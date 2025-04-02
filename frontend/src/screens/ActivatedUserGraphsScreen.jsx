import React from 'react';
import { Container, Card } from 'react-bootstrap';
import { useGetUserGraphsQuery } from '../slices/userGraphsApiSlice';
import GraphRenderer from '../components/GraphRenderer';

const ActivatedUserGraphsScreen = () => {
  const { data: userGraphs, isLoading, error } = useGetUserGraphsQuery();

  // Filter for only those graphs with state=3 (Activated)
  const activatedGraphs = userGraphs ? userGraphs.filter((ug) => ug.state === 3) : [];

  return (
    <Container fluid className="mt-3">
      <h2>Research Findings</h2>
      {isLoading && <p>Loading activated graphs...</p>}
      {error && <p>Error: {error.message}</p>}

      {activatedGraphs.length === 0 ? (
        <p>No activated graphs available.</p>
      ) : (
        activatedGraphs.map((graphRecord) => (
          <Card key={graphRecord._id} className="mb-4">
            <Card.Body>
              {/* 
                1) Chart Container: 
                   - Use overflowX if the chart is wider than the container.
                   - You can adjust width/height to your preference. 
              */}
              <div style={{ width: '100%', overflowX: 'auto' }}>
                <div style={{ width: '1000px', margin: '0 auto' }}>
                  <GraphRenderer
                    graphType={graphRecord.graphId?.graphType}
                    apiRoute={graphRecord.apiRoute}
                    width={1000}
                    height={500}
                  />
                </div>
              </div>

              {/* 
                2) Display Graph Title, Description, and User 
                   - Moved under the chart 
              */}
              <div className="mt-3">
                <h5>{graphRecord.graphTitle}</h5>
                <p>{graphRecord.description}</p>
                <p>Uploaded by: {graphRecord.userId?.name || 'Unknown User'}</p>
              </div>
            </Card.Body>
          </Card>
        ))
      )}
    </Container>
  );
};

export default ActivatedUserGraphsScreen;
