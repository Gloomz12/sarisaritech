# backend/scripts/seed_ai_data.py

from app.db.database import (
    get_connection,
)

from datetime import (
    datetime,
    timedelta,
)

import random

conn = get_connection()

cursor = conn.cursor()

USER_ID = "e4d39f13-317a-4d59-9645-3d4c7e087a0a"

# ====================================
# PRODUCTS
# ====================================

products = [

    "Coke",

    "Piattos",

    "Coffee",

    "Sugar",

    "Milo",

    "Bread",
]

# ====================================
# CREATE PRODUCTS
# ====================================

for product in products:

    cursor.execute("""

        INSERT INTO products (

            name,
            stock_quantity,
            cost_price,
            selling_price,
            min_stock_level,
            unit,
            user_id

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

        product,

        random.randint(20, 100),

        random.randint(5, 20),

        random.randint(20, 50),

        10,

        "pcs",

        USER_ID,
    ))

conn.commit()

# ====================================
# GET PRODUCTS
# ====================================

cursor.execute("""

    SELECT
        id,
        name

    FROM products

    WHERE user_id = %s

""", (
    USER_ID,
))

product_rows = cursor.fetchall()

product_map = {

    row[1]: row[0]

    for row in product_rows
}

# ====================================
# PRODUCT COMBINATIONS
# ====================================

combinations = [

    # SOFTDRINK + SNACKS
    ["Coke", "Piattos"],

    ["Coke", "Bread"],

    ["Coke", "Milo"],

    ["Coke", "Piattos", "Bread"],

    ["Coke", "Piattos", "Coffee"],

    # COFFEE COMBOS
    ["Coffee", "Sugar"],

    ["Coffee", "Bread"],

    ["Coffee", "Sugar", "Bread"],

    ["Coffee", "Milo"],

    # BREAKFAST ITEMS
    ["Bread", "Milo"],

    ["Bread", "Coffee"],

    ["Bread", "Sugar"],

    ["Bread", "Coffee", "Sugar"],

    # SNACK COMBOS
    ["Piattos", "Coke"],

    ["Piattos", "Milo"],

    ["Piattos", "Bread"],

    ["Piattos", "Coffee"],

    # SWEET / MILK COMBOS
    ["Milo", "Sugar"],

    ["Milo", "Bread"],

    ["Milo", "Coffee"],

    ["Milo", "Bread", "Sugar"],

    # LARGE BASKETS
    [
        "Coke",
        "Piattos",
        "Bread",
        "Coffee",
    ],

    [
        "Coffee",
        "Sugar",
        "Bread",
        "Milo",
    ],

    [
        "Coke",
        "Piattos",
        "Milo",
        "Bread",
    ],

    # RANDOM DAILY STORE PURCHASES
    [
        "Coke",
        "Bread",
        "Sugar",
    ],

    [
        "Coffee",
        "Piattos",
        "Milo",
    ],

    [
        "Bread",
        "Coke",
        "Coffee",
    ],

    [
        "Piattos",
        "Sugar",
        "Milo",
    ],
]

# ====================================
# CREATE HISTORICAL SALES
# ====================================

for day in range(90):

    date = datetime.now() - timedelta(
        days=day
    )

    total = random.randint(
        1000,
        5000
    )

    cursor.execute("""

        INSERT INTO transactions (

            user_id,
            total_amount,
            payment_method,
            created_at

        )

        VALUES (

            %s,
            %s,
            %s,
            %s

        )

        RETURNING id

    """, (

        USER_ID,

        total,

        "Cash",

        date,
    ))

    transaction_id = cursor.fetchone()[0]

    # RANDOM PRODUCT COMBINATION
    selected = random.choice(
        combinations
    )

    for item in selected:

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

            product_map[item],

            random.randint(1, 5),

            random.randint(10, 50),
        ))

conn.commit()

cursor.close()

conn.close()

print(
    "AI seed data inserted successfully."
)