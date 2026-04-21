# Project Proposal: Predictive Health-Climate Analytics (cchain Dataset)

## 1. Introduction
The **cchain dataset** represents a landmark in open-sourced linked data, integrating 20 years (2003-2022) of climate, environmental, socioeconomic, and health dimensions at the barangay (village) level across twelve key Philippine cities. This project aims to leverage this dataset to build a predictive framework for climate-sensitive disease outbreaks, helping cities prepare for the health impacts of climate change.

## 2. Project Goal
Develop a machine learning model that predicts barangay-level health risks (specifically respiratory and waterborne diseases) based on historical climate stressors and socioeconomic markers.
- **Anticipated Outcomes:** A spatial-temporal risk dashboard for city health officers.
- **Societal Impact:** Enabling proactive resource allocation and early warning systems for vulnerable urban populations.

## 3. Methodology
### 3.1 Variable Selection (Case Study: Navotas City)
- **Climate:** Monthly avg temperature, total rainfall, humidity, extreme heat days.
- **Health:** Case counts for Dengue, ARI, and Diarrheal diseases.
- **Socioeconomic:** Population density, PSGC geography codes, and poverty incidence.

### 3.2 Data Merging and Preprocessing
- **Merging Strategy:** Disparate data sources (Climate CSVs and Health JSONs) will be merged using PSGC codes as the primary key and calendar months as the temporal join key.
- **Tools:** Use of the provided **CChain Linking Notebook** for initial joins, followed by custom Python `pandas` pipelines for feature engineering (lagged variables, rolling averages).

### 3.3 Machine Learning Architecture
- **Step 1: Feature Importance:** Use Random Forest to identify the strongest environmental drivers of disease.
- **Step 2: Predictive Modeling:** Train XGBoost and LSTM models to forecast health risks 1-3 months in advance.
- **Step 3: Validation:** Backtesting against 2018-2022 data to ensure model reliability.

## 4. Data Utilization
- **Preliminary Analysis:** Correlation heatmaps between rainfall anomalies and dengue spikes.
- **Visualization:** Time-series divergence plots showing the gap between expected and actual health outcomes.

## 5. Expected Challenges
- **Missing Data:** Early records (2003-2005) may be incomplete.
  - *Mitigation:* Focus on the 2010-2022 window or use MICE imputation.
- **Non-Linearity:** Climate-health relations are complex.
  - *Mitigation:* Use ensemble methods and non-parametric models.

## 6. Conclusion
By utilizing the cchain dataset, this project provides a scalable blueprint for urban health resilience in the Philippines, turning 20 years of data into a predictive tool for the future.
