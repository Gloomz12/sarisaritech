from pydantic import BaseModel


class UpdateSettings(BaseModel):

    store_name: str
    owner_name: str
    email: str
    contact_number: str | None = None
    store_address: str | None = None


class ChangePasswordRequest(BaseModel):

    current_password: str
    new_password: str