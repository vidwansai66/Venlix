#!/usr/bin/env python
# coding: utf-8

# In[117]:


import warnings
warnings.filterwarnings("ignore")

import json
import joblib
import numpy as np
import pandas as pd

from sklearn.model_selection import cross_val_score

from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier

from xgboost import XGBClassifier
from lightgbm import LGBMClassifier

from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    confusion_matrix,
    classification_report
)

# ==========================================
# Load Dataset
# ==========================================

DATA_PATH = r"C:\Users\VIDWAN\VenlixAI\data"

X_train = pd.read_csv(f"{DATA_PATH}\\X_train.csv")
X_test = pd.read_csv(f"{DATA_PATH}\\X_test.csv")

y_train = pd.read_csv(f"{DATA_PATH}\\y_train.csv").squeeze()
y_test = pd.read_csv(f"{DATA_PATH}\\y_test.csv").squeeze()

print("="*60)
print("VENLIX AI")
print("Last Mile Delivery Failure Predictor")
print("="*60)

print("\nTraining Shape :", X_train.shape)
print("Testing Shape  :", X_test.shape)

print("\nTarget Distribution")
print(y_train.value_counts())

# ==========================================
# Handle Missing Values
# ==========================================

numeric_cols = X_train.select_dtypes(include=["int64","float64"]).columns

for col in numeric_cols:

    median = X_train[col].median()

    X_train[col] = X_train[col].fillna(median)
    X_test[col] = X_test[col].fillna(median)

print("\nMissing Values Removed")

# ==========================================
# Evaluation Function
# ==========================================

results = []

def evaluate_model(model,name):

    pred = model.predict(X_test)

    prob = model.predict_proba(X_test)[:,1]

    accuracy = accuracy_score(y_test,pred)

    precision = precision_score(y_test,pred)

    recall = recall_score(y_test,pred)

    f1 = f1_score(y_test,pred)

    auc = roc_auc_score(y_test,prob)

    cv = cross_val_score(
        model,
        X_train,
        y_train,
        cv=5,
        scoring="f1"
    ).mean()

    print("\n"+"="*60)
    print(name)
    print("="*60)

    print("Accuracy :",round(accuracy,4))
    print("Precision:",round(precision,4))
    print("Recall   :",round(recall,4))
    print("F1 Score :",round(f1,4))
    print("ROC AUC  :",round(auc,4))
    print("CV Score :",round(cv,4))

    print("\nClassification Report\n")

    print(classification_report(
        y_test,
        pred,
        target_names=[
            "Successful Delivery",
            "Failed Delivery"
        ]
    ))

    print("\nConfusion Matrix\n")

    print(confusion_matrix(
        y_test,
        pred
    ))

    results.append({

        "Model":name,

        "Accuracy":accuracy,

        "Precision":precision,

        "Recall":recall,

        "F1":f1,

        "ROC_AUC":auc,

        "CV":cv

    })


# In[118]:


# ==========================================
# Logistic Regression
# ==========================================

lr = LogisticRegression(
    max_iter=2000,
    class_weight="balanced",
    random_state=42
)

lr.fit(X_train, y_train)

evaluate_model(
    lr,
    "Logistic Regression"
)

# ==========================================
# Decision Tree
# ==========================================

dt = DecisionTreeClassifier(

    criterion="gini",

    max_depth=10,

    min_samples_split=20,

    min_samples_leaf=10,

    class_weight="balanced",

    random_state=42

)

dt.fit(
    X_train,
    y_train
)

evaluate_model(
    dt,
    "Decision Tree"
)

# ==========================================
# Random Forest
# ==========================================

rf = RandomForestClassifier(

    n_estimators=300,

    max_depth=15,

    min_samples_split=10,

    min_samples_leaf=5,

    class_weight="balanced",

    random_state=42,

    n_jobs=-1

)

rf.fit(
    X_train,
    y_train
)

evaluate_model(
    rf,
    "Random Forest"
)


# In[120]:


print(len(X_train))
print(len(y_train))


# In[115]:


# ============================================
# Logistic Regression
# ============================================

lr = LogisticRegression(
    max_iter=2000,
    class_weight="balanced",
    random_state=42
)

lr.fit(X_train, y_train)

evaluate_model(lr, X_test, y_test)


# In[116]:


