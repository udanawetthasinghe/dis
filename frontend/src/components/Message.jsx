// Custom message handler component
import React from 'react';
import { Alert } from 'react-bootstrap';

const Message = ({ variant, children }) => {
  // variant is if its success message is green if its warning then message is red, etc..
  // children is content of the message
  return <Alert variant={variant}>{children}</Alert>;
};

Message.defaultProps = {
  variant: 'info',
};

export default Message;
