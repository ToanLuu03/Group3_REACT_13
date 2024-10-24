import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, Layout, Menu, Dropdown } from 'antd';
import { FaBell, FaUserCircle } from 'react-icons/fa';
import { MdManageAccounts } from 'react-icons/md';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import LogoFpt from '../../assets/image/logofpt.png';
import TrainerConfirmation from '../../assets/image/trainerconfirmation.png';
import TraineeManagement from '../../assets/image/traineemanagement.png';
import Logwork from '../../assets/image/logwork.png';
import contentmanagement from '../../assets/image/contentmanagement.png';
import faqs from '../../assets/image/faqs.png';
import ScheduleTracker from '../../assets/image/ScheduleTracker.png';
import { CiLogout } from 'react-icons/ci';
import ModalNotification from '../Modal/ModalNotification/ModalNotification';
import { clearRole } from "../../features/role/roleSlice";
const { Header, Sider } = Layout;

const Sidebar = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const role = useSelector((state) => state.role.selectedRole.role);
  const username = useSelector((state) => state.users.users.userName.username);
  const dispatch = useDispatch();
  // State to manage Dropdown visibility
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  // Handle responsive behavior
  const handleResize = () => {
    if (window.innerWidth <= 768) {
      setCollapsed(true); // Collapse sidebar on small screens
    } else {
      setCollapsed(false); // Expand sidebar on larger screens
    }
  };
  const handleLogout = () => {
    // Clear the role in Redux store
    dispatch(clearRole());
    // Clear the role from local storage
    localStorage.removeItem('token');
    localStorage.removeItem("trainerAccount");
    localStorage.removeItem('username');

    // Navigate back to RolePage
    navigate("/");
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Dropdown menu for user
  const userMenu = (
    <Menu>
      <Menu.Item
        key="logout"
        icon={<CiLogout style={{ fontSize: '1.6rem' }} />}
        onClick={handleLogout}
        className='text-red-400'
      >
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <div>
      <Layout>
        {/* Sidebar - always takes full height of the screen */}
        <Sider
          trigger={null}
          collapsible
          collapsedWidth={0}
          collapsed={collapsed}
          width={250}
          className={`h-full fixed top-0 left-0 z-50 transition-all duration-300 
            ${collapsed ? 'w-0' : 'w-[250px]'}`}
          style={{ zIndex: 1000 }}
        >
          <div className="">
            <img src={LogoFpt} alt="FPT Logo" className="w-full" />
          </div>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['1']}
            onClick={({ key }) => navigate(key)}
            items={[
              {
                key: `/${role}/trainer-confirmation`,
                icon: <img src={TrainerConfirmation} width={25} alt="TrainerConfirmation" />,
                label: 'Trainer Confirmation',
              },
              {
                key: `/${role}/trainee-management`,
                icon: <img src={TraineeManagement} width={25} alt="TraineeManagement" />,
                label: 'Trainee Management',
              },
              role === 'TRAINER' && {
                key: `/${role}/trainer-management`,
                icon: <MdManageAccounts style={{ fontSize: '1.6rem' }} />,
                label: 'Trainer Management',
              },
              role === 'ADMIN' && {
                key: `/${role}/trainer-list`,
                icon: <MdManageAccounts style={{ fontSize: '1.6rem' }} />,
                label: 'Trainer Management',
              },
              role === 'ADMIN' && {
                key: `/${role}/tracker-admin`,
                icon: <img src={ScheduleTracker} width={25} alt="ScheduleTracker" />,
                label: 'Schedule Tracker',
              },
              {
                key: `/${role}/logwork`,
                icon: <img src={Logwork} width={25} alt="Logwork" />,
                label: 'Log Work',
              },
              {
                key: `/${role}/content-management`,
                icon: <img src={contentmanagement} width={25} alt="contentmanagement" />,
                label: 'Content Management',
              },
              {
                key: `/${role}/faqs`,
                icon: <img src={faqs} width={25} alt="faqs" />,
                label: 'FAQs',
              },
            ].filter(Boolean)}
          />
        </Sider>

        {/* Main layout content */}
        <Layout className={`transition-all duration-300 ${collapsed ? 'ml-0' : 'ml-[50px]'} h-screen`}>
          <Header
            className={`fixed top-0 z-50 flex justify-between items-center px-4 transition-all duration-300 
              ${collapsed ? 'left-0 w-full' : 'left-[250px] w-[calc(100%-250px)]'} 
              bg-antBgContainer shadow-md`}
          >
            <Button
              type="text"
              icon={collapsed ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="text-lg w-16 h-16 flex items-center space-x-2"
            />

            {/* Responsive header section */}
            <div className="flex items-center space-x-4 ml-auto pr-3">
              {/* Display username only on larger screens */}
              <span className="text-gray-700 hidden sm:block">{`Welcome ${username}`}</span>

              <FaBell
                onClick={() => setIsNotificationOpen(true)}
                className="text-xl text-red-500 cursor-pointer" />

              {/* Dropdown for user menu */}
              <Dropdown
                overlay={userMenu}
                trigger={['click']}
                visible={dropdownVisible}
                onVisibleChange={(flag) => setDropdownVisible(flag)}
              >
                <FaUserCircle className="text-2xl text-gray-700 cursor-pointer" />
              </Dropdown>
            </div>
            {isNotificationOpen && (
              <ModalNotification
                isOpen={isNotificationOpen}
                onClose={() => setIsNotificationOpen(false)}
              />
            )}
          </Header>

          {/* The rest of your page content would go here */}
        </Layout>
      </Layout>
    </div>
  );
};

export default Sidebar;
