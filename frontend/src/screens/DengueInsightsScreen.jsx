import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card,Form } from 'react-bootstrap';
import WeeklyComparisonContainer from '../components/visualization/WeeklyComparisonContainer';
import DistrictComparisonContainer from '../components/visualization/DistrictComparisonContainer';
import DistrictDistributionContainer from '../components/visualization/DistrictDistributionContainer';
import DistrictMap from '../components/DistrictMap';
import CustomizeMap from '../components/CustomizeMap';
import FeedbackHotspotsMap from '../components/FeedbackHotspotsMap';
import { useGetYearsQuery, useGetWeeklyByYearQuery } from '../slices/weeklyDngDataApiSlice';
import { districts } from '../config/config';

function DengueInsightsScreen() {
  // Assume we have a year selector; default to the first available year
  const { data: years = [], isLoading: loadingYears, error: errorYears } = useGetYearsQuery();
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    if (years && years.length) {
      setYear(years[0]);
    }
  }, [years]);

  // Fetch weekly data for the selected year (current year)
  const { data: weeklyData = [], isLoading: loadingWeekly, error: errorWeekly } = useGetWeeklyByYearQuery(year);

  // Compute Last Week Stats from weeklyData
  const lastWeekNumber = weeklyData.length ? Math.max(...weeklyData.map(rec => rec.week)) : 0;
  const lastWeekData = weeklyData.filter(rec => rec.week === lastWeekNumber);
  const lastWeekTotal = lastWeekData.reduce((sum, rec) => sum + rec.dengueCases, 0);
  const highestDistrictRecord = lastWeekData.reduce((max, rec) => rec.dengueCases > (max?.dengueCases || 0) ? rec : max, null);
  const highestDistrict = highestDistrictRecord ? highestDistrictRecord.districtId : 'N/A';

  // Compute Year-to-Year Totals
  const currentYearTotal = weeklyData.reduce((sum, rec) => sum + rec.dengueCases, 0);
  const lastYear = year - 1;
  const { data: lastYearData = [] } = useGetWeeklyByYearQuery(lastYear);
  const lastYearTotal = lastYearData.reduce((sum, rec) => sum + rec.dengueCases, 0);

  // Handle loading/errors
  if (loadingYears || loadingWeekly) {
    return <div className="p-4">Loading data...</div>;
  }
  if (errorYears || errorWeekly) {
    return <div className="p-4 text-danger">Error loading data.</div>;
  }


  return (
    <Container fluid className="mt-3">
      {/* Row #1 */}
      <Row>
        {/* Left column = 65% => md=8 (since 8/12 ~ 66%) */}
        <Col md={7}>
          {/* Insert your WeeklyComparisonContainer here */}
          <WeeklyComparisonContainer />
        </Col>

        {/* Right column = 35% => md=4 */}
        <Col md={5}>
          {/* Two stacked boxes */}
          <h2>Important Numbers</h2>
<br />
          <Form.Group controlId="yearSelect" className="mb-4">
            <Form.Label><strong>Select Year</strong></Form.Label>
            <Form.Control
              as="select"
              value={year}
              style={{ width: '25rem' }}

              onChange={e => setYear(Number(e.target.value))}
            >
              {years.map(y => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Card
          bg={"Danger".toLowerCase()}
          key="Danger"
          text={"Danger".toLowerCase() === 'light' ? 'dark' : 'white'}
          style={{ width: '25rem' }}
          className="mb-2"
        >
                    <Card.Header>Last Week of {year} Stats (week {lastWeekNumber})</Card.Header>

            <Card.Body>
            <Card.Title></Card.Title>

              <p>Total Dengue Cases:  <strong>{lastWeekTotal}</strong></p>
              <p>Highest District: <strong>{districts[highestDistrict]}</strong></p>
            </Card.Body>
</Card>
<br/>
<Card
          bg={"Dark".toLowerCase()}
          key="Dark"
          text={"Dark".toLowerCase() === 'light' ? 'dark' : 'white'}
          style={{ width: '25rem' }}
          className="mb-2"
        >
                    <Card.Header>Year-to-Year Comparison</Card.Header>
                    
                                <Card.Body>
  
              <p>Year {year} Total: <strong>{currentYearTotal}</strong></p>
              <p>Previous Year( {lastYear}) Total: <strong>{lastYearTotal}</strong></p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Spacing between rows */}
      <hr />

      {/* Row #2 District comparison with barchart and distribution among districts piechart*/}
      <Row>
        {/* Left column = 65% => md=8 */}
        <Col md={7}>
          <DistrictComparisonContainer />
        </Col>

        {/* Right column = 35% => md=4 */}
        <Col md={5}>
          <DistrictDistributionContainer />
        </Col>
      </Row>



      {/* Spacing between rows */}
      <hr />

 {/* Row #3 with Dengue Heatmap Component */}
 <Row>
 <Col md={7}>
 <Card className="mb-3">
                <Card.Body>
                <div>
      <h2>Dengue Heatmap</h2>
      <DistrictMap />
    </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={5}>

                  <h2>Latest Dengue Hotspot</h2>
                  <FeedbackHotspotsMap />
    
            </Col>
          </Row>





                {/* Row with Customize Dengue Heatmap Component */}
                <Row>
        <Col>
              <Card className="mb-3">
                <Card.Body>
                <div>
      <h2>Customize Dengue Heatmap</h2>
      <CustomizeMap/>
    </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>








    </Container>
  );
}

export default DengueInsightsScreen;
