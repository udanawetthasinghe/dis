/////**  Common Variables  */

// Define constants
export const BASE_URL = "";
export const DNGDATA_URL = "/api/dngData";
export const USERS_URL = "/api/users";
export const userStateNoToName = {
  0: "Pending",
  1: "Active",
  2: "Reject",
};

export const userCatNoToName = {
  1: "Super Admin",
  2: "Admin",
  3: "Researcher",
  4: "General User",
};


export const districts = {
  'All Island':'All Island',
  'LK-11': 'Colombo',
  'LK-12': 'Gampaha',
  'LK-13': 'Kalutara',
  'LK-21': 'Kandy',
  'LK-22': 'Matale',
  'LK-23': 'Nuwaraeliya',
  'LK-31': 'Galle',
  'LK-33': 'Hambantota',
  'LK-32': 'Matara',
  'LK-41': 'Jaffna',
  'LK-42': 'Kilinochchi',
  'LK-43': 'Mannar',
  'LK-44': 'Vavuniya',
  'LK-45': 'Mullaitivu',
  'LK-51': 'Batticaloa',
  'LK-52': 'Ampara',
  'LK-53': 'Trincomalee',
  'LK-61': 'Kurunegala',
  'LK-62': 'Puttalam',
  'LK-71': 'Anuradhapura',
  'LK-72': 'Polonnaruwa',
  'LK-81': 'Badulla',
  'LK-82': 'Moneragala',
  'LK-91': 'Rathnapura',
  'LK-92': 'Kegalle'
};


//****************   This arrangement for the google map hot-pots indication */
export const dengueData = [
  { district: "Colombo", lat: 6.9271, lng: 79.8612, cases: 500 },
  { district: "Gampaha", lat: 7.0913, lng: 79.9994, cases: 300 },
  { district: "Kalutara", lat: 6.5854, lng: 79.9607, cases: 150 },
  { district: "Kandy", lat: 7.2906, lng: 80.6337, cases: 120 },
  { district: "Matale", lat: 7.4671, lng: 80.6234, cases: 80 },
  { district: "N Eliya", lat: 6.9497, lng: 80.7891, cases: 60 },
  { district: "Galle", lat: 6.0535, lng: 80.2200, cases: 180 },
  { district: "Hambantota", lat: 6.1241, lng: 81.1185, cases: 90 },
  { district: "Matara", lat: 5.9549, lng: 80.5540, cases: 110 },
  { district: "Jaffna", lat: 9.6615, lng: 80.0255, cases: 70 },
  { district: "Kilinochchi", lat: 9.3803, lng: 80.3847, cases: 50 },
  { district: "Mannar", lat: 8.9779, lng: 79.9052, cases: 40 },
  { district: "Vavuniya", lat: 8.7514, lng: 80.4979, cases: 30 },
  { district: "Mulativu", lat: 9.2674, lng: 80.8148, cases: 20 },
  { district: "Batticaloa", lat: 7.7102, lng: 81.6924, cases: 90 },
  { district: "Ampara", lat: 7.2964, lng: 81.6747, cases: 50 },
  { district: "Trincomalee", lat: 8.5874, lng: 81.2152, cases: 70 },
  { district: "Kurunegala", lat: 7.4863, lng: 80.3647, cases: 130 },
  { district: "Puttalam", lat: 8.0322, lng: 79.8570, cases: 60 },
  { district: "Apura", lat: 8.3450, lng: 80.4109, cases: 40 },
  { district: "Polonnaruwa", lat: 7.9397, lng: 81.0014, cases: 70 },
  { district: "Badulla", lat: 6.9896, lng: 81.0556, cases: 50 },
  { district: "Moneragala", lat: 6.8719, lng: 81.3483, cases: 40 },
  { district: "Ratnapura", lat: 6.6828, lng: 80.3990, cases: 100 },
  { district: "Kegalle", lat: 7.2535, lng: 80.3464, cases: 80 },
];


/////**  Common Functions  */
// Convert standard timestamp format to user readable format
export const formatDate = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleString();
};

// Convert user state number to state name

export const userStateStr = (userStateNo) => {
  return userStateNoToName[userStateNo]; // month=monthName
};


// Convert user category name to category number

export const userStateNo = (value) => {
  for (const [key, val] of Object.entries(userStateNoToName)) {
    if (val === value) {
      return parseInt(key, 10); // Convert the key to an integer before returning
    }
  }
  return null; // Return null if the value is not found
};


// Convert user category number to category name

export const userCatStr = (userCatNo) => {
  return userCatNoToName[userCatNo]; // month=monthName
};

// Convert user category name to category number

export const userCatNo = (value) => {
  for (const [key, val] of Object.entries(userCatNoToName)) {
    if (val === value) {
      return parseInt(key, 10); // Convert the key to an integer before returning
    }
  }
  return null; // Return null if the value is not found
};



//District related operations

// Get District id by name
export const getDistrictIdByName = (name) => {
  for (const [id, districtName] of Object.entries(districts)) {
    if (districtName.toLowerCase() === name.toLowerCase()) {
      return id;
    }
  }
  return null; // Return null if not found
};


// Get District Name by id
export const getDistrictNameById = (id) => {
  return districts[id] || null; // Return null if not found
};

// Example usage
console.log(getDistrictIdByName('Colombo')); // Output: LK-11
console.log(getDistrictNameById('LK-11'));   // Output: Colombo