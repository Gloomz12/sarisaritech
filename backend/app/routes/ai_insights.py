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

import pandas as pd

import google.generativeai as genai

import os

from dotenv import load_dotenv

load_dotenv()

import logging
router = APIRouter()
logger = logging.getLogger(__name__)

# GEMINI CONFIG
genai.configure(
    api_key=os.getenv(
        "GEMINI_API_KEY"
    )
)

model = genai.GenerativeModel(
    "gemini-2.5-flash"
)



# FORECAST

from sklearn.metrics import (
    mean_absolute_error,
)

@router.get("/forecast")
@limiter.limit("20/minute")
def get_forecast(
    request: Request,
    days: int = 7,
    current_user=Depends(
        get_current_user
    )
):

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

            return {
                "forecast": [],

                "metrics": {
                    "mae": 0,
                }
            }

        
        # DATAFRAME
        data = pd.DataFrame([
            {
                "ds": pd.to_datetime(row[0]),
                "y": float(row[1]),
            }

            for row in rows
        ])

        
        # MINIMUM DATA CHECK
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

            return {

                "forecast":
                    output,

                "metrics": {
                    "mae": 0,
                }
            }

      
        # PROPHET MODEL
      
        model_prophet = Prophet()

        model_prophet.fit(data)

     
        # FUTURE DAYS


        future = model_prophet.make_future_dataframe(
            periods=days
        )

    
        # PREDICT
    
        forecast = model_prophet.predict(
            future
        )

    
        # MODEL EVALUATION

        train_forecast = (
            model_prophet.predict(data)
        )

        mae = mean_absolute_error(
            data["y"],
            train_forecast["yhat"]
        )

        # =========================
        # THESIS OUTPUT
        # =========================

        print("\n========== FORECAST RESULTS ==========")

        actual_values = (
            data["y"]
            .tail(7)
            .tolist()
        )

        forecast_values = (
            train_forecast["yhat"]
            .tail(7)
            .tolist()
        )

        for i in range(len(actual_values)):

            actual_sale = round(
                float(actual_values[i]),
                2
            )

            forecast_sale = round(
                float(forecast_values[i]),
                2
            )

            print(
                f"Actual: {actual_sale} | "
                f"Forecasted: {forecast_sale}"
            )

        print(f"\nMAE: {round(mae, 2)}")

        print("=====================================\n")

    
        # HISTORY + FUTURE FORECAST
        actual_days_map = {
            7: 3,
            30: 15,
            90: 45,
        }

        actual_days = actual_days_map.get(
            days,
            3
        )

        # LAST ACTUAL SALES

        history = data.tail(
            actual_days
        ).copy()

        history = history.rename(columns={
            "y": "yhat"
        })

        history["type"] = "actual"

        # FUTURE ONLY

        future_only = forecast[
            forecast["ds"] > data["ds"].max()
        ].copy()

        future_forecast = future_only[
            ["ds", "yhat"]
        ].head(
            days - actual_days
        )

        future_forecast["type"] = "predicted"

        # COMBINE

        combined = pd.concat([
            history,
            future_forecast
        ])

        # SORT

        combined = combined.sort_values(
            by="ds"
        )

        
        # OUTPUT

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

        return {

            "forecast":
                output,

            "metrics": {

                "mae":
                    round(mae, 2),

            }
        }

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

