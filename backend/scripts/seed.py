import json
import uuid
from datetime import datetime
from database import get_connection


# SMART CATEGORY GUESSING
def guess_category(product_name):
    name = product_name.lower()

    if any(word in name for word in ["coke", "juice", "water", "coffee"]):
        return "Drinks"
    elif any(word in name for word in ["chippy", "piattos", "snack"]):
        return "Snacks"
    elif any(word in name for word in ["pancit", "noodles", "soba"]):
        return "Noodles"
    elif any(word in name for word in ["rice", "egg", "bread"]):
        return "Food"
    else:
        return "Others"


# GET OR CREATE CATEGORY
def get_or_create_category(cursor, name):
    cursor.execute(
        "SELECT id FROM categories WHERE LOWER(name) = LOWER(%s)",
        (name,)
    )
    row = cursor.fetchone()

    if row:
        return row[0]

    cursor.execute(
        "INSERT INTO categories (name) VALUES (%s) RETURNING id",
        (name,)
    )
    new_id = cursor.fetchone()[0]
    print(f"🆕 Created category: {name}")
    return new_id


# GET OR CREATE PRODUCT
def get_or_create_product(cursor, name, category_id):
    cursor.execute(
        "SELECT id, selling_price FROM products WHERE LOWER(name) = LOWER(%s)",
        (name,)
    )
    row = cursor.fetchone()

    if row:
        return row  # (id, price)

    new_id = str(uuid.uuid4())

    # default pricing (you can improve later)
    cost_price = 10
    selling_price = 15

    cursor.execute("""
        INSERT INTO products (id, name, category_id, cost_price, selling_price, stock_quantity)
        VALUES (%s, %s, %s, %s, %s, %s)
    """, (
        new_id,
        name,
        category_id,
        cost_price,
        selling_price,
        100
    ))

    print(f"🆕 Created product: {name}")
    return (new_id, selling_price)


# MAIN SEED FUNCTION
def seed_transactions():
    conn = get_connection()
    cursor = conn.cursor()

    with open("data/transactions.json", "r") as file:
        transactions = json.load(file)

    for tx in transactions:
        transaction_id = str(uuid.uuid4())
        total_amount = 0
        item_data = []

        for item in tx["items"]:
            name = item["product_name"]
            qty = item["quantity"]

            # USE JSON CATEGORY OR AUTO GUESS
            category_name = item.get("category") or guess_category(name)

            # CATEGORY
            category_id = get_or_create_category(cursor, category_name)

            # PRODUCT
            product_id, price = get_or_create_product(cursor, name, category_id)

            subtotal = price * qty
            total_amount += subtotal

            item_data.append((product_id, qty, price))

        # INSERT TRANSACTION
        cursor.execute("""
            INSERT INTO transactions (id, total_amount, payment_method, created_at)
            VALUES (%s, %s, %s, %s)
        """, (
            transaction_id,
            total_amount,
            tx["payment_method"],
            datetime.fromisoformat(tx["created_at"].replace("Z", "+00:00"))
        ))

        # INSERT ITEMS + STOCK UPDATES
        for product_id, qty, price in item_data:
            cursor.execute("""
                INSERT INTO transaction_items (transaction_id, product_id, quantity, price)
                VALUES (%s, %s, %s, %s)
            """, (transaction_id, product_id, qty, price))

            # UPDATE STOCK
            cursor.execute("""
                UPDATE products
                SET stock_quantity = stock_quantity - %s
                WHERE id = %s
            """, (qty, product_id))

            # STOCK MOVEMENT
            cursor.execute("""
                INSERT INTO stock_movements (product_id, change_quantity, type)
                VALUES (%s, %s, 'SALE')
            """, (product_id, -qty))

        print(f"✅ Inserted transaction {transaction_id}")

    conn.commit()
    cursor.close()
    conn.close()


# RUN SCRIPT
if __name__ == "__main__":
    seed_transactions()