from pydantic import BaseModel
from typing import Optional


class DeliveryCreate(BaseModel):
    Agent_Age: int
    Agent_Rating: float

    Store_Latitude: float
    Store_Longitude: float
    Drop_Latitude: float
    Drop_Longitude: float

    Weather: int
    Traffic: int
    Vehicle: int
    Area: int
    Category: int

    Delivery_Time: int

    pin_code: int

    driver_on_time_rate: float
    customer_unavailability_history: float
    address_failure_history_rate: float

    order_value: int
    slot_width_minutes: int

    distance_km: float

    risk_score: float

    day_of_week: int
    month: int
    is_weekend: int

    pickup_delay_minutes: float
    hour_of_day: int


class DeliveryResponse(DeliveryCreate):
    id: int
    prediction: Optional[str] = None
    confidence: Optional[float] = None

from pydantic import BaseModel, ConfigDict

# ...

class DeliveryResponse(DeliveryCreate):
    id: int
    prediction: str | None = None
    confidence: float | None = None

    model_config = ConfigDict(from_attributes=True)