# APRIORI
@router.get("/apriori")
@limiter.limit("20/minute")
def get_apriori(
    request: Request,
    current_user=Depends(
        get_current_user
    )
):

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

        # NO DATA
        if not rows:

            return {
                "success": True,
                "rules": [],
                "message": "No transaction data found."
            }

        # CREATE BASKETS
        basket = {}

        for transaction_id, product_name in rows:

            if transaction_id not in basket:

                basket[transaction_id] = {}

            basket[transaction_id][product_name] = 1

        # NEED AT LEAST 2 TRANSACTIONS
        if len(basket) < 2:

            return {
                "success": True,
                "rules": [],
                "message": "More transactions are needed for Apriori analysis."
            }

        # DATAFRAME
        df = pd.DataFrame(
            basket
        ).T.fillna(0)

        # BOOLEAN VALUES
        df = df.astype(bool)

        # APRIORI
        frequent_items = apriori(
            df,
            min_support=0.01,
            use_colnames=True,
        )

        # EMPTY FREQUENT ITEMS
        if frequent_items.empty:

            return {
                "success": True,
                "rules": [],
                "message": "No frequent itemsets found."
            }

        # ASSOCIATION RULES
        rules = association_rules(
            frequent_items,
            metric="confidence",
            min_threshold=0.2,
        )

        # EMPTY RULES
        if rules.empty:

            return {
                "success": True,
                "rules": [],
                "message": "No association rules found."
            }

        # =========================
        # THESIS OUTPUT
        # =========================

        print("\n========== APRIORI RESULTS ==========")

        for _, row in rules.head(10).iterrows():

            left = ", ".join(
                list(row["antecedents"])
            )

            right = ", ".join(
                list(row["consequents"])
            )

            support = round(
                float(row["support"]),
                2
            )

            confidence = round(
                float(row["confidence"]),
                2
            )

            print(
                f"{left} + {right}"
            )

            print(
                f"Support: {support}"
            )

            print(
                f"Confidence: {confidence}"
            )

            print("----------------------")

        print("=====================================\n")
                    

        output = []

        for _, row in rules.iterrows():

            output.append({

                "products":
                    list(
                        row["antecedents"]
                    ),

                "recommendation":
                    list(
                        row["consequents"]
                    ),

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

        return {
            "success": True,
            "rules": output
        }

    except Exception as e:

        if conn:
            conn.rollback()

        logger.error(f"Apriori error: {e}")

        print("APRIORI ERROR:", str(e))

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

        You are a business assistant for a sari-sari store.

        Generate practical business insights.

        Rules:
        - Maximum 5 insights
        - One sentence only per insight
        - Simple English
        - No numbering
        - No markdown
        - Short and practical

        Top Selling Products:
        {top_products_text}

        Product Associations:
        {apriori_text}

        Generate useful retail recommendations.

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

import gc

@router.get("/restock")
@limiter.limit("20/minute")
def get_restock_recommendations(
    request: Request,
    current_user=Depends(
        get_current_user
    )
):

    conn = None
    cursor = None

    try:

        conn = get_connection()

        cursor = conn.cursor()

        # =========================
        # GET TOP SELLING PRODUCTS
        # =========================

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

            LIMIT 10

        """, (
            current_user["user_id"],
        ))

        products = cursor.fetchall()

        recommendations = []

        # =========================
        # LOOP PRODUCTS
        # =========================

        for product in products:

            product_id = product[0]

            product_name = product[1]

            current_stock = product[2]

            # =========================
            # SALES HISTORY
            # =========================

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

            # =========================
            # SKIP WEAK DATA
            # =========================

            if len(sales_rows) < 7:
                continue

            # =========================
            # DATAFRAME
            # =========================

            data = pd.DataFrame([
                {
                    "ds": str(row[0]),
                    "y": float(row[1]),
                }

                for row in sales_rows
            ])

            # =========================
            # PROPHET MODEL
            # =========================

            model_prophet = Prophet()

            model_prophet.fit(data)

            # =========================
            # FORECAST
            # =========================

            future = model_prophet.make_future_dataframe(
                periods=7
            )

            forecast = model_prophet.predict(
                future
            )

            # =========================
            # PREDICTED DEMAND
            # =========================

            predicted_demand = round(

                forecast["yhat"]
                .tail(7)
                .sum()

            )

            # =========================
            # RESTOCK SUGGESTION
            # =========================

            suggested_order = max(

                predicted_demand
                - current_stock,

                0
            )

            # =========================
            # PRIORITY
            # =========================

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

            # =========================
            # MEMORY CLEANUP
            # =========================

            del data
            del future
            del forecast
            del model_prophet

            gc.collect()

        # =========================
        # SORT RESULTS
        # =========================

        recommendations.sort(

            key=lambda x:
                x["suggested_restock"],

            reverse=True
        )

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