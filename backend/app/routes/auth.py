import os
import uuid
import logging

from dotenv import load_dotenv

from datetime import datetime, timedelta

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr, Field
from passlib.context import CryptContext
from jose import jwt, JWTError
from fastapi import Request
from app.core.security import limiter

from app.db.database import get_connection


# =========================
# LOAD ENV
# =========================

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")

ACCESS_TOKEN_EXPIRE_HOURS = int(
    os.getenv("ACCESS_TOKEN_EXPIRE_HOURS", 24)
)

# VALIDATE ENV

if not SECRET_KEY:
    raise ValueError("SECRET_KEY is missing")


# =========================
# LOGGER
# =========================

logger = logging.getLogger(__name__)


# =========================
# ROUTER
# =========================

router = APIRouter()


# =========================
# PASSWORD HASHING
# =========================

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


# =========================
# MODELS
# =========================

class RegisterRequest(BaseModel):
    store_name: str = Field(min_length=2, max_length=100)
    owner_name: str = Field(min_length=2, max_length=100)

    email: EmailStr

    username: str = Field(
        min_length=3,
        max_length=50
    )

    password: str = Field(
        min_length=8,
        max_length=100
    )


class LoginRequest(BaseModel):
    email: EmailStr

    password: str = Field(
        min_length=8,
        max_length=100
    )


# =========================
# REGISTER
# =========================

@router.post("/register")
@limiter.limit("3/minute")
def register(
    request: Request,
    data: RegisterRequest
):

    conn = None
    cur = None

    try:

        conn = get_connection()
        cur = conn.cursor()

        # CHECK EMAIL

        cur.execute(
            """
            SELECT user_id
            FROM users
            WHERE email = %s
            """,
            (data.email,)
        )

        existing_email = cur.fetchone()

        if existing_email:

            raise HTTPException(
                status_code=400,
                detail="Email already exists."
            )

        # HASH PASSWORD

        hashed_password = pwd_context.hash(
            data.password
        )

        # INSERT USER

        cur.execute(
            """
            INSERT INTO users
            (
                user_id,
                store_name,
                owner_name,
                email,
                username,
                password_hash
            )
            VALUES
            (
                %s,
                %s,
                %s,
                %s,
                %s,
                %s
            )
            """,
            (
                str(uuid.uuid4()),
                data.store_name,
                data.owner_name,
                data.email,
                data.username,
                hashed_password
            )
        )

        conn.commit()

        return {
            "message":
            "Account created successfully."
        }

    except HTTPException:
        raise

    except Exception as e:

        logger.error(f"Register Error: {e}")

        raise HTTPException(
            status_code=500,
            detail="Internal server error"
        )

    finally:

        if cur:
            cur.close()

        if conn:
            conn.close()


# =========================
# LOGIN
# =========================

@router.post("/login")
@limiter.limit("5/minute")
def login(
    request: Request,
    data: LoginRequest
):

    conn = None
    cur = None

    try:

        conn = get_connection()
        cur = conn.cursor()

        cur.execute(
            """
            SELECT
                user_id,
                store_name,
                owner_name,
                email,
                username,
                password_hash
            FROM users
            WHERE email = %s
            """,
            (data.email,)
        )

        user = cur.fetchone()

        # USER NOT FOUND

        if not user:

            raise HTTPException(
                status_code=401,
                detail="Invalid email or password."
            )

        # VERIFY PASSWORD

        valid_password = pwd_context.verify(
            data.password,
            user[5]
        )

        if not valid_password:

            raise HTTPException(
                status_code=401,
                detail="Invalid email or password."
            )

        # CREATE JWT TOKEN

        expire = datetime.utcnow() + timedelta(
            hours=ACCESS_TOKEN_EXPIRE_HOURS
        )

        payload = {
            "user_id": user[0],
            "email": user[3],
            "exp": expire
        }

        token = jwt.encode(
            payload,
            SECRET_KEY,
            algorithm=ALGORITHM
        )

        # RESPONSE

        return {
            "token": token,

            "user": {
                "id": user[0],
                "store_name": user[1],
                "owner_name": user[2],
                "email": user[3],
                "username": user[4],
            }
        }

    except HTTPException:
        raise

    except JWTError as e:

        logger.error(f"JWT Error: {e}")

        raise HTTPException(
            status_code=500,
            detail="Token generation failed"
        )

    except Exception as e:

        logger.error(f"Login Error: {e}")

        raise HTTPException(
            status_code=500,
            detail="Internal server error"
        )

    finally:

        if cur:
            cur.close()

        if conn:
            conn.close()