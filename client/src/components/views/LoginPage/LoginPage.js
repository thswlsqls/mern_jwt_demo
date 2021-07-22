import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';

import { withRouter, Link } from 'react-router-dom';
import { loginUser } from '../../../_actions/user_action';
import './styles.css';
// import { Checkbox, Input } from 'antd';

function LoginPage(props) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();

  const onSubmit = (data) => {
    console.log(data);

    dispatch(loginUser(data)).then((response) => {
      if (response.payload.loginSuccess) {
        props.history.push('/');
      } else {
        alert(response.payload.err);
        console.log(response.payload.err);
      }
    });
  }; // your form submit function which will invoke after successful validation

  console.log(watch('email')); // you can watch individual input by pass the name of the input
  console.log(watch('password')); // you can watch individual input by pass the name of the input

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>Email</label>
      <input
        //defaultValue="please text your email"
        {...register('email', {
          required: true,
          pattern: /^\S+@\S+$/i,
          maxLength: 20,
        })}
      />
      {errors.email && errors.email.type === 'required' && (
        <p>This Email field is required</p>
      )}
      {errors.email && errors.email.type === 'maxLength' && (
        <p>Your email is not valid</p>
      )}
      {errors.email && errors.email.type === 'maxLength' && (
        <p>Your input exceed maximum length</p>
      )}

      <label>Password</label>
      <input
        type="password"
        {...register('password', { required: true, minLength: 12 })}
      />
      {errors.password && errors.password.type === 'required' && (
        <p>This password field is required</p>
      )}
      {errors.password && errors.password.type === 'minLength' && (
        <p>password would be more then 12 characters</p>
      )}
      {/* <Checkbox>Remember me</Checkbox> */}
      <Link to="/signup" className="login-form-register">
        Register now!
      </Link>
      <input type="submit" value="Log in" />
    </form>
  );
}

export default withRouter(LoginPage);
