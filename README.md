# dis
Dengue Information System


# Data Verification and Duplicate Prevention for Weekly Dengue Data

This document describes the methods implemented in the backend to ensure that duplicate weekly dengue data entries are prevented. The verification is performed at both the application (controller) level and the database schema level.

## Overview

For each weekly dengue data record, the following key fields are used to determine uniqueness:

- **year**
- **week**
- **districtId**

A combination of these fields must be unique, meaning that each district may only have one record per week and year. If duplicate records are attempted, an error is returned to prevent accidental multiple insertions for the same time period and district.

## Verification in the Backend Controller

Before inserting new data into the database, the controller performs the following steps:

### 1. Input Validation
- **Required Fields:** The controller checks for the presence of `year`, `week`, `districtId`, and `dengueCases`.
- **Data Type Validation:** It verifies that fields such as `year`, `week`, and `dengueCases` are valid numbers.

### 2. Duplicate Check for Single Records
- **Process:**  
  The controller queries the database for an existing record that matches the combination of `year`, `week`, and `districtId`.
- **Error Handling:**  
  If an existing record is found, the controller returns an error message similar to:  
  > "Weekly dengue data already exists for year: `<year>`, week: `<week>`, district: `<districtId>`."

### 3. Duplicate Check for Multiple Records
- **Process:**  
  For bulk inserts, the controller loops through each record and performs the duplicate check using the same criteria.
- **Error Handling:**  
  If any record in the batch is found to be a duplicate, the entire insertion operation is aborted, and an error is returned.

### 4. Data Insertion
- **Successful Insert:**  
  Only when no duplicates are found does the controller proceed to insert the new record(s) into the database.

## Verification at the Database Schema Level

To provide an additional layer of protection, the data model includes a **compound unique index** on the combination of `year`, `week`, and `districtId`. This enforces uniqueness at the database level.

### Example Schema Definition

```javascript
import mongoose from "mongoose";

const weeklyDengueDataSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    year: {
      type: Number,
      required: true,
    },
    week: {
      type: Number,
      required: true,
      min: 1,
      max: 52,
    },
    districtId: {
      type: String,
      required: true,
    },
    dengueCases: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add unique compound index on year, week, and districtId
weeklyDengueDataSchema.index({ year: 1, week: 1, districtId: 1 }, { unique: true });

export default mongoose.model("weeklyDengueData", weeklyDengueDataSchema);
```
### Benefits
- **Redundancy:**
The compound index acts as a second line of defense. Even if the application logic fails or a race condition occurs, the database will enforce the uniqueness constraint.

- **Error Handling:**
Duplicate key errors (e.g., MongoDB error code E11000) can be caught in the error handling middleware to provide clear feedback to the client.

### Conclusion
By implementing duplicate verification at both the controller and database levels, the application ensures robust data integrity for weekly dengue records. This two-pronged approach:

- **Prevents data redundancy**
- **Maintains consistency**
- **Ensures reliable dengue data tracking and reporting**



# Proposed Graph Types for Dengue-Related Visualizations Using D3.js

## 1. Introduction

In this research, we aim to provide dynamic, data-driven visualizations for dengue-related metrics. To achieve this, we categorize our chart types into three primary variants, each suitable for different data structures. This document outlines the **Single Value Line Graph**, **Multi Value Line Graph**, and **Categorical Scatter Plot**, detailing the expected data format and usage scenarios.

## 2. Overview of the Three Graph Types

### 2.1 Single Value Line Graph

- **Graph Index:** 1  
- **Suggested graphType:** `"SingleLine"`
- **Description:**  
  A single time-series line chart, where each data point represents a single numeric value (e.g., dengue cases or dengue risk) over a timeline. The timeline is determined by merging the `year` and `week` fields.
- **X-Axis:** Combined (`year` + `week`) to indicate the specific time point.
- **Y-Axis:** A single numeric field (e.g., `value` or `data`).

**Example Use Case:** Displaying a single trend line of dengue cases over weekly intervals.

**Sample JSON Structure:**

```json
{
  "title": "Dengue Cases Over Time",
  "xAxisLabel": "Year-Week",
  "yAxisLabel": "Cases",
  "data": [
    { "year": 2018, "week": 1, "value": 0.02 },
    { "year": 2018, "week": 2, "value": 0.05 },
    { "year": 2018, "week": 3, "value": 0.09 }
  ]
}
```

