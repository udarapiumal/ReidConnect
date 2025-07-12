import React from 'react';
import { Typography, Card, Row, Col, Statistic } from 'antd';
import { BookOutlined, UserOutlined, FileOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Title } = Typography;

const AcademicAdminDashboard: React.FC = () => {
  return (
    <div className="admin-dashboard">
      <Title level={2}>Academic Administration Dashboard</Title>
      
      <Row gutter={[16, 16]} className="dashboard-stats">
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="Total Courses" 
              value={24} 
              prefix={<BookOutlined />} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="Active Students" 
              value={156} 
              prefix={<UserOutlined />} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="Pending Requests" 
              value={8} 
              prefix={<FileOutlined />} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="Completed Tasks" 
              value={42} 
              prefix={<CheckCircleOutlined />} 
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AcademicAdminDashboard;
