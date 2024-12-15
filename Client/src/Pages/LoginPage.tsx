import React, { useState } from 'react';
import { Card, Input, Checkbox, Button, Typography } from "@material-tailwind/react";
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
          <Card color="transparent" shadow={false}>
            <Typography variant="h4" color="blue-gray">
              Login
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              Welcome back! Enter your details to log in.
            </Typography>
            <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96" onSubmit={handleSubmit}>
              <div className="mb-1 flex flex-col gap-6">
                <Typography variant="h6" color="red" className="-mb-3">{message}</Typography>

                <Typography variant="h6" color="blue-gray" className="-mb-3">
                  Your Email
                </Typography>
                <Input
                  size="lg"
                  placeholder="xyz@mail.com"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                  labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                />

                <Typography variant="h6" color="blue-gray" className="-mb-3">
                  Password
                </Typography>
                <Input
                  type="password"
                  size="lg"
                  placeholder="********"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                  labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                />
              </div>

              <Checkbox
                label={
                  <Typography variant="small" color="gray" className="flex items-center font-normal">
                    I agree to the
                    <a href="#" className="font-medium transition-colors hover:text-gray-900">
                      &nbsp;Terms and Conditions
                    </a>
                  </Typography>
                }
                containerProps={{ className: "-ml-2.5" }}
              />

              <Button type="submit" className="mt-6" fullWidth>
                Sign In
              </Button>

              <Typography color="gray" className="mt-4 text-center font-normal">
                Don't have an account?{" "}
                <Link to="/register" className="font-medium text-gray-900">
                  Register
                </Link>
              </Typography>

              <Typography color="gray" className="mt-4 text-center font-normal">
                Are you a Manager?{" "}
                <Link to="/" className="font-medium text-gray-900">
                  Sign In as a Manager
                </Link>
              </Typography>
            </form>
          </Card>
        </main>
      </div>
    </section>
  );
};

export default LoginPage;
