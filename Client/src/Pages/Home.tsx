import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../Actions/user.action.ts';

// Custom Card Component
const CardComponent = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg mx-auto">
    {children}
  </div>
);

// Custom Button Component
const ButtonComponent = ({ children, type, onClick }: { children: React.ReactNode; type: 'submit' | 'button'; onClick?: () => void }) => (
  <button
    type={type}
    onClick={onClick}
    className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
  >
    {children}
  </button>
);

const Home = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'admin',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);

    const user = await login(formData);
    user && navigate('/admin/dashboard');
    !user && setMessage('Invalid email or password!');
  };

  return (
    <section className="bg-white">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <aside className="relative block h-16 lg:order-last lg:col-span-5 lg:h-full xl:col-span-6">
          <img
            alt="Background"
            src="https://img.freepik.com/premium-photo/midcentury-modern-abstract-painting-contemporary-art-background-reproduction-simple-artwork_688547-10713.jpg"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </aside>

        <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6 w-full">
          <CardComponent>
            <h1 className="text-gray-700 font-bold text-3xl mt-1 ">Hello Manager</h1>
            <p className="text-gray-500 mt-1 font-normal">
              Nice to meet you! Enter your details to register.
            </p>
            <form className="mt-8 mb-2 w-[30rem] max-w-screen-lg sm:w-96" onSubmit={handleSubmit}>
              <div className="mb-1 flex flex-col gap-6">
                <h6 className="text-red-500 -mb-3">{message}</h6>

                <label htmlFor="email" className="text-blue-gray-500 -mb-3">Your Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="xyz@mail.com"
                  className="w-full border-t border-gray-300 p-3 rounded-md focus:border-gray-900"
                />

                <label htmlFor="password" className="text-blue-gray-500 -mb-3">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="********"
                  className="w-full border-t border-gray-300 p-3 rounded-md focus:border-gray-900"
                />
              </div>

              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="terms"
                  className="mr-2"
                />
                <label htmlFor="terms" className="text-gray-700">
                  I agree to the
                  <a href="#" className="font-medium text-blue-600 hover:text-blue-800">
                    &nbsp;Terms and Conditions
                  </a>
                </label>
              </div>

              <ButtonComponent type="submit">
                Sign Up
              </ButtonComponent>

              <p className="text-center text-gray-500 mt-4 font-normal">
                Are you a User?{" "}
                <Link to="/login" className="font-medium text-gray-900">
                  Sign Up
                </Link>
              </p>
            </form>
          </CardComponent>
        </main>
      </div>
    </section>
  );
};

export default Home;
