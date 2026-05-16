from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)

from app.db.database import (
    get_connection,
)

from app.utils.auth import (
    get_current_user,
)

router = APIRouter()


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


def build_date_filter(
    range_value,
    start_date=None,
    end_date=None
):

    if (
        range_value == "custom"
        and start_date
        and end_date
    ):

        return f"""
        created_at >= '{start_date} 00:00:00'
        AND created_at <= '{end_date} 23:59:59'
        """

    interval = get_interval(range_value)

    return f"""
        created_at >=
        NOW() - INTERVAL '{interval}'
    """


# ====================================
# OVERVIEW
# ====================================

@router.get("/overview")
def get_overview(
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

        date_filter = build_date_filter(
            range,
            start_date,
            end_date
        )

        conn = get_connection()

        cursor = conn.cursor()

        cursor.execute(f"""

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
                {date_filter}

        """, (
            current_user["user_id"],
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

        print(
            "ANALYTICS ERROR:",
            e
        )

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
# SALES TREND
# ====================================

@router.get("/sales-trend")
def get_sales_trend(
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

        date_filter = build_date_filter(
            range,
            start_date,
            end_date
        )

        conn = get_connection()

        cursor = conn.cursor()

        # ====================================
        # 1 YEAR = MONTHLY
        # ====================================

        if range == "1year":

            cursor.execute(f"""

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
                    {date_filter}

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

            cursor.execute(f"""

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
                    {date_filter}

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
        # CUSTOM LONG RANGE = WEEKLY
        # ====================================

        if (
            range == "custom"
            and start_date
            and end_date
        ):

            cursor.execute("""

                SELECT

                    DATE(%s) as start_date,
                    DATE(%s) as end_date

            """, (
                start_date,
                end_date,
            ))

            dates = cursor.fetchone()

            days_diff = (
                dates[1] - dates[0]
            ).days

            # MORE THAN 31 DAYS

            if days_diff > 31:

                cursor.execute(f"""

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
                        {date_filter}

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

        cursor.execute(f"""

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
                {date_filter}

            GROUP BY
                DATE(created_at)

            ORDER BY
                DATE(created_at)

        """, (
            current_user["user_id"],
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

        print(
            "ANALYTICS ERROR:",
            e
        )

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
# TOP PRODUCTS
# ====================================

@router.get("/top-products")
def get_top_products(
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

        date_filter = build_date_filter(
            range,
            start_date,
            end_date
        )

        conn = get_connection()

        cursor = conn.cursor()

        cursor.execute(f"""

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
                {date_filter.replace("created_at", "t.created_at")}

            GROUP BY
                p.name,
                c.name

            ORDER BY
                sales DESC

            LIMIT 5

        """, (
            current_user["user_id"],
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

        print(
            "ANALYTICS ERROR:",
            e
        )

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
# CATEGORY DISTRIBUTION
# ====================================

@router.get("/categories")
def get_categories(
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

        date_filter = build_date_filter(
            range,
            start_date,
            end_date
        )

        conn = get_connection()

        cursor = conn.cursor()

        cursor.execute(f"""

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
                {date_filter.replace("created_at", "t.created_at")}

            GROUP BY
                c.name

        """, (
            current_user["user_id"],
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

        print(
            "ANALYTICS ERROR:",
            e
        )

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()