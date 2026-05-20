from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from slowapi.middleware import SlowAPIMiddleware

from app.core.security import limiter

from app.routes import products
from app.routes import transactions
from app.routes import stock_movements

from app.routes.dashboard import (
    router as dashboard_router
)

from app.routes.analytics import (
    router as analytics_router
)

from app.routes.ai_insights import (
    router as ai_router
)

from app.routes.auth import (
    router as auth_router
)

from app.routes.settings import (
    router as settings_router
)

# FASTAPI APP

app = FastAPI()

# RATE LIMITER

app.state.limiter = limiter

app.add_middleware(
    SlowAPIMiddleware
)

# CORS

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "https://sarisaritech.vercel.app",
]

app.add_middleware(
    CORSMiddleware,

    allow_origins=origins,

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
    prefix="/api/transactions",
    tags=["Transactions"]
)

# STOCK MOVEMENTS

app.include_router(
    stock_movements.router,
    prefix="/api/stock-movements",
    tags=["Stock Movements"]
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

# DASHBOARD

app.include_router(
    dashboard_router,
    prefix="/api/dashboard",
    tags=["Dashboard"]
)

# ANALYTICS

app.include_router(
    analytics_router,
    prefix="/api/analytics",
    tags=["Analytics"]
)

# AI INSIGHTS

app.include_router(
    ai_router,
    prefix="/api/ai-insights",
    tags=["AI Insights"]
)