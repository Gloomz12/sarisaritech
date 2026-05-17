from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)

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

router = APIRouter()


# GEMINI CONFIG
genai.configure(
    api_key=os.getenv(
        "GEMINI_API_KEY"
    )
)

model = genai.GenerativeModel(
    "gemini-2.5-flash"
)


# ====================================
# FORECAST
# ====================================

from sklearn.metrics import (
    mean_absolute_error,
)

@router.get("/forecast")
def get_forecast(

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

            return {

                "forecast":
                    output,

                "metrics": {
                    "mae": 0,
                }
            }

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
        # HISTORY + FUTURE FORECAST
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

        # ====================================
        # OUTPUT
        # ====================================

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

        print("FORECAST ERROR:", e)

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
# APRIORI
# ====================================

@router.get("/apriori")
def get_apriori(
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

        """, (
            current_user["user_id"],
        ))

        rows = cursor.fetchall()

        if not rows:

            return []

        basket = {}

        for transaction_id, product_name in rows:

            if transaction_id not in basket:

                basket[
                    transaction_id
                ] = {}

            basket[
                transaction_id
            ][product_name] = 1

        df = pd.DataFrame(
            basket
        ).T.fillna(0)

        frequent_items = apriori(
            df,
            min_support=0.1,
            use_colnames=True,
        )

        rules = association_rules(
            frequent_items,
            metric="confidence",
            min_threshold=0.5,
        )

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
                        row["support"],
                        2
                    ),

                "confidence":
                    round(
                        row["confidence"],
                        2
                    ),

                "lift":
                    round(
                        row["lift"],
                        2
                    ),
            })

        return output

    except Exception as e:

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
def get_gemini_insights(
    current_user=Depends(
        get_current_user
    )
):

    try:

        prompt = """

            You are a business assistant for a sari-sari store.

            Analyze the forecast trends and Apriori association rules,
            then generate short and practical business insights.

            Requirements:
            - Maximum of 5 insights only
            - One sentence per insight
            - Use simple and easy English
            - Avoid deep or technical words
            - Make the advice clear and practical
            - Focus on sales, stock, product placement, and promos
            - Avoid repetition
            - Avoid generic advice
            - No headings
            - No numbering
            - No markdown symbols
            - Keep the response short and dashboard-friendly

            Forecast Insights:
            - Beverage sales are increasing
            - Weekend demand is higher

            Apriori Associations:
            - Coke is often bought with Chips
            - Coffee is often bought with Sugar

            Generate short retail recommendations.

            """

        response = model.generate_content(
            prompt
        )

        return {

            "insights":
                response.text
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

# ====================================
# RESTOCK RECOMMENDATIONS
# ====================================

@router.get("/restock")
def get_restock_recommendations(
    current_user=Depends(
        get_current_user
    )
):

    conn = None
    cursor = None

    try:

        conn = get_connection()

        cursor = conn.cursor()

        # GET PRODUCTS
        cursor.execute("""

            SELECT
                id,
                name,
                stock_quantity

            FROM products

            WHERE
                user_id = %s

        """, (
            current_user["user_id"],
        ))

        products = cursor.fetchall()

        recommendations = []

        for product in products:

            product_id = product[0]

            product_name = product[1]

            current_stock = product[2]

            # GET SALES HISTORY
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

            # SKIP PRODUCTS
            # WITHOUT SALES
            if len(sales_rows) < 2:
                continue

            # CREATE DATAFRAME
            data = pd.DataFrame([
                {
                    "ds": str(row[0]),
                    "y": float(row[1]),
                }

                for row in sales_rows
            ])

            # PROPHET MODEL
            model_prophet = Prophet()

            model_prophet.fit(data)

            # FORECAST NEXT 7 DAYS
            future = model_prophet.make_future_dataframe(
                periods=7
            )

            forecast = model_prophet.predict(
                future
            )

            # GET PREDICTED DEMAND
            predicted_demand = round(

                forecast["yhat"]
                .tail(7)
                .sum()

            )

            # SUGGESTED ORDER
            suggested_order = max(

                predicted_demand
                - current_stock,

                0
            )

            # PRIORITY
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

        # SORT HIGHEST FIRST
        recommendations.sort(

            key=lambda x:
                x["suggested_restock"],

            reverse=True
        )

        return recommendations

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()