import React from 'react';
import { FaBars, FaBell, FaUserCircle } from 'react-icons/fa'; // for icons

const TopBar = () => {
  return (
    <div className="w-full bg-gray-100 p-2">
      <nav className="flex justify-between items-center px-4">
        {/* Left: Menu Icon */}
        <div className="flex items-center space-x-2">
          <FaBars className="text-xl text-gray-700 cursor-pointer" />
        </div>

        {/* Right: Welcome Text and Icons */}
        <div className="flex items-center space-x-4">
          <span className="text-gray-700">Welcome to User</span>
          <FaUserCircle className="text-2xl text-gray-700 cursor-pointer" />
          <FaBell className="text-xl text-red-500 cursor-pointer" />
        </div>
      </nav>
    </div>
  );
};

export default TopBar;
