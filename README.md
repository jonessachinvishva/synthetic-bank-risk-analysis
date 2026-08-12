MSc Data Science Research Projects - Summer 2026
# Create a Synthetic Bank: Interest Rate Risk and Behavioural Modelling

## MSc Data Science Dissertation Project

**University of Leicester**

### Project Overview

This project develops a **synthetic retail banking dataset** to analyse the impact of **interest rate changes on a bank’s retail portfolio**. The work is based on historical **Bank of England (BoE)** and **Office for National Statistics (ONS)** data and addresses the problem faced by UK high street banks after the post-2008 period of prolonged low interest rates, where historical customer behaviour under different interest-rate environments was limited.

The project combines **macroeconomic indicators**, **retail banking volume data**, **time-series analysis**, **linear regression**, **logistic regression**, and **synthetic customer generation** to simulate realistic banking portfolios under alternative economic scenarios.

---

# Problem Statement

Banks need to assess **income risk and portfolio behaviour** when interest rates change. Historical customer-level data covering a wide range of economic conditions is often unavailable, particularly during periods of sustained low interest rates. This project creates a synthetic bank that reflects realistic UK retail banking behaviour and enables **scenario analysis under changing macroeconomic conditions**.

---

# Objectives

* Collect historical UK macroeconomic and retail banking data from **BoE** and **ONS**
* Perform time-series preprocessing and exploratory analysis
* Model the relationship between macroeconomic variables and retail banking volumes
* Predict mortgage approval behaviour using **Linear Regression**
* Classify economic conditions using **Logistic Regression**
* Generate a **synthetic customer-level banking dataset**
* Simulate **interest-rate stress scenarios**
* Measure the effect of macroeconomic changes on the synthetic banking portfolio

---

# Data Sources

## Bank of England

* Bank Rate
* Mortgage Approvals
* Consumer Credit
* Credit Card Lending
* Household Current Account Deposits (LPMBF88)
* Household Savings Deposits (LPMZ3TH, LPMZ3TN)

## Office for National Statistics

* Consumer Price Index (CPI)
* GDP Growth
* Unemployment Rate
* House Price Index

The historical dataset spans **2008-01 to 2025-12** at a **monthly frequency**.

---

# Project Structure

```text
Create-Synthetic-Bank/
│
├── data/
│   ├── raw/                     # BoE and ONS source files
│   ├── processed/               # Cleaned and merged datasets
│   └── synthetic/               # Generated customer datasets
│
├── notebooks/
│   ├── 01_data_collection.ipynb
│   ├── 02_time_series_analysis.ipynb
│   ├── 03_linear_regression.ipynb
│   ├── 04_logistic_regression.ipynb
│   ├── 05_synthetic_generation.ipynb
│   └── 06_scenario_analysis.ipynb
│
├── dashboard/
│   └── streamlit_app.py         # Interactive scenario analysis
│
├── models/
│   ├── linear_model.pkl
│   └── logistic_model.pkl
│
├── outputs/
│   ├── figures/
│   ├── tables/
│   └── reports/
│
├── Final_DS.csv
├── requirements.txt
└── README.md
```

---

# Methodology

## 1. Historical Dataset

The first dataset is a **monthly macroeconomic and retail banking dataset** containing:

| Variable            |
| ------------------- |
| Month               |
| Bank_Rate           |
| CPI                 |
| GDP_Growth          |
| Unemployment_Rate   |
| House_Price_Index   |
| Current_Accounts    |
| Savings_Accounts    |
| Mortgage_Approvals  |
| Consumer_Credit     |
| Credit_Card_Lending |

---

## 2. Time-Series Analysis

Time-series preprocessing includes:

* Date conversion
* Monthly indexing
* Missing-value handling
* Trend analysis
* Rolling statistics
* Stationarity testing
* Differencing (where required)

---

## 3. Linear Regression

### Target Variable

* Mortgage_Approvals

### Features

* Bank_Rate
* CPI
* GDP_Growth
* Unemployment_Rate
* House_Price_Index

