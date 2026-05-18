from pydantic import (
    BaseModel,
    Field,
)

from typing import Optional


class ProductCreate(BaseModel):

    id: str

    name: str = Field(
        min_length=1,
        max_length=100
    )

    category: str = Field(
        min_length=1,
        max_length=100
    )

    cost_price: float = Field(
        gt=0
    )

    selling_price: float = Field(
        gt=0
    )

    stock_quantity: int = Field(
        ge=0
    )

    min_stock_level: int = Field(
        ge=0
    )

    unit: Optional[str] = "pc"


class ProductUpdate(BaseModel):

    name: str = Field(
        min_length=1,
        max_length=100
    )

    category: str = Field(
        min_length=1,
        max_length=100
    )

    cost_price: float = Field(
        gt=0
    )

    selling_price: float = Field(
        gt=0
    )

    stock_quantity: int = Field(
        ge=0
    )

    min_stock_level: int = Field(
        ge=0
    )

    unit: Optional[str] = "pc"


class RestockRequest(BaseModel):

    amount: int = Field(
        gt=0
    )