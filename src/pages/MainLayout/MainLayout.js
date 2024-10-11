import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Layout } from 'antd';
import { GroupIcon, CapIcon, ClockIcon, BookIcon, QuestionIcon, TrainerManagementIcon } from '../../components/CustomIcons';
import {
  StyledSider,
  LogoContainer,
  Logo,
  StyledMenu,
  StyledHeader,
  CollapseButton,
  AvatarButton,
  StyledContent,
  StyledAvatar,
  StyledNotification,
  HeaderRight
} from './MainLayout.styled';
import { Typography } from 'antd';

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('1');

  const selectMenuItem = (key) => {
    setSelectedKey(key);
  };

  const wrapIcon = (icon) => React.cloneElement(icon, { style: { width: 24, height: 24, marginRight: '15px' } });

  return (
    <Layout>
      <StyledSider
        trigger={null}
        collapsible
        collapsedWidth={0}
        width={240}
        collapsed={collapsed}
      >
        <LogoContainer>
          <Logo
            src="https://fams-test.fa.edu.vn/assets/images/logo/logo.svg"
            alt="Logo"
          />
        </LogoContainer>
        <StyledMenu
          mode="inline"
          selectedKeys={[selectedKey]} // Điều chỉnh key dựa trên state
          items={[
            {
              key: '1',
              icon: wrapIcon(<GroupIcon />),
              label: <a href='#1'>Trainer Confirmation</a>,
            },
            {
              key: '2',
              icon: wrapIcon(<CapIcon />),
              label: <a href='#1'>Trainee Management</a>,
            },
            {
              key: '3',
              icon: wrapIcon(<TrainerManagementIcon />),
              label: <a href="/trainer/portal">Trainer Management</a>,
            },
            {
              key: '4',
              icon: wrapIcon(<ClockIcon />),
              label: <a href='#1'>Log Work</a>,
            },
            {
              key: '5',
              icon: wrapIcon(<BookIcon />),
              label: <a href='#1'>Content Management</a>,
            },
            {
              key: '6',
              icon: wrapIcon(<QuestionIcon />),
              label: <a href='#1'>FAQs</a>,
            },
          ]}
        />
      </StyledSider>

      <Layout>
        <StyledHeader>
          <CollapseButton
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
          />
          <HeaderRight>
            <Typography.Text>Welcome to TrangMNQ</Typography.Text>
            <AvatarButton shape='circle'>
              <StyledAvatar />
            </AvatarButton>
            <AvatarButton shape='circle'>
              <StyledNotification />
            </AvatarButton>
          </HeaderRight>
        </StyledHeader>
        <StyledContent>
          <Outlet context={{ selectMenuItem }} />
        </StyledContent>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
