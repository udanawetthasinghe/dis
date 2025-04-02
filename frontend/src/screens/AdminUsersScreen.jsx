// Display user list for admin
import React from 'react';
import { useNavigate } from "react-router-dom";
import { LinkContainer } from 'react-router-bootstrap';
import { Container,Col,Row,Table, Button } from 'react-bootstrap';
import { FaTimes, FaTrash, FaEdit, FaCheck } from 'react-icons/fa';
import Message from '../components/Message';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import AdminSideMenu from '../components/AdminSideMenu';

import {
  useGetUsersQuery,
  useDeleteUserMutation,
  useUpdateUserDataMutation,
} from '../slices/usersApiSlice';

// import config file for USER CATEGORIES and USER STATES
import { userStateStr, userCatStr, formatDate } from '../config/config';



const AdminUsersScreen = () => {


  const { userInfo } = useSelector((state) => state.auth);
  // Use navigate hook to redirect to user list
  const navigate = useNavigate();


  // Get users
  const { data: users, error } = useGetUsersQuery();


// Activate user
const [updateUserState] = useUpdateUserDataMutation();

        // Activate handler
        const activateHandler = async id => {
          const userId=id
            try {
              const userState=1
              await updateUserState({userId, userState });
              toast.success('User account activated');
              navigate("/admin/users");
            } catch (err) {
              toast.error(err?.data?.message || err.error);
            }
          
        };

        
    // Delete user mutation
    const [deleteUser] = useDeleteUserMutation();

    // Delete handler
    const deleteHandler = async id => {

      const userToDelete = users.find(user => user._id === id); // Find the user to delete from 'users' array based on the ID
     
    // Check whether loged user has power to remove the selected account 
      if (userToDelete.userCat<=userInfo.userState) {
        toast.error('Cannot delete super or equal users');
        return;
      }

      if (window.confirm('Delete user..! Confirm?')) {
        try {
          await deleteUser(id);
          toast.success('User removed successfully');
          navigate("/admin/users");
        } catch (err) {
          toast.error(err?.data?.message || err.error);
        }
      }
    };
  
    const pendingUsers = users?.filter((user) => userStateStr(user.userState) === 'Pending');

  // Render users list
  return (
    <>
       <Container fluid className="mt-3">
          <Row>
            <Col md={2}>
              <AdminSideMenu />
            </Col>
            <Col md={10}>
              {/* Row with Dengue Dynamics and Latest Dengue Hotspot side by side */}
              <Row>
     <h1>Users</h1>
     <h4> Pending Users</h4>
      {error && <Message variant="danger">{error}</Message>}
      <Table striped hover responsive className="table-sm">
        <thead>
          <tr>
            <th>ID</th>
            <th>NAME</th>
            <th>EMAIL</th>
            <th>USER CATEGORY</th>
            <th>USER STATE</th>
            <th>CREATED AT</th>
            <th>ACTION</th>
          </tr>
        </thead>
        <tbody>
          {pendingUsers &&
            pendingUsers.map(users => (
              <tr key={users._id}>
                <td>{users._id}</td>
                <td>{users.name}</td>
                <td>
                  <a href={`mailto:${users.email}`}>{users.email}</a>
                </td>
                <td>{userCatStr(users.userCat)}</td>
                <td>
                  {userStateStr(users.userState)==='Pending' ? (
                    <>
                     <FaCheck style={{ color: 'blue' }} /> {userStateStr(users.userState)}
                    </>
                  ) :  userStateStr(users.userState)==='Active'  ? (
                    <>
                    <FaCheck style={{ color: 'green' }} /> {userStateStr(users.userState)}

                    </>
                  ) : (
                    <>
                    <FaTimes style={{ color: 'red' }} /> {userStateStr(users.userState)}

                    </>
                  )}
                </td>
                <td>{formatDate(users.createdAt)}</td>
                
                <td>
                <Button
                    variant="success"
                    className="btn-sm"
                    onClick={() => activateHandler(users._id)}
                  >
<i class="fa fa-check-circle-o">ACTIVATE</i>                  </Button>
                  <LinkContainer to={`/admin/user/${users._id}/edit`}>
                    <Button variant="light" className="btn-sm mx-2">
                      <FaEdit /> EDIT
                    </Button>
                  </LinkContainer>
                  <Button
                    variant="danger"
                    className="btn-sm"
                    onClick={() => deleteHandler(users._id)}
                  >
                    <FaTrash /> REMOVE
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>



      <h4> All Users</h4>
      {error && <Message variant="danger">{error}</Message>}
      <Table striped hover responsive className="table-sm">
        <thead>
          <tr>
            <th>ID</th>
            <th>NAME</th>
            <th>EMAIL</th>
            <th>USER CATEGORY</th>
            <th>USER STATE</th>
            <th>CREATED AT</th>
            <th>ACTION</th>
          </tr>
        </thead>
        <tbody>
          {users &&
            users.map(users => (
              <tr key={users._id}>
                <td>{users._id}</td>
                <td>{users.name}</td>
                <td>
                  <a href={`mailto:${users.email}`}>{users.email}</a>
                </td>
                <td>{userCatStr(users.userCat)}</td>
                <td>
                  {userStateStr(users.userState)==='Pending' ? (
                    <>
                     <FaCheck style={{ color: 'blue' }} /> {userStateStr(users.userState)}
                    </>
                  ) :  userStateStr(users.userState)==='Active'  ? (
                    <>
                    <FaCheck style={{ color: 'green' }} /> {userStateStr(users.userState)}

                    </>
                  ) : (
                    <>
                    <FaTimes style={{ color: 'red' }} /> {userStateStr(users.userState)}

                    </>
                  )}
                </td>
                <td>{formatDate(users.createdAt)}</td>
                
                <td> 

                  <LinkContainer to={`/admin/user/${users._id}/edit`}>
                    <Button variant="light" className="btn-sm mx-2">
                      <FaEdit /> EDIT
                    </Button>
                  </LinkContainer>
                  <Button
                    variant="danger"
                    className="btn-sm"
                    onClick={() => deleteHandler(users._id)}
                  >
                    <FaTrash /> REMOVE
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>

      </Row>
      </Col>
      </Row>
      </Container>
    </>
  );
};

export default AdminUsersScreen;

