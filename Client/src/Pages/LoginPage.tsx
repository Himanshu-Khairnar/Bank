import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { login } from '../Actions/user.action.ts';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'user'
  });

  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const user = await login(formData);

      if (user?.data?.user?.id) {
        const userId = user.data.user.id;
        console.log(userId);
        navigate(`/dashboard/${userId}`);
      } else {
        setMessage('Invalid email or password!');
      }
    } catch (error) {
      console.error(error);
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <section className="bg-white">
      <div className="lg:grid w-full lg:min-h-screen lg:grid-cols-12">
        <aside className="relative block h-16 lg:order-last lg:col-span-5 lg:h-full xl:col-span-6">
          <img
            alt=""
            src="https://images.template.net/wp-content/uploads/2017/02/07191313/Modern-Abstract-Art-Painting.jpg?width=480o"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </aside>

        <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-96">
            <h4 className="text-2xl text-gray-900">Login</h4>
            <p className="text-gray-600 mt-1">Welcome back! Enter your details to log in.</p>
            <form className="mt-8 mb-2" onSubmit={handleSubmit}>
              <div className="mb-4">
                {message && <p className="text-red-500 text-sm mb-2">{message}</p>}

                <label className="block text-sm text-gray-600">Your Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="xyz@mail.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm text-gray-600">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="********"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="mb-4">
                <label className="inline-flex items-center text-sm text-gray-600">
                  <input type="checkbox" className="mr-2" />
                  I agree to the
                  <a href="#" className="text-blue-600 hover:text-blue-800 ml-1">Terms and Conditions</a>
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Sign In
              </button>

              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-blue-600 hover:text-blue-800">
                    Register
                  </Link>
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Are you a Manager?{' '}
                  <Link to="/" className="text-blue-600 hover:text-blue-800">
                    Sign In as a Manager
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </main>
      </div>
    </section>
  );
};

export default LoginPage;
