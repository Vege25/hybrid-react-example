import React from 'react';
import {useForm} from '../hooks/FormHooks';
import {useAuthentication} from '../hooks/apiHooks';
import {useNavigate} from 'react-router-dom';
import {Credentials} from '../types/LocalTypes';

const LoginForm: React.FC = () => {
  const {postLogin} = useAuthentication();
  const navigate = useNavigate();
  // Add your component logic here
  const initValues: Credentials = {
    username: '',
    password: '',
  };

  const {handleSubmit, handleInputChange, inputs} = useForm(async () => {
    try {
      const creds = {
        username: inputs.username,
        password: inputs.password,
      };
      const loginResult = await postLogin(creds);
      if (!loginResult) {
        return;
      }

      localStorage.setItem('token', loginResult.token);
      navigate('/profile');
    } catch (e) {
      console.log((e as Error).message);
    }
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
