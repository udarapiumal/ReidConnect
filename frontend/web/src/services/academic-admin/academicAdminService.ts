import axios from 'axios';

const API_URL = '/api/academic-admin';

export interface Course {
  id: string;
  code: string;
  name: string;
  department: string;
  credits: number;
  status: string;
}

export interface Student {
  id: string;
  studentId: string;
  name: string;
  program: string;
  year: number;
  gpa: number;
  status: string;
}

// Course Management API calls
export const getCourses = async (): Promise<Course[]> => {
  const response = await axios.get(`${API_URL}/courses`);
  return response.data;
};

export const createCourse = async (course: Omit<Course, 'id'>): Promise<Course> => {
  const response = await axios.post(`${API_URL}/courses`, course);
  return response.data;
};

export const updateCourse = async (id: string, course: Partial<Course>): Promise<Course> => {
  const response = await axios.put(`${API_URL}/courses/${id}`, course);
  return response.data;
};

export const deleteCourse = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/courses/${id}`);
};

// Student Records API calls
export const getStudents = async (): Promise<Student[]> => {
  const response = await axios.get(`${API_URL}/students`);
  return response.data;
};

export const getStudentById = async (id: string): Promise<Student> => {
  const response = await axios.get(`${API_URL}/students/${id}`);
  return response.data;
};

export const updateStudent = async (id: string, student: Partial<Student>): Promise<Student> => {
  const response = await axios.put(`${API_URL}/students/${id}`, student);
  return response.data;
};

// Dashboard statistics
export const getDashboardStats = async (): Promise<{
  totalCourses: number;
  activeStudents: number;
  pendingRequests: number;
  completedTasks: number;
}> => {
  const response = await axios.get(`${API_URL}/dashboard/stats`);
  return response.data;
};
