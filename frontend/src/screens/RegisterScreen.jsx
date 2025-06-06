import { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useRegisterMutation } from '../slices/usersApiSlice';
import { toast } from 'react-toastify';
import { userCatNo,userStateNo } from '../config/config';
import logo from '../assets/fullLogo.png';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userCategory, setUserCategory] = useState('General User');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

  const { userInfo } = useSelector((state) => state.auth);



  useEffect(() => {
    if (userInfo) {
   navigate('/');

    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error(
        <div data-testid="errorPopup">Passwords do not match</div>
      );
    } else {
      try {
        const userCat = userCatNo(userCategory);

        const res = await register({ name, email, password, userCat}).unwrap();
       // dispatch(setCredentials({ ...res }));
       toast.success(
        <div data-testid="successPopup">
        Welcome {res.name}, Account created successfully - Please login here
      </div>
      );
       navigate('/login');

      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };
  return (
    <FormContainer>
    <Container style={{ width: 'auto',alignContent:'center'}}>
    <img
                src={logo}
                alt="dis"
                style={{ width: '200px', height: '150px', alignItems:'center' }}
              />
      </Container> 
      <h1>Register</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className='my-2' controlId='name'>
          <Form.Label>Name</Form.Label>
          <Form.Control
            data-testid="name"
            type='name'
            placeholder='Enter name'
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className='my-2' controlId='email'>
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            data-testid="email"
            type='email'
            placeholder='Enter email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className='my-2' controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            data-testid="password"
            type='password'
            placeholder='Enter password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group className='my-2' controlId='confirmPassword'>
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            data-testid="confirmPassword"
            type='password'
            placeholder='Confirm password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group data-testid="userCategory" className='my-2' controlId='userCategory'>
          <Form.Label>User Category</Form.Label>
          <div>
            <Form.Check
              type='radio'
              label='Researcher (Please use academic email for the registration)'
              name='userCategory'
              variant="success"

              value='Researcher'
              checked={userCategory === 'Researcher'}
              onChange={(e) => setUserCategory(e.target.value)}
            />
            <Form.Check
              type='radio'
              label='General User'
              variant="success"

              name='userCategory'
              value='General User'
              checked={userCategory ==='General User'}
              onChange={(e) => setUserCategory(e.target.value)}
            />
          </div>
        </Form.Group>

        
        <Button data-testid="registerBtn" type='submit' variant='success' className='mt-3'>
          Register
        </Button>

        {isLoading && <Loader />}
      </Form>

      <Row className='py-3'>
        <Col>
          Already have an account? <Link to={`/login`}>Login</Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default RegisterScreen;
