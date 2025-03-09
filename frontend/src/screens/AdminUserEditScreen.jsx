// Display user edit screen for admin
import React from 'react';
import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import Message from '../components/Message';
import { toast } from 'react-toastify';
import FormContainer from '../components/FormContainer';
import {
  useGetUserDataQuery,
  useUpdateUserDataMutation,
} from '../slices/usersApiSlice';

// import config file for USER CATEGORIES and USER STATES
import { userStateStr, userCatStr, formatDate, userStateNo, userCatNo } from '../config/config';

const AdminUserEditScreen = () => {

    
// Get dengue case id from url
const { id: userId } = useParams();

  // State variables
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cat, setUserCat] = useState();
  const [state, setUserState] = useState();



// Get user details
const { data: user, error,refetch } = useGetUserDataQuery(userId);

// Update user
const [updateUserDetails] = useUpdateUserDataMutation(userId);

  // Use navigate hook to redirect to user list
  const navigate = useNavigate();

// Update state of the variables when user data changes
useEffect(() => {
    if (user) {
        setName(user.name);
        setEmail(user.email);
        setUserCat(userCatStr(user.userCat));
        setUserState(userStateStr(user.userState));

      }
    }, [user]);


// Submit handler
const submitHandler = async event => {
  event.preventDefault();

  try {
    console.log(state)
    const userState=userStateNo(state)
    console.log(userState)

    const userCat = userCatNo(cat)
   await updateUserDetails({userId, name, email,userCat,userState });
   //toast.success(`${name}, ${email}, ${userCatNo(userCat)},${userStateNo(userState)}`);
   console.log(userId, name, email,userCat,userState )

   toast.success('User updated successfully');
    refetch();
    navigate(`/admin/user/${userId}`);

  } catch (err) {
    toast.error(err?.data?.message || err.error);
  }
};

// Render product edit form
return (
  <>
    <Link to="/admin/users" className="btn btn-light my-3">
      Go Back
    </Link>
    <FormContainer>
        <h1>Edit User</h1>
        {error && <Message variant="danger">{error}</Message>}
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="name" className="my-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="name"
              placeholder="Enter name"
              value={name}
              onChange={event => setName(event.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="email" className="my-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={event => setEmail(event.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="cat" className="my-3">
          <Form.Label>User Category</Form.Label>
          <Form.Select
            value={cat}
            onChange={(event) => setUserCat(event.target.value)}
            required
          >
            <option value="Super Admin">Super Admin</option>
            <option value="Admin">Admin</option>
            <option value="Researcher">Researcher</option>
            <option value="General User">General User</option>
          </Form.Select>
        </Form.Group>

        <Form.Group controlId="state" className="my-3">
          <Form.Label>User State</Form.Label>
          <Form.Select
            value={state}
            onChange={(event) => setUserState(event.target.value)}
            required
          >
            <option value="Pending">Pending</option>
            <option value="Active">Active</option>
            <option value="Reject">Reject</option>
          </Form.Select>
        </Form.Group>

          <Button type="submit" variant="primary" className="my-2">
            Update
          </Button>
        </Form>
      </FormContainer>
  </>
);


};

export default AdminUserEditScreen;