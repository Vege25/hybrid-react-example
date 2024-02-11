import React from 'react';
import {useForm} from '../hooks/FormHooks';
import {useUser} from '../hooks/apiHooks';

const RegisterForm: React.FC = () => {
  // Add your component logic here
  const {postUser} = useUser();
  const initvalues = {username: '', password: '', email: ''};

  const doRegister = async () => {
    try {
      console.log(inputs);
      const creds = {
        username: inputs.username,
        password: inputs.password,
        email: inputs.email,
      };
      await postUser(creds);
    } catch (e) {
      console.log((e as Error).message);
    }
  };
  const {handleSubmit, handleInputChange, inputs} = useForm(
    doRegister,
    initvalues,
  );

  return (
    <>
      <div className="flex justify-center items-center mt-6">
        <div className="w-full max-w-md p-4 border rounded-lg shadow-md">
          <h3 className="text-center text-xl font-bold mb-4">Register</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-600"
              >
                Username
              </label>
              <input
                name="username"
                type="text"
                id="username"
                onChange={handleInputChange}
                autoComplete="username"
                className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-600"
              >
                Password
              </label>
              <input
                name="password"
                type="password"
                id="password"
                onChange={handleInputChange}
                autoComplete="current-password"
                className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-600"
              >
                Email
              </label>
              <input
                name="email"
                type="email"
                id="email"
                onChange={handleInputChange}
                autoComplete="email"
                className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            <button
              type="submit"
              className="w-full p-2 bg-blue-500 text-white rounded-md"
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default RegisterForm;
