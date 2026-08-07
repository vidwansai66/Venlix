import re
from typing import Dict, Any
import copy

def mask_customer_pii(data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Masks Personally Identifiable Information (PII) by default before API serialization.
    This ensures that internal databases hold the real data, but standard API consumers 
    only see anonymized details unless authorized.
    
    Why masking is done during API serialization:
    - We must not modify or corrupt the actual database values.
    - Masking at the presentation layer guarantees privacy across all clients.
    """
    masked = copy.deepcopy(data)
    
    # Mask Customer Name (e.g., Rahul Sharma -> Customer #A183)
    if "name" in masked and masked["name"]:
        # Extract initials or just use a generic placeholder
        # For simplicity, we just use a generic placeholder as requested by example
        masked["name"] = f"Customer #{hash(masked['name']) % 10000:04d}"
        
    # Handle 'customer_name' variant
    if "customer_name" in masked and masked["customer_name"]:
        # Match example output Customer #XXXX (e.g. Customer #A183)
        # Using hash to generate a somewhat consistent ID
        hashed = hash(masked['customer_name']) % 10000
        masked["customer_name"] = f"Customer #A{hashed:03d}"

    # Mask Phone (e.g., 9876543210 -> ********3210)
    phone_fields = ["phone", "customer_phone", "phone_number"]
    for pf in phone_fields:
        if pf in masked and masked[pf]:
            phone_str = str(masked[pf])
            if len(phone_str) >= 4:
                masked[pf] = "*" * (len(phone_str) - 4) + phone_str[-4:]
            else:
                masked[pf] = "****"

    # Mask Email (e.g., rahul.s@gmail.com -> r***@gmail.com)
    email_fields = ["email", "customer_email"]
    for ef in email_fields:
        if ef in masked and masked[ef]:
            email_str = str(masked[ef])
            parts = email_str.split("@")
            if len(parts) == 2:
                masked[ef] = f"{parts[0][0]}***@{parts[1]}"
            else:
                masked[ef] = "***"

    # Mask Address (e.g., Flat 302, Block A -> Zone/Area representation)
    address_fields = ["address", "customer_address", "full_address", "delivery_address"]
    for af in address_fields:
        if af in masked and masked[af]:
            # Simplify to an area representation. Since we don't have a complex geocoder here,
            # we will just replace it with a generic safe string or extract a known safe substring.
            # As per example: Flat 302, Block A, Green Residency -> Sector-12
            masked[af] = "Sector-12"

    # Remove or round GPS
    gps_fields = ["gps", "gps_coordinates", "coordinates"]
    for gf in gps_fields:
        if gf in masked and masked[gf]:
            # Rounding to 1 decimal place represents approx 11km resolution
            if isinstance(masked[gf], str):
                try:
                    lat_lon = [float(x.strip()) for x in masked[gf].split(',')]
                    masked[gf] = f"{round(lat_lon[0], 1)}, {round(lat_lon[1], 1)}"
                except Exception:
                    masked[gf] = "Location Hidden"
            else:
                masked[gf] = "Location Hidden"
                
    # Hide Society
    if "society" in masked and masked["society"]:
        masked["society"] = "Hidden"
        
    if "society_name" in masked and masked["society_name"]:
        masked["society_name"] = "Hidden"
        
    return masked
