from fastapi import APIRouter, Request
from app.db.database import get_connection
import uuid
from datetime import datetime, timezone

router = APIRouter()

@router.post("/transactions")
async def create_transaction(request: Request):
    conn = None
    cursor = None

    try:
        data = await request.json()

        total_amount = data["total_amount"]
        amount_paid = data["amount_paid"]

        # VALIDATION
        if amount_paid < total_amount:
            return {"error": "Insufficient payment"}

        change_amount = amount_paid - total_amount

        conn = get_connection()
        cursor = conn.cursor()

        transaction_id = str(uuid.uuid4())
        created_at = datetime.now(timezone.utc)

        # INSERT TRANSACTION (with payment)
        cursor.execute("""
            INSERT INTO transactions 
            (id, total_amount, payment_method, created_at, amount_paid, change_amount)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (
            transaction_id,
            total_amount,
            data["payment_method"],
            created_at,
            amount_paid,
            change_amount
        ))

        # ITEMS + STOCK
        for item in data["items"]:
            quantity = item["quantity"]

            cursor.execute("""
                SELECT selling_price, stock_quantity 
                FROM products 
                WHERE id = %s
            """, (item["product_id"],))

            product = cursor.fetchone()

            if not product:
                raise Exception("Product not found")

            price, stock = product

            # STOCK CHECK
            if stock < quantity:
                raise Exception("Not enough stock")

            # insert item
            cursor.execute("""
                INSERT INTO transaction_items (
                    id, transaction_id, product_id, quantity, price
                )
                VALUES (%s, %s, %s, %s, %s)
            """, (
                str(uuid.uuid4()),
                transaction_id,
                item["product_id"],
                quantity,
                price
            ))

            # update stock
            cursor.execute("""
                UPDATE products
                SET stock_quantity = stock_quantity - %s
                WHERE id = %s
            """, (quantity, item["product_id"]))

            # stock movement
            cursor.execute("""
                INSERT INTO stock_movements (
                    id, product_id, change_quantity, type
                )
                VALUES (%s, %s, %s, 'SALE')
            """, (
                str(uuid.uuid4()),
                item["product_id"],
                -quantity
            ))

        conn.commit()

        return {
            "message": "Transaction recorded successfully",
            "transaction_id": transaction_id,
            "change": float(change_amount)
        }

    except Exception as e:
        if conn:
            conn.rollback()
        return {"error": str(e)}

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


@router.get("/transactions")
def get_transactions():
    try:
        conn = get_connection()
        cursor = conn.cursor()

        # Get transactions
        cursor.execute("""
            SELECT id, total_amount, payment_method, created_at, amount_paid, change_amount
            FROM transactions
            ORDER BY created_at DESC
        """)
        transactions = cursor.fetchall()

        result = []

        for t in transactions:
          
            cursor.execute("""
                SELECT 
                    ti.product_id, 
                    ti.quantity, 
                    ti.subtotal, 
                    p.name,
                    c.name AS category
                FROM transaction_items ti
                JOIN products p ON ti.product_id = p.id
                LEFT JOIN categories c ON p.category_id = c.id
                WHERE ti.transaction_id = %s
            """, (t[0],))

            items = cursor.fetchall()

            result.append({
                "id": str(t[0]),
                "total_amount": float(t[1]),
                "payment_method": t[2],
                "created_at": t[3].isoformat(),
                "amount_paid": float(t[4]) if t[4] else 0,
                "change_amount": float(t[5]) if t[5] else 0,
                "items": [
                    {
                        "product_id": str(i[0]),
                        "product_name": i[3],
                        "category": i[4] if i[4] else "Uncategorized",
                        "quantity": i[1],
                        "subtotal": float(i[2])
                    } for i in items
                ]
            })

        cursor.close()
        conn.close()

        return result

    except Exception as e:
        return {"error": str(e)}