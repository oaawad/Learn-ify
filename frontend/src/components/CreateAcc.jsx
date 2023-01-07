import React from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { FaUser } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Popup from 'reactjs-popup';
import Select from 'react-select';

function CreateAcc() {
  let { user } = useSelector((state) => state.user);
  if (typeof user === 'string') {
    user = JSON.parse(user);
  }
  const token = user.token;
  const [type, setType] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    firstName: '',
    lastName: '',
  });

  const { username, email, password, password2, firstName, lastName } =
    formData;

  const options = [
    { value: 'administrator', label: 'Administrator' },
    { value: 'instructor', label: 'Instructor' },
    { value: 'corporate', label: 'Corporate' },
  ];

  const createAcc = async (userData) => {
    const response = await fetch('http://localhost:5555/api/users/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    if (data.username) {
      toast.success(` Account created successfully with `);
      toast(`  Username: ${data.username} `, {
        autoClose: false,
        icon: '👤',
      });
      toast(` Password: ${data.password} `, {
        autoClose: false,
        icon: '🔑',
      });
    } else {
      toast.error(data.message);
    }
  };
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (password !== password2) {
      toast.error('Passwords do not match');
    } else {
      const userData = {
        username,
        firstName,
        lastName,
        email,
        password,
      };
      userData.type = type;
      createAcc(userData);
    }
  };

  return (
    <>
      <Popup
        trigger={
          <button className="btn btn-block">
            <FaUser /> Create Account
          </button>
        }
        modal
      >
        {(close) => (
          <div className="modal">
            <div className="modal-header">
              <h1 className="">
                <FaUser /> Create Account
              </h1>
              <button className="close-button" onClick={close}>
                &times;
              </button>
            </div>
            <section className="modal-body">
              <form onSubmit={onSubmit}>
                <div className="form-group">
                  <Select
                    placeholder="Select Account Type"
                    options={options}
                    onChange={(e) => setType(e.value)}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    name="username"
                    value={username}
                    placeholder="Enter your username"
                    onChange={onChange}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    id="firstName"
                    name="firstName"
                    value={firstName}
                    placeholder="Enter your firstName"
                    onChange={onChange}
                  />
                </div>{' '}
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    id="lastName"
                    name="lastName"
                    value={lastName}
                    placeholder="Enter your lastName"
                    onChange={onChange}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={email}
                    placeholder="Enter your email"
                    onChange={onChange}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={password}
                    placeholder="Enter password"
                    onChange={onChange}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    className="form-control"
                    id="password2"
                    name="password2"
                    value={password2}
                    placeholder="Confirm password"
                    onChange={onChange}
                  />
                </div>
                <div className="form-group">
                  <button type="submit" className="btn btn-block">
                    Submit
                  </button>
                </div>
              </form>
            </section>
          </div>
        )}
      </Popup>
    </>
  );
}

export default CreateAcc;