def evaluate_model(model, X_test, y_test):

    pred = model.predict(X_test)

    print("=" * 60)
    print(model.__class__.__name__)
    print("=" * 60)

    print(f"Accuracy  : {accuracy_score(y_test, pred):.4f}")
    print(f"Precision : {precision_score(y_test, pred):.4f}")
    print(f"Recall    : {recall_score(y_test, pred):.4f}")
    print(f"F1 Score  : {f1_score(y_test, pred):.4f}")

    print("\nClassification Report\n")

    print(classification_report(
        y_test,
        pred,
        target_names=[
            "Successful Delivery",
            "Failed Delivery"
        ]
    ))

    print("\nConfusion Matrix\n")

    print(confusion_matrix(y_test, pred))


# In[79]:


dt = DecisionTreeClassifier(
    random_state=42
)

dt.fit(X_train, y_train)

evaluate_model(dt, X_test, y_test)


# In[83]:


rf = RandomForestClassifier(
    n_estimators=200,
    random_state=42
)

rf.fit(X_train, y_train)

evaluate_model(rf, X_test, y_test)


# In[84]:


scale_pos_weight = (
    (y_train == 0).sum() /
    (y_train == 1).sum()
)

print(scale_pos_weight)


# In[85]:


xgb = XGBClassifier(

    n_estimators=300,

    learning_rate=0.05,

    max_depth=6,

    subsample=0.8,

    colsample_bytree=0.8,

    random_state=42,

    scale_pos_weight=scale_pos_weight,

    eval_metric="logloss"

)

xgb.fit(X_train, y_train)

evaluate_model(xgb, X_test, y_test)


# In[86]:


lgbm = LGBMClassifier(

    n_estimators=300,

    learning_rate=0.05,

    max_depth=6,

    random_state=42,

    class_weight="balanced"

)

lgbm.fit(X_train, y_train)

evaluate_model(lgbm, X_test, y_test)


# In[87]:


models = {

    "Logistic Regression": lr,

    "Decision Tree": dt,

    "Random Forest": rf,

    "XGBoost": xgb,

    "LightGBM": lgbm

}

results = []

for name, model in models.items():

    pred = model.predict(X_test)

    results.append({

        "Model": name,

        "Accuracy": accuracy_score(y_test, pred),

        "Precision": precision_score(y_test, pred),

        "Recall": recall_score(y_test, pred),

        "F1 Score": f1_score(y_test, pred)

    })

results = pd.DataFrame(results)

results.sort_values(
    "F1 Score",
    ascending=False
)


# In[88]:


importance = pd.DataFrame({

    "Feature": X_train.columns,

    "Importance": xgb.feature_importances_

})

importance = importance.sort_values(
    "Importance",
    ascending=False
)

importance.head(15)


# In[89]:


import matplotlib.pyplot as plt
import seaborn as sns

plt.figure(figsize=(10,6))

sns.barplot(
    data=importance.head(15),
    x="Importance",
    y="Feature"
)

plt.title("Top 15 Important Features")

plt.show()


# In[90]:


import joblib

joblib.dump(xgb, "venlix_model.pkl")

print("Model Saved Successfully")


# In[91]:


import joblib

feature_columns = list(X_train.columns)

joblib.dump(feature_columns, "feature_columns.pkl")

print("Saved successfully!")


# In[92]:


import pandas as pd

X_train = pd.read_csv(r"C:\Users\VIDWAN\Venlix\data\X_train.csv")


# In[93]:


joblib.dump(list(X_train.columns), "feature_columns.pkl")


# In[94]:


import joblib

joblib.dump(
    list(X_train.columns),
    r"C:\Users\VIDWAN\Venlix\backend\models\feature_columns.pkl"
)

print("✅ feature_columns.pkl saved successfully!")


# In[95]:


print(X_train.columns.tolist())


# In[96]:


print(len(X_train.columns))


# In[111]:


X_train = pd.read_csv(r"C:\Users\VIDWAN\VenlixAI\data\X_train.csv")
X_test = pd.read_csv(r"C:\Users\VIDWAN\Venlix\data\X_test.csv")


# In[108]:


X_train.to_csv(r"C:\Users\VIDWAN\VenlixAI\data\X_train.csv", index=False)
X_test.to_csv(r"C:\Users\VIDWAN\VenlixAI\data\X_test.csv", index=False)

y_train.to_csv(r"C:\Users\VIDWAN\VenlixAI\data\y_train.csv", index=False)
y_test.to_csv(r"C:\Users\VIDWAN\VenlixAI\data\y_test.csv", index=False)


# In[109]:


print(X_test.columns.tolist())
import os

print(os.path.abspath(r"C:\Users\VIDWAN\VenlixAI\data\X_test.csv"))


# In[110]:


print(model.get_booster().feature_names == list(X_test.columns))


# In[103]:





# In[ ]:





# In[ ]:





# In[ ]:




