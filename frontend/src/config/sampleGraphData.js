// sampleGraphData.js

export const singleLineGraphSample = {
    title: "Dengue Cases Over Time",
    xAxisLabel: "Year-Week",
    yAxisLabel: "Cases",
    apiRoute: "/samples/singleLineGraph.json",

    data: [
      { year: 2018, week: 1, value: 0.02 },
      { year: 2018, week: 2, value: 0.05 },
      { year: 2018, week: 3, value: 0.09 },
    ],
  };
  


  export const multiLineGraphSample = {
    title: "Expected vs. Real Dengue Cases",
    xAxisLabel: "Year-Week",
    yAxisLabel: "Cases",
    apiRoute: "/samples/multiLineGraph.json",

    legend: {
      data1: "Expected Cases",
      data2: "Real Cases",
    },
    data: [
      { year: 2018, week: 1, data1: 10, data2: 12 },
      { year: 2018, week: 2, data1: 14, data2: 16 },
      { year: 2018, week: 3, data1: 20, data2: 18 },
    ],
  };
  
  export const categoricalScatterGraphSample = {
    title: "Dengue Risk by Week",
    xAxisLabel: "Year-Week",
    yAxisLabel: "Dengue Cases",
    categoryKey: "riskLevel",
    apiRoute: "/samples/categoricalScatterGraph.json",

    categoryColors: {
      low: "green",
      medium: "orange",
      high: "red",
    },
    data: [
      { year: 2018, week: 1, data1: 5, riskLevel: "low" },
      { year: 2018, week: 2, data1: 12, riskLevel: "medium" },
      { year: 2018, week: 3, data1: 20, riskLevel: "high" },
    ],
  };
  
  export const singleLineGraphSampleNew = 
  {
    "data": [
      {
        "Value": 1,
        "Week": 1,
        "Year": 2013
      },
      {
        "Value": 2,
        "Week": 2,
        "Year": 2013
      },
      
      {
        "Value": 6,
        "Week": 6,
        "Year": 2013
      },
      {
        "Value": 7,
        "Week": 7,
        "Year": 2013
      },
      {
        "Value": 8,
        "Week": 8,
        "Year": 2013
      },
      {
        "Value": 9,
        "Week": 9,
        "Year": 2013
      },
      {
        "Value": 10,
        "Week": 10,
        "Year": 2013
      },
      {
        "Value": 11,
        "Week": 11,
        "Year": 2013
      },
      {
        "Value": 12,
        "Week": 12,
        "Year": 2013
      },
      {
        "Value": 13,
        "Week": 13,
        "Year": 2013
      },
      {
        "Value": 14,
        "Week": 14,
        "Year": 2013
      },
      {
        "Value": 15,
        "Week": 15,
        "Year": 2013
      },
     
      {
        "Value": 33,
        "Week": 33,
        "Year": 2013
      },
      {
        "Value": 34,
        "Week": 34,
        "Year": 2013
      },
      {
        "Value": 35,
        "Week": 35,
        "Year": 2013
      },
      {
        "Value": 36,
        "Week": 36,
        "Year": 2013
      },
      {
        "Value": 37,
        "Week": 37,
        "Year": 2013
      },
      {
        "Value": 38,
        "Week": 38,
        "Year": 2013
      },
      {
        "Value": 39,
        "Week": 39,
        "Year": 2013
      },
      {
        "Value": 40,
        "Week": 40,
        "Year": 2013
      },
      {
        "Value": 41,
        "Week": 41,
        "Year": 2013
      },
      {
        "Value": 42,
        "Week": 42,
        "Year": 2013
      },
      {
        "Value": 43,
        "Week": 43,
        "Year": 2013
      },
      {
        "Value": 44,
        "Week": 44,
        "Year": 2013
      },
      {
        "Value": 45,
        "Week": 45,
        "Year": 2013
      },
      {
        "Value": 46,
        "Week": 46,
        "Year": 2013
      },
      {
        "Value": 47,
        "Week": 47,
        "Year": 2013
      },
      {
        "Value": 48,
        "Week": 48,
        "Year": 2013
      },
      {
        "Value": 49,
        "Week": 49,
        "Year": 2013
      },
      {
        "Value": 50,
        "Week": 50,
        "Year": 2013
      },
      {
        "Value": 51,
        "Week": 51,
        "Year": 2013
      },
      {
        "Value": 52,
        "Week": 52,
        "Year": 2013
      },
      {
        "Value": 1,
        "Week": 1,
        "Year": 2014
      },
      {
        "Value": 2,
        "Week": 2,
        "Year": 2014
      },
      {
        "Value": 3,
        "Week": 3,
        "Year": 2014
      },
      {
        "Value": 28,
        "Week": 28,
        "Year": 2014
      },
      {
        "Value": 29,
        "Week": 29,
        "Year": 2014
      },
      {
        "Value": 30,
        "Week": 30,
        "Year": 2014
      },
      {
        "Value": 31,
        "Week": 31,
        "Year": 2014
      },
      {
        "Value": 32,
        "Week": 32,
        "Year": 2014
      },
      {
        "Value": 33,
        "Week": 33,
        "Year": 2014
      },
      {
        "Value": 34,
        "Week": 34,
        "Year": 2014
      },
      {
        "Value": 35,
        "Week": 35,
        "Year": 2014
      },
      {
        "Value": 36,
        "Week": 36,
        "Year": 2014
      },
      {
        "Value": 37,
        "Week": 37,
        "Year": 2014
      },
      
      {
        "Value": 18,
        "Week": 18,
        "Year": 2015
      },
      {
        "Value": 19,
        "Week": 19,
        "Year": 2015
      },
      {
        "Value": 20,
        "Week": 20,
        "Year": 2015
      },
      {
        "Value": 21,
        "Week": 21,
        "Year": 2015
      },
      {
        "Value": 22,
        "Week": 22,
        "Year": 2015
      },
      {
        "Value": 23,
        "Week": 23,
        "Year": 2015
      },
      {
        "Value": 24,
        "Week": 24,
        "Year": 2015
      },
      {
        "Value": 25,
        "Week": 25,
        "Year": 2015
      },
      {
        "Value": 26,
        "Week": 26,
        "Year": 2015
      },
      {
        "Value": 27,
        "Week": 27,
        "Year": 2015
      },
      {
        "Value": 28,
        "Week": 28,
        "Year": 2015
      },
      {
        "Value": 29,
        "Week": 29,
        "Year": 2015
      },
      {
        "Value": 30,
        "Week": 30,
        "Year": 2015
      },
      {
        "Value": 31,
        "Week": 31,
        "Year": 2015
      },
      {
        "Value": 32,
        "Week": 32,
        "Year": 2015
      },
      {
        "Value": 33,
        "Week": 33,
        "Year": 2015
      },
      {
        "Value": 34,
        "Week": 34,
        "Year": 2015
      },
      {
        "Value": 35,
        "Week": 35,
        "Year": 2015
      },
      {
        "Value": 36,
        "Week": 36,
        "Year": 2015
      },
      {
        "Value": 37,
        "Week": 37,
        "Year": 2015
      },
      {
        "Value": 38,
        "Week": 38,
        "Year": 2015
      },
      {
        "Value": 39,
        "Week": 39,
        "Year": 2015
      },
      {
        "Value": 40,
        "Week": 40,
        "Year": 2015
      },
      {
        "Value": 41,
        "Week": 41,
        "Year": 2015
      },
      {
        "Value": 42,
        "Week": 42,
        "Year": 2015
      }
    ],
    "title": "Dengue Risk in Colombo District during 2013 to 2018",
    "xAxisLabel": "Year-Week",
    "yAxisLabel": "Dengue Risk",
    "apiRoute": "/samples/singleLineGraphNew.json",

  };