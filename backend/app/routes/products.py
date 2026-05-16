import uuid

from fastapi import (
    APIRouter,
    HTTPException,
    Depends,
)

from app.db.database import (
    get_connection,
)

from app.utils.auth import (
    get_current_user,
)

router = APIRouter()


# GET PRODUCTS
@router.get("/")
def get_products(
    current_user=Depends(get_current_user)
):

    try:

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT
                p.id,
                p.name,
                c.name,
                p.cost_price,
                p.selling_price,
                p.stock_quantity,
                p.min_stock_level,
                p.unit

            FROM products p

            LEFT JOIN categories c
            ON p.category_id = c.id

            WHERE
            p.user_id = %s

            AND

             p.is_active = TRUE

            ORDER BY p.name ASC
        """, (
            current_user["user_id"],
        ))

        rows = cursor.fetchall()

        result = []

        for row in rows:

            result.append({
                "id": str(row[0]),

                "name": row[1],

                "category":
                    row[2]
                    if row[2]
                    else "Uncategorized",

                "cost_price":
                    float(row[3]),

                "selling_price":
                    float(row[4]),

                "stock_quantity":
                    row[5],

                "min_stock_level":
                    row[6],

                "unit":
                    row[7],
            })

        cursor.close()
        conn.close()

        return result

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# ADD PRODUCT
@router.post("/")
def add_product(
    product: dict,
    current_user=Depends(get_current_user)
):

    try:

        conn = get_connection()
        cursor = conn.cursor()

        product_name = (
            product["name"]
            .strip()
        )

        category_name = (
            product["category"]
            .strip()
        )

        if not product_name:

            raise HTTPException(
                status_code=400,
                detail="Product name is required"
            )

        # CHECK EXISTING PRODUCT

        cursor.execute("""
            SELECT
                p.id,
                p.is_active

            FROM products p

            LEFT JOIN categories c
            ON p.category_id = c.id

            WHERE
                LOWER(TRIM(p.name)) =
                LOWER(TRIM(%s))

            AND

                LOWER(TRIM(c.name)) =
                LOWER(TRIM(%s))

            AND

                p.user_id = %s
        """, (

            product_name,

            category_name,

            current_user["user_id"]

        ))

        existing = cursor.fetchone()

        if existing:

            existing_product_id = existing[0]

            is_active = existing[1]

            # PRODUCT STILL ACTIVE

            if is_active:

                raise HTTPException(
                    status_code=400,
                    detail="Product already exists in this category"
                )

            # RESTORE REMOVED PRODUCT

            cursor.execute("""
                UPDATE products

                SET
                    is_active = TRUE,
                    cost_price = %s,
                    selling_price = %s,
                    stock_quantity = %s,
                    min_stock_level = %s,
                    unit = %s

                WHERE id = %s
            """, (

                product["cost_price"],

                product["selling_price"],

                product["stock_quantity"],

                product["min_stock_level"],

                product.get("unit", "pc"),

                existing_product_id

            ))

            conn.commit()

            cursor.close()
            conn.close()

            return {
                "message": "Product restored successfully"
            }

        # FIND CATEGORY

        cursor.execute("""
            SELECT id

            FROM categories

            WHERE
                LOWER(TRIM(name)) =
                LOWER(TRIM(%s))

            AND

                user_id = %s
        """, (

            category_name,

            current_user["user_id"]

        ))

        cat = cursor.fetchone()

        # CREATE CATEGORY

        if not cat:

            cursor.execute("""
                INSERT INTO categories (

                    id,
                    name,
                    user_id

                )

                VALUES (
                    %s,
                    %s,
                    %s
                )

                RETURNING id
            """, (

                str(uuid.uuid4()),

                category_name,

                current_user["user_id"]

            ))

            category_id = (
                cursor.fetchone()[0]
            )

        else:

            category_id = cat[0]

        # INSERT PRODUCT

        cursor.execute("""
            INSERT INTO products (

                id,
                user_id,
                name,
                category_id,
                cost_price,
                selling_price,
                stock_quantity,
                min_stock_level,
                unit

            )

            VALUES (
                %s,
                %s,
                %s,
                %s,
                %s,
                %s,
                %s,
                %s,
                %s
            )
        """, (

            product["id"],

            current_user["user_id"],

            product_name,

            category_id,

            product["cost_price"],

            product["selling_price"],

            product["stock_quantity"],

            product["min_stock_level"],

            product.get("unit", "pc"),

        ))

        conn.commit()

        cursor.close()
        conn.close()

        return {
            "message":
                "Product added successfully"
        }

    except HTTPException as e:

        raise e

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# RESTOCK PRODUCT
@router.put("/restock/{product_id}")
def restock_product(
    product_id: str,
    data: dict,
    current_user=Depends(get_current_user)
):

    conn = None
    cursor = None

    try:

        conn = get_connection()
        cursor = conn.cursor()

        amount = int(data["amount"])

        if amount <= 0:

            raise HTTPException(
                status_code=400,
                detail="Invalid restock amount"
            )

        # UPDATE STOCK

        cursor.execute("""
            UPDATE products

            SET stock_quantity =
                stock_quantity + %s

            WHERE
                id = %s

            AND

                user_id = %s

            RETURNING stock_quantity
        """, (

            amount,

            product_id,

            current_user["user_id"]

        ))

        result = cursor.fetchone()

        if not result:

            raise HTTPException(
                status_code=404,
                detail="Product not found"
            )

        new_stock = result[0]

        # LOG MOVEMENT

        cursor.execute("""
            INSERT INTO stock_movements (

                id,
                user_id,
                product_id,
                change_quantity,
                type

            )

            VALUES (
                %s,
                %s,
                %s,
                %s,
                'RESTOCK'
            )
        """, (

            str(uuid.uuid4()),

            current_user["user_id"],

            product_id,

            amount

        ))

        conn.commit()

        return {
            "message":
                "Restocked successfully",

            "new_stock":
                new_stock
        }

    except HTTPException as e:

        if conn:
            conn.rollback()

        raise e

    except Exception as e:

        if conn:
            conn.rollback()

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()


# UPDATE PRODUCT
@router.put("/{product_id}")
def update_product(
    product_id: str,
    product: dict,
    current_user=Depends(get_current_user)
):

    try:

        conn = get_connection()
        cursor = conn.cursor()

        product_name = (
            product["name"]
            .strip()
        )

        category_name = (
            product["category"]
            .strip()
        )

        # CHECK DUPLICATE

        cursor.execute("""
            SELECT p.id

            FROM products p

            LEFT JOIN categories c
            ON p.category_id = c.id

            WHERE
                LOWER(TRIM(p.name)) =
                LOWER(TRIM(%s))

            AND

                LOWER(TRIM(c.name)) =
                LOWER(TRIM(%s))

            AND

                p.id != %s

            AND

                p.user_id = %s
        """, (

            product_name,

            category_name,

            product_id,

            current_user["user_id"]

        ))

        existing = cursor.fetchone()

        if existing:

            raise HTTPException(
                status_code=400,
                detail="Another product already exists with same name and category"
            )

        # FIND CATEGORY

        cursor.execute("""
            SELECT id

            FROM categories

            WHERE
                LOWER(TRIM(name)) =
                LOWER(TRIM(%s))

            AND

                user_id = %s
        """, (

            category_name,

            current_user["user_id"]

        ))

        cat = cursor.fetchone()

        if not cat:

            cursor.execute("""
                INSERT INTO categories (

                    id,
                    name,
                    user_id

                )

                VALUES (
                    %s,
                    %s,
                    %s
                )

                RETURNING id
            """, (

                str(uuid.uuid4()),

                category_name,

                current_user["user_id"]

            ))

            category_id = (
                cursor.fetchone()[0]
            )

        else:

            category_id = cat[0]

        # GET OLD STOCK

        cursor.execute("""
            SELECT stock_quantity

            FROM products

            WHERE
                id = %s

            AND

                user_id = %s
        """, (

            product_id,

            current_user["user_id"]

        ))

        old_stock_result = cursor.fetchone()

        old_stock = old_stock_result[0]

        # UPDATE PRODUCT

        cursor.execute("""
            UPDATE products

            SET
                name = %s,
                category_id = %s,
                cost_price = %s,
                selling_price = %s,
                stock_quantity = %s,
                min_stock_level = %s,
                unit = %s

            WHERE
                id = %s

            AND

                user_id = %s
        """, (

            product_name,

            category_id,

            product["cost_price"],

            product["selling_price"],

            product["stock_quantity"],

            product["min_stock_level"],

            product.get("unit", "pc"),

            product_id,

            current_user["user_id"]

        ))

       # STOCK ADJUSTMENT LOG

        new_stock = product["stock_quantity"]

        difference = new_stock - old_stock

        if difference != 0:

            cursor.execute("""
                INSERT INTO stock_movements (

                    id,
                    user_id,
                    product_id,
                    change_quantity,
                    type,
                    previous_stock,
                    new_stock

                )

                VALUES (
                    %s,
                    %s,
                    %s,
                    %s,
                    'ADJUSTMENT',
                    %s,
                    %s
                )
            """, (

                str(uuid.uuid4()),

                current_user["user_id"],

                product_id,

                difference,

                old_stock,

                new_stock

            ))

        conn.commit()

        cursor.close()
        conn.close()

        return {
            "message": "Updated"
        }

    except HTTPException as e:

        raise e

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# DELETE PRODUCT
@router.delete("/{product_id}")
def delete_product(
    product_id: str,
    current_user=Depends(get_current_user)
):

    try:

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            UPDATE products

            SET
                is_active = FALSE

            WHERE
                id = %s

            AND

                user_id = %s
        """, (

            product_id,

            current_user["user_id"]

        ))

        conn.commit()

        cursor.close()
        conn.close()

        return {
            "message": "Removed from inventory"
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )