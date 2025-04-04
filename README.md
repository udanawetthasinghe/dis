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



# Dengue Data Visualization System: A Comprehensive Report

## 1. Introduction

The Dengue Data Visualization System is a MERN‑stack application designed to aggregate, analyze, and visually represent dengue case data. It provides interactive statistical graphs (line, bar, and pie charts) and spatial visualizations (heatmap and customized maps) to support public health research and decision‑making. This report documents the development process from backend data modeling and API development to the frontend implementation with responsive dashboards.

## 2. System Overview

### Backend

- **Technology:** Node.js, Express, MongoDB, Mongoose.
- **Purpose:** Store and manage weekly dengue data (by year, week, and district) and expose RESTful API endpoints.
- **Key Components:**
  - **Data Model:** Defined in `weeklyDngDataModel.js` with fields for `year`, `week` (1–52), `districtId`, `dengueCases`, and timestamps.
  - **Controller & Routes:** `weeklyDngDataController.js` implements CRUD operations and specific queries (e.g., distinct years, data by year). Routes are defined in `weeklyDngDataRoutes.js`.

### Frontend

- **Technology:** React, Redux Toolkit Query (RTK Query) for API communication, D3.js for charting, and React Bootstrap for layout.
- **Purpose:** Fetch data from the backend, compute relevant statistics, and render interactive visualizations.
- **Key Components:**
  - **Data Fetching:** RTK Query slices (e.g., `WeeklyDngDataApiSlice`) expose hooks like `useGetWeeklyByYearQuery` and `useGetYearsQuery` for data retrieval.
  - **Charts:** D3-powered components including:
    - **Line Charts:** `SingleLineD3` and `ThreeLineChart` for time-series analysis.
    - **Grouped Bar Charts:** `DistrictComparisonChart` compares dengue cases by district across multiple years.
    - **Pie Charts:** `DistrictDistributionChart` visualizes the percentage distribution of cases among districts.
  - **Map Visualizations:**
    - **Dengue Heatmap:** Visualizes geographic clusters of dengue cases.
    - **Customized Map:** Allows users to interact with and configure the map display for detailed spatial analysis.
  - **Dashboard Layout:** The main dashboard (e.g., `DengueInsightsScreen`) uses React Bootstrap’s grid system to create a responsive layout:
    - **Row #1:**  
      - Left (≈65% width): Displays live comparison charts via `WeeklyComparisonContainer`.  
      - Right (≈35% width): Shows two summary cards for _Last Week Stats_ and _Year-to-Year Comparison_.
    - **Row #2:**  
      - Left (≈65% width): Renders the district comparison grouped bar chart via `DistrictComparisonContainer`.  
      - Right (≈35% width): Displays the district distribution pie chart via `DistrictDistributionContainer`.
    - **Row #3:**  
      - Dengue Heat Map component
    - **Row #4:**  
      - Customize Map component

## 3. Data Modeling & Backend Implementation

### 3.1 Data Model

The MongoDB schema (in `weeklyDngDataModel.js`) includes:
- **Year & Week:** Numeric fields specifying the calendar week and year.
- **District ID:** A string identifying the district.
- **Dengue Cases:** A numeric value representing the number of reported cases.
- **Timestamps:** Automatic fields for creation and update times.

### 3.2 Controller & Routes

- **Controller:** Implements endpoints to retrieve all weekly records, fetch distinct years, and filter records by year.
- **Routes:** Mapped in `weeklyDngDataRoutes.js` to allow creation, update, and deletion of records (with appropriate authorization).

## 4. Frontend Implementation

### 4.1 Data Fetching

RTK Query is used to streamline API requests. Hooks such as:
- `useGetYearsQuery`
- `useGetWeeklyByYearQuery`

enable efficient data fetching. The use of `skipToken` delays a query until valid parameters (like a selected year) are provided.

### 4.2 Chart Visualizations

D3.js is used to build interactive charts:

- **Line Charts:**  
  - **SingleLineD3:** Renders a responsive line chart with tooltips and dynamic tick intervals.  
  - **ThreeLineChart:** Displays multiple lines (for comparing three years) using the same internal coordinate system.
  
- **Grouped Bar Charts:**  
  - **DistrictComparisonChart:** Aggregates and compares dengue case counts by district for three selected years.
  
- **Pie Charts:**  
  - **DistrictDistributionChart:** Visualizes the percentage distribution of dengue cases among districts.  
    - Conditional logic is used to display labels only for slices meeting certain criteria (e.g., only showing percentages for slices below 5%).  
    - A vertical legend sorted in descending order of percentages is provided.

### 4.3 Map Visualizations

Two additional map components enhance spatial analysis:
- **Dengue Heatmap:** Renders a geographic heatmap indicating areas with high dengue incidence.
- **Customized Map:** Allows users to insert their data and visualize them using our system’s infrastructure and allow user to download that customized map.

### 4.4 Dashboard & Layout

The main dashboard page (`DengueInsightsScreen`) is built using React Bootstrap’s grid system:
- **Responsive Grid:** Uses `<Container fluid>`, `<Row>`, and `<Col>` components to structure the layout.
- **Row #1:**  
  - **Left Column (≈65% width):** Contains the `WeeklyComparisonContainer` component, displaying live comparison charts.
  - **Right Column (≈35% width):** Contains two stacked cards:
    - **Last Week Stats:** Displays total dengue cases and the district with the highest cases for the last week.
    - **Year-to-Year Comparison:** Shows the total dengue cases for the current year versus the previous year.
- **Row #2:**  
  - **Left Column (≈65% width):** Renders the `DistrictComparisonContainer` (grouped bar chart).
  - **Right Column (≈35% width):** Renders the `DistrictDistributionContainer` (pie chart).
    - **Row #3:**  
      - Dengue Heat Map component
    - **Row #4:**  
      - Customize Map component

### 4.5 Responsive Design Approach (Using React Bootstrap)

Rather than using Tailwind CSS, the system uses React Bootstrap:
- **Container:** `<Container fluid>` ensures that the content spans the full viewport width.
- **Row and Col Components:** `<Row>` and `<Col md={8}>` (approximately 65%) with `<Col md={4}>` (approximately 35%) create a consistent layout on medium and larger screens, while stacking vertically on smaller screens.
- **Inline Styles:** Specific component containers use inline styles (or Bootstrap classes) to set fixed heights when needed.

## 5. Challenges and Solutions

### 5.1 Responsive Layout Without Tailwind

- **Challenge:** Implementing a responsive dashboard layout using only React Bootstrap.
- **Solution:** Leveraged Bootstrap’s grid system (`Container`, `Row`, and `Col`) to create a two‑row, 65/35 split layout that adapts to different screen sizes.

### 5.2 Data Aggregation and Computation

- **Challenge:** Aggregating weekly dengue data to compute summary statistics (last week’s totals, highest reporting district, year-to-year comparisons).
- **Solution:** Utilized React hooks (`useEffect`, `useMemo`) to compute these statistics from the fetched data.

### 5.3 Integration of Multiple Visualization Types

- **Challenge:** Combining time-series charts, grouped bar charts, pie charts, and map visualizations in one dashboard.
- **Solution:** Modularized the frontend into reusable components for each visualization type and integrated them into the dashboard using Bootstrap’s responsive grid.

### 5.4 Map Visualizations

- **Challenge:** Implementing interactive map components for spatial analysis.
- **Solution:** Developed separate components for the Dengue Heatmap and Customized Map to provide interactive geographic visualizations.

## 6. Conclusion and Future Enhancements

The Dengue Data Visualization System effectively integrates backend data management with dynamic, interactive frontend visualizations in a responsive dashboard. Key features include:
- **Dynamic, interactive charts** built with D3.js.
- **Responsive dashboard layouts** using React Bootstrap.
- **Comprehensive data aggregation** using React hooks.
- **Advanced map visualizations** for spatial analysis.

