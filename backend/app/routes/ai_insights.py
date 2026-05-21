from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Request,
)

from app.core.security import limiter

from prophet import Prophet

from mlxtend.frequent_patterns import (
    apriori,
    association_rules,
)

from app.db.database import (
    get_connection,
)

from app.utils.auth import (
    get_current_user,
)

from sklearn.metrics import (
    mean_absolute_error,
)

from datetime import (
    datetime,
    timedelta,
)

import pandas as pd

import google.generativeai as genai

import os

import gc

import logging

from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

logger = logging.getLogger(__name__)

# ====================================
# GEMINI CONFIG
# ====================================

genai.configure(
    api_key=os.getenv(
        "GEMINI_API_KEY"
    )
)

model = genai.GenerativeModel(
    "gemini-2.5-flash"
)

# ====================================
# SIMPLE CACHE
# ====================================

forecast_cache = {}

apriori_cache = {
    "data": None,
    "last_updated": None,
}

restock_cache = {
    "data": None,
    "last_updated": None,
}

# ====================================
# FORECAST
# ====================================

@router.get("/forecast")
@limiter.limit("20/minute")
def get_forecast(
    request: Request,
    days: int = 7,
    current_user=Depends(
        get_current_user
    )
):

    global forecast_cache

    # ====================================
    # CACHE REUSE
    # ====================================

    cache_key = f"forecast_{days}"

    if (
        cache_key in forecast_cache
    ):

        cached = forecast_cache[cache_key]

        if (
            datetime.now()
            - cached["last_updated"]
            < timedelta(minutes=30)
        ):

            return cached["data"]

    conn = None
    cursor = None

    try:

        conn = get_connection()

        cursor = conn.cursor()

        cursor.execute("""

            SELECT

                DATE(created_at),

                COALESCE(
                    SUM(total_amount),
                    0
                )

            FROM transactions

            WHERE
                user_id = %s

            GROUP BY
                DATE(created_at)

            ORDER BY
                DATE(created_at)

        """, (
            current_user["user_id"],
        ))

        rows = cursor.fetchall()

        if not rows:

            result = {
                "forecast": [],
                "metrics": {
                    "mae": 0,
                }
            }

            forecast_cache[cache_key] = {
            "data": result,
            "last_updated": datetime.now(),
}

            return result

        # ====================================
        # DATAFRAME
        # ====================================

        data = pd.DataFrame([
            {
                "ds": pd.to_datetime(row[0]),
                "y": float(row[1]),
            }

            for row in rows
        ])

        # ====================================
        # MINIMUM DATA CHECK
        # ====================================

        if len(data) < 3:

            output = []

            for _, row in data.iterrows():

                output.append({

                    "ds":
                        row["ds"].strftime(
                            "%Y-%m-%d"
                        ),

                    "yhat":
                        round(
                            float(row["y"]),
                            2
                        ),

                    "type":
                        "actual",
                })

            result = {

                "forecast":
                    output,

                "metrics": {
                    "mae": 0,
                }
            }

            forecast_cache[cache_key] = {
                "data": result,
                "last_updated": datetime.now(),
            }

            return result

        # ====================================
        # PROPHET MODEL
        # ====================================

        model_prophet = Prophet()

        model_prophet.fit(data)

        # ====================================
        # FUTURE DAYS
        # ====================================

        future = model_prophet.make_future_dataframe(
            periods=days
        )

        # ====================================
        # PREDICT
        # ====================================

        forecast = model_prophet.predict(
            future
        )

        # ====================================
        # MODEL EVALUATION
        # ====================================

        train_forecast = (
            model_prophet.predict(data)
        )

        mae = mean_absolute_error(
            data["y"],
            train_forecast["yhat"]
        )

        # ====================================
        # OUTPUT FORMAT
        # ====================================

        actual_days_map = {
            7: 3,
            30: 15,
            90: 45,
        }

        actual_days = actual_days_map.get(
            days,
            3
        )

        history = data.tail(
            actual_days
        ).copy()

        history = history.rename(columns={
            "y": "yhat"
        })

        history["type"] = "actual"

        future_only = forecast[
            forecast["ds"] > data["ds"].max()
        ].copy()

        future_forecast = future_only[
            ["ds", "yhat"]
        ].head(
            days - actual_days
        )

        future_forecast["type"] = "predicted"

        combined = pd.concat([
            history,
            future_forecast
        ])

        combined = combined.sort_values(
            by="ds"
        )

        output = []

        for _, row in combined.iterrows():

            output.append({

                "ds":
                    row["ds"].strftime(
                        "%Y-%m-%d"
                    ),

                "yhat":
                    round(
                        float(row["yhat"]),
                        2
                    ),

                "type":
                    row["type"],
            })

        result = {

            "forecast":
                output,

            "metrics": {

                "mae":
                    round(mae, 2),

            }
        }

        # ====================================
        # SAVE CACHE
        # ====================================

        forecast_cache[cache_key] = {
            "data": result,
            "last_updated": datetime.now(),
        }

        return result

    except Exception as e:

        if conn:
            conn.rollback()

        logger.error(f"Forecast error: {e}")

        raise HTTPException(
            status_code=500,
            detail="Internal server error"
        )

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()

# ====================================
# APRIORI
# ====================================

@router.get("/apriori")
@limiter.limit("20/minute")
def get_apriori(
    request: Request,
    current_user=Depends(
        get_current_user
    )
):

    global apriori_cache

    # ====================================
    # CACHE REUSE
    # ====================================

    if (
        apriori_cache["data"] is not None
        and apriori_cache["last_updated"] is not None
        and datetime.now()
        - apriori_cache["last_updated"]
        < timedelta(minutes=5)
    ):
        return apriori_cache["data"]

    conn = None
    cursor = None

    try:

        conn = get_connection()

        cursor = conn.cursor()

        cursor.execute("""

            SELECT

                t.id,
                p.name

            FROM transaction_items ti

            JOIN products p
            ON ti.product_id = p.id

            JOIN transactions t
            ON ti.transaction_id = t.id

            WHERE
                t.user_id = %s
                AND t.type = 'sale'

        """, (
            current_user["user_id"],
        ))

        rows = cursor.fetchall()

        if not rows:

            result = {
                "success": True,
                "rules": [],
                "message": "No transaction data found."
            }

            apriori_cache["data"] = result

            apriori_cache["last_updated"] = datetime.now()

            return result

        basket = {}

        for transaction_id, product_name in rows:

            if transaction_id not in basket:

                basket[transaction_id] = {}

            basket[transaction_id][product_name] = 1

        if len(basket) < 2:

            result = {
                "success": True,
                "rules": [],
                "message": "More transactions are needed."
            }

            apriori_cache["data"] = result

            apriori_cache["last_updated"] = datetime.now()

            return result

        df = pd.DataFrame(
            basket
        ).T.fillna(0)

        df = df.astype(bool)

        frequent_items = apriori(
            df,
            min_support=0.01,
            use_colnames=True,
        )

        if frequent_items.empty:

            result = {
                "success": True,
                "rules": [],
                "message": "No frequent itemsets found."
            }

            apriori_cache["data"] = result

            apriori_cache["last_updated"] = datetime.now()

            return result

        rules = association_rules(
            frequent_items,
            metric="confidence",
            min_threshold=0.2,
        )

        if rules.empty:

            result = {
                "success": True,
                "rules": [],
                "message": "No association rules found."
            }

            apriori_cache["data"] = result

            apriori_cache["last_updated"] = datetime.now()

            return result

        output = []

        seen_pairs = set()

        for _, row in rules.iterrows():

            left = sorted(
                list(row["antecedents"])
            )

            right = sorted(
                list(row["consequents"])
            )

            # normalize pair
            pair_key = tuple(sorted([
                tuple(left),
                tuple(right)
            ]))

            # skip reverse duplicates
            if pair_key in seen_pairs:
                continue

            seen_pairs.add(pair_key)

            output.append({

                "products":
                    left,

                "recommendation":
                    right,

                "support":
                    round(
                        float(row["support"]),
                        2
                    ),

                "confidence":
                    round(
                        float(row["confidence"]),
                        2
                    ),

                "lift":
                    round(
                        float(row["lift"]),
                        2
                    ),
            })
            result = {
                "success": True,
                "rules": output
            }

        # ====================================
        # SAVE CACHE
        # ====================================

        apriori_cache["data"] = result

        apriori_cache["last_updated"] = datetime.now()

        return result

    except Exception as e:

        if conn:
            conn.rollback()

        logger.error(f"Apriori error: {e}")

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()

        # ====================================
        # GEMINI AI INSIGHTS
        # ====================================

