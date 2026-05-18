from fastapi import (
    APIRouter,
    HTTPException,
    Depends
)

from passlib.context import CryptContext

from app.db.database import get_connection

from app.models.settings_model import (
    UpdateSettings,
    ChangePasswordRequest
)

from app.utils.auth import (
    get_current_user
)

router = APIRouter()

# PASSWORD HASHER

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
    bcrypt__rounds=12
)


# UPDATE SETTINGS
@router.put("/")
def update_settings(
    data: UpdateSettings,
    current_user=Depends(get_current_user)
):

    conn = get_connection()

    cursor = conn.cursor()

    user_id = current_user["user_id"]

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
@router.put("/change-password")
def change_password(
    data: ChangePasswordRequest,
    current_user=Depends(get_current_user)
):

    conn = get_connection()

    cursor = conn.cursor()

    user_id = current_user["user_id"]

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