### Future Enhancements

- **Real-Time Data Updates:** Implement WebSocket or polling mechanisms to display real-time data.
- **Advanced Analytics:** Incorporate predictive analytics and trend forecasting.
- **User Customization:** Expand filtering options and allow users to customize visualizations.
- **UI/UX Improvements:** Enhance the overall design and interactivity for an improved user experience.

---

# Dengue Feedback Submission and Hotspots Map Report

## 1. Overview

This section details two interrelated features of the Dengue Information System (DIS):

### Dengue Feedback Submission
- **Functionality:** Any user (logged in or not) can submit information about a potential dengue breeding site.
- **Process:**
  - The user interacts with a feedback form that includes an integrated Google Map.
  - The user selects a location on the map, provides a short description, and optionally uploads a photo.
  - **Mandatory fields:** Location selection and description.
- **Data Storage:** Submitted data is stored in a MongoDB collection named `Feedback`.

### Hotspots Map Display
- **Functionality:** Aggregates user-submitted feedback by district and visualizes it as a heatmap.
- **Visualization:**
  - Uses Leaflet along with the Leaflet heat plugin.
  - Highlights areas with a higher concentration of reported dengue breeding sites.
- **Purpose:** Helps to identify potential high-risk zones.

## 2. System Architecture and File Structure

### Backend

#### Model: `models/feedbackModel.js`
- **Purpose:** Defines the Feedback schema for MongoDB.
- **Key Fields:**
  - `user`: Stores the user ID or `"unknown_user"` if not logged in.
  - `location`: Contains latitude and longitude.
  - `district`: Derived from reverse geocoding.
  - `description`: The short description provided by the user.
  - `image`: File path or URL to the uploaded image.
  - `week`: The ISO week number (calculated automatically).

#### Controller: `controllers/feedbackController.js`
- **Responsibilities:**
  - Creating new feedback records (with input validation and error handling).
  - Retrieving feedback data (all records or filtered by specific week).
  - Deleting feedback records.

#### Routes: `routes/feedbackRoutes.js`
- **Function:** Defines API endpoints (e.g., `POST /api/feedback`, `GET /api/feedback`, etc.).

#### Middleware: `middleware/upload.js`
- **Function:** Handles file uploads (using Multer or a similar library).

### Frontend

#### 2.1. Feedback Submission

**Components:**

- `components/GoogleMapPicker.jsx`
  - **Function:** Integrates Google Maps to allow users to select a location.
  - **Operation:** Captures latitude and longitude on map clicks and sends the data back to its parent component.

**Screens:**

- `screens/FeedbackSubmissionScreen.jsx`
  - **Function:** Provides the submission form where users:
    - Pick a location using the `GoogleMapPicker` component.
    - Input a short description.
    - Optionally upload an image.
  - **Validation:** Ensures that required fields (location and description) are provided.
  - **Reverse Geocoding:** Utilizes the Google Maps Geocoding API to determine the district based on selected coordinates.

**API Slices:**

- `slices/feedbackApiSlice.js`
  - **Function:** Manages API calls related to feedback submission, ensuring communication between the frontend and backend.

#### 2.2. Hotspots Map Generation

**Components:**

- `components/FeedbackHotspotsMap.jsx`
  - **Function:** Uses React-Leaflet and the Leaflet heat plugin to generate a heatmap.
  - **Workflow:**
    - Retrieves feedback data for the current week via an API query.
    - Aggregates records by district.
    - Maps the aggregated data to geographic coordinates using a configuration file.
    - Displays a heatmap reflecting the intensity of dengue breeding site reports.

**Screens:**

- `screens/DengueInsightsScreen.jsx`
  - **Function:** Integrates and displays the `FeedbackHotspotsMap` component as part of a broader insights dashboard.

**API Slices:**

