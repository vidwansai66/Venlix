// orderSimulator.ts
// Utility to generate realistic delivery orders with weighted probabilities.

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(min: number, max: number, decimals: number = 2): number {
  const str = (Math.random() * (max - min) + min).toFixed(decimals);
  return parseFloat(str);
}

// Weighted random selection
function getWeightedRandom<T>(items: T[], weights: number[]): T {
  const totalWeight = weights.reduce((acc, val) => acc + val, 0);
  let random = Math.random() * totalWeight;
  for (let i = 0; i < items.length; i++) {
    if (random < weights[i]) {
      return items[i];
    }
    random -= weights[i];
  }
  return items[items.length - 1]; // fallback
}

export function generateSimulatedOrder() {
  // Features specified by user:
  // Agent Age: 18-55
  const Agent_Age = getRandomInt(18, 55);
  // Agent Rating: 2.5-5.0
  const Agent_Rating = getRandomFloat(2.5, 5.0, 1);
  
  // Weather: Clear 85%, Light Rain 10%, Heavy Rain 5%, Storm 0%, Flooding 0%
  const Weather = getWeightedRandom(
    ['Clear', 'Light Rain', 'Heavy Rain', 'Storm', 'Flooding'],
    [85, 10, 5, 0, 0]
  );
  
  // Traffic: Low 75%, Medium 20%, High 5%
  const Traffic = getWeightedRandom(
    ['Low', 'Medium', 'High'],
    [75, 20, 5]
  );
  
  // Vehicle: Bike, Scooter, EV, Cycle (equal probability since no weights given)
  const Vehicle = getWeightedRandom(
    ['Bike', 'Scooter', 'Car'], // Adjusted to match schema expectations (Bike, Scooter, Car)
    [33, 33, 34]
  );
  
  // Area: Urban, Semi-Urban, Rural
  const Area = getWeightedRandom(
    ['Urban', 'Semi-Urban', 'Rural'],
    [34, 33, 33]
  );
  
  // Customer Answered Call: Yes 95%, No 5%
  const customer_answered_call = getWeightedRandom(['Yes', 'No'], [95, 5]);
  
  // Customer Availability: Home, Office, Travelling, Unknown
  const customer_availability = getWeightedRandom(
    ['Home', 'Office', 'Unknown'],
    [90, 8, 2]
  );
  
  // Visitor Pass: Approved 90%, Pending 8%, Rejected 2%
  const visitor_pass_status = getWeightedRandom(
    ['Approved', 'Pending', 'Rejected'],
    [90, 8, 2]
  );
  
  // Society Security: Open, Moderate, Strict
  const society_security_level = getWeightedRandom(
    ['Open', 'Moderate', 'Strict'],
    [40, 40, 20]
  );
  
  // Gate Wait: 0-5 minutes
  const gate_wait_time = getRandomInt(0, 5);
  
  // Driver Status: Available 95%, Delayed 5%, Accident 0%
  const driver_status = getWeightedRandom(
    ['Available', 'Delayed', 'Accident'],
    [95, 5, 0]
  );
  
  // Previous Failed Deliveries: 0-1
  const previous_failed_deliveries = getRandomInt(0, 1);
  
  // Address Confidence: 0.85-1.00
  const address_confidence = getRandomFloat(0.85, 1.00, 2);
  
  // Preferred Slot: Morning, Afternoon, Evening
  const preferred_delivery_slot = getWeightedRandom(
    ['Morning', 'Afternoon', 'Evening'],
    [34, 33, 33]
  );
  
  // Estimated Arrival Delay: 0-10
  const estimated_arrival_delay = getRandomInt(0, 10);
  
  // Driver Experience: 1-60 months
  const driver_experience = getRandomInt(1, 60);
  
  // Pickup Delay: 0-5
  const pickup_delay_minutes = getRandomFloat(0, 5, 1);
  
  // Hour: 0-23
  const hour_of_day = getRandomInt(0, 23);
  
  // Day: Current Day
  const today = new Date();
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const day_of_week = days[today.getDay()];
  
  // Weekend: Automatically detect
  const is_weekend = (today.getDay() === 0 || today.getDay() === 6) ? 1 : 0;
  
  // Customer Reachability: 0.80-1.00
  const customer_reachability_score = getRandomFloat(0.80, 1.00, 2);
  
  // Society Accessibility: 0.80-1.00
  const society_accessibility_score = getRandomFloat(0.80, 1.00, 2);
  
  // Driver Reliability: 0.80-1.00
  const driver_reliability_score = getRandomFloat(0.80, 1.00, 2);
  
  // Others not specified but required by endpoint schema
  const Delivery_Time = getRandomInt(15, 45);
  const customer_response_time = getRandomInt(1, 5);
  const arrival_within_preferred_slot = getRandomInt(0, 1);
  
  return {
    Agent_Age,
    Agent_Rating,
    Weather,
    Traffic,
    Vehicle,
    Area,
    Delivery_Time,
    customer_answered_call,
    customer_response_time,
    customer_availability,
    visitor_pass_status,
    society_security_level,
    gate_wait_time,
    driver_status,
    previous_failed_deliveries,
    address_confidence,
    preferred_delivery_slot,
    estimated_arrival_delay,
    driver_experience,
    pickup_delay_minutes,
    hour_of_day,
    day_of_week,
    is_weekend,
    arrival_within_preferred_slot,
    customer_reachability_score,
    society_accessibility_score,
    driver_reliability_score
  };
}
