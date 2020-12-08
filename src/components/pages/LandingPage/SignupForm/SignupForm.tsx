import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Auth } from '../../../../api';
import squadUp from '../../../../assets/img/squad-up.png';
import { Input, Modal, ThoughtBubble } from '../../../common';
import { DragonBoi } from '../DragonBoi';
import SignupSuccess from './SignupSuccess';

const SignupForm = (): React.ReactElement => {
  const {
    register,
    errors,
    watch,
    handleSubmit,
    clearErrors,
    setError,
  } = useForm({ mode: 'onChange' });
  const [showModal, setShowModal] = useState(false);

  const onSubmit: SubmitHandler<Auth.SignupFormState> = (data): void => {
    // Format form data for API call body
    const credentials = Auth.formatSignupBody(data);
    Auth.signup(credentials)
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

  return (
    <>
      <div className="landing-form">
        <Modal.Component
          visible={showModal}
          setVisible={setShowModal}
          component={SignupSuccess}
          closable={false}
          centered={true}
        />
        <div className="landing-splash">
          <ThoughtBubble
            render={() => <>#SquadGoals! Sign up and start writing today!</>}
          />
          <DragonBoi />
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <img src={squadUp} alt="Squad Up!" />
          <p>
            A Story Squad account is free! Please fill out the information below
            to get started.
          </p>
          {errors.form && (
            <div className="server-error">{errors.form.message}</div>
          )}
          {/* not sending first or last to back end at this time */}
          <Input
            name="firstName"
            label="First Name"
            errors={errors}
            register={register}
            rules={{ required: 'First name is required!' }}
          />
          <Input
            name="username"
            label="Username"
            errors={errors}
            register={register}
            rules={{ required: 'Username is required!' }}
          />
          <Input
            name="email"
            label="Email"
            errors={errors}
            register={register}
            rules={{
              required: 'Email is required!',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Please enter a valid email address',
              },
            }}
          />
          <Input
            name="password"
            label="Password"
            type="password"
            errors={errors}
            register={register}
            rules={{
              required: 'Password is required!',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters.',
              },
              maxLength: {
                value: 32,
                message: 'Password must not be longer than 32 characters.',
              },
              pattern: {
                value: /(?=.*[A-Za-z])(?=.*\d)/,
                message:
                  'Password must contain at least one letter and number.',
              },
            }}
          />
          <Input
            name="confirm"
            label="Confirm Password"
            type="password"
            errors={errors}
            register={register}
            rules={{
              required: 'Password confirmation is required!',
              validate: (value) =>
                value === watch('password') || "Passwords don't match!",
            }}
          />
          <Input
            name="ageStr"
            label="Age"
            errors={errors}
            register={register}
            rules={{
              required: 'Age is required!',
              validate: (value) => !!parseInt(value) || 'Age must be a number!',
            }}
          />
          {/* If the user is younger than 13, require a parent email */}
          {parseInt(watch('ageStr')) < 13 && (
            <Input
              name="parentEmail"
              label="Parent Email"
              errors={errors}
              register={register}
              rules={{
                validate: (value) => {
                  if (parseInt(watch('ageStr')) < 13)
                    return value.length > 1 || 'Parent email is required!';
                  else return true;
                },
              }}
            />
          )}
          <div className="text">
            By signing up with our site, you are agreeing to our{' '}
            <Link to="/tos" className="text-button" target="_blank">
              Terms & Conditions
            </Link>
            .
          </div>
          <div className="text">
            Already have an account? <Link to="/login">Click Here</Link>
          </div>
          <input
            type="submit"
            value="Create Account"
            onClick={() => clearErrors('form')}
          />
        </form>
      </div>
    </>
  );
};

export default SignupForm;
