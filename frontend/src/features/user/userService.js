import axios from 'axios';
import { toast } from 'react-toastify';
const API_URL = '/api/users/';

// Register user
const register = async (userData) => {
  if (userData.comp) {
    const response = await axios.post(`${API_URL}/instructors/`, userData.data, {
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },
    });
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }

    return response.data;
  } else if (userData.corp) {
    const response = await axios.post(`/api/corporate/student-register`, userData.data, {
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },
    });
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }

    return response.data;
  } else {
    const response = await axios.post(API_URL, userData);

    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }

    return response.data;
  }
};

// Login user
const login = async (userData) => {
  const response = await axios.post(API_URL + 'login', userData);

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }

  return response.data;
};

const setCountry = async (userData) => {
  const country = userData.country;
  const response = await axios.post(
    API_URL + 'me',
    { country },
    {
      headers: {
        Authorization: `Bearer ${userData.token}`,
        'Content-Type': 'application/json',
      },
    }
  );
  if (response.data) {
    localStorage.setItem('country', JSON.stringify(response.data));
  }
  return response.data;
};

const getMyCourses = async (username, token) => {
  const response = await axios.get(`${API_URL}/${username}/courses`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const sendMail = async (data) => {
  const response = await axios
    .post(`${API_URL}/forgotPass`, data)
    .then((response) => {
      toast.success('Email Verf Sent!');
      return response.data;
    })
    .catch((err) => {
      toast.error(err.response.data.message);
    });
};

// Change password

// Logout user
const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('country');
};
const updateWatchedDuration = async (userData) => {
  const { user, courseId, videoId, exerciseId } = userData;
  const response = await axios({
    method: 'put',
    url: `/api/users/mycourses/${courseId}/lessons/${videoId || exerciseId}`,
    headers: { Authorization: `Bearer ${user.token}` },
  });
  if (response.data) {
    localStorage.setItem(
      'user',
      JSON.stringify({
        _id: user.id,
        type: user.type,
        courses: response.data.courses,
        token: user.token,
      })
    );
  }
  return {
    _id: user.id,
    token: user.token,
    courses: response.data.courses,
    type: user.type,
  };
};
const addCourse = async (user) => {
  const response = await axios({
    method: 'get',
    url: '/api/users/me/last-checkout-session',
    headers: { Authorization: `Bearer ${user.token}` },
  });
  if (response.data) {
    localStorage.setItem(
      'user',
      JSON.stringify({
        token: user.token,
        courses: response.data.courses,
        type: user.type,
      })
    );
  }
  return {
    user: user._id,
    token: user.token,
    courses: response.data.courses,
    type: user.type,
  };
};
const requestCourse = async (data) => {
  const response = await axios({
    method: 'post',
    url: '/api/corporate/request',
    data: { courseId: data.course },
    headers: { Authorization: `Bearer ${data.user.token}` },
  });
  if (response.data) {
    localStorage.setItem(
      'user',
      JSON.stringify({
        user: data.user._id,
        token: data.user.token,
        courses: data.user.courses,
        requests: response.data.requests,
        type: data.user.type,
      })
    );
  }
  return {
    user: data.user._id,
    token: data.user.token,
    courses: data.user.courses,
    requests: response.data.requests,
    type: data.user.type,
  };
};
const userService = {
  register,
  logout,
  login,
  setCountry,
  getMyCourses,
  sendMail,
  updateWatchedDuration,
  addCourse,
  requestCourse,
};

export default userService;
