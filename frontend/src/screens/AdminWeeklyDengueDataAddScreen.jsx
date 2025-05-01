import { useState, useEffect, useRef  } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col, Card, CardBody } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import { toast } from "react-toastify";
import { useCreateWeeklyDngCasesMutation } from "../slices/weeklyDngDataApiSlice"; 
import { districts, getDistrictIdByName } from "../config/config";
import AdminSideMenu from "../components/AdminSideMenu";



const AdminWeeklyDengueDataAddScreen = () => {
  // ====== Single Entry States ======
  const [year, setYear] = useState("");
  const [week, setWeek] = useState("");
  const [districtName, setDistrictName] = useState(""); // user sees the name
  const [dengueCases, setDengueCases] = useState("");

  // ====== District Search States ======
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // ====== Multiple Entry State (for JSON file upload) ======
  const [fileData, setFileData] = useState(null);

  const navigate = useNavigate();

  // RTK Query Mutation Hook for creating weekly data
  const [createWeeklyDngCases, { isLoading }] = useCreateWeeklyDngCasesMutation();

// Reference for clicking outside the dropdown
const dropdownRef = useRef(null);

  useEffect(() => {
    // Optionally set default year/week or any other defaults
    const currentYear = new Date().getFullYear();
    setYear(currentYear.toString());
    setWeek("1"); // default to week 1



    // Event listener to detect clicks outside the dropdown
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };

  }, []);

   // Convert districts object to an array of just the district names
  // e.g. ["Colombo", "Gampaha", "Kalutara", ...]
  const districtNames = Object.values(districts);

  // ====== Filtered Districts based on searchTerm ======
  const filteredDistricts = districtNames.filter((d) =>
    d.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ====== Single Entry Form Validation ======
  const validateInputs = () => {
    let errorMessage = "";
    const currentYear = new Date().getFullYear();
    if (!year || isNaN(year)) {
      errorMessage += "Year must be a valid number. ";
    }

    if (year>currentYear) {
      errorMessage += "Please don't try to add future data";
    }


    
    if (!week || isNaN(week)) {
      errorMessage += "Week must be a valid number. ";
    }
    if (!districtName) {
      errorMessage += "District name is required. ";
    }
    if (!dengueCases || isNaN(dengueCases)) {
      errorMessage += "Dengue cases must be a valid number. ";
    }
    if (errorMessage) {
      toast.error(errorMessage);
      return false;
    }
    return true;
  };

  // ====== Single Entry Submit Handler ======
  const submitHandler = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    // Convert district name to district ID
    const districtId = getDistrictIdByName(districtName);
    if (!districtId) {
      toast.error("Invalid district name selected.");
      return;
    }

    // Construct data object
    const weeklyData = {
      year: Number(year),
      week: Number(week),
      districtId,
      dengueCases: Number(dengueCases),
    };

    try {
      const res = await createWeeklyDngCases([weeklyData]).unwrap(); 
      // .unwrap() to get actual response or error

      toast.success("Weekly dengue data added successfully");
      navigate("/admin/weeklyDengueData"); 
      // Adjust path to wherever your weekly data list is displayed
    } catch (error) {
      toast.error(error.data?.message || error.error || "Error adding data");
    }
  };

  // ====== Multiple Entry: JSON File Upload Handler ======
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const json = JSON.parse(evt.target.result);
        setFileData(json); // store the parsed JSON array/object in state
      } catch (error) {
        toast.error("Invalid JSON file format");
      }
    };
    reader.readAsText(file);
  };