The model estimates how changes in macroeconomic conditions influence mortgage approval volumes.

Evaluation metrics:

* R²
* MAE
* RMSE

---

## 4. Logistic Regression

A binary **Economy_Status** variable is created:

* Good Economy (0)
* Difficult Economy (1)

Based on macroeconomic thresholds such as:

* High Bank Rate
* High CPI
* Negative GDP Growth
* High Unemployment

The logistic model predicts the probability of a difficult economic environment.

Evaluation metrics:

* Accuracy
* Precision
* Recall
* F1-score
* ROC-AUC

---

## 5. Synthetic Customer Generation

A synthetic customer dataset is generated using calibrated statistical distributions.

### Customer Attributes

* Customer_ID
* Age
* Income
* Current_Balance
* Savings_Balance
* Mortgage_Balance
* Loan_Balance
* Credit_Card_Balance

Macroeconomic variables for each month are attached to customer records, creating a time-dependent synthetic banking portfolio.

Example:

| Customer_ID | Month   | Age | Income | Current_Balance | Mortgage_Balance | Bank_Rate |
| ----------- | ------- | --- | ------ | --------------- | ---------------- | --------- |
| C000001     | 2024-01 | 34  | 42000  | 2850            | 185000           | 5.25      |
| C000001     | 2024-02 | 34  | 42000  | 2720            | 184650           | 5.25      |

---

# Scenario Analysis

Scenario analysis is performed **after synthetic data generation**.

Example scenarios:

## Baseline

* Bank Rate: 5.25%
* CPI: 3.2%
* GDP Growth: 0.4%
* Unemployment: 4.1%

## Stress Scenario

* Bank Rate: 7.00%
* CPI: 5.5%
* GDP Growth: -0.8%
* Unemployment: 6.8%

The trained regression models are reused to predict:

* Mortgage approvals
* Economic regime
* Portfolio changes
* Mortgage payment increases
* Aggregate current and savings balances
* Estimated bank income impact

---

# Interactive Dashboard

A **Streamlit dashboard** enables real-time scenario analysis using sliders.

Users can adjust:

* Bank Rate
* CPI
* GDP Growth
* Unemployment Rate

The dashboard dynamically updates:

* Predicted mortgage approvals
* Economy status
* Portfolio metrics
* Risk indicators

Run with:

```bash
streamlit run dashboard/streamlit_app.py
```

---

# Installation

Clone the repository:

```bash
git clone https://github.com/yourusername/create-synthetic-bank.git
cd create-synthetic-bank
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate:

Windows

```bash
venv\\Scripts\\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

---

# Running the Project

### 1. Preprocess data

```bash
python scripts/preprocess.py
```

### 2. Train regression models

```bash
python scripts/train_models.py
```

### 3. Generate synthetic bank

```bash
python scripts/generate_synthetic_bank.py
```

### 4. Run scenario analysis

```bash
python scripts/scenario_analysis.py
```

### 5. Launch dashboard

```bash
streamlit run dashboard/streamlit_app.py
```

---

# Expected Outputs

* Cleaned historical dataset
* Trained linear regression model
* Trained logistic regression model
* Synthetic customer dataset
* Scenario analysis results
* Interactive dashboard visualisations
* Portfolio comparison reports

---

# Technologies Used

* Python
* Pandas
* NumPy
* Scikit-learn
* Matplotlib
* Seaborn
* Statsmodels
* Streamlit
* Jupyter Notebook

---

# Research Significance

The project demonstrates how publicly available UK macroeconomic data can be transformed into a **synthetic retail banking environment** suitable for **interest-rate risk analysis**, **behavioural modelling**, and **stress testing**. The framework can support academic research, risk management studies, and the development of banking simulation tools where customer-level historical data is unavailable.

---

# Author

**Saketh Pakala Sivasubramanyam**

**Nilesh Anand**

**Jones Sachin Vanathu Chinnappan**

**Sharma Murali Christian**

MSc Data Science
University of Leicester


