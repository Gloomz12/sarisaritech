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

import logging
router = APIRouter()
logger = logging.getLogger(__name__)


@router.get("/")
def get_stock_movements(
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
                sm.id,

                sm.product_id,

                sm.change_quantity,

                sm.type,

                sm.created_at,

                p.name,

                sm.previous_stock,

                sm.new_stock

            FROM stock_movements sm

            JOIN products p
            ON sm.product_id = p.id

            WHERE
                sm.user_id = %s
                AND sm.type != 'SALE'

            ORDER BY
                sm.created_at DESC
        """, (
            current_user["user_id"],
        ))

        rows = cursor.fetchall()

        result = []

        for row in rows:

            result.append({

                "id":
                    str(row[0]),

                "product_id":
                    str(row[1]),

                "change_quantity":
                    row[2],

                "type":
                    row[3],

                "created_at":
                    row[4],

                "product_name":
                    row[5],

                "previous_stock":
                    row[6],

                "new_stock":
                    row[7],
            })

        return result

    except Exception as e:
        
        if conn:
            conn.rollback()

        logger.error(f"Stock movements error: {e}")

        raise HTTPException(
            status_code=500,
            detail="Internal server error"
        )


    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()