// Validate each record from the JSON file upload
const validateRecord = (record, index) => {
  let errorMessage = "";
  if (!record.year || isNaN(record.year)) {
    errorMessage += `Record ${index + 1}: Year must be a valid number. `;
  }
  if (!record.week || isNaN(record.week)) {
    errorMessage += `Record ${index + 1}: Week must be a valid number. `;
  }
  if (!record.district || !record.district.trim()) {
    errorMessage += `Record ${index + 1}: District is required. `;
  }
  if (record.dengueCases === undefined || isNaN(record.dengueCases)) {
    errorMessage += `Record ${index + 1}: Dengue cases must be a valid number. `;
  }
  return errorMessage;
};




  const uploadJsonHandler = async () => {
    if (!fileData) {
      toast.error("Please select a valid JSON file first");
      return;
    }

    // fileData should be an array of objects, each with: { year, week, districtName, dengueCases }
    // Convert districtName to districtId for each record
    let records = Array.isArray(fileData) ? fileData : [fileData];

    // Validate each record before proceeding
    for (let i = 0; i < records.length; i++) {
      const validationError = validateRecord(records[i], i);
      if (validationError) {
        toast.error(validationError);
        return;
      }
    }


    // Convert district (name) to districtId for each record

    records = records.map((item) => {
        const distId = getDistrictIdByName(item.district);
        if (!distId) {
          toast.error("Please add valid district names");
          return;
        }
    
      return {
        year: Number(item.year),
        week: Number(item.week),
        districtId: distId || "unknown",
        dengueCases: Number(item.dengueCases),
      };
    });

    try {
      const res = await createWeeklyDngCases(records).unwrap(); 
      const msg = await toast.success("Multiple weekly dengue data records added successfully");
      navigate("/admin/weeklyDengueData");
    } catch (error) {
      toast.error(error.data?.message || error.error || "Error adding data");
    }
  };

 // ====== Handlers for Live Search Dropdown ======
 const handleSearchTermChange = (e) => {
  setSearchTerm(e.target.value);
  setDistrictName(e.target.value);
  setShowDropdown(true); 
};

const handleSelectDistrict = (dist) => {
  setDistrictName(dist);
  setSearchTerm(dist);
  setShowDropdown(false);
};
  return (
    <>
<Row>
        <Col md={2}>
          <AdminSideMenu />
        </Col>

<Col md={10}>




      

<Row>

<h1>Insert Weekly Dengue Data</h1>
<br/><br/><br/>
</Row>

<Row>



        <Col md={5}>
        <Card>
        <CardBody>
                  <h2>Add Single Weekly Dengue Data</h2>
        <Form onSubmit={submitHandler}>
          {/* YEAR */}
          <Form.Group controlId="year" className="my-3">
            <Form.Label>Year</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              required
            />
          </Form.Group>

          {/* WEEK */}
          <Form.Group controlId="week" className="my-3">
            <Form.Label>Week (1 - 52)</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter week number"
              value={week}
              onChange={(e) => setWeek(e.target.value)}
              required
            />
          </Form.Group>

          {/* DISTRICT NAME with Realtime Search */}
          <Form.Group controlId="districtName" className="my-3" ref={dropdownRef}>
            <Form.Label>District</Form.Label>
            <Form.Control
              type="text"
              placeholder="Search district..."
              value={districtName}
              onChange={handleSearchTermChange}
              required
            />
            {showDropdown && filteredDistricts.length > 0 && (
              <div
                style={{
                  border: "1px solid #ccc",
                  backgroundColor: "#fff",
                  position: "absolute",
                  zIndex: 999,
                  width: "100%",
                  maxHeight: "200px",
                  overflowY: "auto",
                }}
              >
                {filteredDistricts.map((dist) => (
                  <div
                    key={dist}
                    style={{
                      padding: "8px",
                      cursor: "pointer",
                      borderBottom: "1px solid #f1f1f1",
                    }}
                    onClick={() => handleSelectDistrict(dist)}
                  >
                    {dist}
                  </div>
                ))}
              </div>
            )}
          </Form.Group>

          {/* DENGUE CASES */}
          <Form.Group controlId="dengueCases" className="my-3">
            <Form.Label>Dengue Cases</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter Dengue Cases"
              value={dengueCases}
              onChange={(e) => setDengueCases(e.target.value)}
              required
            />
          </Form.Group>

          {/* SUBMIT BUTTON */}
          <Button
            type="submit"
            variant="success"
            className="my-2"
            disabled={isLoading}
          >
            Add Weekly Dengue Data
          </Button>
        </Form>
        </CardBody>
        
      </Card></Col>
      <Col md={5}>

      <Card>
        <CardBody>
        <h2>Upload Multiple Weekly Dengue Data (JSON)</h2>
            <Form.Group controlId="jsonFile" className="my-3">
              <Form.Label>Select JSON File</Form.Label>
              <Form.Control type="file" accept=".json" onChange={handleFileChange} />
            </Form.Group>
            <Button
              type="button"
              variant="success"
              className="my-2"
              onClick={uploadJsonHandler}
              disabled={isLoading}
            >
              Upload JSON
            </Button>

        </CardBody>
        
      </Card>
      </Col>
      </Row>

      </Col>
      </Row>
    </>
  );
};

export default AdminWeeklyDengueDataAddScreen;
