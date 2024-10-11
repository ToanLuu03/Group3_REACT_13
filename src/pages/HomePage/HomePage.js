
import React from 'react';
import { useDispatch } from 'react-redux';
import { clearRole } from '../../features/role/roleSlice'; // Import the clearRole action
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { PATH_NAME } from '../../constants/pathName';
const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the role in Redux store
    dispatch(clearRole());

    // Clear the role from local storage
    localStorage.removeItem("selectedRole");

    // Navigate back to RolePage
    navigate(PATH_NAME.ROLE);
  };
  return (
    <div>
      <div>
        <h1>Home Page!</h1>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default HomePage;
