# backend/scripts/seed_ai_data.py

import os
import sys
import random

from datetime import (
    datetime,
    timedelta,
)

sys.path.append(
    os.path.abspath(
        os.path.join(
            os.path.dirname(__file__),
            ".."
        )
    )
)

from app.db.database import get_connection

# =========================================
# DATABASE
# =========================================

conn = get_connection()

cursor = conn.cursor()

USER_ID = "e4d39f13-317a-4d59-9645-3d4c7e087a0a"

# =========================================
# CATEGORIES
# =========================================

categories = [

    "Beverages",

    "Snacks",

    "Coffee & Milk",

    "Bread & Bakery",

    "Canned Goods",

    "Instant Foods",

    "Condiments",

    "Frozen Foods",

    "Personal Care",

    "Household Items",

    "School Supplies",

    "Rice & Grains",
]

category_map = {}

print("Creating categories...")

for category in categories:

    cursor.execute("""

        INSERT INTO categories (

            name,
            user_id

        )

        VALUES (

            %s,
            %s

        )

        ON CONFLICT (user_id, name)
        DO NOTHING

        RETURNING id

    """, (
        category,
        USER_ID,
    ))

    result = cursor.fetchone()

    if result:

        category_id = result[0]

    else:

        cursor.execute("""

            SELECT id

            FROM categories

            WHERE name = %s
            AND user_id = %s

        """, (
            category,
            USER_ID,
        ))

        category_id = cursor.fetchone()[0]

    category_map[category] = category_id

conn.commit()

# =========================================
# PRODUCTS
# =========================================

products = [

    # BEVERAGES
    ("Coke 1.5L", "Beverages", 45, 65),
    ("Sprite 1.5L", "Beverages", 45, 65),
    ("Royal 1.5L", "Beverages", 45, 65),
    ("Mountain Dew", "Beverages", 22, 35),
    ("Pepsi", "Beverages", 20, 32),
    ("RC Cola", "Beverages", 18, 28),
    ("Zesto", "Beverages", 8, 15),
    ("C2 Green Tea", "Beverages", 18, 28),
    ("Gatorade", "Beverages", 28, 42),
    ("Nature Spring", "Beverages", 10, 18),

    # SNACKS
    ("Piattos", "Snacks", 15, 25),
    ("Nova", "Snacks", 15, 25),
    ("Cheezy", "Snacks", 15, 25),
    ("Chippy", "Snacks", 12, 20),
    ("Vcut", "Snacks", 14, 24),
    ("Crackers", "Snacks", 10, 18),
    ("Fudgee Bar", "Snacks", 8, 15),
    ("Hansel", "Snacks", 7, 12),
    ("Skyflakes", "Snacks", 12, 18),
    ("Oishi", "Snacks", 10, 18),

    # COFFEE & MILK
    ("Nescafe Original", "Coffee & Milk", 10, 18),
    ("Kopiko Brown", "Coffee & Milk", 10, 18),
    ("Great Taste", "Coffee & Milk", 10, 18),
    ("Milo Sachet", "Coffee & Milk", 12, 20),
    ("Bear Brand", "Coffee & Milk", 15, 28),
    ("Alaska Condensed", "Coffee & Milk", 30, 45),
    ("Alaska Evap", "Coffee & Milk", 28, 42),
    ("Coffee Mate", "Coffee & Milk", 18, 30),

    # BREAD
    ("Pandesal", "Bread & Bakery", 3, 5),
    ("Pan De Coco", "Bread & Bakery", 10, 18),
    ("Spanish Bread", "Bread & Bakery", 12, 20),
    ("Ensaymada", "Bread & Bakery", 15, 25),
    ("Monay", "Bread & Bakery", 8, 15),

    # CANNED GOODS
    ("555 Sardines", "Canned Goods", 18, 28),
    ("Mega Sardines", "Canned Goods", 18, 28),
    ("Century Tuna", "Canned Goods", 30, 45),
    ("Argentina Corned Beef", "Canned Goods", 35, 55),
    ("Spam", "Canned Goods", 120, 160),
    ("Vienna Sausage", "Canned Goods", 25, 38),

    # INSTANT FOODS
    ("Lucky Me Beef", "Instant Foods", 10, 18),
    ("Lucky Me Chicken", "Instant Foods", 10, 18),
    ("Pancit Canton", "Instant Foods", 12, 20),
    ("Cup Noodles", "Instant Foods", 18, 30),
    ("Payless", "Instant Foods", 15, 25),

    # CONDIMENTS
    ("Sugar 1kg", "Condiments", 55, 75),
    ("Salt", "Condiments", 8, 15),
    ("Soy Sauce", "Condiments", 18, 30),
    ("Vinegar", "Condiments", 15, 25),
    ("Fish Sauce", "Condiments", 12, 20),

    # FROZEN
    ("Hotdog", "Frozen Foods", 60, 90),
    ("Longganisa", "Frozen Foods", 70, 110),
    ("Tocino", "Frozen Foods", 65, 100),

    # PERSONAL CARE
    ("Palmolive Sachet", "Personal Care", 5, 10),
    ("Creamsilk Sachet", "Personal Care", 5, 10),
    ("Safeguard Soap", "Personal Care", 20, 35),
    ("Colgate", "Personal Care", 35, 55),
    ("Closeup", "Personal Care", 35, 55),

    # HOUSEHOLD
    ("Surf Powder", "Household Items", 25, 40),
    ("Tide", "Household Items", 30, 45),
    ("Bleach", "Household Items", 18, 30),
    ("Joy Dishwashing", "Household Items", 20, 35),

    # SCHOOL SUPPLIES
    ("Notebook", "School Supplies", 20, 35),
    ("Ballpen", "School Supplies", 8, 15),
    ("Pencil", "School Supplies", 5, 10),
    ("Eraser", "School Supplies", 3, 8),

    # RICE
    ("Rice 1kg", "Rice & Grains", 45, 60),
    ("Rice 5kg", "Rice & Grains", 240, 300),
]

