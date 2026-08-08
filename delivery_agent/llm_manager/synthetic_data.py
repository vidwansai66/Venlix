"""
Synthetic Exception Notes dataset for Tier-2 RAG Exception Analyzer.
Contains ~60 realistic delivery driver exception notes covering various logistical issue categories:
- Gated Access & Keypads
- Customer Absence & Unreachable
- Address & Location Issues
- Package Damage & Box Integrity
- Traffic, Weather & Access Road Closures
- Security Dogs & Property Hazards
"""

SYNTHETIC_EXCEPTION_NOTES = [
    # Gated Access & Keypads (1-10)
    {
        "id": "NOTE-001",
        "note": "Gate code 4821 entered at front gate but call box reads invalid code. Customer phone goes straight to voicemail.",
        "root_cause": "Outdated security gate PIN code provided by customer.",
        "suggested_solution": "SMS customer requesting updated gate code; request dispatch to check customer master profile.",
        "category": "Gated Access"
    },
    {
        "id": "NOTE-002",
        "note": "Security guard at front entry refuses entry without pre-approved visitor badge. Customer did not register delivery with front desk.",
        "root_cause": "Unregistered delivery with HOA/building security.",
        "suggested_solution": "Contact leasing office or leave parcel at guard house if authorization permitted.",
        "category": "Gated Access"
    },
    {
        "id": "NOTE-003",
        "note": "Intercom at apartment gate broken. Display screen unreadable and no button response.",
        "root_cause": "Faulty hardware intercom system at property main gate.",
        "suggested_solution": "Notify customer via automated text to meet at gate or reschedule for afternoon route.",
        "category": "Gated Access"
    },
    {
        "id": "NOTE-004",
        "note": "Automatic security gate closed; keypad vandalized and missing numbers 3 and 7.",
        "root_cause": "Vandalized entrance keypad preventing PIN input.",
        "suggested_solution": "Contact recipient to manually open gate via phone app or hold for depot return.",
        "category": "Gated Access"
    },
    {
        "id": "NOTE-005",
        "note": "Subdivision gate requires remote clicker or physical keycard; no visitor pin keypad exists.",
        "root_cause": "Restricted private community entry lacking visitor keypad access.",
        "suggested_solution": "Schedule delivery when recipient is present or deliver to local locker drop point.",
        "category": "Gated Access"
    },
    {
        "id": "NOTE-006",
        "note": "Gate code worked but secondary inner door lock requires fob access. Driver stuck between outer gate and building.",
        "root_cause": "Multi-tier security access failure (inner door fob required).",
        "suggested_solution": "Dispatch prompt SMS to customer or leave parcel in outer secure vestibule.",
        "category": "Gated Access"
    },
    {
        "id": "NOTE-007",
        "note": "Customer provided gate code 9912#, but gate motor jammed and beeped red error light.",
        "root_cause": "Mechanical failure of entrance gate motor.",
        "suggested_solution": "Report gate mechanical lock to property manager and alert customer to retrieve package.",
        "category": "Gated Access"
    },
    {
        "id": "NOTE-008",
        "note": "Delivery van cannot fit under low clearance security gate height archway (7ft limit).",
        "root_cause": "Vehicle clearance mismatch with entrance gate arch height.",
        "suggested_solution": "Park outside gate and complete delivery on foot, or reassign to smaller sprinter van.",
        "category": "Gated Access"
    },
    {
        "id": "NOTE-009",
        "note": "Call box dials customer but line rings 5 times and disconnects. Second attempt failed.",
        "root_cause": "Unresponsive customer on intercom ring-through.",
        "suggested_solution": "Send direct automated SMS notification and hold parcel at nearest access point.",
        "category": "Gated Access"
    },
    {
        "id": "NOTE-010",
        "note": "Gated community entrance blocked by broken-down moving truck; no alternate gate entry.",
        "root_cause": "Physical road blockage at sole entry gate.",
        "suggested_solution": "Delay route delivery by 45 minutes or re-sequence stop to end of route.",
        "category": "Gated Access"
    },

    # Customer Absence & Unreachable (11-20)
    {
        "id": "NOTE-011",
        "note": "Signature required for package delivery but nobody answered doorbell after 3 attempts.",
        "root_cause": "Recipient absent for signature-required parcel.",
        "suggested_solution": "Leave delivery attempted door tag and reschedule delivery or redirect to pickup location.",
        "category": "Customer Absent"
    },
    {
        "id": "NOTE-012",
        "note": "Customer left note on door stating 'Do not leave package outside', but customer is not home.",
        "root_cause": "Customer requested in-person handoff but absent.",
        "suggested_solution": "Reschedule delivery for evening window when customer returns.",
        "category": "Customer Absent"
    },
    {
        "id": "NOTE-013",
        "note": "Business location closed early at 3:00 PM on Friday; doors locked and lights off.",
        "root_cause": "Commercial destination closed outside normal operating hours.",
        "suggested_solution": "Reschedule delivery for next business day (Monday 9:00 AM).",
        "category": "Customer Absent"
    },
    {
        "id": "NOTE-014",
        "note": "Customer requested delivery to Suite 402, but office space is vacant under construction.",
        "root_cause": "Tenant relocated or unit under renovation.",
        "suggested_solution": "Flag address for address verification team; return parcel to depot.",
        "category": "Customer Absent"
    },
    {
        "id": "NOTE-015",
        "note": "Customer phone number listed on shipping label is disconnected or invalid number.",
        "root_cause": "Invalid customer contact details provided on waybill.",
        "suggested_solution": "Update contact record via customer service email or online tracking portal.",
        "category": "Customer Absent"
    },
    {
        "id": "NOTE-016",
        "note": "Age-restricted delivery requiring ID scan; recipient present is a minor under 21.",
        "root_cause": "Age verification failed due to lack of adult recipient.",
        "suggested_solution": "Return parcel to hub; require adult ID match upon redelivery attempt.",
        "category": "Customer Absent"
    },
    {
        "id": "NOTE-017",
        "note": "Ring video doorbell answered by owner who stated they are on vacation for two weeks.",
        "root_cause": "Customer away on extended trip.",
        "suggested_solution": "Hold parcel at regional hub station for customer pickup or hold until return date.",
        "category": "Customer Absent"
    },
    {
        "id": "NOTE-018",
        "note": "Customer answered call and asked driver to wait 30 minutes; driver cannot hold route.",
        "root_cause": "Customer delay exceeds driver schedule tolerances.",
        "suggested_solution": "Politely inform customer package must be rescheduled or left in safe spot if approved.",
        "category": "Customer Absent"
    },
    {
        "id": "NOTE-019",
        "note": "Apartment leasing office refuses to accept oversized package for resident.",
        "root_cause": "Leasing office policy restriction on large parcel storage.",
        "suggested_solution": "Contact resident directly to arrange door-to-door delivery.",
        "category": "Customer Absent"
    },
    {
        "id": "NOTE-020",
        "note": "High value shipment; no safe location to conceal package on exposed open porch.",
        "root_cause": "Lack of secure porch drop location for high-value goods.",
        "suggested_solution": "Request customer authorization for alternative drop spot or require in-person sign-off.",
        "category": "Customer Absent"
    },

    # Address & Location Issues (21-30)
    {
        "id": "NOTE-021",
        "note": "House number 742 missing on street; street numbers jump from 740 to 746.",
        "root_cause": "Non-existent or incorrectly formatted building number.",
        "suggested_solution": "Verify pin GPS coordinate with dispatch; contact customer for landmark verification.",
        "category": "Address Issue"
    },
    {
        "id": "NOTE-022",
        "note": "Label specifies 'Main St' but GPS points to 'Main Ave' three miles away.",
        "root_cause": "Street suffix discrepancy (Street vs Avenue) on label.",
        "suggested_solution": "Cross-reference zip code and street name suffix with postal master database.",
        "category": "Address Issue"
    },
    {
        "id": "NOTE-023",
        "note": "Unit number missing on shipping label for 150-unit multi-story residential tower.",
        "root_cause": "Omitted apartment/suite unit number.",
        "suggested_solution": "Check resident directory in lobby or text customer to obtain unit number.",
        "category": "Address Issue"
    },
    {
        "id": "NOTE-024",
        "note": "Delivery address points to a empty agricultural field with no structures.",
        "root_cause": "Incorrect GPS geocode or parcel boundary error.",
        "suggested_solution": "Call customer to confirm cross streets and driving directions.",
        "category": "Address Issue"
    },
    {
        "id": "NOTE-025",
        "note": "New construction subdivision; street name not found in vehicle navigation map.",
        "root_cause": "Unmapped new residential development.",
        "suggested_solution": "Use satellite map overlay and call recipient for entrance guidance.",
        "category": "Address Issue"
    },
    {
        "id": "NOTE-026",
        "note": "Label address reads PO Box, but carrier service does not deliver to Post Office boxes.",
        "root_cause": "Incompatible carrier service for PO Box destination.",
        "suggested_solution": "Contact customer to request physical street address for re-routing.",
        "category": "Address Issue"
    },
    {
        "id": "NOTE-027",
        "note": "Two buildings share identical number 12B in front and rear courtyard.",
        "root_cause": "Ambiguous building signage / dual building numbers.",
        "suggested_solution": "Verify customer name on door plaque or call customer to confirm building position.",
        "category": "Address Issue"
    },
    {
        "id": "NOTE-028",
        "note": "Zip code 90210 on package conflicts with city name San Jose on label.",
        "root_cause": "Zip code and city name mismatch.",
        "suggested_solution": "Correct shipping record via postal lookup prior to next delivery run.",
        "category": "Address Issue"
    },
    {
        "id": "NOTE-029",
        "note": "Commercial shipping dock access is located on rear alleyway, front entrance locked.",
        "root_cause": "Unclear loading dock entrance instructions.",
        "suggested_solution": "Add driver note to master location record: 'Use rear alley dock entrance'.",
        "category": "Address Issue"
    },
    {
        "id": "NOTE-030",
        "note": "Gps pin leads to pedestrian-only promenade with no vehicle access permitted.",
        "root_cause": "Vehicle restricted pedestrian plaza location.",
        "suggested_solution": "Use hand dolly from nearest unloading zone or transfer to walking courier.",
        "category": "Address Issue"
    },

    # Package Damage & Integrity (31-40)
    {
        "id": "NOTE-031",
        "note": "Outer cardboard box crushed and torn; liquid leaking from corner of package.",
        "root_cause": "Transit damage resulting in liquid container rupture.",
        "suggested_solution": "Halt delivery, mark parcel as damaged in transit, and trigger automated replacement order.",
        "category": "Package Damage"
    },
    {
        "id": "NOTE-032",
        "note": "Shipping barcode ripped and unscanable by handheld terminal.",
        "root_cause": "Damaged shipping label barcode.",
        "suggested_solution": "Manually enter tracking number or print replacement barcode at sorting facility.",
        "category": "Package Damage"
    },
    {
        "id": "NOTE-033",
        "note": "Heavy package tape peeled open; internal contents visibly exposed.",
        "root_cause": "Packaging tape failure during sorting.",
        "suggested_solution": "Inspect contents against manifest, re-seal securely, and note open box condition.",
        "category": "Package Damage"
    },
    {
        "id": "NOTE-034",
        "note": "Perishable frozen food parcel box warm to touch; dry ice completely melted.",
        "root_cause": "Thermal protection expired due to transit delay.",
        "suggested_solution": "Dispose of spoiled goods per safety protocol and issue priority replacement credit.",
        "category": "Package Damage"
    },
    {
        "id": "NOTE-035",
        "note": "Fragile sticker package rattling loudly inside box when moved.",
        "root_cause": "Internal breakage of fragile contents due to insufficient cushioning.",
        "suggested_solution": "Return parcel to hub quality control team for claims inspection.",
        "category": "Package Damage"
    },
    {
        "id": "NOTE-036",
        "note": "Hazardous material battery box punctured by heavy forklift tine.",
        "root_cause": "Warehouse forklift puncture of HAZMAT parcel.",
        "suggested_solution": "Contain parcel per safety protocol and alert HAZMAT compliance desk.",
        "category": "Package Damage"
    },
    {
        "id": "NOTE-037",
        "note": "Water soaked parcel caused by rain exposure on open conveyor belt.",
        "root_cause": "Environmental water damage during loading.",
        "suggested_solution": "Dry outer package, re-wrap in protective plastic wrap, and contact recipient.",
        "category": "Package Damage"
    },
    {
        "id": "NOTE-038",
        "note": "Package weight on scale (2 lbs) differs significantly from label manifest (15 lbs).",
        "root_cause": "Manifest weight discrepancy / partial missing contents.",
        "suggested_solution": "Audit package contents at terminal before attempt.",
        "category": "Package Damage"
    },
    {
        "id": "NOTE-039",
        "note": "Pallet shrink-wrap collapsed during transit causing boxes to spill.",
        "root_cause": "Pallet containment failure.",
        "suggested_solution": "Restack and re-strap pallet at cross-dock facility.",
        "category": "Package Damage"
    },
    {
        "id": "NOTE-040",
        "note": "Customer rejected package at door due to outer box denting.",
        "root_cause": "Customer rejection of cosmetically damaged parcel.",
        "suggested_solution": "Return parcel for repackaging or issue discount confirmation.",
        "category": "Package Damage"
    },

    # Property Hazards & Animals (41-50)
    {
        "id": "NOTE-041",
        "note": "Large unrestrained German Shepherd aggressive at front yard fence; driver cannot access porch.",
        "root_cause": "Unrestrained aggressive guard dog on property.",
        "suggested_solution": "Call customer to secure dog inside or place package over fence if safe.",
        "category": "Property Hazard"
    },
    {
        "id": "NOTE-042",
        "note": "Front porch wooden steps rotted and collapsed under weight.",
        "root_cause": "Hazardous structural walkway condition.",
        "suggested_solution": "Leave parcel at safe distance near bottom of stairs and take photo proof.",
        "category": "Property Hazard"
    },
    {
        "id": "NOTE-043",
        "note": "Wasp nest actively swarming directly above front door parcel drop box.",
        "root_cause": "Insect infestation hazard at primary drop spot.",
        "suggested_solution": "Deliver package to garage side door location instead.",
        "category": "Property Hazard"
    },
    {
        "id": "NOTE-044",
        "note": "Driveway covered in pure black ice; vehicle slipping backward.",
        "root_cause": "Severe ice hazard on steep driveway incline.",
        "suggested_solution": "Park safely on flat main street and proceed with footwear ice cleats or hold delivery.",
        "category": "Property Hazard"
    },
    {
        "id": "NOTE-045",
        "note": "Low hanging power line down across entrance driveway.",
        "root_cause": "Downed utility line hazard.",
        "suggested_solution": "Avoid area, report utility hazard to local emergency services, and re-route.",
        "category": "Property Hazard"
    },
    {
        "id": "NOTE-046",
        "note": "Beware of Dog sign posted; loose Pitbull barking in front yard.",
        "root_cause": "Unchecked dog loose on front grounds.",
        "suggested_solution": "Honk horn to alert resident or phone customer prior to stepping out of van.",
        "category": "Property Hazard"
    },
    {
        "id": "NOTE-047",
        "note": "Fallen tree branch completely blocking walkway to front porch.",
        "root_cause": "Debris obstructing pedestrian walkway.",
        "suggested_solution": "Place parcel securely at side gate or alternative access walkway.",
        "category": "Property Hazard"
    },
    {
        "id": "NOTE-048",
        "note": "Flooded driveway with 1 foot of standing water after heavy downpour.",
        "root_cause": "Localized standing water flood hazard.",
        "suggested_solution": "Contact customer for alternative drop point on elevated ground.",
        "category": "Property Hazard"
    },
    {
        "id": "NOTE-049",
        "note": "Construction workers operating heavy excavator across single lane driveway.",
        "root_cause": "Active construction machinery obstructing access.",
        "suggested_solution": "Hand-deliver parcel to site foreman or recipient on site.",
        "category": "Property Hazard"
    },
    {
        "id": "NOTE-050",
        "note": "Extremely dark unlit rural driveway with no porch lighting visible.",
        "root_cause": "Inadequate lighting hazard for night delivery.",
        "suggested_solution": "Use high-powered flashlight and text customer to turn on exterior lights.",
        "category": "Property Hazard"
    },

    # Traffic & Weather Closures (51-60)
    {
        "id": "NOTE-051",
        "note": "Mountain pass road closed by State Patrol due to heavy snow and avalanche risk.",
        "root_cause": "Severe winter weather road closure.",
        "suggested_solution": "Hold parcel at regional gateway hub until road conditions clear.",
        "category": "Weather / Traffic"
    },
    {
        "id": "NOTE-052",
        "note": "Main access highway closed due to multi-vehicle accident; detour adds 90 minutes.",
        "root_cause": "Major highway accident blockage.",
        "suggested_solution": "Re-sequence route stops or use secondary backroads if time permits.",
        "category": "Weather / Traffic"
    },
    {
        "id": "NOTE-053",
        "note": "Street blocked off by police for annual downtown marathon race event.",
        "root_cause": "Civic event / parade street closure.",
        "suggested_solution": "Attempt delivery after event conclusion or reschedule for next morning.",
        "category": "Weather / Traffic"
    },
    {
        "id": "NOTE-054",
        "note": "Flash flooding on low bridge crossing river to island neighborhood.",
        "root_cause": "Bridge flooded and impassable.",
        "suggested_solution": "Hold parcel at dispatch facility and update tracking status.",
        "category": "Weather / Traffic"
    },
    {
        "id": "NOTE-055",
        "note": "Bridge undergoing emergency structural repair; closed to all vehicle traffic.",
        "root_cause": "Bridge infrastructure maintenance closure.",
        "suggested_solution": "Reroute via northern bypass bridge.",
        "category": "Weather / Traffic"
    },
    {
        "id": "NOTE-056",
        "note": "Wildfire smoke reduction protocol restricting outdoor driver exposure times.",
        "root_cause": "Environmental hazardous air quality event.",
        "suggested_solution": "Limit delivery shifts and prioritize urgent essential medical shipments.",
        "category": "Weather / Traffic"
    },
    {
        "id": "NOTE-057",
        "note": "Severe thunderstorm with active hail warning in delivery zone.",
        "root_cause": "Severe storm safety risk.",
        "suggested_solution": "Pause delivery operations for 30 minutes in safe shelter.",
        "category": "Weather / Traffic"
    },
    {
        "id": "NOTE-058",
        "note": "Unannounced road paving crew turned street into wet asphalt zone.",
        "root_cause": "Road resurfacing work prohibiting vehicle traffic.",
        "suggested_solution": "Park on adjacent cross street and walk parcel to door.",
        "category": "Weather / Traffic"
    },
    {
        "id": "NOTE-059",
        "note": "Ferry service to island cancelled due to high sea swells.",
        "root_cause": "Maritime ferry transport cancellation.",
        "suggested_solution": "Reschedule delivery for next scheduled ferry sail.",
        "category": "Weather / Traffic"
    },
    {
        "id": "NOTE-060",
        "note": "Gridlock traffic caused by stadium concert event blocking access lane.",
        "root_cause": "Heavy stadium event traffic congestion.",
        "suggested_solution": "Reschedule stop for post-event timeframe or early morning.",
        "category": "Weather / Traffic"
    }
]
