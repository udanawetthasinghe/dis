// import { Navbar, Nav, Container, NavDropdown, Badge } from 'react-bootstrap';
import { Navbar, Nav, Container, NavDropdown, Row, Col } from "react-bootstrap";
import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import { LinkContainer } from "react-router-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../slices/usersApiSlice";
import { logout } from "../slices/authSlice";
import logo from "../assets/logo.png";
//import LogoSVG from "./LogoSVG";

const Header = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>
              <img
                src={logo}
                alt="dis"
                style={{ width: '80px', height: 'auto', marginRight: '30px' }}
              />Dengue Information System
               
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
            <LinkContainer to="/">
                <Nav.Link> Home</Nav.Link>
              </LinkContainer>
            <LinkContainer to="/dengue-insights">
                <Nav.Link> Insights</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/activated-user-graphs">
                <Nav.Link> Forecasts</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/feedback">
                <Nav.Link> Feedback</Nav.Link>
              </LinkContainer>
              {userInfo ? (
                <>
                  <NavDropdown
                    data-testid="userNameDropDown"
                    title={userInfo.name}
                    id="username"
                  >
                    <LinkContainer to="/profile">
                      <NavDropdown.Item>Profile</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Item onClick={logoutHandler}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                  {userInfo.userCat === 1 && (
                    <LinkContainer to="/admin/dashboard">
                      <Nav.Link>Admin</Nav.Link>
                    </LinkContainer>
                  )}
                  {userInfo.userCat === 3 && (
                    <LinkContainer to="/researcher/dashboard">
                      <Nav.Link>Researcher</Nav.Link>
                    </LinkContainer>
                  )}

                  {userInfo.userCat === 4 && (
                    <LinkContainer to="/feedback">
                      <Nav.Link>Feedback</Nav.Link>
                    </LinkContainer>
                  )}
                </>
              ) : (
                <>
                  <LinkContainer to="/login">
                    <Nav.Link data-testid="signInBtn">
                      <FaSignInAlt /> Sign In
                    </Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/register">
                    <Nav.Link data-testid="signUpBtn">
                      <FaSignOutAlt /> Sign Up
                    </Nav.Link>
                  </LinkContainer>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