print("Creating products...")

for product in products:

    name, category, cost, selling = product

    cursor.execute("""

        INSERT INTO products (

            name,
            category_id,
            cost_price,
            selling_price,
            stock_quantity,
            min_stock_level,
            created_at,
            updated_at,
            unit,
            user_id,
            is_active

        )

        VALUES (

            %s,
            %s,
            %s,
            %s,
            %s,
            %s,
            NOW(),
            NOW(),
            %s,
            %s,
            %s

        )

        ON CONFLICT (user_id, name)
        DO NOTHING

    """, (

        name,

        category_map[category],

        cost,

        selling,

        random.randint(500, 2000),

        random.randint(20, 50),

        "pcs",

        USER_ID,

        True,
    ))

conn.commit()

# =========================================
# GET PRODUCTS
# =========================================

cursor.execute("""

    SELECT
        id,
        name,
        selling_price

    FROM products

    WHERE user_id = %s

""", (
    USER_ID,
))

product_rows = cursor.fetchall()

product_map = {

    row[1]: {

        "id": row[0],

        "price": float(row[2]),
    }

    for row in product_rows
}

# =========================================
# COMBINATIONS
# =========================================

combinations = [

    ["Coke 1.5L", "Piattos"],
    ["Sprite 1.5L", "Nova"],
    ["Royal 1.5L", "Hansel"],
    ["Pandesal", "Kopiko Brown"],
    ["Pandesal", "Milo Sachet"],
    ["Lucky Me Beef", "Coke 1.5L"],
    ["Pancit Canton", "Royal 1.5L"],
    ["555 Sardines", "Rice 1kg"],
    ["Century Tuna", "Skyflakes"],
    ["Argentina Corned Beef", "Rice 1kg"],
    ["Surf Powder", "Joy Dishwashing"],
    ["Palmolive Sachet", "Safeguard Soap"],
    ["Notebook", "Ballpen"],
    ["Rice 5kg", "Soy Sauce", "Vinegar"],
    ["Coffee Mate", "Nescafe Original"],
    ["Milo Sachet", "Bear Brand"],
    ["Hotdog", "Rice 1kg"],
    ["Longganisa", "Rice 1kg"],

    [
        "Coke 1.5L",
        "Piattos",
        "Pandesal",
        "Kopiko Brown",
    ],

    [
        "Rice 5kg",
        "Soy Sauce",
        "Vinegar",
        "Fish Sauce",
    ],

    [
        "Pancit Canton",
        "Royal 1.5L",
        "Hansel",
    ],
]

