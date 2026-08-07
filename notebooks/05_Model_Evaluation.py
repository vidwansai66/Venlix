#!/usr/bin/env python
# coding: utf-8

# In[16]:


import joblib
import pandas as pd

# -----------------------------
# Load Model
# -----------------------------

model = joblib.load("venlix_model.pkl")

# -----------------------------
# Load Test Data
# -----------------------------

X_test = pd.read_csv(r"C:\Users\VIDWAN\VenlixAI\data\X_test.csv")

y_test = pd.read_csv(r"C:\Users\VIDWAN\VenlixAI\data\y_test.csv").squeeze()

print("=" * 60)
print("MODEL FEATURES")
print("=" * 60)

print(model.get_booster().feature_names)

print("\n")

print("=" * 60)
print("X_TEST FEATURES")
print("=" * 60)

print(list(X_test.columns))

print("\n")

print("Model Feature Count :", len(model.get_booster().feature_names))
print("X_test Feature Count:", len(X_test.columns))


# In[18]:


# ============================================
# Predictions
# ============================================

# Verify model and dataset features match

model_features = model.get_booster().feature_names
test_features = list(X_test.columns)

if model_features != test_features:

    print("❌ Feature Mismatch Found")

    print("\nFeatures missing in X_test:")

    print(list(set(model_features) - set(test_features)))

    print("\nExtra features in X_test:")

    print(list(set(test_features) - set(model_features)))

    raise Exception(
        "Model and X_test feature names do not match.\n"
        "Retrain the model using the latest X_train.csv."
    )

print("✅ Feature names matched successfully.")

# Prediction

y_pred = model.predict(X_test)

y_prob = model.predict_proba(X_test)[:, 1]

print("✅ Predictions generated successfully.")


# In[ ]:




