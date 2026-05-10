from fastapi import APIRouter, HTTPException
from passlib.context import CryptContext

from app.db.database import get_connection

from app.models.settings_model import (
    UpdateSettings,
    ChangePasswordRequest
)

router = APIRouter()

# PASSWORD HASHER

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

# UPDATE SETTINGS
@router.put("/{user_id}")
def update_settings(
    user_id: str,
    data: UpdateSettings
):

    conn = get_connection()

    cursor = conn.cursor()

    # UPDATE USER

    cursor.execute(
        """
        UPDATE users
        SET
            store_name = %s,
            owner_name = %s,
            email = %s,
            contact_number = %s,
            store_address = %s
        WHERE user_id = %s
        """,
        (
            data.store_name,
            data.owner_name,
            data.email,
            data.contact_number,
            data.store_address,
            user_id
        )
    )

    conn.commit()

    # GET UPDATED USER

    cursor.execute(
        """
        SELECT
            user_id,
            store_name,
            owner_name,
            email,
            contact_number,
            store_address
        FROM users
        WHERE user_id = %s
        """,
        (user_id,)
    )

    updated_user = cursor.fetchone()

    cursor.close()
    conn.close()

    return {

        "success": True,

        "message": "Settings updated",

        "user": {

            "id": updated_user[0],
            "store_name": updated_user[1],
            "owner_name": updated_user[2],
            "email": updated_user[3],
            "contact_number": updated_user[4],
            "store_address": updated_user[5],
        }
    }



# CHANGE PASSWORD
@router.put("/change-password/{user_id}")
def change_password(
    user_id: str,
    data: ChangePasswordRequest
):

    conn = get_connection()

    cursor = conn.cursor()

    # GET USER PASSWORD

    cursor.execute(
        """
        SELECT password_hash
        FROM users
        WHERE user_id = %s
        """,
        (user_id,)
    )

    user = cursor.fetchone()

    if not user:

        cursor.close()
        conn.close()

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    password_hash = user[0]

    # VERIFY CURRENT PASSWORD

    valid_password = pwd_context.verify(
        data.current_password,
        password_hash
    )

    if not valid_password:

        cursor.close()
        conn.close()

        raise HTTPException(
            status_code=400,
            detail="Current password is incorrect"
        )

    # HASH NEW PASSWORD

    new_hashed_password = pwd_context.hash(
        data.new_password
    )

    # UPDATE PASSWORD

    cursor.execute(
        """
        UPDATE users
        SET password_hash = %s
        WHERE user_id = %s
        """,
        (
            new_hashed_password,
            user_id
        )
    )

    conn.commit()

    cursor.close()
    conn.close()

    return {

        "success": True,

        "message":
            "Password changed successfully"
    }