- `slices/feedbackApiSlice.js`
  - **Function:** Also handles fetching the feedback data necessary for generating the hotspots map.

## 3. Implementation Details

### Feedback Submission

#### Backend Workflow
- **Data Validation and Extraction:**
  - The backend controller validates inputs received from the client.
  - **Mandatory Fields:** Latitude, longitude, district, and description.
- **Week Calculation:**
  - A helper function calculates the current ISO week number based on the submission date.
- **User Identification:**
  - Uses the logged-in user’s ID or defaults to `"unknown_user"` for non-logged-in users.
- **Data Storage:**
  - Validated data is stored in the MongoDB `Feedback` collection.

#### Frontend Workflow
- **Location Selection:**
  - The `GoogleMapPicker` component renders an interactive map and captures coordinates when the user clicks.
- **Reverse Geocoding:**
  - Upon location selection, the Google Maps Geocoding API is called to extract the district.
- **Form Validation:**
  - The `FeedbackSubmissionScreen` checks that mandatory inputs are provided before creating a FormData object.
- **Data Submission:**
  - The form data, including any image file, is sent to the backend API via a Redux API slice.

### Hotspots Map Generation

#### Data Aggregation and Visualization
- **Data Retrieval:**
  - The `FeedbackHotspotsMap` component uses an API query (via `feedbackApiSlice.js`) to fetch current week feedback data.
- **Data Processing:**
  - Aggregates feedback records by district.
  - Each district’s feedback count is scaled (e.g., multiplied by 100) to represent heat intensity.
- **Map Rendering:**
  - A heatmap layer is created using React-Leaflet and the Leaflet heat plugin.
  - Districts with higher counts appear with increased heat intensity.
- **Display:**
  - The heatmap is rendered on a full-screen Leaflet map (centered on Colombo by default) and is integrated into the Dengue Insights page.

## 4. User Interaction

### For Feedback Submission
- **Access:**
  - The feedback submission feature is accessible from the header menu.
- **Interaction:**
  - Users select a location on the map, provide a description, and optionally upload an image.
- **Error Handling:**
  - If mandatory fields (location or description) are missing, an error message is displayed via toast notifications.
- **Data Security:**
  - Logged-in users have their user ID stored.
  - Submissions from non-logged-in users are recorded as `"unknown_user"`.

### For Hotspots Map
- **Dashboard Integration:**
  - The hotspots map is part of the insights dashboard, providing a visual overview of dengue risk areas.
- **Interactivity:**
  - Users can zoom and pan the map to view different districts.
  - The heat intensity correlates with the volume of user-submitted feedback.
- **Real-Time Updates:**
  - The system updates the map as new feedback is submitted, ensuring the visualization remains current.

## 5. Testing and Validation

### Backend Testing
- **Unit Tests:** Ensure that feedback creation, retrieval, and deletion function correctly.
- **Validation Tests:** Confirm that all mandatory fields are enforced and that appropriate error messages are returned.

### Frontend Testing
- **Component Tests:** Verify that components like `GoogleMapPicker` work correctly, triggering reverse geocoding on location selection.
- **Form Tests:** Ensure that the submission form blocks feedback submissions when mandatory inputs are missing.
- **Integration Tests:** Validate that the API slice properly handles feedback data submission and retrieval.

### Usability Testing
- **User Trials:** Initial user feedback has been used to refine the location selection process, error handling, and overall user experience.
- **Map Evaluation:** The hotspots map has been assessed for clarity and accuracy in representing dengue risk areas.

## 6. Conclusion

This report outlined the design and implementation of two key features in the Dengue Information System:

- **Feedback Submission:** Enables users to report dengue breeding sites through an interactive interface.
- **Hotspots Map:** Provides real-time visualization of high-risk areas by aggregating user feedback.


# Edit Weekly Dengue Data

- Only Dengue Cases can be edited by the admin, other field show as disabled input field, this will increase consistency of data.