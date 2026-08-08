"""
Data models for LLM Manager.
"""
from dataclasses import dataclass, field
from typing import Optional, Dict, Any

@dataclass
class DeliveryCase:
    """
    Represents a delivery case context passed from Multi-Agent / Backend.
    """
    case_id: str
    customer_name: str
    failure_type: str
    driver_context: str
    proposed_slot: str
    phone: Optional[str] = None
    address: Optional[str] = None
    metadata: Dict[str, Any] = field(default_factory=dict)

    @classmethod
    def from_dict(cls, data: dict) -> "DeliveryCase":
        return cls(
            case_id=data.get("case_id", "CASE-000"),
            customer_name=data.get("customer_name", "Customer"),
            failure_type=data.get("failure_type", "Delivery Exception"),
            driver_context=data.get("driver_context", "Unable to deliver."),
            proposed_slot=data.get("proposed_slot", "Tomorrow 2:00 PM"),
            phone=data.get("phone"),
            address=data.get("address"),
            metadata=data.get("metadata", {})
        )

    def to_dict(self) -> dict:
        return {
            "case_id": self.case_id,
            "customer_name": self.customer_name,
            "failure_type": self.failure_type,
            "driver_context": self.driver_context,
            "proposed_slot": self.proposed_slot,
            "phone": self.phone,
            "address": self.address,
            "metadata": self.metadata,
        }
