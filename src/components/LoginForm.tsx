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
      <h3>Login</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="UserWithLevelname">Username</label>
          <input
            name="username"
            type="text"
            id="UserWithLevelname"
            onChange={handleInputChange}
            autoComplete="username"
          />
        </div>
        <div>
          <label htmlFor="loginpassword">Password</label>
          <input
            name="password"
            type="password"
            id="loginpassword"
            onChange={handleInputChange}
            autoComplete="current-password"
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </>
  );
};

export default LoginForm;
