import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, Layout, Menu, Dropdown } from 'antd';
import { FaBell, FaUserCircle } from 'react-icons/fa';
import { CgProfile } from "react-icons/cg";
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import LogoFpt from '../../assets/image/logofpt.png';
import TrainerConfirmation from '../../assets/image/trainerconfirmation.png';
import TraineeManagement from '../../assets/image/traineemanagement.png';
import TrainerManagement from '../../assets/image/TrainerManagement.png';
import Logwork from '../../assets/image/logwork.png';
import contentmanagement from '../../assets/image/contentmanagement.png';
import faqs from '../../assets/image/faqs.png';
// import ScheduleTracker from '../../assets/image/ScheduleTracker.png';
import Report from '../../assets/image/report.png';
import Setting from '../../assets/image/seting.png'
import Statistic from '../../assets/image/statistics.png';
import { CiLogout } from 'react-icons/ci';
import ModalNotification from '../Modal/ModalNotification/ModalNotification';
import { clearRole } from "../../features/role/roleSlice";
// import SubMenu from 'antd/es/menu/SubMenu';
const { SubMenu } = Menu;
const { Header, Sider } = Layout;

const Sidebar = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');
  const username = localStorage.getItem('username');
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

    localStorage.removeItem("role");
    localStorage.removeItem('username');
    localStorage.removeItem('token');
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
        key="profile"
        icon={<CgProfile style={{ fontSize: '1.6rem' }} />}
        onClick={() => navigate(`/${role}/profile`)}
      >
        Profile
      </Menu.Item>
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
  const menuItems = {
    CLASS_ADMIN: [
      {
        key: 'class-management',
        icon: <img src={TrainerConfirmation} width={25} alt="Class Management" />,
        label: 'Class Management',
        children: [
          { key: '/CLASS_ADMIN/class-management/class-list', label: 'Class List' },
          { key: '/CLASS_ADMIN/class-management/in-progress', label: 'In Progress Class' },
          { key: '/CLASS_ADMIN/class-management/checkpoint', label: 'Checkpoint' },
          { key: '/CLASS_ADMIN/class-management/tracker-admin', label: 'Schedule Tracker' },
        ],
      },
      {
        key: '/CLASS_ADMIN/trainer-list',
        icon: <img src={TrainerManagement} width={25} alt="" />,
        label: 'Trainer Management',
      },
      {
        key: 'trainee-management',
        icon: <img src={TraineeManagement} width={25} alt="Trainee Management" />,
        label: 'Trainee Management',
        children: [
          { key: '/CLASS_ADMIN/trainee-management/trainee-list', label: 'Trainee List' },
          { key: '/CLASS_ADMIN/trainee-management/trainee-feedback', label: 'Trainee Feedback' },
        ],
      },
      {
        key: '/CLASS_ADMIN/statistics',
        icon: <img src={Statistic} width={25} alt="ScheduleTracker" />,
        label: 'Statistics',
      },
      {
        key: 'log-work',
        icon: <img src={Logwork} width={25} alt="Log Work" />,
        label: 'Log Works',
        children: [
          { key: '/CLASS_ADMIN/logwork/my-effort', label: 'My Effort' },
          { key: '/CLASS_ADMIN/logwork/declare-efforts', label: 'Declare Efforts' },
          { key: '/CLASS_ADMIN/logwork/add-extension-efforts', label: 'Add Extension Efforts' },
          { key: '/CLASS_ADMIN/logwork/confirm-efforts', label: 'Confirm Efforts' },
        ],
      },
      {
        key: 'content-management',
        icon: <img src={contentmanagement} width={25} alt="Content Management" />,
        label: 'Content Management',
        children: [
          { key: '/CLASS_ADMIN/content-management/course-program', label: 'Training Course Program' },
          { key: '/CLASS_ADMIN/content-management/program', label: 'Training Program' },
          { key: '/CLASS_ADMIN/content-management/topic', label: 'Topic' },
        ],
      },
      {
        key: 'reports',
        icon: <img src={Report} width={25} alt="Reports" />,
        label: 'Reports',
        children: [{ key: '/CLASS_ADMIN/reports/export-data', label: 'Export Data' }],
      },
      {
        key: '/CLASS_ADMIN/faqs',
        icon: <img src={faqs} width={25} alt="FAQs" />,
        label: 'FAQs',
      },
    ],
    DELIVERY_MANAGER: [
      {
        key: '/DELIVERY_MANAGER/class-management',
        icon: <img src={TrainerConfirmation} width={25} alt="Class Management" />,
        label: 'Class Management',
      },
      {
        key: '/DELIVERY_MANAGER/trainer-list',
        icon: <img src={TrainerManagement} width={25} alt="" />,
        label: 'Trainer Management',
      },
      {
        key: 'trainee-management',
        icon: <img src={TraineeManagement} width={25} alt="Trainee Management" />,
        label: 'Trainee Management',
        children: [
          { key: '/DELIVERY_MANAGER/trainee-management/trainee-list', label: 'Trainee List' },
          { key: '/DELIVERY_MANAGER/trainee-management/feedback', label: 'Feedback' },
        ],
      },
      {
        key: '/DELIVERY_MANAGER/statistics',
        icon: <img src={Statistic} width={25} alt="ScheduleTracker" />,
        label: 'Statistics',
      },
      {
        key: '/DELIVERY_MANAGER/logwork',
        icon: <img src={Logwork} width={25} alt="Logwork" />,
        label: 'Log Work',
      },
      {
        key: '/DELIVERY_MANAGER/content-management',
        icon: <img src={contentmanagement} width={25} alt="Content Management" />,
        label: 'Content Management',
      },
      {
        key: '/DELIVERY_MANAGER/reports',
        icon: <img src={Report} alt="Report" width={25} />,
        label: 'Reports',
      },
      {
        key: 'settings',
        icon: <img src={Setting} width={25} alt="Settings" />,
        label: 'Settings',
        children: [
          { key: '/DELIVERY_MANAGER/settings/config-holiday', label: 'Config Holiday' },
          { key: '/DELIVERY_MANAGER/settings/config-slot-time', label: 'Config Slot Time' },
          { key: '/DELIVERY_MANAGER/settings/config-unit-price', label: 'Config Unit Price' },
          { key: '/DELIVERY_MANAGER/settings/config-checkpoint-deadline', label: 'Config Checkpoint Deadline' },
        ],
      },
      {
        key: '/DELIVERY_MANAGER/faqs',
        icon: <img src={faqs} width={25} alt="FAQs" />,
        label: 'FAQs',
      },
    ],
    TRAINER_MANAGER: [
      {
        key: 'class-management',
        icon: <img src={TrainerConfirmation} width={25} alt="Class Management" />,
        label: 'Class Management',
        children: [
          { key: '/TRAINER_MANAGER/class-management/class-list', label: 'Class List' },
          { key: '/TRAINER_MANAGER/class-management/in-progress', label: 'In Progress Class' },
          { key: '/TRAINER_MANAGER/class-management/checkpoint', label: 'Checkpoint' },
          { key: '/TRAINER_MANAGER/class-management/schedule-tracker', label: 'Schedule Tracker' },
        ],
      },
      {
        key: '/TRAINER_MANAGER/trainee-management',
        icon: <img src={TraineeManagement} width={25} alt="Trainee Management" />,
        label: 'Trainee Management',
      },
      {
        key: '/TRAINER_MANAGER/statistics',
        icon: <img src={Statistic} width={25} alt="ScheduleTracker" />,
        label: 'Statistics',
      },
      {
        key: 'log-work',
        icon: <img src={Logwork} width={25} alt="Log Work" />,
        label: 'Log Works',
        children: [
          { key: '/TRAINER_MANAGER/logwork/my-effort', label: 'My Effort' },
          { key: '/TRAINER_MANAGER/logwork/declare-efforts', label: 'Declare Efforts' },
          { key: '/TRAINER_MANAGER/logwork/add-extension-efforts', label: 'Add Extension Efforts' },
          { key: '/TRAINER_MANAGER/logwork/confirm-efforts', label: 'Confirm Efforts' },
        ],
      },
      {
        key: 'content-management',
        icon: <img src={contentmanagement} width={25} alt="Content Management" />,
        label: 'Content Management',
        children: [
          { key: '/TRAINER_MANAGER/content-management/course-program', label: 'Training Course Program' },
          { key: '/TRAINER_MANAGER/content-management/program', label: 'Training Program' },
          { key: '/TRAINER_MANAGER/content-management/topic', label: 'Topic' },
        ],
      },
      {
        key: '/TRAINER_MANAGER/faqs',
        icon: <img src={faqs} width={25} alt="FAQs" />,
        label: 'FAQs',
      },
    ],
    TRAINER: [
      {
        key: 'class-management',
        icon: <img src={TrainerConfirmation} width={25} alt="Class Management" />,
        label: 'Class Management',
        children: [
          { key: '/TRAINER/class-management/class-list', label: 'Class List' },
          { key: '/TRAINER/class-management/in-progress', label: 'In Progress Class' },
          { key: '/TRAINER/class-management/checkpoint', label: 'Checkpoint' },
          { key: '/TRAINER/class-management/schedule-tracker', label: 'Schedule Tracker' },
        ],
      },
      {
        key: '/TRAINER/trainee-management',
        icon: <img src={TraineeManagement} width={25} alt="Trainee Management" />,
        label: 'Trainee Management',
      },
      {
        key: 'log-work',
        icon: <img src={Logwork} width={25} alt="Log Work" />,
        label: 'Log Works',
        children: [
          { key: '/TRAINER/logwork/my-effort', label: 'My Effort' },
          { key: '/TRAINER/logwork/declare-efforts', label: 'Declare Efforts' },
          { key: '/TRAINER/logwork/add-extension-efforts', label: 'Add Extension Efforts' },
          { key: '/TRAINER/logwork/confirm-efforts', label: 'Confirm Efforts' },
        ],
      },
      {
        key: '/TRAINER/faqs',
        icon: <img src={faqs} width={25} alt="FAQs" />,
        label: 'FAQs',
      },
      {
        key: '/TRAINER/trainer-management',
        icon: <img src={TrainerManagement} width={25} alt="" />,
        label: 'Trainer Management',
      },
    ],
    FAMS_ADMIN: [
      {
        key: 'class-management',
        icon: <img src={TrainerConfirmation} width={25} alt="Class Management" />,
        label: 'Class Management',
      },
      {
        key: 'trainee-management',
        icon: <img src={TraineeManagement} width={25} alt="Trainee Management" />,
        label: 'Trainee Management',
      },
      {
        key: 'log-work',
        icon: <img src={Logwork} width={25} alt="Log Work" />,
        label: 'Log Works',
      },
      {
        key: 'FAMS-Settings',
        icon: <img src={Setting} width={25} alt="FAQs" />,
        label: 'FAMS-Settings',
      },
      {
        key: 'App-Code-config',
        icon: <img src={TrainerManagement} width={25} alt="" />,
        label: 'App Code Config',
      },
      {
        key: 'Email-template',
        icon: <img src={TrainerConfirmation} width={25} alt="Class Management" />,
        label: 'Email template',
      },
      {
        key: 'User-management',
        icon: <img src={TraineeManagement} width={25} alt="Trainee Management" />,
        label: 'User Management',
      },
      {
        key: 'Scheduler-management',
        icon: <img src={Logwork} width={25} alt="Log Work" />,
        label: 'Scheduler Management',
      },
      {
        key: 'Trainer-management',
        icon: <img src={TrainerManagement} width={25} alt="FAQs" />,
        label: 'Trainer Management',
      },
      {
        key: 'faqs',
        icon: <img src={faqs} width={25} alt="FAQs" />,
        label: 'FAQs',
      },
    ]
  };

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
            onClick={({ key }) => navigate(key)}
          >
            {(menuItems[role] || []).map((item) =>
              item.children ? (
                <SubMenu key={item.key} icon={item.icon} title={item.label}>
                  {item.children.map((subItem) => (
                    <Menu.Item key={subItem.key}>{subItem.label}</Menu.Item>
                  ))}
                </SubMenu>
              ) : (
                <Menu.Item key={item.key} icon={item.icon}>
                  {item.label}
                </Menu.Item>
              )
            )}
          </Menu>
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