### 2.2 Multi Value Line Graph

- **Graph Index:** 2  
- **Suggested graphType:** `"MultiLine"`
- **Description:**  
  A chart containing multiple line series plotted on the same X-axis, enabling comparisons between two or more numeric fields (e.g., “expected cases” vs. “real cases”).
- **X-Axis:** Combined (`year` + `week`) to indicate the time dimension.
- **Y-Axis:** Two or more numeric columns (e.g., `data1`, `data2`), each rendered as a distinct line.

**Example Use Case:** Comparing predicted versus actual dengue incidence in a single chart.

**Sample JSON Structure:**

```json
{
  "title": "Expected vs. Real Dengue Cases",
  "xAxisLabel": "Year-Week",
  "yAxisLabel": "Cases",
  "legend": {
    "data1": "Expected Cases",
    "data2": "Real Cases"
  },
  "data": [
    { "year": 2018, "week": 1, "data1": 10, "data2": 12 },
    { "year": 2018, "week": 2, "data1": 14, "data2": 16 },
    { "year": 2018, "week": 3, "data1": 20, "data2": 18 }
  ]
}
```

### 2.3 Categorical Scatter Plot

- **Graph Index:** 3  
- **Suggested graphType:** `"CategoricalScatter"`
- **Description:**  
  A scatter plot where each point’s x-position is the combination of `year` and `week`, the y-position is a numeric field (e.g., `data1`), and its color is determined by a categorical field (e.g., `"riskLevel"`). This allows the user to visualize both numeric variation and category-based groupings in one chart.
- **X-Axis:** Combined (`year` + `week`).
- **Y-Axis:** A numeric field (`data1`).
- **Color Coding:** A categorical field (e.g., `riskLevel`) defines the color of each point.

**Example Use Case:** Plotting weekly dengue cases on the y-axis, colored by risk category (low, medium, high).

**Sample JSON Structure:**

```json
{
  "title": "Dengue Risk by Week",
  "xAxisLabel": "Year-Week",
  "yAxisLabel": "Dengue Cases",
  "categoryKey": "riskLevel",
  "categoryColors": {
    "low": "green",
    "medium": "orange",
    "high": "red"
  },
  "data": [
    { "year": 2018, "week": 1, "data1": 5, "riskLevel": "low" },
    { "year": 2018, "week": 2, "data1": 12, "riskLevel": "medium" },
    { "year": 2018, "week": 3, "data1": 20, "riskLevel": "high" }
  ]
}
```
## 3. Recommended Naming Conventions

| Graph Index | Suggested graphType     | graphName                     | Description                             |
| ----------- | ----------------------- | ----------------------------- | --------------------------------------- |
| 1           | `"SingleLine"`          | "Single Value Line Graph"     | Single time-series line.                |
| 2           | `"MultiLine"`           | "Multi Value Line Graph"      | Multiple lines on a single time axis.   |
| 3           | `"CategoricalScatter"`  | "Categorical Scatter Plot"    | Scatter plot with categorical coloring. |

This naming convention ensures clarity when switching graph logic in code. For example:

```javascript
switch (graphType) {
  case 'SingleLine':
    // Code to draw a single line
    break;
  case 'MultiLine':
    // Code to draw multiple lines
    break;
  case 'CategoricalScatter':
    // Code to draw a scatter plot with colored categories
    break;
  default:
    // Fallback
}
```

## 4. Use Cases & Benefits

- **SingleLine:**  
  Perfect for straightforward trend analysis (e.g., weekly dengue incidence).

- **MultiLine:**  
  Ideal for comparisons of different metrics or forecasts versus real data.

- **CategoricalScatter:**  
  Visualizes distributions with an added categorical dimension (e.g., risk levels).

In all cases, the x-axis merges `year` and `week` to reflect a unique time slice. The y-axis holds one or more numeric values. For the scatter plot, an additional categorical field is used to differentiate colors.

## 5. Conclusion

These three graph types—**SingleLine**, **MultiLine**, and **CategoricalScatter**—cover the core needs for time-series and categorical data visualization in dengue-related research. By standardizing data formats and naming conventions, we can streamline both the user interface (where users select the appropriate graph type) and the technical implementation (where D3.js code adapts based on `graphType`).

By following these guidelines, researchers and developers can easily incorporate new data into their existing dashboards, ensuring consistent and informative visualizations for dengue monitoring and analysis.
