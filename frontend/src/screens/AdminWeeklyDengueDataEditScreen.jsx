import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import { toast } from "react-toastify";
import { 
  useUpdateWeeklyDngCasesMutation, 
  useGetWeeklyDngCaseDetailsQuery 
} from "../slices/weeklyDngDataApiSlice"; 
import { districts, getDistrictIdByName } from "../config/config";

const AdminWeeklyDengueDataEditScreen = () => {
  // Get record id from URL
  const { id } = useParams();
  const navigate = useNavigate();

  // State variables for record fields
  const [year, setYear] = useState("");
  const [week, setWeek] = useState("");
  const [districtName, setDistrictName] = useState("");
  const [dengueCases, setDengueCases] = useState("");

  // Fetch the existing record details using its id
  const { data: existingData, isLoading, error } = useGetWeeklyDngCaseDetailsQuery(id);

  // RTK Query Mutation Hook for updating weekly data
  const [updateWeeklyDngCases, { isLoading: isUpdating }] = useUpdateWeeklyDngCasesMutation();

  // Populate form fields when existingData is loaded
  useEffect(() => {
    if (existingData) {
      setYear(existingData.year.toString());
      setWeek(existingData.week.toString());
      // Assuming that existingData has districtName; if only districtId is provided,
      // you might need to derive the name from the districts mapping.
      setDistrictName(districts[existingData.districtId]);
      setDengueCases(existingData.dengueCases.toString());
    }
  }, [existingData]);

  // Simple input validation function
  const validateInputs = () => {
    let errorMessage = "";
    const currentYear = new Date().getFullYear();
    if (!year || isNaN(year)) {
      errorMessage += "Year must be a valid number. ";
    }
    if (Number(year) > currentYear) {
      errorMessage += "Please do not enter future data. ";
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

  // Submit handler to update the record
  const submitHandler = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    // Convert district name to district ID
    const districtId = getDistrictIdByName(districtName);
    if (!districtId) {
      toast.error("Invalid district name selected.");
      return;
    }

    // Construct updated data object
    const updatedData = {
      dngCaseId: id, // used in API slice update request
      year: Number(year),
      week: Number(week),
      districtId,
      dengueCases: Number(dengueCases),
    };

    try {
      await updateWeeklyDngCases(updatedData).unwrap();
      toast.success("Weekly dengue data updated successfully");
      navigate("/admin/weeklyDengueData");
    } catch (error) {
      toast.error(error.data?.message || error.error || "Error updating data");
    }
  };

  return (
    <>
      <Link to="/admin/weeklyDengueData" className="btn btn-light my-3">
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit Weekly Dengue Data</h1>
        {isLoading ? (
          <p>Loading data...</p>
        ) : error ? (
          <p>Error loading data: {error.message}</p>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="year" className="my-3">
              <Form.Label>Year</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                disabled 
                required
              />
            </Form.Group>
            <Form.Group controlId="week" className="my-3">
              <Form.Label>Week (1 - 52)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter week number"
                value={week}
                onChange={(e) => setWeek(e.target.value)}
                disabled 
                required
              />
            </Form.Group>
            <Form.Group controlId="districtName" className="my-3">
              <Form.Label>District</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter district name"
                value={districtName}
                onChange={(e) => setDistrictName(e.target.value)}
                disabled 
                required
              />
            </Form.Group>
            <Form.Group controlId="dengueCases" className="my-3">
              <Form.Label>Dengue Cases</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter dengue cases"
                value={dengueCases}
                onChange={(e) => setDengueCases(e.target.value)}
                required
              />
            </Form.Group>
            <Button type="submit" variant="primary" className="my-2" disabled={isUpdating}>
              {isUpdating ? "Updating..." : "Update Data"}
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default AdminWeeklyDengueDataEditScreen;
