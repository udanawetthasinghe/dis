import React from 'react';
import { Card } from 'react-bootstrap';
import { singleLineGraphSample, multiLineGraphSample, categoricalScatterGraphSample } from '../config/sampleGraphData';

const AdminGraphSamples = () => {
  return (
    <div>
      <Card className="mb-3">
        <Card.Header>Single Line Graph</Card.Header>
        <Card.Body>
          <pre>{JSON.stringify(singleLineGraphSample, null, 2)}</pre>
        </Card.Body>
      </Card>
      <Card className="mb-3">
        <Card.Header>Multi Line Graph</Card.Header>
        <Card.Body>
          <pre>{JSON.stringify(multiLineGraphSample, null, 2)}</pre>
        </Card.Body>
      </Card>
      <Card className="mb-3">
        <Card.Header>Categorical Scatter Plot</Card.Header>
        <Card.Body>
          <pre>{JSON.stringify(categoricalScatterGraphSample, null, 2)}</pre>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AdminGraphSamples;
