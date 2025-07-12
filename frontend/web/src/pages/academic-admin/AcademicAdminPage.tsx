import React from 'react';
import { Tabs } from 'antd';
import AcademicAdminDashboard from '../../components/academic-admin/AcademicAdminDashboard';
import CourseManagement from '../../components/academic-admin/CourseManagement';
import StudentRecords from '../../components/academic-admin/StudentRecords';

const { TabPane } = Tabs;

const AcademicAdminPage: React.FC = () => {
  return (
    <div className="academic-admin-container">
      <Tabs defaultActiveKey="dashboard">
        <TabPane tab="Dashboard" key="dashboard">
          <AcademicAdminDashboard />
        </TabPane>
        <TabPane tab="Course Management" key="courses">
          <CourseManagement />
        </TabPane>
        <TabPane tab="Student Records" key="students">
          <StudentRecords />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default AcademicAdminPage;
