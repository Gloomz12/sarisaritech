from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes import products, transactions

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
app.include_router(products.router, prefix="/api")
app.include_router(transactions.router, prefix="/api")