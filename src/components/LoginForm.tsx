import React from 'react';
import {useForm} from '../hooks/FormHooks';
import {Credentials} from '../types/LocalTypes';
import {useUserContext} from '../hooks/contextHooks';

const LoginForm: React.FC = () => {
  const {handleLogin} = useUserContext();
  // Add your component logic here
  const initValues: Credentials = {
    username: '',
    password: '',
  };
  const doLogin = async () => {
    handleLogin(inputs as Credentials);
  };

  const {handleSubmit, handleInputChange, inputs} = useForm(
    doLogin,
    initValues,
  );

  return (
    <>
      <div className="flex justify-center items-center">
        <div className="w-full max-w-md p-4 border rounded-lg shadow-md">
          <h3 className="text-center text-xl font-bold mb-4">Login</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="UserWithLevelname"
                className="block text-sm font-medium text-gray-600"
              >
                Username
              </label>
              <input
                name="username"
                type="text"
                id="UserWithLevelname"
                onChange={handleInputChange}
                autoComplete="username"
                className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            <div>
              <label
                htmlFor="loginpassword"
                className="block text-sm font-medium text-gray-600"
              >
                Password
              </label>
              <input
                name="password"
                type="password"
                id="loginpassword"
                onChange={handleInputChange}
                autoComplete="current-password"
                className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            <button
              type="submit"
              className="w-full p-2 bg-blue-500 text-white rounded-md"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
