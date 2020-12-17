import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Auth } from '../../../../api';
import { updatePassword } from '../../../../api/Auth';
import { Input } from '../../../common';

const PasswordResetForm = (
  props: Omit<Auth.NewPasswordBody, 'password'>,
): React.ReactElement => {
  //TODO create state to show modal
  const [showModal, setShowModal] = useState(false);

  // deconstruct our useForm() methods
  const {
    register,
    handleSubmit,
    errors,
    setError,
    clearErrors,
    watch,
  } = useForm({
    mode: 'onChange',
  });

  // onSubmit should send the users email a reset password link/token that has a 10 min timer
  const onSubmit: SubmitHandler<{
    password: string;
  }> = (data) => {
    console.log('Form Submitted: ', data);

    const userBody = {
      email: props.email,
      code: props.code,
      password: data.password,
    };

    //TODO - redirect user?
    updatePassword(userBody)
      .then(() => {
        clearErrors();
        setShowModal(true);
      })
      .catch((err: Auth.AxiosError) => {
        console.log({ err });
        let message: string;
        if (err.response?.data) {
          message = err.response.data.error;
        } else {
          message = 'An unknown error occurred. Please try again.';
        }
        setError('form', { type: 'manual', message });
      });
  };

  // TODO - need error handlers, remove console log in onSubmit

  return (
    <div className="landing-form">
      <form onSubmit={handleSubmit(onSubmit)}>
        <ul className="text">
          <li>Password requirements:</li>
          <li>Between 8 and 32 characters</li>
          <li>Includes at least 1 Capital</li>
          <li>Includes at least 1 Number</li>
        </ul>
        <Input
          name="password"
          label="Password"
          type="password"
          showPassword
          errors={errors}
          register={register}
          rules={{
            required: 'Password is required!',
            validate: {
              // checks entered password value contains required characters
              includesCapital: (value) => {
                const pattern = /[A-Z]/;
                return (
                  pattern.test(value) ||
                  'Password must include at least 1 capital letter'
                );
              },
              includesNumber: (value) => {
                const pattern = /[0-9]/;
                return (
                  pattern.test(value) ||
                  'Password must include at least 1 number'
                );
              },
              // checks that entered password value is a minimum of 8 chars
              checkLength: (value) => {
                return (
                  (value.length >= 8 && value.length <= 32) ||
                  'Password must be between 8 and 32 characters.'
                );
              },
            },
          }}
        />
        <Input
          name="confirm"
          label="Confirm Password"
          type="password"
          showPassword
          errors={errors}
          register={register}
          rules={{
            required: 'Password confirmation is required!',
            validate: (value) => {
              // checks that the values in password and confirm inputs match
              return value === watch('password') || "Passwords don't match!";
            },
          }}
        />
        <input
          type="submit"
          value="Reset Password"
          onClick={() => clearErrors('form')}
        />
      </form>
    </div>
  );
};

export default PasswordResetForm;