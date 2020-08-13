import React, { useReducer } from 'react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import Card from '../components/common/Card';
import Hyperlink from './../components/common/Hyperlink';
import Label from './../components/common/Label';
import FormInput from './../components/FormInput';
import FormSuccess from './../components/FormSuccess';
import FormError from './../components/FormError';
import GradientBar from './../components/common/GradientBar';
import GradientButton from '../components/common/GradientButton';
import logo from './../images/logo.png';
import { publicFetch } from '../util/fetch';
import { Redirect } from 'react-router';

const LoginSchema = Yup.object().shape({
  email: Yup.string().required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const initialState = {
  loading: false,
  success: '',
  error: '',
  redirect: false,
};

const loginReducer = (state, action) => {
  switch (action.type) {
    case 'SUCCESS': {
      return {
        ...state,
        loading: true,
        success: action.payload.message,
        redirect: true,
      };
    }

    case 'FAIL': {
      return {
        ...state,
        loading: false,
        success: null,
        error: action.payload.message,
      };
    }

    default:
      return state;
  }
};

const Login = () => {
  const [state, dispatch] = useReducer(loginReducer, initialState);

  const { loading, success, error, redirect } = state;

  const submitCredentials = async (credentials) => {
    try {
      const { data } = await publicFetch.post('authenticate', credentials);
      console.log(data);
      dispatch({
        type: 'SUCCESS',
        payload: {
          message: data.message,
        },
      });
    } catch (error) {
      const { data } = error.response;
      dispatch({
        type: 'FAIL',
        payload: {
          error: data.message,
        },
      });
    }
  };

  return (
    <>
      {redirect && <Redirect to="/dashboard" />}
      <section className="w-full sm:w-1/2 h-screen m-auto p-8 sm:pt-10">
        <GradientBar />
        <Card>
          <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full">
              <div>
                <div className="w-32 m-auto mb-6">
                  <img src={logo} alt="Logo" />
                </div>
                <h2 className="mb-2 text-center text-3xl leading-9 font-extrabold text-gray-900">
                  Log in to your account
                </h2>
                <p className="text-gray-600 text-center">
                  Don't have an account?{' '}
                  <Hyperlink to="signup" text="Sign up now" />
                </p>
              </div>

              <Formik
                initialValues={{
                  email: '',
                  password: '',
                }}
                onSubmit={(values) => submitCredentials(values)}
                validationSchema={LoginSchema}
              >
                {() => (
                  <Form className="mt-8">
                    {success && <FormSuccess text={success} />}
                    {error && <FormError text={error} />}
                    <div>
                      <div className="mb-2">
                        <div className="mb-1">
                          <Label text="Email" />
                        </div>
                        <FormInput
                          ariaLabel="Email"
                          name="email"
                          type="text"
                          placeholder="Email"
                        />
                      </div>
                      <div>
                        <div className="mb-1">
                          <Label text="Password" />
                        </div>
                        <FormInput
                          ariaLabel="Password"
                          name="password"
                          type="password"
                          placeholder="Password"
                        />
                      </div>
                    </div>

                    <div className="mt-6 flex justify-start">
                      <div className="text-sm leading-5">
                        <Hyperlink
                          to="forgot-password"
                          text="Forgot your password?"
                        />
                      </div>
                    </div>

                    <div className="mt-6">
                      <GradientButton
                        type="submit"
                        text="Log In"
                        loading={loading}
                      />
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </Card>
      </section>
    </>
  );
};

export default Login;
