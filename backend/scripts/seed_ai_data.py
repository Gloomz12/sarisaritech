# =========================================
# FAST REALISTIC SARI-SARI STORE SEEDER
# FULL HISTORY + LIVE PROGRESS
# OPTIMIZED FOR SUPABASE
# =========================================

import os
import sys
import random

from datetime import datetime, timedelta

from psycopg2.extras import execute_batch

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

conn.autocommit = False

cursor = conn.cursor()

USER_ID = "ad3d45ec-54c7-47fe-b638-4a8fa96b8d9d"

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
        VALUES (%s, %s)
        ON CONFLICT (user_id, name)
        DO NOTHING
        RETURNING id
    """, (
        category,
        USER_ID
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
            USER_ID
        ))

        category_id = cursor.fetchone()[0]

    category_map[category] = category_id

conn.commit()

# =========================================
# PRODUCTS
# =========================================

products = [

    # BEVERAGES
    ("Coke Mismo", "Beverages", 16.50, 22),
    ("Sprite Mismo", "Beverages", 16.50, 22),
    ("Royal Mismo", "Beverages", 16.50, 22),
    ("Mountain Dew Mismo", "Beverages", 16.50, 22),
    ("Pepsi", "Beverages", 14, 18),
    ("RC Cola", "Beverages", 10, 12),
    ("Zesto", "Beverages", 9.50, 13),
    ("C2 Green Tea", "Beverages", 24, 30),
    ("Gatorade", "Beverages", 42, 50),
    ("Nature Spring", "Beverages", 11, 15),
    ("Cobra Energy Drink", "Beverages", 15, 18),

    # SNACKS
    ("Piattos", "Snacks", 16, 22),
    ("Nova", "Snacks", 16, 22),
    ("Cheezy", "Snacks", 10, 15),
    ("Chippy", "Snacks", 10, 15),
    ("VCut", "Snacks", 16, 22),
    ("Crackers", "Snacks", 8, 12),
    ("Fudgee Bar", "Snacks", 8.50, 12),
    ("Hansel", "Snacks", 9, 13),
    ("Skyflakes", "Snacks", 8.50, 12),
    ("Oishi", "Snacks", 8, 12),
    ("Roller Coaster", "Snacks", 10, 15),
    ("Nagaraya", "Snacks", 8.50, 12),

    # COFFEE & MILK
    ("Nescafe Original", "Coffee & Milk", 12.50, 16),
    ("Kopiko Brown", "Coffee & Milk", 13, 17),
    ("Great Taste", "Coffee & Milk", 12, 16),
    ("Milo Sachet", "Coffee & Milk", 11, 15),
    ("Bear Brand", "Coffee & Milk", 15, 20),
    ("Alaska Condensed", "Coffee & Milk", 62, 72),
    ("Alaska Evap", "Coffee & Milk", 43, 50),
    ("Coffee Mate", "Coffee & Milk", 18, 24),

    # BREAD
    ("Pandesal", "Bread & Bakery", 3, 5),
    ("Pan De Coco", "Bread & Bakery", 8, 10),
    ("Spanish Bread", "Bread & Bakery", 10, 12),
    ("Ensaymada", "Bread & Bakery", 12, 15),
    ("Monay", "Bread & Bakery", 8, 10),

    # CANNED GOODS
    ("555 Sardines", "Canned Goods", 28, 35),
    ("Mega Sardines", "Canned Goods", 22.50, 28),
    ("Century Tuna", "Canned Goods", 41, 48),
    ("Argentina Corned Beef", "Canned Goods", 42, 50),
    ("Spam", "Canned Goods", 145, 170),
    ("Vienna Sausage", "Canned Goods", 28, 35),
    ("Ligo Sardines", "Canned Goods", 23, 28),

    # INSTANT FOODS
    ("Lucky Me Beef", "Instant Foods", 10.50, 14),
    ("Lucky Me Chicken", "Instant Foods", 10.50, 14),
    ("Pancit Canton", "Instant Foods", 14.50, 18),
    ("Cup Noodles", "Instant Foods", 21, 26),
    ("Payless", "Instant Foods", 16, 20),
    ("Mi Goreng", "Instant Foods", 15, 20),

    # CONDIMENTS
    ("Sugar 1kg", "Condiments", 58, 65),
    ("Salt", "Condiments", 7, 10),
    ("Soy Sauce", "Condiments", 12.50, 16),
    ("Vinegar", "Condiments", 10.50, 14),
    ("Fish Sauce", "Condiments", 16, 22),
    ("Banana Ketchup", "Condiments", 20, 26),

    # FROZEN
    ("Hotdog", "Frozen Foods", 75, 90),
    ("Longganisa", "Frozen Foods", 80, 95),
    ("Tocino", "Frozen Foods", 75, 90),

    # PERSONAL CARE
    ("Palmolive Sachet", "Personal Care", 7.50, 11),
    ("Creamsilk Sachet", "Personal Care", 8.50, 12),
    ("Safeguard Soap", "Personal Care", 22, 28),
    ("Colgate", "Personal Care", 11, 15),
    ("Closeup", "Personal Care", 11, 15),
    ("Bioderm Soap", "Personal Care", 20, 25),

    # HOUSEHOLD
    ("Surf Powder", "Household Items", 12.50, 17),
    ("Tide", "Household Items", 12.50, 17),
    ("Bleach", "Household Items", 18, 24),
    ("Joy Dishwashing", "Household Items", 12, 16),
    ("Downy Sachet", "Household Items", 7.50, 11),

    # SCHOOL
    ("Notebook", "School Supplies", 20, 25),
    ("Ballpen", "School Supplies", 6, 10),
    ("Pencil", "School Supplies", 4, 6),
    ("Eraser", "School Supplies", 3, 5),

    # RICE
    ("Rice 1kg", "Rice & Grains", 48, 55),
    ("Rice 5kg", "Rice & Grains", 250, 285),
]

print("Creating products...")

product_insert_data = []

for product in products:

    name, category, cost, selling = product

    stock_quantity = random.randint(5, 25)

    if random.random() < 0.30:
        stock_quantity = random.randint(1, 4)

    if random.random() < 0.12:
        stock_quantity = 0

    min_stock_level = random.randint(3, 8)

    product_insert_data.append((
        name,
        category_map[category],
        cost,
        selling,
        stock_quantity,
        min_stock_level,
        "pcs",
        USER_ID,
        True
    ))

execute_batch(
    cursor,
    """
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
    """,
    product_insert_data,
    page_size=100
)

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
# PRODUCT GROUPS
# =========================================

beverages = [
    "Coke Mismo",
    "Sprite Mismo",
    "Royal Mismo",
    "Mountain Dew Mismo",
    "Pepsi",
    "RC Cola",
    "Zesto",
    "C2 Green Tea",
    "Nature Spring",
]

snacks = [
    "Piattos",
    "Nova",
    "Cheezy",
    "Chippy",
    "VCut",
    "Crackers",
    "Fudgee Bar",
    "Hansel",
    "Skyflakes",
    "Oishi",
    "Roller Coaster",
    "Nagaraya",
]

instant_foods = [
    "Lucky Me Beef",
    "Lucky Me Chicken",
    "Pancit Canton",
    "Cup Noodles",
    "Payless",
    "Mi Goreng",
]

coffee_items = [
    "Kopiko Brown",
    "Nescafe Original",
    "Great Taste",
    "Milo Sachet",
    "Bear Brand",
]

school_items = [
    "Notebook",
    "Ballpen",
    "Pencil",
    "Eraser",
]

all_products = list(product_map.keys())

PAYMENT_METHODS = (
    ["Cash"] * 92 +
    ["GCash"] * 6 +
    ["Paymaya"] * 2
)

# =========================================
# 1 YEAR DATA
# =========================================

print("Creating realistic transactions...")

START_DATE = datetime.now() - timedelta(days=365)
END_DATE = datetime.now()

current_date = START_DATE

transaction_counter = 0

while current_date <= END_DATE:

    daily_transactions = random.randint(30, 60)

    if current_date.weekday() >= 5:
        daily_transactions = random.randint(40, 80)

    for _ in range(daily_transactions):

        created_at = current_date.replace(
            hour=random.randint(6, 21),
            minute=random.randint(0, 59),
            second=0,
            microsecond=0,
        )

        # =================================
        # RANDOM BASKET GENERATION
        # =================================

        basket_size = random.choices(
            [1, 2, 3, 4],
            weights=[45, 35, 15, 5]
        )[0]

        selected = []

        behavior = random.choice([
            "snack_combo",
            "instant_meal",
            "coffee_break",
            "school_purchase",
            "random",
        ])

        # =================================
        # SNACK + DRINK
        # =================================

        if behavior == "snack_combo":

            selected.append(
                random.choice(beverages)
            )

            selected.append(
                random.choice(snacks)
            )

        # =================================
        # INSTANT FOOD COMBO
        # =================================

        elif behavior == "instant_meal":

            selected.append(
                random.choice(instant_foods)
            )

            if random.random() < 0.70:

                selected.append(
                    random.choice(beverages)
                )

        # =================================
        # COFFEE BREAK
        # =================================

        elif behavior == "coffee_break":

            selected.append(
                random.choice(coffee_items)
            )

            if random.random() < 0.60:

                selected.append(
                    random.choice(snacks)
                )

        # =================================
        # SCHOOL ITEMS
        # =================================

        elif behavior == "school_purchase":

            selected.append(
                random.choice(school_items)
            )

            if random.random() < 0.50:

                selected.append(
                    random.choice(school_items)
                )

        # =================================
        # PURE RANDOM
        # =================================

        else:

            selected = random.sample(
                all_products,
                min(
                    basket_size,
                    len(all_products)
                )
            )

        # =================================
        # ADD RANDOM EXTRA ITEMS
        # =================================

        if random.random() < 0.25:

            extra_item = random.choice(
                all_products
            )

            if extra_item not in selected:
                selected.append(extra_item)

        # REMOVE DUPLICATES
        selected = list(set(selected))

        total_amount = 0
        transaction_items = []

        for item in selected:

            if item not in product_map:
                continue

            quantity = random.randint(1, 2)

            price = product_map[item]["price"]

            subtotal = quantity * price

            total_amount += subtotal

            transaction_items.append({
                "product_id": product_map[item]["id"],
                "quantity": quantity,
                "price": price,
            })

        total_amount = round(total_amount, 2)

        amount_paid = (
            total_amount +
            random.choice([0, 5, 10, 20, 50])
        )

        change_amount = (
            amount_paid -
            total_amount
        )

        payment_method = random.choice(
            PAYMENT_METHODS
        )

        # =================================
        # INSERT TRANSACTION
        # =================================

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

        transaction_item_data = []
        stock_movement_data = []

        for item in transaction_items:

            transaction_item_data.append((
                transaction_id,
                item["product_id"],
                item["quantity"],
                item["price"],
            ))

            previous_stock = random.randint(3, 25)

            new_stock = (
                previous_stock -
                item["quantity"]
            )

            stock_movement_data.append((
                item["product_id"],
                -item["quantity"],
                "SALE",
                created_at,
                USER_ID,
                previous_stock,
                new_stock,
            ))

            # =================================
            # RANDOM RESTOCK
            # =================================

            if random.random() < 0.04:

                restock_qty = random.randint(3, 12)

                restock_previous = new_stock

                restock_new = (
                    restock_previous +
                    restock_qty
                )

                restock_date = (
                    created_at +
                    timedelta(
                        hours=random.randint(1, 24)
                    )
                )

                stock_movement_data.append((
                    item["product_id"],
                    restock_qty,
                    "RESTOCK",
                    restock_date,
                    USER_ID,
                    restock_previous,
                    restock_new,
                ))

        # =================================
        # INSERT TRANSACTION ITEMS
        # =================================

        execute_batch(
            cursor,
            """
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
            """,
            transaction_item_data,
            page_size=100
        )

        # =================================
        # INSERT STOCK MOVEMENTS
        # =================================

        execute_batch(
            cursor,
            """
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
            """,
            stock_movement_data,
            page_size=100
        )

        transaction_counter += 1

        if transaction_counter % 50 == 0:

            print(
                f"Generated: {transaction_counter}"
            )

        if transaction_counter % 500 == 0:

            conn.commit()

            print(
                f"{transaction_counter} transactions committed..."
            )

    current_date += timedelta(days=1)

# FINAL COMMIT
conn.commit()

cursor.close()
conn.close()

print("===================================")
print("FAST REALISTIC SEED COMPLETE")
print("===================================")
print(f"TOTAL TRANSACTIONS: {transaction_counter}")
print("1 YEAR DATA GENERATED")
print("FULL HISTORY ENABLED")
print("FULL STOCK MOVEMENTS ENABLED")
print("FORECAST READY")
print("APRIORI READY")
print("ANALYTICS READY")
print("===================================")