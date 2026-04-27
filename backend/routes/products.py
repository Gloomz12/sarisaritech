from fastapi import APIRouter
from database import get_connection

router = APIRouter()

# GET PRODUCTS
@router.get("/products")
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