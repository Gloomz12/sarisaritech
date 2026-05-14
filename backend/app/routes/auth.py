import os

from dotenv import load_dotenv

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
import uuid

from app.db.database import get_connection


# LOAD ENV
load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")

ALGORITHM = os.getenv("ALGORITHM")

ACCESS_TOKEN_EXPIRE_HOURS = int(
    os.getenv("ACCESS_TOKEN_EXPIRE_HOURS")
)


# ROUTER
router = APIRouter()


# PASSWORD HASHING
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


# MODELS
class RegisterRequest(BaseModel):
    store_name: str
    owner_name: str
    email: str
    username: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str



# REGISTER
@router.post("/register")
def register(data: RegisterRequest):

    conn = get_connection()
    cur = conn.cursor()

    # CHECK EMAIL
    cur.execute(
        """
        SELECT *
        FROM users
        WHERE email = %s
        """,
        (data.email,)
    )

    existing_email = cur.fetchone()

    if existing_email:

        cur.close()
        conn.close()

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

    cur.close()
    conn.close()

    return {
        "message":
        "Account created successfully."
    }



# LOGIN
@router.post("/login")
def login(data: LoginRequest):

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

        cur.close()
        conn.close()

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

        cur.close()
        conn.close()

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password."
        )

    # CREATE JWT TOKEN

    payload = {
        "user_id": user[0],
        "email": user[3],
        "exp": datetime.utcnow() + timedelta(
            hours=ACCESS_TOKEN_EXPIRE_HOURS
        )
    }

    token = jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    # CLOSE CONNECTION

    cur.close()
    conn.close()

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