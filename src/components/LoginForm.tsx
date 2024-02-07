import React from 'react';
import {useForm} from '../hooks/FormHooks';
import {useAuthentication} from '../hooks/apiHooks';
import {Credentials} from '../types/Localtypes';

const LoginForm: React.FC = () => {
  const {postLogin} = useAuthentication();
  // Add your component logic here
  const initValues: Credentials = {
    username: '',
    password: '',
  };

  const {handleSubmit, handleInputChange, inputs} = useForm(async () => {
    const creds = {
      username: inputs.username,
      password: inputs.password,
    };
    console.log(postLogin(creds));
  }, initValues);

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
