import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../Actions/user.action.ts';

const SignPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user'
  });

  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [alert, setAlert] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (confirmPassword !== formData.password) {
      setMessage('Passwords do not match!');
      setAlert(true);
      return;
    }

    const user = await signup(formData);

    if (user) {
      navigate('/login');
    } else {
      setMessage('User already exists');
      setAlert(true);
    }
  };

  return (
    <section className="bg-white min-h-screen flex items-center justify-center">
      <div className="lg:grid lg:grid-cols-12 lg:min-h-screen w-full">
        <aside className="lg:col-span-5 relative h-96 lg:h-full">
          <img
            alt="Sign Up"
            src="https://images.unsplash.com/photo-1605106702734-205df224ecce?ixlib=rb-1.2.1&auto=format&fit=crop&w=870&q=80"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </aside>

        <main className="lg:col-span-7 flex items-center justify-center px-8 py-8 sm:px-12">
          <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-3xl font-semibold text-gray-700">Register</h2>
            <p className="mt-2 text-gray-600">Let's get started!</p>

            {alert && <div className="text-red-600 mt-3">{message}</div>}

            <form onSubmit={handleSubmit} className="mt-6">
              <div className="mb-4">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Your Name
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Your Name"
                  value={formData.username}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Your Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="xyz@mail.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="********"
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="********"
                  value={confirmPassword}
                  onChange={handleChangePassword}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="terms"
                  className="mr-2"
                  required
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  I agree to the
                  <a href="#" className="font-medium text-indigo-600 hover:text-indigo-800 ml-1">
                    Terms and Conditions
                  </a>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Sign Up
              </button>

              <div className="mt-4 text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-800">
                  Login
                </Link>
              </div>
            </form>
          </div>
        </main>
      </div>
    </section>
  );
};

export default SignPage;
