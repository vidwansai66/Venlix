#!/usr/bin/env python
# coding: utf-8

# In[11]:


import pandas as pd
import numpy as np

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import joblib

# --------------------------------------------------
# Load Dataset
# --------------------------------------------------

df = pd.read_csv("../data/gated_delivery_dataset.csv")

# --------------------------------------------------
# Convert Date & Time Columns
# --------------------------------------------------

# Order Date
df["Order_Date"] = pd.to_datetime(
    df["Order_Date"],
    errors="coerce",
    dayfirst=True
)

# Order Time
df["Order_Time"] = pd.to_datetime(
    df["Order_Time"],
    errors="coerce",
    format="mixed"
)

# Pickup Time
df["Pickup_Time"] = pd.to_datetime(
    df["Pickup_Time"],
    errors="coerce",
    format="mixed"
)

# Remove rows with invalid date/time values
df.dropna(
    subset=["Order_Date", "Order_Time", "Pickup_Time"],
    inplace=True
)
# --------------------------------------------------
# Feature Engineering
# --------------------------------------------------

# Pickup delay
df["pickup_delay_minutes"] = (
    (df["Pickup_Time"] - df["Order_Time"])
    .dt.total_seconds() / 60
)

# Hour of day
df["hour_of_day"] = df["Order_Time"].dt.hour

# Day of week
df["day_of_week"] = df["Order_Date"].dt.day_name()

# Weekend
df["is_weekend"] = df["Order_Date"].dt.weekday >= 5

# Arrival within preferred slot
def arrival_slot(hour):
    if hour < 12:
        return "Morning"
    elif hour < 17:
        return "Afternoon"
    else:
        return "Evening"

df["actual_delivery_slot"] = df["hour_of_day"].apply(arrival_slot)

df["arrival_within_preferred_slot"] = (
    df["actual_delivery_slot"] ==
    df["preferred_delivery_slot"]
).astype(int)

# Customer Reachability Score
df["customer_reachability_score"] = np.where(
    df["customer_answered_call"] == "Yes",
    100 - (df["customer_response_time"] / 6),
    10
)

df["customer_reachability_score"] = (
    df["customer_reachability_score"]
    .clip(0, 100)
)

# Society Accessibility Score
security_map = {
    "Open": 100,
    "Moderate": 70,
    "Strict": 40
}

df["society_accessibility_score"] = (
    df["society_security_level"].map(security_map)
    - df["gate_wait_time"] * 2
)

df["society_accessibility_score"] = (
    df["society_accessibility_score"]
    .clip(0, 100)
)

# Driver Reliability Score
driver_map = {
    "Available": 100,
    "Delayed": 60,
    "Accident": 20,
    "Medical Emergency": 10
}

df["driver_reliability_score"] = (
    df["driver_status"].map(driver_map)
    + df["driver_experience"] * 2
    - df["previous_failed_deliveries"] * 5
)

df["driver_reliability_score"] = (
    df["driver_reliability_score"]
    .clip(0, 100)
)

# --------------------------------------------------
# Drop Unnecessary Columns
# --------------------------------------------------

columns_to_drop = [
    "Order_Date",
    "Order_Time",
    "Pickup_Time",
    "actual_delivery_slot"
]

for col in columns_to_drop:
    if col in df.columns:
        df.drop(columns=col, inplace=True)

# --------------------------------------------------
# Encode Categorical Columns
# --------------------------------------------------

label_encoders = {}

categorical_cols = df.select_dtypes(include="object").columns

for col in categorical_cols:

    if col != "delivery_failure":

        le = LabelEncoder()

        df[col] = le.fit_transform(df[col].astype(str))

        label_encoders[col] = le

print("Categorical Encoding Completed.")

# --------------------------------------------------
# Dataset Information
# --------------------------------------------------

print(df.info())

print(df.head())

print(df.isnull().sum())

# --------------------------------------------------
# Features & Target
# --------------------------------------------------

X = df.drop(columns=["delivery_failure"])

y = df["delivery_failure"]

# --------------------------------------------------
# Train Test Split
# --------------------------------------------------

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

print()

print("Training Features :", X_train.shape)

print("Testing Features  :", X_test.shape)

print()

print("Training Labels :", y_train.shape)

print("Testing Labels  :", y_test.shape)

# --------------------------------------------------
# Save Processed Data
# --------------------------------------------------

X_train.to_csv("X_train.csv", index=False)

X_test.to_csv("X_test.csv", index=False)

y_train.to_csv("y_train.csv", index=False)

y_test.to_csv("y_test.csv", index=False)

# --------------------------------------------------
# Save Label Encoders
# --------------------------------------------------

joblib.dump(label_encoders, "label_encoders.pkl")

print()

print("Preprocessing Completed Successfully.")


# In[12]:


df = pd.read_csv("../data/gated_delivery_dataset.csv")
df.head()


# In[13]:


df["pickup_delay_minutes"] = (
    (df["Pickup_Time"] - df["Order_Time"])
    .dt.total_seconds() / 60
)


# In[14]:


df["hour_of_day"] = df["Order_Time"].dt.hour


# In[34]:


df.drop(
    columns=[
        "Order_ID",
        "driver_id",
        "customer_id",
        "Order_Date",
        "Order_Time",
        "Pickup_Time"
    ],
    inplace=True
)


# In[35]:


label_encoders = {}

categorical_cols = df.select_dtypes(include="object").columns

for col in categorical_cols:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])
    label_encoders[col] = le

print("Categorical columns encoded successfully.")


# In[36]:


df.info()


# In[37]:


X = df.drop(
    columns=[
        "label_failed",
        "label_failure_type",
        "recommended_action"
    ]
)

y = df["label_failed"]


# In[38]:


X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)


# In[39]:


print("Training Features:", X_train.shape)
print("Testing Features :", X_test.shape)

print("Training Labels :", y_train.shape)
print("Testing Labels  :", y_test.shape)


# In[40]:


X_train.to_csv("X_train.csv", index=False)
X_test.to_csv("X_test.csv", index=False)

y_train.to_csv("y_train.csv", index=False)
y_test.to_csv("y_test.csv", index=False)

print("Processed datasets saved successfully.")


# In[41]:


import joblib

joblib.dump(label_encoders, "label_encoders.pkl")


# In[10]:


print(df.columns.tolist())


# In[ ]:




