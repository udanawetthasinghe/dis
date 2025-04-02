import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import { toast } from 'react-toastify';
import { useGetWeeklyDngCaseDetailsQuery, useUpdateWeeklyDngCasesMutation } from '../slices/weeklyDngDataApiSlice';
import { districts } from '../config/config';
const AdminDengueEditScreen = () => {

  
       
    

        
// Get dengue case id from url
const { id: dngCaseId } = useParams();

// State variables
const [year, setYear] = useState("");
const [week, setWeek] = useState("");
const [districtName, setDistrictName] = useState(""); // user sees the name
const [dengueCases, setDengueCases] = useState("");

// ====== District Search States ======
const [searchTerm, setSearchTerm] = useState("");
const [showDropdown, setShowDropdown] = useState(false);


// Get dengue data details
const { data: dngCase, error } = useGetWeeklyDngCaseDetailsQuery(dngCaseId);

// Update product
const [updateDngCase] = useUpdateWeeklyDngCasesMutation();

// Redirect to dengue data list
const navigate = useNavigate();

// Update state of the variables when product data changes
useEffect(() => {
  if (dngCase) {


// Combine year and month into YYYY-MM format
const formattedMonth = `${dngCase.year}-${monthNumber}`;

    //setYear(dngCase.year);
    setMonth(formattedMonth);
    setDistrictId(dngCase.districtId);
    setDengueCases(dngCase.dengueCases);
    setRainfall(dngCase.rainfall);
  }
}, [dngCase]);

// Submit handler
const submitHandler = async event => {
  event.preventDefault();

      // Split the value into year and month
//console.log(year)
  const [yearString, monthNumber] = monthAndYear.split('-');
  const year=parseInt(yearString)


      // Convert month number to month name

  const month=monthNumberToName[monthNumber];  // month=monthName


  // get the updated dengue cases from the form
  const updatedDngCase = { 
    dngCaseId,
    year,
    month,
    districtId,
    dengueCases,
    rainfall,
  };
  // Update product
  const result = await updateDngCase(updatedDngCase);
  if (result.error) {
    toast.error(result.error);
  } else {
    toast.success('Dengue case updated');
    navigate(`/admin/dengueData/${dngCaseId}`);
  }
};

// Render product edit form
return (
  <>
    <Link to="/admin/dengueData" className="btn btn-light my-3">
      Go Back
    </Link>
    <FormContainer>
      <h1>Edit Dengue Cases</h1>
      {/* {error && <Message variant="danger">{error}</Message>} */}
      <Form onSubmit={submitHandler}>
        {/* <Form.Group controlId="year" className="my-3">
          <Form.Label>Year</Form.Label>
          <Form.Control
            type="year"
            placeholder="Enter year"
            value={year}
            onChange={event => setYear(event.target.value)}
          ></Form.Control>
        </Form.Group> */}

        <Form.Group controlId="monthAndYear" className="my-3">
          <Form.Label>Month and Year</Form.Label>
          <Form.Control
            type="month"
            placeholder="Enter month and year"
            value={monthAndYear}
            onChange={event => setMonth(event.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="districtId" className="my-3">
          <Form.Label>District Id</Form.Label>
          <Form.Control
            type="districtId"
            placeholder="Enter stock district id"
            value={districtId}
            onChange={event => setDistrictId(event.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="dengueCases" className="my-3">
          <Form.Label>Dengue Cases</Form.Label>
          <Form.Control
            type="dengueCases"
            placeholder="Enter Dengue Cases"
            value={dengueCases}
            onChange={event => setDengueCases(event.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="rainfall" className="my-3">
          <Form.Label>Rainfall</Form.Label>
          <Form.Control
            type="rainfall"
            placeholder="Enter rainfall"
            value={rainfall}
            onChange={event => setRainfall(event.target.value)}
          ></Form.Control>
        </Form.Group>

        
        <Button type="submit" variant="primary" className="my-2">
          Update
        </Button>
      </Form>
    </FormContainer>
  </>
);


};

export default AdminDengueEditScreen;