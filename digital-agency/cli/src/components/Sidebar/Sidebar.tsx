import React from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import { DashboardOutlined, FeedbackOutlined } from '@ant-design/icons';

const Sidebar: React.FC = () => {
  return (
    <Menu mode="inline" defaultSelectedKeys={['1']}>
      <Menu.Item key="1" icon={<DashboardOutlined />}>
        <Link to="/dashboard">Dashboard</Link>
      </Menu.Item>
      <Menu.Item key="2" icon={<FeedbackOutlined />}>
        <Link to="/feedback-dashboard">Feedback Dashboard</Link>
      </Menu.Item>
    </Menu>
  );
};

export default Sidebar; 