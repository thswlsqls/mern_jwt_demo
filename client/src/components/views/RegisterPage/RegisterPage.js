import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
// import { registerUser } from '../../../REDUX_actions/user_actions';
import { withRouter } from 'react-router-dom';

import './styles.css';
// import Checkbox from 'antd/lib/checkbox/Checkbox';

function RegisterPage(props) {
  // const [user_email, setUser_email] = useState("")
  // const [user_password, setUser_password] = useState("")

  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);

    //   dispatch(registerUser(data)).then((response) => {
    //     if (response.payload.registerSuccess) {
    //       props.history.push('/login');
    //     } else {
    //       alert(response.payload.err);
    //     }
    //   });
  }; // your form submit function which will invoke after successful validation

  console.log(watch('user_email')); // you can watch individual input by pass the name of the input
  console.log(watch('password')); // you can watch individual input by pass the name of the input

  const password = useRef();
  password.current = watch('password');

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>Email</label>
      <input
        //defaultValue="please text your email"
        {...register('user_email', {
          required: true,
          pattern: /^\S+@\S+$/i,
          maxLength: 20,
        })}
      />
      {errors.user_email && errors.user_email.type === 'required' && (
        <p>This Email field is required</p>
      )}
      {errors.user_email && errors.user_email.type === 'pattern' && (
        <p>Your email is not valid</p>
      )}
      {errors.user_email && errors.user_email.type === 'maxLength' && (
        <p>Your input exceed maximum length</p>
      )}

      <label>Name</label>
      <input
        //defaultValue="please text your email"
        {...register('user_name', {
          required: true,
          pattern: /^[A-Za-z]+$/i,
          maxLength: 20,
        })}
      />
      {errors.user_name && errors.user_name.type === 'required' && (
        <p>This Name field is required</p>
      )}
      {errors.user_name && errors.user_name.type === 'pattern' && (
        <p>Your Name is not valid</p>
      )}
      {errors.user_name && errors.user_name.type === 'maxLength' && (
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
        <p>password must have at least 12 characters</p>
      )}

      <label>Password Confirm</label>
      <input
        type="password"
        {...register('password_confirm', {
          required: true,
          minLength: 12,
          validate: (value) => value === password.current,
        })}
      />
      {errors.password_confirm &&
        errors.password_confirm.type === 'required' && (
          <p>This password confirm field is required</p>
        )}
      {errors.password_confirm &&
        errors.password_confirm.type === 'minLength' && (
          <p>password would be more then 12 characters</p>
        )}
      {errors.password_confirm &&
        errors.password_confirm.type === 'validate' && (
          <p>The password do not match</p>
        )}
      <div>
        {/* <Checkbox>I agree to the Program’s Terms of Service</Checkbox> */}
        <a style={{ float: 'right' }} href="#">
          ❔Terms of Service
        </a>

        {/* <Checkbox>
          I accept the Program’s use of my data for the service
        </Checkbox> */}
        <a style={{ float: 'right' }} href="#">
          ❔Privacy Policy
        </a>
      </div>
      <input type="submit" value="Register" />
    </form>
  );
}

export default withRouter(RegisterPage);
