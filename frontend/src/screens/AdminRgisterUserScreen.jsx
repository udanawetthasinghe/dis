// Display user edit screen for admin
import React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import Message from "../components/Message";
import { toast } from "react-toastify";
import FormContainer from "../components/FormContainer";
import { useRegisterUserByAdminMutation } from "../slices/usersApiSlice";

// import config file for USER CATEGORIES and USER STATES
import { userStateNo, userCatNo } from "../config/config";

const AdminRegisterUserScreen = () => {
  // State variables
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cat, setUserCat] = useState();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [state, setUserState] = useState();

  // Add the new user
  const [register] = useRegisterUserByAdminMutation();

  // Use navigate hook to redirect to user list
  const navigate = useNavigate();

  // Submit handler
  const submitHandler = async (event) => {
    event.preventDefault();

    try {
      const userState = userStateNo(state);
      const userCat = userCatNo(cat);
      await register({ name, email, password, userCat, userState });

      toast.success("User created successfully");
      navigate("/admin/users");
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
        <h1>Create a new user</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="name" className="my-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="name"
              placeholder="Enter name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="email" className="my-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group className="my-2" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="cat" className="my-3">
            <Form.Label>User Category</Form.Label>
            <Form.Select
              value={cat}
              onChange={(event) => setUserCat(event.target.value)}
              required
            >
              <option value="General User">General User</option>
              <option value="Researcher">Researcher</option>
              <option value="Admin">Admin</option>
              <option value="Super Admin">Super Admin</option>
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
            Create
          </Button>
        </Form>
      </FormContainer>
    </>
  );
};

export default AdminRegisterUserScreen;
