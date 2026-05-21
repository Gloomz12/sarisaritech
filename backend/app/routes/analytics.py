from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Request,
)

from app.core.security import limiter

from app.db.database import (
    get_connection,
)

from app.utils.auth import (
    get_current_user,
)

import logging

router = APIRouter()

logger = logging.getLogger(__name__)


# ====================================
# RANGE FILTER
# ====================================

def get_interval(range_value):

    mapping = {

        "7days":
            "7 days",

        "30days":
            "30 days",

        "3months":
            "3 months",

        "1year":
            "1 year",
    }

    return mapping.get(
        range_value,
        "30 days"
    )


# ====================================
# OVERVIEW
# ====================================

@router.get("/overview")
@limiter.limit("30/minute")
def get_overview(
    request: Request,
    range: str = "30days",
    start_date: str = None,
    end_date: str = None,
    current_user=Depends(
        get_current_user
    )
):

    conn = None
    cursor = None

    try:
        is_custom = (
            range == "custom"
            and start_date
            and end_date
        )

        interval = get_interval(range)

        conn = get_connection()

        cursor = conn.cursor()

        if is_custom:

            cursor.execute("""

                SELECT

                    COALESCE(
                        SUM(total_amount),
                        0
                    ),

                    COUNT(*)

                FROM transactions

                WHERE
                    user_id = %s

                AND
                    DATE(created_at)
                    BETWEEN %s AND %s

            """, (
                current_user["user_id"],
                start_date,
                end_date
            ))

        else:

            cursor.execute("""

                SELECT

                    COALESCE(
                        SUM(total_amount),
                        0
                    ),

                    COUNT(*)

                FROM transactions

                WHERE
                    user_id = %s

                AND
                    created_at >=
                    NOW() - INTERVAL %s

            """, (
                current_user["user_id"],
                interval
            ))

        sales_data = cursor.fetchone()

        total_sales = float(
            sales_data[0]
        )

        total_orders = sales_data[1]

        average_order_value = (

            total_sales / total_orders

            if total_orders > 0

            else 0
        )

        cursor.execute("""

            SELECT COUNT(*)

            FROM products

            WHERE
                user_id = %s

            AND
                is_active = true

        """, (
            current_user["user_id"],
        ))

        active_products = cursor.fetchone()[0]

        return {

            "totalSales":
                total_sales,

            "totalOrders":
                total_orders,

            "averageOrderValue":
                round(
                    average_order_value,
                    2
                ),

            "activeProducts":
                active_products,
        }

    except Exception as e:

        if conn:
            conn.rollback()

        logger.error(f"Overview analytics error: {e}")

        raise HTTPException(
            status_code=500,
            detail="Failed to load overview"
        )

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()


# ====================================
# SALES TREND
# ====================================

@router.get("/sales-trend")
@limiter.limit("30/minute")
def get_sales_trend(
    request: Request,
    range: str = "30days",
    start_date: str = None,
    end_date: str = None,
    current_user=Depends(
        get_current_user
    )
):

    conn = None
    cursor = None

    try:
        is_custom = (
            range == "custom"
            and start_date
            and end_date
        )

        interval = get_interval(range)

        conn = get_connection()

        cursor = conn.cursor()

        # ====================================
        # 1 YEAR = MONTHLY
        # ====================================

        if range == "1year":

            cursor.execute("""

                SELECT

                    TO_CHAR(
                        DATE_TRUNC(
                            'month',
                            created_at
                        ),
                        'Mon'
                    ) as month,

                    COALESCE(
                        SUM(total_amount),
                        0
                    )

                FROM transactions

                WHERE
                    user_id = %s

                AND
                    created_at >=
                    NOW() - INTERVAL %s

                GROUP BY
                    DATE_TRUNC(
                        'month',
                        created_at
                    )

                ORDER BY
                    DATE_TRUNC(
                        'month',
                        created_at
                    )

            """, (
                current_user["user_id"],
                interval
            ))

            rows = cursor.fetchall()

            result = []

            for row in rows:

                result.append({

                    "date":
                        row[0],

                    "sales":
                        float(row[1]),
                })

            return result

        # ====================================
        # 3 MONTHS = WEEKLY
        # ====================================

        if range == "3months":

            cursor.execute("""

                SELECT

                    DATE_TRUNC(
                        'week',
                        created_at
                    )::date as week,

                    COALESCE(
                        SUM(total_amount),
                        0
                    )

                FROM transactions

                WHERE
                    user_id = %s

                AND
                    created_at >=
                    NOW() - INTERVAL %s

                GROUP BY
                    DATE_TRUNC(
                        'week',
                        created_at
                    )

                ORDER BY
                    DATE_TRUNC(
                        'week',
                        created_at
                    )

            """, (
                current_user["user_id"],
                interval
            ))

            rows = cursor.fetchall()

            result = []

            for row in rows:

                result.append({

                    "date":
                        row[0].isoformat(),

                    "sales":
                        float(row[1]),
                })

            return result

        # ====================================
        # DEFAULT = DAILY
        # ====================================

        if is_custom:

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

                AND
                    DATE(created_at)
                    BETWEEN %s AND %s

                GROUP BY
                    DATE(created_at)

                ORDER BY
                    DATE(created_at)

            """, (
                current_user["user_id"],
                start_date,
                end_date
            ))

        else:

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

                AND
                    created_at >=
                    NOW() - INTERVAL %s

                GROUP BY
                    DATE(created_at)

                ORDER BY
                    DATE(created_at)

            """, (
                current_user["user_id"],
                interval
            ))

        rows = cursor.fetchall()

        result = []

        for row in rows:

            result.append({

                "date":
                    str(row[0]),

                "sales":
                    float(row[1]),
            })

        return result

    except Exception as e:

        if conn:
            conn.rollback()

        logger.error(f"Sales trend analytics error: {e}")

        raise HTTPException(
            status_code=500,
            detail="Failed to load sales trend"
        )

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()


# ====================================
# TOP PRODUCTS
# ====================================

@router.get("/top-products")
@limiter.limit("30/minute")
def get_top_products(
    request: Request,
    range: str = "30days",
    start_date: str = None,
    end_date: str = None,
    current_user=Depends(
        get_current_user
    )
):

    conn = None
    cursor = None

    try:
        is_custom = (
            range == "custom"
            and start_date
            and end_date
        )

        interval = get_interval(range)

        conn = get_connection()

        cursor = conn.cursor()

        if is_custom:

            cursor.execute("""

                SELECT

                    p.name,

                    COALESCE(
                        c.name,
                        'Uncategorized'
                    ),

                    COALESCE(
                        SUM(ti.quantity),
                        0
                    ) as sold,

                    COALESCE(
                        SUM(ti.subtotal),
                        0
                    ) as sales

                FROM transaction_items ti

                JOIN products p
                ON ti.product_id = p.id

                LEFT JOIN categories c
                ON p.category_id = c.id

                JOIN transactions t
                ON ti.transaction_id = t.id

                WHERE
                    t.user_id = %s

                AND
                    DATE(t.created_at)
                    BETWEEN %s AND %s

                GROUP BY
                    p.name,
                    c.name

                ORDER BY
                    sales DESC

                LIMIT 5

            """, (
                current_user["user_id"],
                start_date,
                end_date
            ))

        else:

            cursor.execute("""

                SELECT

                    p.name,

                    COALESCE(
                        c.name,
                        'Uncategorized'
                    ),

                    COALESCE(
                        SUM(ti.quantity),
                        0
                    ) as sold,

                    COALESCE(
                        SUM(ti.subtotal),
                        0
                    ) as sales

                FROM transaction_items ti

                JOIN products p
                ON ti.product_id = p.id

                LEFT JOIN categories c
                ON p.category_id = c.id

                JOIN transactions t
                ON ti.transaction_id = t.id

                WHERE
                    t.user_id = %s

                AND
                    t.created_at >=
                    NOW() - INTERVAL %s

                GROUP BY
                    p.name,
                    c.name

                ORDER BY
                    sales DESC

                LIMIT 5

            """, (
                current_user["user_id"],
                interval
            ))
        rows = cursor.fetchall()

        result = []

        for row in rows:

            result.append({

                "name":
                    row[0],

                "category":
                    row[1],

                "sold":
                    row[2],

                "sales":
                    float(row[3]),
            })

        return result

    except Exception as e:

        if conn:
            conn.rollback()

        logger.error(f"Top products analytics error: {e}")

        raise HTTPException(
            status_code=500,
            detail="Failed to load top products"
        )

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()


# ====================================
# CATEGORY DISTRIBUTION
# ====================================

@router.get("/categories")
@limiter.limit("30/minute")
def get_categories(
   request: Request,
    range: str = "30days",
    start_date: str = None,
    end_date: str = None,
    current_user=Depends(
        get_current_user
    )
):
    conn = None
    cursor = None

    try:
        is_custom = (
            range == "custom"
            and start_date
            and end_date
        )

        interval = get_interval(range)

        conn = get_connection()

        cursor = conn.cursor()

        if is_custom:

            cursor.execute("""

                SELECT

                    COALESCE(
                        c.name,
                        'Uncategorized'
                    ),

                    COALESCE(
                        SUM(ti.subtotal),
                        0
                    ) as sales

                FROM transaction_items ti

                JOIN products p
                ON ti.product_id = p.id

                LEFT JOIN categories c
                ON p.category_id = c.id

                JOIN transactions t
                ON ti.transaction_id = t.id

                WHERE
                    t.user_id = %s

                AND
                    DATE(t.created_at)
                    BETWEEN %s AND %s

                GROUP BY
                    c.name

            """, (
                current_user["user_id"],
                start_date,
                end_date
            ))

        else:

            cursor.execute("""

                SELECT

                    COALESCE(
                        c.name,
                        'Uncategorized'
                    ),

                    COALESCE(
                        SUM(ti.subtotal),
                        0
                    ) as sales

                FROM transaction_items ti

                JOIN products p
                ON ti.product_id = p.id

                LEFT JOIN categories c
                ON p.category_id = c.id

                JOIN transactions t
                ON ti.transaction_id = t.id

                WHERE
                    t.user_id = %s

                AND
                    t.created_at >=
                    NOW() - INTERVAL %s

                GROUP BY
                    c.name

            """, (
                current_user["user_id"],
                interval
            ))
        rows = cursor.fetchall()

        total = sum(
            float(row[1])
            for row in rows
        )

        result = []

        for row in rows:

            amount = float(row[1])

            percent = (
                (amount / total) * 100
                if total > 0 else 0
            )

            result.append({

                "name":
                    row[0],

                "amount":
                    amount,

                "percent":
                    round(percent, 1),
            })

        return result

    except Exception as e:

        if conn:
            conn.rollback()

        logger.error(f"Categories analytics error: {e}")

        raise HTTPException(
            status_code=500,
            detail="Failed to load categories"
        )

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()