import axios from 'axios';
import { toast } from 'react-toastify';
const API_URL = '/api/courses';

const createCourse = async (formData, token) => {
  const response = await axios.post(API_URL, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const courseService = {
  createCourse,
};

export default courseService;
