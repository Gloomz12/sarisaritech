from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from app.db.database import (
    get_connection
)

from app.utils.auth import (
    get_current_user
)

import logging

router = APIRouter(
    tags=["Dashboard"]
)

logger = logging.getLogger(__name__)


@router.get("/stats")
def get_dashboard_stats(
    current_user=Depends(get_current_user)
):

    conn = None
    cur = None

    try:

        conn = get_connection()

        cur = conn.cursor()

        # TODAY SALES

        cur.execute("""
            SELECT
                COALESCE(SUM(total_amount), 0),
                COUNT(*)

            FROM transactions

            WHERE user_id = %s
            AND DATE(created_at) = CURRENT_DATE
        """, (str(current_user["user_id"]),))

        today_data = cur.fetchone()

        # TODAY AVERAGE SALE

        today_average = 0

        if today_data[1] > 0:

            today_average = round(
                float(today_data[0]) / today_data[1],
                2
            )

        # YESTERDAY SALES

        cur.execute("""
            SELECT
                COALESCE(SUM(total_amount), 0)

            FROM transactions

            WHERE user_id = %s
            AND DATE(created_at)
                = CURRENT_DATE - INTERVAL '1 day'
        """, (str(current_user["user_id"]),))

        yesterday_sales = float(
            cur.fetchone()[0]
        )

        # WEEK SALES

        cur.execute("""
            SELECT
                COALESCE(SUM(total_amount), 0),
                COUNT(*)

            FROM transactions

            WHERE user_id = %s
            AND created_at >= CURRENT_DATE - INTERVAL '7 days'
        """, (str(current_user["user_id"]),))

        week_data = cur.fetchone()

        # WEEK AVERAGE SALE

        week_average = 0

        if week_data[1] > 0:

            week_average = round(
                float(week_data[0]) / week_data[1],
                2
            )

        # PREVIOUS WEEK SALES

        cur.execute("""
            SELECT
                COALESCE(SUM(total_amount), 0)

            FROM transactions

            WHERE user_id = %s
            AND created_at >= CURRENT_DATE - INTERVAL '14 days'
            AND created_at < CURRENT_DATE - INTERVAL '7 days'
        """, (str(current_user["user_id"]),))

        previous_week_sales = float(
            cur.fetchone()[0]
        )

        # TOP PRODUCT TODAY

        cur.execute("""
            SELECT
                p.name,
                SUM(ti.quantity) AS qty

            FROM transaction_items ti

            JOIN products p
                ON p.id = ti.product_id

            JOIN transactions t
                ON t.id = ti.transaction_id

            WHERE t.user_id = %s
            AND DATE(t.created_at) = CURRENT_DATE

            GROUP BY p.name

            ORDER BY qty DESC

            LIMIT 1
        """, (str(current_user["user_id"]),))

        top_today = cur.fetchone()

        # TOP PRODUCT WEEK

        cur.execute("""
            SELECT
                p.name,
                SUM(ti.quantity) AS qty

            FROM transaction_items ti

            JOIN products p
                ON p.id = ti.product_id

            JOIN transactions t
                ON t.id = ti.transaction_id

            WHERE t.user_id = %s
            AND t.created_at >= CURRENT_DATE - INTERVAL '7 days'

            GROUP BY p.name

            ORDER BY qty DESC

            LIMIT 1
        """, (str(current_user["user_id"]),))

        top_week = cur.fetchone()

        # LOW STOCK PRODUCTS

        cur.execute("""
            SELECT
                id,
                name,
                stock_quantity

            FROM products

            WHERE user_id = %s
            AND stock_quantity <= 50

            ORDER BY stock_quantity ASC

            LIMIT 3
        """, (str(current_user["user_id"]),))

        stock_rows = cur.fetchall()

        alerts = []

        for item in stock_rows:

            level = "medium"

            if item[2] <= 5:

                level = "critical"

            elif item[2] <= 15:

                level = "low"

            alerts.append({
                "id": str(item[0]),
                "name": item[1],
                "stock": item[2],
                "level": level
            })

        # TODAY GROWTH %

        today_growth = 0

        if yesterday_sales > 0:

            today_growth = round(
                (
                    (
                        float(today_data[0])
                        - yesterday_sales
                    )
                    / yesterday_sales
                ) * 100,
                1
            )

        # WEEK GROWTH %

        week_growth = 0

        if previous_week_sales > 0:

            week_growth = round(
                (
                    (
                        float(week_data[0])
                        - previous_week_sales
                    )
                    / previous_week_sales
                ) * 100,
                1
            )

        return {

            "today": {
                "sales": float(today_data[0]),
                "transactions": today_data[1],
                "growth": today_growth,
                "average_sale": today_average,

                "top_product": (
                    top_today[0]
                    if top_today
                    else None
                ),

                "top_quantity": (
                    int(top_today[1])
                    if top_today
                    else 0
                )
            },

            "week": {
                "sales": float(week_data[0]),
                "transactions": week_data[1],
                "growth": week_growth,
                "average_sale": week_average,

                "top_product": (
                    top_week[0]
                    if top_week
                    else None
                ),

                "top_quantity": (
                    int(top_week[1])
                    if top_week
                    else 0
                )
            },

            "stock_alerts": alerts
        }

    except Exception as e:

        if conn:
            conn.rollback()

        logger.error(f"Dashboard stats error: {e}")

        raise HTTPException(
            status_code=500,
            detail="Failed to load dashboard stats"
        )

    finally:

        if cur:
            cur.close()

        if conn:
            conn.close()