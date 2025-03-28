import React from 'react';

const ResponsiveChartWrapper = ({ children}) => {
  return (
    <div style={{ width: '100%', textAlign: 'left' }}>
      {children}
    </div>
  );
};

export default ResponsiveChartWrapper;
