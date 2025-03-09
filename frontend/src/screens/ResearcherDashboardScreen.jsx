

import { Table, Button, Row, Col } from 'react-bootstrap';

import { LinkContainer } from 'react-router-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import {Link, useParams } from 'react-router-dom';
import Message from '../components/Message';
import { toast } from 'react-toastify';
import { districts, getDistrictIdByName, getDistrictNameById } from '../config/config';





import { useGetDngDataQuery, useGetDngCaseDetailsQuery, useDeleteDngCasesMutation } from '../slices/dngDataApiSlice';



const ResearcherDashboardScreen = () => {


  ////***  If directed to this page from dng case edit page: this page will display that updated case also */
 
 
  const { id: dngCaseId } = useParams();

  if(dngCaseId){
    const {data: dngCase } = useGetDngCaseDetailsQuery(dngCaseId);
 
  }
  // Get Updated dengue case details


/////*********************   End first part */
    // Get dengue data
    const { data: dngData,error,refetch} = useGetDngDataQuery({});
  
   
    // Create delete mutation
    const [deleteDengueCase] = useDeleteDngCasesMutation();

    // Delete handler
    const deleteHandler = async id => {
      if (window.confirm('Do you need to delete this data! Confirm?')) {
        try {
          await deleteDengueCase(id);
          toast.success('Dengue case deleted successfully');
          refetch();
        } catch (err) {
          toast.error(err?.data?.message || err.error);
        }
      }
    };

    const downloadJson = () => {
        const json = JSON.stringify(dngData, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'dengue_cases.json';
        a.click();
        URL.revokeObjectURL(url);
      };
    


    // Render dengue data
    return (
      <>


{dngCaseId ? (
<>
<Col>
            <h1>Dengue Data</h1>
          </Col>
</>
        
                
              ):(<></>) }
              
        <Row className="align-items-center">
          <Col>
            <h1>Dengue Data</h1>
          </Col>
          <Col className="text-end">
         
          </Col>
        </Row>

        <Row className="align-items-center">
          <Col>
   
          </Col>
          <Col className="text-end">
          <Button onClick={downloadJson} className="mt-3">
        Download JSON
      </Button>
          </Col>

        </Row>
        
        <Table striped hover responsive className="table-sm">
          <thead>
            <tr>
          
              <th>YEAR</th>
              <th>MONTH</th>
              <th>DISTRICT ID</th>
              <th>DENGUE CASES</th>
              <th>RAINFALL</th>
              
            </tr>
          </thead>
          <tbody>
            {dngData &&
              dngData.map(dngData => (
                <tr key={dngData._id}>

                  <td>{dngData.year}</td>
                  <td>{dngData.month}</td>
                  <td>{getDistrictNameById(dngData.districtId)}</td>
                  <td>{dngData.dengueCases}</td>
                  <td>{dngData.rainfall}</td>
                </tr>
              ))}
          </tbody>
        </Table>

      </>
    );
  };
  
  export default ResearcherDashboardScreen;