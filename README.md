# dis
Dengue Information System
## 📖 Dengue Information System (DIS) — Functional Overview

### Home Page
- **Image slider:** Rotating announcements & system overview  
- **News feed:** Latest dengue‑related updates  

### Top Menu Structure

| Menu     | Functionality                                                         |
|----------|-----------------------------------------------------------------------|
| Insights | Interactive data visualizations                                       |
| News     | Admin‑posted bulletins                                                |
| Feedback | Public submits breeding site reports (location, description, photos)  |
| Profile  | Role‑based login: General User, Researcher, Admin                     |

---

## Insights (Data Visualization Dashboard)

| Visualization           | Description                          | Controls                              |
|-------------------------|--------------------------------------|---------------------------------------|
| I. Yearly Line Chart    | Compare dengue cases by year         | Select district; compare 1–3 years     |
| II. District Bar Chart  | Dengue cases per district            | Select year/week                      |
| III. District Pie Chart | Percentage distribution of cases     | Select year                           |
| IV. GIS Heatmap         | Choropleth Sri Lanka map             | Click district for details; select year |
| V. Hotspot Map          | Google map heat intensity of breeding site reports | Real‑time updates from user feedback |

---

## Role‑Based Permissions

| Role           | Permissions                                                                 |
|----------------|-----------------------------------------------------------------------------|
| General User   | Submit/view own feedback; view public dashboards                            |
| Researcher     | Access raw dengue data; run/test models via DIS; submit graphs for admin approval |
| Admin          | Manage all users; approve researcher accounts; CRUD dengue data; review/publish researcher graphs |

---

## Technology Stack

- **Frontend:** React + Redux Toolkit Query + D3.js (dynamic, interactive charts)  
- **Backend:** Node.js/Express for data API + Flask (Python) service for dengue risk modeling  
- **Database:** MongoDB (stores users, graph configurations, feedback)  
- **Deployment:** CORS‑enabled REST APIs; responsive design  

---

## Figure

Single architectural diagram showing data flow:

```mermaid
flowchart TD
    ExcelData[Excel data] --> PythonForecast[Python forecasting (Flask API)]
    PythonForecast --> NodeAPI[MongoDB + Node/Express API]
    NodeAPI --> ReactDash[React Dashboard + D3.js]
```





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








# Sri Lanka Dengue Heatmap

**Date:** 2025‑03‑24  
**Author:** Development Team  

---

## Overview

This interactive choropleth visualizes annual dengue case totals by district in Sri Lanka. Users can:

- Select a year  
- View district‑level dengue incidence on a color‑graded map  
- Click any district to see its total cases  
- Export the current map view as a PNG  
- Interpret color bins via a dynamically generated legend  

This feature integrates into our MERN‑based Dengue Information System.

---

## Data Model & API

### MongoDB Schema (`weeklyDngData` collection)

| Field       | Type   | Description                      |
|-------------|--------|----------------------------------|
| `year`      | Number | Calendar year (e.g. 2024)        |
| `week`      | Number | ISO week number (1–52)           |
| `districtId`| String | Sri Lanka district code (e.g. “LK-11”) |
| `dengueCases`| Number| Cases reported that week         |

### Backend Endpoints

| Endpoint                                  | Method | Description                                  |
|-------------------------------------------|--------|----------------------------------------------|
| `/api/weeklyDngData/years`                | GET    | Returns sorted list of available years       |
| `/api/weeklyDngData/weekly?year={year}`   | GET    | Returns all weekly records for the specified year |

> Annual totals are aggregated client‑side from weekly data.

---

## Frontend Stack

- **React** + **React‑Leaflet** for map rendering  
- **RTK Query** for data fetching  
- **React‑Bootstrap** for UI  
- **html-to-image** + **downloadjs** for PNG export  

---

## Data Aggregation & Dynamic Binning

1. Fetch weekly records via RTK Query  
2. Aggregate into `{ districtId: totalCases }` using `Array.reduce()`  
3. Sort totals, compute median, derive sub‑range (`sr = ⌊median/3⌋`, minimum 1)  
4. Generate seven thresholds:  [0, sr, 2sr, 3sr, 4sr, 5sr, 6sr]

5. Assign colors (darkest red for >6sr down to pale for zero):

| Range     | Color   |
|-----------|---------|
| > 6·sr    | #800026 |
| > 5·sr    | #BD0026 |
| > 4·sr    | #E31A1C |
| > 3·sr    | #FC4E2A |
| > 2·sr    | #FD8D3C |
| > 1·sr    | #FEB24C |
| > 0       | #FFEDA5 |
| = 0       | #FFEDA0 |

---

## Component Structure

```jsx
<DistrictMap>
<Form.Select>  <!-- Year selector --> </Form.Select>
<MapContainer>
 <GeoJSON style={styleFn} onEachFeature={...} />
 <Legend grades={thresholds} getColor={colorFn} />
</MapContainer>
<DetailsPanel>  <!-- Selected district cases --> </DetailsPanel>
<Button onClick={exportMap}>Export as PNG</Button>
</DistrictMap>
```
## Export Feature

Captures the map container and downloads it as a PNG:

```js
import { toPng } from 'html-to-image';
import download from 'downloadjs';

const exportMap = () => {
  toPng(mapRef.current, { backgroundColor: '#fff', cacheBust: true })
    .then(dataUrl => download(dataUrl, `SriLanka_Dengue_${selectedYear}.png`))
    .catch(err => console.error('Export failed:', err));
};
```
## Performance Optimizations

- Memoize aggregation and threshold calculations with `useMemo`
- Remount `<GeoJSON>` on year change (React `key`) to avoid stale styles
- Leverage Leaflet’s built‑in tile virtualization for smooth panning/zoom

## Future Enhancements

| Feature         | Description                                         |
|-----------------|-----------------------------------------------------|
| Loading Spinner | Show `<Spinner>` while fetching data               |
| CSV Export      | Download annual totals per district as CSV          |
| Time Slider     | Animate heatmap over years                          |
| Accessibility   | Add ARIA labels and keyboard navigation support     |



# Customize Map — User‑Driven Choropleth

**Date:** 2025‑03‑25  
**Author:** Development Team  

---

## 1️⃣ Objective

Extend our existing Sri Lanka dengue heatmap into a **fully customizable mapping tool**, empowering users to:

- Enter a custom **map title**  
- Supply their own district‑level data (numeric only)  
- Choose between **Warm (red)** or **Cold (blue)** color ramps  
- Generate a dynamic choropleth instantly  
- Export the result as a high‑resolution PNG  

This “Customize Map” component maximizes data entry convenience, accessibility, and visual clarity.

---

## 2️⃣ Technology Stack

| Layer | Library / Tool |
|-------|----------------|
| UI Layout | React + React‑Bootstrap |
| Map Rendering | React‑Leaflet + GeoJSON |
| Data Binding | React state + useMemo |
| Export PNG | html-to-image + downloadjs |
| Styling | CSS + Bootstrap utilities |

---

## 3️⃣ Layout & User Flow

The screen is split into **two equal columns**:

| Left Column | Right Column |
|-------------|--------------|
| ✏️ **Map Title**<br/>Rendered from user input | 🔤 **Title Input**<br/>Editable text field |
| 🗺️ **Choropleth Map**<br/>Rendered only after “Generate Map” | 📋 **Data Table**<br/>Two‑column: District + Value |
| 📊 **Legend**<br/>Dynamic color bins at bottom‑right | 🎨 **Palette Selector**<br/>Warm vs Cold |
| 📥 **Export Button**<br/>Downloads PNG | ▶️ **Generate Map Button**<br/>Creates the map |

---

## 4️⃣ Data Entry Convenience

- **Default Sample Values**  
  - Pre‑loaded from `dengue-data.json`  
  - Automatically selected on focus (no backspace needed)  
- **Keyboard Navigation**  
  - Press **Tab** or **Enter** to move to the next input cell  
- **Validation & Fallback**  
  - Only numeric input accepted  
  - Empty cells automatically treated as **0** on generate  

---

## 5️⃣ Dynamic Choropleth Logic

### Aggregation

- User inputs aggregated into `{ districtId: totalCases }`  
- Missing → 0  

### Threshold Calculation

- Sort totals → compute median → sub‑range = ⌊median/3⌋ (min 1)  
- Thresholds: `[0, sr, 2sr, 3sr, 4sr, 5sr, 6sr]`

### Dual Palettes

| Range   | Warm (reds) | Cold (blues) |
|---------|-------------|--------------|
| >6·sr   | #800026     | #08519c      |
| >5·sr   | #BD0026     | #3182bd      |
| >4·sr   | #E31A1C     | #6baed6      |
| >3·sr   | #FC4E2A     | #9ecae1      |
| >2·sr   | #FD8D3C     | #c6dbef      |
| >1·sr   | #FEB24C     | #deebf7      |
| >0      | #FFEDA5     | #f7fbff      |
| =0      | #FFEDA0     | #ffffff      |

---

## 6️⃣ Legend & Export

- **Legend** implemented as a Leaflet control in bottom‑right  
- **Export PNG** captures the entire map container (tiles, GeoJSON, legend) via `html-to-image` and triggers a download

```js
toPng(mapRef.current, { backgroundColor: '#fff', cacheBust: true })
  .then(url => download(url, `${topic}.png`));
```

## 7️⃣ Accessibility & Performance

- All form inputs are properly labeled and support keyboard navigation (Tab/Enter)  
- Input values auto‑select on focus to streamline data entry  
- Computation (aggregation + threshold calculation) wrapped in `useMemo` to minimize re-renders  
- GeoJSON layer keyed by data change (`key={selectedYear}`) prevents stale styles  
- Leaflet’s built‑in tile virtualization ensures smooth panning/zoom even with large boundary data

## 8️⃣ Future Enhancements

| Feature           | Description                                      |
|-------------------|--------------------------------------------------|
| CSV Download      | Export user-entered district values as a CSV file |
| Reset Form        | Clear all input fields with a single click        |
| Theme Presets     | Save and reuse custom color palettes              |
| Mobile Layout     | Adapt two‑column layout for small screens         |
