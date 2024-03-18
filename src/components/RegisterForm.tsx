import React, {useState} from 'react';
import {useForm} from '../hooks/FormHooks';
import {useUser} from '../hooks/apiHooks';

const RegisterForm: React.FC = () => {
  // Add your component logic here
  const {postUser} = useUser();
  const [usernameAvailable, setUsernameAvailable] = useState<boolean>(true);
  const [emailAvailable, setEmailAvailable] = useState<boolean>(true);
  const initvalues = {username: '', password: '', email: ''};

  const doRegister = async () => {
    try {
      if (!usernameAvailable || !emailAvailable) {
        alert('Username or email not available');
        return;
      }
      console.log(usernameAvailable, emailAvailable);

      const creds = {
        username: inputs.username,
        password: inputs.password,
        email: inputs.email,
      };
      const user = await postUser(creds);
      if (user) {
        alert('User created');
      }
    } catch (e) {
      console.log((e as Error).message);
    }
  };
  const {handleSubmit, handleInputChange, inputs} = useForm(
    doRegister,
    initvalues,
  );
  const {getUsernameAvailable, getEmailAvailable} = useUser();

  const handleUsernameBlur = async (
    event: React.SyntheticEvent<HTMLInputElement>,
  ) => {
    console.log(event.currentTarget.value);
    const result = await getUsernameAvailable(event.currentTarget.value);
    setUsernameAvailable(result);
  };

  const handleEmailBlur = async () => {
    console.log(inputs.email);
    const result = await getEmailAvailable(inputs.email);
    setEmailAvailable(result);
  };
  return (
    <>
      <div className="mt-6 flex items-center justify-center">
        <div className="w-full max-w-md rounded-lg border p-4 shadow-md">
          <h3 className="mb-4 text-center text-xl font-bold">Register</h3>
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
                onBlur={handleUsernameBlur}
                onChange={handleInputChange}
                autoComplete="username"
                className="mt-1 w-full rounded-md border p-2 focus:border-blue-300 focus:outline-none focus:ring"
              />
            </div>
            {!usernameAvailable && (
              <div className="flex justify-end">
                <p className="text-red-500">Username not aviable</p>
              </div>
            )}
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
                className="mt-1 w-full rounded-md border p-2 focus:border-blue-300 focus:outline-none focus:ring"
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
                onBlur={handleEmailBlur}
                onChange={handleInputChange}
                autoComplete="email"
                className="mt-1 w-full rounded-md border p-2 focus:border-blue-300 focus:outline-none focus:ring"
              />
            </div>
            {!emailAvailable && (
              <div className="flex justify-end">
                <p className="text-red-500">Email not aviable</p>
              </div>
            )}
            <button
              type="submit"
              className="w-full rounded-md bg-blue-500 p-2 text-white"
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
