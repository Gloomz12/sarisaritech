from fastapi import APIRouter, Request
from app.db.database import get_connection
import uuid
from datetime import datetime, timezone

router = APIRouter()

@router.post("/transactions")
async def create_transaction(request: Request):
    try:
        data = await request.json()

        conn = get_connection()
        cursor = conn.cursor()

        transaction_id = str(uuid.uuid4())
        created_at = datetime.now(timezone.utc)

        # Insert transaction
        cursor.execute("""
            INSERT INTO transactions (id, total_amount, payment_method, created_at)
            VALUES (%s, %s, %s, %s)
        """, (
            transaction_id,
            data["total_amount"],
            data["payment_method"],
            created_at
        ))

        # Insert items + update stock + stock movement
        for item in data["items"]:
            price = item["subtotal"] / item["quantity"]

            cursor.execute("""
                INSERT INTO transaction_items (
                    id, transaction_id, product_id, quantity, price
                )
                VALUES (%s, %s, %s, %s, %s)
            """, (
                str(uuid.uuid4()),
                transaction_id,
                item["product_id"],
                item["quantity"],
                price
            ))

            # bawas stock
            cursor.execute("""
                UPDATE products
                SET stock_quantity = stock_quantity - %s
                WHERE id = %s
            """, (item["quantity"], item["product_id"]))

            # stock movement log
            cursor.execute("""
                INSERT INTO stock_movements (
                    id, product_id, change_quantity, type
                )
                VALUES (%s, %s, %s, 'SALE')
            """, (
                str(uuid.uuid4()),
                item["product_id"],
                -item["quantity"]
            ))

        conn.commit()
        cursor.close()
        conn.close()

        return {"message": "Transaction recorded successfully"}

    except Exception as e:
        return {"error": str(e)}


@router.get("/transactions")
def get_transactions():
    try:
        conn = get_connection()
        cursor = conn.cursor()

        # Get transactions
        cursor.execute("""
            SELECT id, total_amount, payment_method, created_at
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