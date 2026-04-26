from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import get_connection

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