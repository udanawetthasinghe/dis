// AdminSideMenu.js
import React from "react";
import { Nav, Navbar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const ResearcherSideMenu = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
      <Nav className="flex-column mt-3">
        <Nav.Item>
          <Nav className="flex-column ms-3">
          <LinkContainer to="/profile">
          <Nav.Link>User Profile</Nav.Link>
            </LinkContainer>

          </Nav>
        </Nav.Item>
        <Nav.Item>
          <Nav className="flex-column ms-3">
            <LinkContainer to="/admin/weeklyDengueData">
              <Nav.Link>All Dengue Data</Nav.Link>
            </LinkContainer>
          </Nav>
        </Nav.Item>
        {/* NEW: Customize Graphs */}
        <Nav.Item>
          <Nav className="flex-column ms-3">
            <LinkContainer to="/admin/usergraphs/create">
              <Nav.Link>Graph Manager</Nav.Link>
            </LinkContainer>
          </Nav>
        </Nav.Item>


        <Nav.Item>
          <Nav className="flex-column ms-3">
            <LinkContainer to="/admin/feedback">
              <Nav.Link>My Feedbacks</Nav.Link>
            </LinkContainer>
            
          </Nav>
        </Nav.Item>


      </Nav>
    </Navbar>
  );
};

export default ResearcherSideMenu;
