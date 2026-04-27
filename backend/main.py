from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from database import get_connection
import uuid
from datetime import datetime, timezone


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Backend working"}


# GET PRODUCTS
@app.get("/api/products")
def get_products():
    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT * FROM products")
        rows = cursor.fetchall()

        result = []
        for row in rows:
            result.append({
                "id": str(row[0]),
                "name": row[1],
                "category_id": row[2],
                "cost_price": float(row[3]),
                "selling_price": float(row[4]),
                "stock_quantity": row[5],
                "min_stock_level": row[6],
            })

        cursor.close()
        conn.close()

        return result

    except Exception as e:
        return {"error": str(e)}


# CREATE TRANSACTION
@app.post("/api/transactions")
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
            # insert transaction item
            cursor.execute("""
                INSERT INTO transaction_items (
                    transaction_id, product_id, quantity, price
                ) VALUES (%s, %s, %s, %s)
            """, (
                transaction_id,
                item["product_id"],
                item["quantity"],
                item["subtotal"] / item["quantity"]
            ))

            # bawas stock
            cursor.execute("""
                UPDATE products
                SET stock_quantity = stock_quantity - %s
                WHERE id = %s
            """, (item["quantity"], item["product_id"]))

            # log stock movement
            cursor.execute("""
                INSERT INTO stock_movements (product_id, change_quantity, type)
                VALUES (%s, %s, 'SALE')
            """, (item["product_id"], -item["quantity"]))

        conn.commit()
        cursor.close()
        conn.close()

        return {"message": "Transaction recorded successfully"}

    except Exception as e:
        return {"error": str(e)}


# GET TRANSACTIONS (FOR HISTORY & DASHBOARD)
@app.get("/api/transactions")
def get_transactions():
    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT id, total_amount, payment_method, created_at
            FROM transactions
            ORDER BY created_at DESC
        """)
        transactions = cursor.fetchall()

        result = []

        for t in transactions:
            cursor.execute("""
                SELECT ti.product_id, ti.quantity, ti.subtotal, p.name
                FROM transaction_items ti
                JOIN products p ON ti.product_id = p.id
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