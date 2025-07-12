import React, { useState } from 'react';
import { Table, Input, Button, Space, Typography, Tag } from 'antd';
import { SearchOutlined, FileExcelOutlined } from '@ant-design/icons';

const { Title } = Typography;

interface Student {
  id: string;
  studentId: string;
  name: string;
  program: string;
  year: number;
  gpa: number;
  status: 'active' | 'probation' | 'graduated' | 'inactive';
}

const StudentRecords: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  
  const students: Student[] = [
    { id: '1', studentId: 'S12345', name: 'John Smith', program: 'Computer Science', year: 3, gpa: 3.7, status: 'active' },
    { id: '2', studentId: 'S12346', name: 'Emma Johnson', program: 'Business Administration', year: 2, gpa: 3.2, status: 'active' },
    { id: '3', studentId: 'S12347', name: 'Michael Brown', program: 'Psychology', year: 4, gpa: 2.8, status: 'probation' },
    { id: '4', studentId: 'S12348', name: 'Sophia Davis', program: 'English Literature', year: 3, gpa: 3.9, status: 'active' },
    { id: '5', studentId: 'S12349', name: 'William Miller', program: 'Computer Science', year: 4, gpa: 3.5, status: 'active' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'green';
      case 'probation': return 'orange';
      case 'graduated': return 'blue';
      case 'inactive': return 'red';
      default: return 'default';
    }
  };

  const columns = [
    { title: 'Student ID', dataIndex: 'studentId', key: 'studentId' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Program', dataIndex: 'program', key: 'program' },
    { title: 'Year', dataIndex: 'year', key: 'year' },
    { title: 'GPA', dataIndex: 'gpa', key: 'gpa' },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record: Student) => (
        <Space size="middle">
          <Button>View Details</Button>
          <Button>Edit</Button>
        </Space>
      ),
    },
  ];

  const filteredStudents = students.filter(
    student => 
      student.name.toLowerCase().includes(searchText.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchText.toLowerCase()) ||
      student.program.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="student-records">
      <Title level={3}>Student Records</Title>
      
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Search students"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
        <Button type="primary" icon={<FileExcelOutlined />}>
          Export to Excel
        </Button>
      </Space>
      
      <Table 
        columns={columns} 
        dataSource={filteredStudents} 
        rowKey="id"
      />
    </div>
  );
};

export default StudentRecords;
