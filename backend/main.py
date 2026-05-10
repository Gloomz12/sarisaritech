from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import products
from app.routes import transactions

from app.routes.auth import (
    router as auth_router
)

from app.routes.settings import (
    router as settings_router
)

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# HOME
@app.get("/")
def home():
    return {
        "message": "Backend working"
    }

# PRODUCTS
app.include_router(
    products.router,
    prefix="/api/products",
    tags=["Products"]
)

# TRANSACTIONS
app.include_router(
    transactions.router,
    prefix="/api",
    tags=["Transactions"]
)

# AUTH
app.include_router(
    auth_router,
    prefix="/api/auth",
    tags=["Authentication"]
)

# SETTINGS
app.include_router(
    settings_router,
    prefix="/api/settings",
    tags=["Settings"]
)