@router.get("/gemini")
@limiter.limit("10/minute")
def get_gemini_insights(
    request: Request,
    current_user=Depends(get_current_user)
):

    conn = None
    cursor = None

    try:

        conn = get_connection()
        cursor = conn.cursor()

        # =========================
        # GET TOP PRODUCTS
        # =========================

        cursor.execute("""

            SELECT
                p.name,
                SUM(ti.quantity) AS total_qty

            FROM transaction_items ti

            JOIN products p
            ON ti.product_id = p.id

            JOIN transactions t
            ON ti.transaction_id = t.id

            WHERE t.user_id = %s

            GROUP BY p.name

            ORDER BY total_qty DESC

            LIMIT 5

        """, (
            current_user["user_id"],
        ))

        top_products = cursor.fetchall()

        # =========================
        # GET APRIORI DATA
        # =========================

        cursor.execute("""

            SELECT
                t.id,
                p.name

            FROM transaction_items ti

            JOIN products p
            ON ti.product_id = p.id

            JOIN transactions t
            ON ti.transaction_id = t.id

            WHERE t.user_id = %s

        """, (
            current_user["user_id"],
        ))

        rows = cursor.fetchall()

        apriori_text = "No association data available."

        if rows:

            basket = {}

            for transaction_id, product_name in rows:

                if transaction_id not in basket:
                    basket[transaction_id] = {}

                basket[transaction_id][product_name] = 1

            df = pd.DataFrame(basket).T.fillna(0)

            frequent_items = apriori(
                df,
                min_support=0.01,
                use_colnames=True,
            )

            rules = association_rules(
                frequent_items,
                metric="confidence",
                min_threshold=0.2,
            )
            
            rules = rules.head(5)

            associations = []

            for _, row in rules.iterrows():

                left = ", ".join(list(row["antecedents"]))
                right = ", ".join(list(row["consequents"]))

                associations.append(
                    f"{left} is often bought with {right}"
                )

            if associations:
                apriori_text = "\n".join(
                    associations[:5]
                )

        # =========================
        # TOP PRODUCTS TEXT
        # =========================

        top_products_text = "\n".join([
            f"{name} sold {qty} units"
            for name, qty in top_products
        ])

        if not top_products_text:
            top_products_text = "No sales data available."

        # =========================
        # GEMINI PROMPT
        # =========================

        prompt = f"""

        You are an AI business assistant for a sari-sari store inventory and sales system.

        Your task is to generate short and practical business recommendations
        based ONLY on the provided sales and Apriori association data.

        STRICT RULES:
        - Use ONLY the exact product names provided
        - Do NOT invent products
        - Do NOT assume information not found in the data
        - Maximum 5 recommendations only
        - One sentence per recommendation
        - Simple and professional English
        - No numbering
        - No markdown
        - Focus on inventory, bundling, restocking, and sales improvement
        - Keep each recommendation short and clear

        TOP SELLING PRODUCTS:
        {top_products_text}

        PRODUCT ASSOCIATIONS:
        {apriori_text}

        Generate useful recommendations for the store owner.

        """

        response = model.generate_content(
            prompt
        )

        return {
            "insights": response.text
        }

    except Exception as e:

        logger.error(f"Gemini insights error: {e}")

        raise HTTPException(
            status_code=500,
            detail="Internal server error"
        )

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()


# ====================================
# RESTOCK RECOMMENDATIONS
# ====================================

@router.get("/restock")
@limiter.limit("20/minute")
def get_restock_recommendations(
    request: Request,
    current_user=Depends(
        get_current_user
    )
):

    global restock_cache

    # ====================================
    # CACHE REUSE
    # ====================================

    if (
        restock_cache["data"] is not None
        and restock_cache["last_updated"] is not None
        and datetime.now()
        - restock_cache["last_updated"]
        < timedelta(minutes=5)
    ):
        return restock_cache["data"]

    conn = None
    cursor = None

    try:

        conn = get_connection()

        cursor = conn.cursor()

        cursor.execute("""

            SELECT
                p.id,
                p.name,
                p.stock_quantity,

                COALESCE(
                    SUM(ti.quantity),
                    0
                ) AS total_sales

            FROM products p

            LEFT JOIN transaction_items ti
            ON p.id = ti.product_id

            LEFT JOIN transactions t
            ON ti.transaction_id = t.id

            WHERE
                p.user_id = %s

            GROUP BY
                p.id,
                p.name,
                p.stock_quantity

            ORDER BY
                total_sales DESC

            LIMIT 30

        """, (
            current_user["user_id"],
        ))

        products = cursor.fetchall()

        recommendations = []

        for product in products:

            product_id = product[0]

            product_name = product[1]

            current_stock = product[2]

            cursor.execute("""

                SELECT

                    DATE(t.created_at),

                    COALESCE(
                        SUM(ti.quantity),
                        0
                    )

                FROM transaction_items ti

                JOIN transactions t
                ON ti.transaction_id = t.id

                WHERE
                    ti.product_id = %s

                    AND t.user_id = %s

                GROUP BY
                    DATE(t.created_at)

                ORDER BY
                    DATE(t.created_at)

            """, (
                product_id,
                current_user["user_id"],
            ))

            sales_rows = cursor.fetchall()

            if len(sales_rows) < 7:
                continue

            data = pd.DataFrame([
                {
                    "ds": str(row[0]),
                    "y": float(row[1]),
                }

                for row in sales_rows
            ])

            model_prophet = Prophet()

            model_prophet.fit(data)

            future = model_prophet.make_future_dataframe(
                periods=7
            )

            forecast = model_prophet.predict(
                future
            )

            predicted_demand = round(

                forecast["yhat"]
                .tail(7)
                .sum()

            )

            suggested_order = max(

                predicted_demand
                - current_stock,

                0
            )

            if suggested_order >= 50:

                priority = "High"

            elif suggested_order >= 20:

                priority = "Medium"

            else:

                priority = "Low"

            recommendations.append({

                "product_name":
                    product_name,

                "current_stock":
                    current_stock,

                "predicted_demand":
                    predicted_demand,

                "suggested_restock":
                    suggested_order,

                "priority":
                    priority,
            })

            del data
            del future
            del forecast
            del model_prophet

            gc.collect()

        recommendations.sort(

            key=lambda x:
                x["suggested_restock"],

            reverse=True
        )

        # ====================================
        # SAVE CACHE
        # ====================================

        restock_cache["data"] = recommendations

        restock_cache["last_updated"] = datetime.now()

        return recommendations

    except Exception as e:

        logger.error(
            f"Restock recommendations error: {e}"
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