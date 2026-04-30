from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import products
from app.routes import transactions

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Backend working"}

# REGISTER ROUTES
app.include_router(products.router, prefix="/api/products", tags=["Products"])
app.include_router(transactions.router, prefix="/api/transactions", tags=["Transactions"])