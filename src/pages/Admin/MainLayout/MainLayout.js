import React, { useState} from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../../components/sidebar/Sidebar';
const MainLayout = () => {
  // const [collapsed, setCollapsed] = useState(false);
  // const [selectedKey, setSelectedKey] = useState('1');
  // const [username, setUsername] = useState('');
  // const sidebarRef = useRef(null);
  // const dispatch = useDispatch();
  // const navigate = useNavigate();
  // const selectMenuItem = (key) => {
  //   setSelectedKey(key);
  // };
  // useEffect(() => {
  //   const username = localStorage.getItem('username');
  //   setUsername(username || '');
  // }, []);
  // const wrapIcon = (icon) => React.cloneElement(icon, { style: { width: 24, height: 24, marginRight: '15px' } });
  // const handleLogout = () => {
  //   // Clear the role in Redux store
  //   dispatch(clearRole());

  //   // Clear the role from local storage
  //   localStorage.removeItem("selectedRole");
  //   localStorage.removeItem('username');
  //   localStorage.removeItem('token');
  //   // Navigate back to RolePage
  //   navigate("/");
  // };
  // // Tạo menu cho avatar
  // const avatarMenu = (
  //   <Menu>
  //     <Menu.Item key="profile">
  //       <Button>Profile</Button>
  //     </Menu.Item>
  //     <Menu.Item onClick={handleLogout} key="logout">
  //       <Button>Logout</Button>
  //     </Menu.Item>
  //   </Menu>
  // );
  // const handleResize = () => {
  //   if (window.innerWidth <= 1024) {
  //     setCollapsed(true);
  //   } else {
  //     setCollapsed(false);
  //   }
  // };

  // useEffect(() => {
  //   handleResize();
  //   window.addEventListener('resize', handleResize);
  //   return () => {
  //     window.removeEventListener('resize', handleResize);
  //   };
  // }, []);

  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (sidebarRef.current && !sidebarRef.current.contains(event.target) && window.innerWidth <= 1024) {
  //       setCollapsed(true);
  //     }
  //   };

  //   document.addEventListener('mousedown', handleClickOutside);
  //   return () => {
  //     document.removeEventListener('mousedown', handleClickOutside);
  //   };
  // }, [collapsed]);

  // return (
  //   <Layout style={{ height: '100vh' }}>
  //     <Sider
  //       ref={sidebarRef}
  //       className={`styled-sider ${!collapsed ? 'collapsed' : ''}`}
  //       trigger={null}
  //       collapsible
  //       collapsedWidth={0}
  //       width={240}
  //       collapsed={collapsed}
  //     >
  //       <div className="logo-container">
  //         <img
  //           className="logo"
  //           src="https://fams-test.fa.edu.vn/assets/images/logo/logo.svg"
  //           alt="Logo"
  //         />
  //       </div>
  //       <Menu
  //         className="styled-menu"
  //         mode="inline"
  //         selectedKeys={[selectedKey]}
  //         items={[
  //           {
  //             key: '1',
  //             icon: wrapIcon(<GroupIcon />),
  //             label: <a href='#1'>Class Management</a>,
  //           },
  //           {
  //             key: '2',
  //             icon: wrapIcon(<CapIcon />),
  //             label: <a href='#1'>Trainee Management</a>,
  //           },
  //           {
  //             key: '3',
  //             icon: wrapIcon(<CapIcon />),
  //             label: <Link to='/admin/trainer-management'>Trainer Management</Link>,
  //           },
  //           {
  //             key: '4',
  //             icon: wrapIcon(<TrainerManagementIcon />),
  //             label: <a href="/admin/schedule_tracker">Schedule Tracker</a>,
  //           },
  //           {
  //             key: '5',
  //             icon: wrapIcon(<ClockIcon />),
  //             label: <a href='#1'>Log Work</a>,
  //           },
  //           {
  //             key: '6',
  //             icon: wrapIcon(<BookIcon />),
  //             label: <a href='#1'>Content Management</a>,
  //           },
  //           {
  //             key: '7',
  //             icon: wrapIcon(<QuestionIcon />),
  //             label: <a href='#1'>FAQs</a>,
  //           },
  //         ]}
  //       />
  //     </Sider>

  //     <Layout>
  //       <Header className="styled-header">
  //         <Button
  //           className="collapse-button"
  //           type="text"
  //           icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
  //           onClick={() => setCollapsed(!collapsed)}
  //         />
  //         <div className="header-right">
  //           <Typography.Text>Welcome to {username}</Typography.Text>
  //           <Dropdown overlay={avatarMenu} trigger={['click']}>
  //             <Button shape="circle" className="avatar-button">
  //               <RxAvatar className="styled-avatar" />
  //             </Button>
  //           </Dropdown>
  //           <Button shape="circle" className="avatar-button">
  //             <IoIosNotifications className="styled-notification" />
  //           </Button>
  //         </div>
  //       </Header>
  //       <Content className="styled-content">
  //         <Outlet context={{ selectMenuItem }} />
  //       </Content>
  //     </Layout>
  //   </Layout>
  // );
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed}
       trigger={null}
        collapsible
        collapsedWidth={0}
        width={240}

      />

      {/* Main Content Area with dynamic margin */}
      <div
        className={`transition-all duration-300 ${
          collapsed ? 'ml-0' : 'ml-[220px]'
        } flex-grow px-3 py-4 overflow-auto`}  // Added overflow-auto
      >
        {/* Outlet renders the child route components */}
        <Outlet  context={{ collapsed }} />
      </div>
    </div>
  );
};

export default MainLayout;
