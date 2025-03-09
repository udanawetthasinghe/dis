import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import { toast } from 'react-toastify';
import { useCreateDngCasesMutation } from '../slices/dngDataApiSlice';

const AdminDengueDataAddScreen = () => {

  
        // Mapping of month names to numbers
        const monthNameToNumber = {
          January: '01',
          February: '02',
          March: '03',
          April: '04',
          May: '05',
          June: '06',
          July: '07',
          August: '08',
          September: '09',
          October: '10',
          November: '11',
          December: '12',
        };
      
        const monthNumberToName = {
          '01': 'January',
          '02': 'February',
          '03': 'March',
          '04': 'April',
          '05': 'May',
          '06': 'June',
          '07': 'July',
          '08': 'August',
          '09': 'September',
          '10': 'October',
          '11': 'November',
          '12': 'December',
        };
    
  // Function to get the current month in YYYY-MM format
  const getCurrentMonth = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based in JS
    return `${year}-${month}`;
  };
  console.log(getCurrentMonth())

// State variables
const [monthAndYear, setMonth] = useState(getCurrentMonth());
const [districtId, setDistrictId] = useState('');
const [dengueCases, setDengueCases] = useState('');
const [rainfall, setRainfall] = useState('');
const [errors, setErrors] = useState({});


// Update product
const [addDngCase] = useCreateDngCasesMutation();

// Redirect to product list
const navigate = useNavigate();

// Update state of the variables when product data changes
useEffect(() => {
  if (addDngCase) {


    setMonth(getCurrentMonth());
    setDistrictId(addDngCase.districtId);
    setDengueCases(addDngCase.dengueCases);
    setRainfall(addDngCase.rainfall);

  }
}, [addDngCase]);



// Validation function
const validateInputs = () => {

  console.log("test")
  let inputErrors = {};

  let errorSttring='';

  if (isNaN(dengueCases) || dengueCases === '') {
    inputErrors.dengueCases = 'Dengue cases must be a number';
    errorSttring= `${inputErrors.dengueCases}`;
  }
  if (isNaN(rainfall) || rainfall === '') {
    inputErrors.rainfall = 'Rainfall must be a number';
    errorSttring =`${errorSttring} ${inputErrors.rainfall}`;
  }
if(errorSttring){

  toast.error(errorSttring)

}
  //setErrors(inputErrors);
 return Object.keys(inputErrors).length === 0;
};



// Submit handler
const submitHandler = async event => {
  event.preventDefault();
  // Validate inputs
  if (!validateInputs()) {
    return;
  }
      // Split the value into year and month
//console.log(year)
  const [yearString, monthNumber] = monthAndYear.split('-');
  const year=parseInt(yearString)


      // Convert month number to month name

  const month=monthNumberToName[monthNumber];  // month=monthName


  // get the updated dengue cases from the form
  const addedDngCase = { 
    year,
    month,
    districtId,
    dengueCases,
    rainfall,
  };
  // Add Dengue

    const result = await addDngCase(addedDngCase);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Dengue case added');
      navigate(`/admin/dengueData`);
    }


};

// Render product edit form
return (
  <>
    <Link to="/admin/dengueData" className="btn btn-light my-3">
      Go Back
    </Link>
    <FormContainer>
      <h1>Add Dengue Case</h1>
      {/* {error && <Message variant="danger">{error}</Message>} */}
      <Form onSubmit={submitHandler}>


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
            placeholder="Enter district id"
            value={districtId}
            onChange={event => setDistrictId(event.target.value)}
            required
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="dengueCases" className="my-3">
          <Form.Label>Dengue Cases</Form.Label>
          <Form.Control
            type="dengueCases"
            placeholder="Enter Dengue Cases"
            value={dengueCases}
            onChange={event => setDengueCases(event.target.value)}
            required
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="rainfall" className="my-3">
          <Form.Label>Rainfall</Form.Label>
          <Form.Control
            type="rainfall"
            placeholder="Enter rainfall"
            value={rainfall}
            onChange={event => setRainfall(event.target.value)}
            required
          ></Form.Control>
        </Form.Group>

        
        <Button type="submit" variant="primary" className="my-2">
          Add Dengue Data
        </Button>
      </Form>
    </FormContainer>
  </>
);


};

export default AdminDengueDataAddScreen;