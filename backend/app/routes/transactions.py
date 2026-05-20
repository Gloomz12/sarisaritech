from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Request,
    Query,
)
from app.core.security import limiter

from app.db.database import (
    get_connection
)

from app.utils.auth import (
    get_current_user
)

from app.schemas.transaction_schema import (
    TransactionCreate,
)

import uuid

from datetime import (
    datetime,
    timezone
)

import logging

router = APIRouter()

logger = logging.getLogger(__name__)


# CREATE TRANSACTION
@router.post("/")
@limiter.limit("30/minute")
async def create_transaction(
    request: Request,
    data: TransactionCreate,
    current_user=Depends(get_current_user)
):

    conn = None
    cursor = None

    try:

        total_amount = data.total_amount

        amount_paid = data.amount_paid

        # NORMALIZE PAYMENT METHOD

        payment_method = (
            "GCash"
            if data.payment_method.lower() == "gcash"
            else
            "Paymaya"
            if data.payment_method.lower() == "paymaya"
            else
            "Cash"
        )

        # VALIDATION

        if amount_paid < total_amount:

            raise HTTPException(
                status_code=400,
                detail="Insufficient payment"
            )

        change_amount = (
            amount_paid - total_amount
        )

        conn = get_connection()

        cursor = conn.cursor()

        transaction_id = str(uuid.uuid4())

        created_at = datetime.now(
            timezone.utc
        )

        # INSERT TRANSACTION

        cursor.execute("""
            INSERT INTO transactions (

                id,
                user_id,
                total_amount,
                payment_method,
                created_at,
                amount_paid,
                change_amount

            )

            VALUES (
                %s,
                %s,
                %s,
                %s,
                %s,
                %s,
                %s
            )
        """, (

            transaction_id,

            current_user["user_id"],

            total_amount,

            payment_method,

            created_at,

            amount_paid,

            change_amount
        ))

        # ITEMS + STOCK

        for item in data.items:

            quantity = item.quantity

            # GET PRODUCT

            cursor.execute("""
                SELECT
                    selling_price,
                    stock_quantity

                FROM products

                WHERE
                    id = %s

                AND

                    user_id = %s
            """, (

                item.product_id,

                current_user["user_id"]

            ))

            product = cursor.fetchone()

            if not product:

                raise HTTPException(
                    status_code=404,
                    detail="Product not found"
                )

            price, stock = product

            # STOCK CHECK

            if stock < quantity:

                raise HTTPException(
                    status_code=400,
                    detail="Not enough stock"
                )

            # INSERT ITEM

            cursor.execute("""
                INSERT INTO transaction_items (

                    id,
                    transaction_id,
                    product_id,
                    quantity,
                    price

                )

                VALUES (
                    %s,
                    %s,
                    %s,
                    %s,
                    %s
                )
            """, (

                str(uuid.uuid4()),

                transaction_id,

                item.product_id,

                quantity,

                price,

            ))

            # UPDATE STOCK

            cursor.execute("""
                UPDATE products

                SET stock_quantity =
                    stock_quantity - %s

                WHERE
                    id = %s

                AND

                    user_id = %s
            """, (

                quantity,

                item.product_id,

                current_user["user_id"]

            ))

            # STOCK MOVEMENT

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
                    'SALE'
                )
            """, (

                str(uuid.uuid4()),

                current_user["user_id"],

                item.product_id,

                -quantity
            ))

        conn.commit()

        return {

            "message":
                "Transaction recorded successfully",

            "transaction_id":
                transaction_id,

            "change":
                float(change_amount)
        }

    except HTTPException:

        if conn:
            conn.rollback()

        raise

    except Exception as e:

        if conn:
            conn.rollback()

        logger.error(f"Create transaction error: {e}")

        raise HTTPException(
            status_code=500,
            detail="Internal server error"
        )

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()


# GET TRANSACTIONS
@router.get("/")
@limiter.limit("30/minute")
def get_transactions(
    request: Request,

    limit: int = Query(
        20,
        ge=1,
        le=100
    ),

    offset: int = Query(
        0,
        ge=0
    ),

    current_user=Depends(
        get_current_user
    )
):

    conn = None
    cursor = None

    try:

        conn = get_connection()

        cursor = conn.cursor()

        # GET LIMITED TRANSACTIONS

        cursor.execute("""
            SELECT

                id,
                total_amount,
                payment_method,
                created_at,
                amount_paid,
                change_amount

            FROM transactions

            WHERE user_id = %s

            ORDER BY created_at DESC

            LIMIT %s
            OFFSET %s
        """, (

            current_user["user_id"],

            limit,

            offset

        ))

        transactions = cursor.fetchall()

        result = []

        for t in transactions:

            # GET ITEMS

            cursor.execute("""
                SELECT

                    ti.product_id,
                    ti.quantity,
                    ti.subtotal,
                    p.name,
                    c.name AS category

                FROM transaction_items ti

                JOIN products p
                ON ti.product_id = p.id

                LEFT JOIN categories c
                ON p.category_id = c.id

                WHERE ti.transaction_id = %s
            """, (t[0],))

            items = cursor.fetchall()

            result.append({

                "id":
                    str(t[0]),

                "total_amount":
                    float(t[1]),

                "payment_method":
                    t[2],

                "created_at":
                    t[3].isoformat(),

                "amount_paid":
                    float(t[4])
                    if t[4]
                    else 0,

                "change_amount":
                    float(t[5])
                    if t[5]
                    else 0,

                "items": [

                    {

                        "product_id":
                            str(i[0]),

                        "product_name":
                            i[3],

                        "category":
                            i[4]
                            if i[4]
                            else "Uncategorized",

                        "quantity":
                            i[1],

                        "subtotal":
                            float(i[2])

                    }

                    for i in items
                ]
            })

        return {

            "transactions":
                result,

            "count":
                len(result),

            "limit":
                limit,

            "offset":
                offset
        }

    except Exception as e:

        if conn:
            conn.rollback()

        logger.error(
            f"Get transactions error: {e}"
        )

        raise HTTPException(
            status_code=500,
            detail="Internal server error"
        )

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()