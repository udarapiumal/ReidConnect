import React, { useState } from 'react';
import { Table, Button, Space, Modal, Form, Input, Select, Typography } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

interface Course {
  id: string;
  code: string;
  name: string;
  department: string;
  credits: number;
  status: 'active' | 'inactive';
}

const CourseManagement: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([
    { id: '1', code: 'CS101', name: 'Introduction to Computer Science', department: 'Computer Science', credits: 3, status: 'active' },
    { id: '2', code: 'MATH201', name: 'Calculus II', department: 'Mathematics', credits: 4, status: 'active' },
    { id: '3', code: 'ENG105', name: 'Academic Writing', department: 'English', credits: 3, status: 'inactive' },
  ]);
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const columns = [
    { title: 'Course Code', dataIndex: 'code', key: 'code' },
    { title: 'Course Name', dataIndex: 'name', key: 'name' },
    { title: 'Department', dataIndex: 'department', key: 'department' },
    { title: 'Credits', dataIndex: 'credits', key: 'credits' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    {
      title: 'Action',
      key: 'action',
      render: (_, record: Course) => (
        <Space size="middle">
          <Button 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
          />
          <Button 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingCourse(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    form.setFieldsValue(course);
    setIsModalVisible(true);
  };

  const handleDelete = (id: string) => {
    setCourses(courses.filter(course => course.id !== id));
  };

  const handleSubmit = () => {
    form.validateFields().then(values => {
      if (editingCourse) {
        setCourses(courses.map(course => 
          course.id === editingCourse.id ? { ...values, id: course.id } : course
        ));
      } else {
        setCourses([...courses, { ...values, id: Date.now().toString() }]);
      }
      setIsModalVisible(false);
    });
  };

  return (
    <div className="course-management">
      <Title level={3}>Course Management</Title>
      <Button 
        type="primary" 
        icon={<PlusOutlined />} 
        onClick={handleAdd}
        style={{ marginBottom: 16 }}
      >
        Add Course
      </Button>
      
      <Table columns={columns} dataSource={courses} rowKey="id" />

      <Modal
        title={editingCourse ? "Edit Course" : "Add New Course"}
        visible={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="code" label="Course Code" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="name" label="Course Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="department" label="Department" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="credits" label="Credits" rules={[{ required: true }]}>
            <Input type="number" min={1} />
          </Form.Item>
          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <Select>
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CourseManagement;
