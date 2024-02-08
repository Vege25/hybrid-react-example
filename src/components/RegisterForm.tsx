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
      <h3>Register</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            name="username"
            type="text"
            id="username"
            onChange={handleInputChange}
            autoComplete="username"
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            name="password"
            type="password"
            id="password"
            onChange={handleInputChange}
            autoComplete="current-password"
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            name="email"
            type="email"
            id="email"
            onChange={handleInputChange}
            autoComplete="email"
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </>
  );
};

export default RegisterForm;
