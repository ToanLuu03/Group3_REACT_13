import React, { useState } from 'react'
import { Outlet } from 'react-router-dom';
import Sidebar from '../../../components/sidebar/Sidebar';

const TrainerLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main Content Area with dynamic margin */}
      <div
        className={`transition-all duration-300 ${
          collapsed ? "ml-0" : "ml-[250px]"
        } flex-grow p-4 overflow-auto`}
      >
        {/* Outlet renders the child route components */}
        <Outlet context={{ collapsed }}/>
      </div>
    </div>
  );
}

export default TrainerLayout