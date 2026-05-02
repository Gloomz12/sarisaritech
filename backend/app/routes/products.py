import uuid

from fastapi import APIRouter, HTTPException
from app.db.database import get_connection

router = APIRouter()

# GET PRODUCTS
@router.get("/")
def get_products():
    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT p.id, p.name, c.name, p.cost_price, p.selling_price,
                   p.stock_quantity, p.min_stock_level, p.unit
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
        """)

        rows = cursor.fetchall()

        result = []
        for row in rows:
            result.append({
                "id": str(row[0]),
                "name": row[1],
                "category": row[2] if row[2] else "Uncategorized",
                "cost_price": float(row[3]),
                "selling_price": float(row[4]),
                "stock_quantity": row[5],
                "min_stock_level": row[6],
                "unit": row[7]
            })

        cursor.close()
        conn.close()

        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



# ADD PRODUCT
@router.post("/")
def add_product(product: dict):
    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT id FROM categories WHERE name=%s", (product["category"],))
        cat = cursor.fetchone()

        if not cat:
            cursor.execute(
                "INSERT INTO categories (name) VALUES (%s) RETURNING id",
                (product["category"],)
            )
            category_id = cursor.fetchone()[0]
        else:
            category_id = cat[0]

        cursor.execute("""
            INSERT INTO products
            (id, name, category_id, cost_price, selling_price, stock_quantity, min_stock_level, unit)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            product["id"],
            product["name"],
            category_id,
            product["cost_price"],
            product["selling_price"],
            product["stock_quantity"],
            product["min_stock_level"],
            product.get("unit", "pc")
        ))

        conn.commit()
        cursor.close()
        conn.close()

        return {"message": "Product added"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# UPDATE PRODUCT
@router.put("/{product_id}")
def update_product(product_id: str, product: dict):
    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT id FROM categories WHERE name=%s", (product["category"],))
        cat = cursor.fetchone()

        if not cat:
            cursor.execute(
                "INSERT INTO categories (name) VALUES (%s) RETURNING id",
                (product["category"],)
            )
            category_id = cursor.fetchone()[0]
        else:
            category_id = cat[0]

        cursor.execute("""
            UPDATE products SET
                name=%s,
                category_id=%s,
                cost_price=%s,
                selling_price=%s,
                stock_quantity=%s,
                min_stock_level=%s,
                unit=%s
            WHERE id=%s
        """, (
            product["name"],
            category_id,
            product["cost_price"],
            product["selling_price"],
            product["stock_quantity"],
            product["min_stock_level"],
            product.get("unit", "pc"),
            product_id
        ))

        conn.commit()
        cursor.close()
        conn.close()

        return {"message": "Updated"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



# DELETE PRODUCT
@router.delete("/{product_id}")
def delete_product(product_id: str):
    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("DELETE FROM products WHERE id=%s", (product_id,))

        conn.commit()
        cursor.close()
        conn.close()

        return {"message": "Deleted"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# RESTOCK PRODUCT
@router.put("/restock/{product_id}")
def restock_product(product_id: str, data: dict):
    conn = None
    cursor = None

    try:
        conn = get_connection()
        cursor = conn.cursor()

        amount = int(data["amount"])

        if amount <= 0:
            raise Exception("Invalid restock amount")

        # update stock
        cursor.execute("""
            UPDATE products
            SET stock_quantity = stock_quantity + %s
            WHERE id = %s
            RETURNING stock_quantity
        """, (amount, product_id))

        result = cursor.fetchone()

        if not result:
            raise Exception("Product not found")

        new_stock = result[0]

        # log stock movement
        cursor.execute("""
            INSERT INTO stock_movements (
                id, product_id, change_quantity, type
            )
            VALUES (%s, %s, %s, 'RESTOCK')
        """, (
            str(uuid.uuid4()),
            product_id,
            amount
        ))

        conn.commit()

        return {
            "message": "Restocked successfully",
            "new_stock": new_stock
        }

    except Exception as e:
        if conn:
            conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()