# =========================================
# PAYMENT METHODS
# =========================================

PAYMENT_METHODS = (
    ["Cash"] * 70 +
    ["GCash"] * 20 +
    ["Paymaya"] * 10
)

# =========================================
# TRANSACTIONS
# =========================================

print("Creating transactions...")

TOTAL_TRANSACTIONS = 3000

for _ in range(TOTAL_TRANSACTIONS):

    random_days = random.randint(0, 365)

    random_hours = random.randint(6, 22)

    random_minutes = random.randint(0, 59)

    created_at = (
        datetime.now()
        - timedelta(days=random_days)
    ).replace(

        hour=random_hours,
        minute=random_minutes,
        second=0,
        microsecond=0,
    )

    selected = random.choice(
        combinations
    )

    total_amount = 0

    transaction_items = []

    for item in selected:

        if item not in product_map:
            continue

        quantity = random.randint(1, 5)

        product_price = product_map[item]["price"]

        subtotal = (
            product_price * quantity
        )

        total_amount += subtotal

        transaction_items.append({

            "product_id":
                product_map[item]["id"],

            "quantity":
                quantity,

            "price":
                product_price,
        })

    total_amount = round(
        total_amount,
        2
    )

    amount_paid = (
        total_amount +
        random.randint(0, 500)
    )

    change_amount = (
        amount_paid -
        total_amount
    )

    payment_method = random.choice(
        PAYMENT_METHODS
    )

    # =====================================
    # INSERT TRANSACTION
    # =====================================

    cursor.execute("""

        INSERT INTO transactions (

            total_amount,
            payment_method,
            created_at,
            amount_paid,
            change_amount,
            user_id,
            updated_at

        )

        VALUES (

            %s,
            %s,
            %s,
            %s,
            %s,
            %s,
            NOW()

        )

        RETURNING id

    """, (

        total_amount,

        payment_method,

        created_at,

        amount_paid,

        change_amount,

        USER_ID,
    ))

    transaction_id = cursor.fetchone()[0]

    # =====================================
    # INSERT TRANSACTION ITEMS
    # =====================================

    for item in transaction_items:

        cursor.execute("""

            INSERT INTO transaction_items (

                transaction_id,
                product_id,
                quantity,
                price

            )

            VALUES (

                %s,
                %s,
                %s,
                %s

            )

        """, (

            transaction_id,

            item["product_id"],

            item["quantity"],

            item["price"],
        ))

        previous_stock = random.randint(
            500,
            2000
        )

        new_stock = (
            previous_stock -
            item["quantity"]
        )

        # =================================
        # STOCK MOVEMENTS
        # =================================

        cursor.execute("""

            INSERT INTO stock_movements (

                product_id,
                change_quantity,
                type,
                created_at,
                user_id,
                previous_stock,
                new_stock

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

            item["product_id"],

            -item["quantity"],

            "SALE",

            created_at,

            USER_ID,

            previous_stock,

            new_stock,
        ))

conn.commit()

cursor.close()

conn.close()

print("===================================")
print("REALISTIC SARI-SARI STORE SEEDED")
print("===================================")
print("Categories:", len(categories))
print("Products:", len(products))
print("Transactions:", TOTAL_TRANSACTIONS)
print("===================================")