from pydantic import (
    BaseModel,
    Field,
)

from typing import List


class TransactionItem(BaseModel):

    product_id: str

    quantity: int = Field(
        gt=0
    )


class TransactionCreate(BaseModel):

    total_amount: float = Field(
        gt=0
    )

    amount_paid: float = Field(
        ge=0
    )

    payment_method: str

    items: List[TransactionItem]