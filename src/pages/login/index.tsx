import type { NextPage } from 'next';
import { ChangeEvent, FormEvent, useState } from 'react';
import { useAppDispatch } from '../../common/hooks';
import { userLogin } from '../../features/auth/authSlice';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { ValidateEmail } from '../../common/functions';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { getUserProfilePicture } from '../../features/photo/photoSlice';

const LoginPage: NextPage = () => {
  const dispatch = useAppDispatch();
  const [inputs, setInputs] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });
  const router = useRouter();

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => {
      return { ...values, [name]: value };
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (validate()) {
      try {
        const result = await dispatch(userLogin(inputs)).unwrap();
        if (result.isSuccess) {
          if (result.data.user.profilePicture) {
            await dispatch(
              getUserProfilePicture({
                id: result.data.user.profilePicture.id,
              }),
            ).unwrap();
          }
          await router.push('/');
        }
      } catch (e) {}
    }
  }

  function validate() {
    let isValid = true;
    if (!inputs.email) {
      setErrors((values) => {
        return { ...values, email: 'Email cannot be empty' };
      });
      isValid = false;
    } else if (!ValidateEmail(inputs.email)) {
      setErrors((values) => {
        return { ...values, email: 'Wrong email format' };
      });
      isValid = false;
    } else {
      setErrors((values) => {
        return { ...values, email: '' };
      });
    }

    if (!inputs.password) {
      setErrors((values) => {
        return { ...values, password: 'Password cannot be empty' };
      });
      isValid = false;
    } else if (inputs.password.length < 6) {
      setErrors((values) => {
        return {
          ...values,
          password: 'Password must have at least 6 characters',
        };
      });
      isValid = false;
    } else {
      setErrors((values) => {
        return { ...values, password: '' };
      });
    }
    return isValid;
  }

  return (
    <>
      <Head>
        <title>Login Admin</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h1 className="text-center text-3xl font-bold text-green-400">
            DELIVERY SYSTEM
          </h1>
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="mt-2">
              <span className="p-float-label">
                <InputText
                  id="email"
                  name="email"
                  value={inputs.email || ''}
                  className={
                    (errors.email !== '' ? 'p-invalid' : '') +
                    ' p-inputtext-sm w-[100%]'
                  }
                  onChange={handleChange}
                />
                <label htmlFor="username">Email</label>
              </span>
              <p className={'text-red-300 mt-0.5 ml-1 text-xs'}>
                {errors.email}
              </p>
            </div>

            <div className="mt-5">
              <span className="p-float-label mt-10">
                <InputText
                  id="password"
                  type="password"
                  name="password"
                  value={inputs.password || ''}
                  className={
                    (errors.password !== '' ? 'p-invalid' : '') +
                    ' p-inputtext-sm w-[100%]'
                  }
                  onChange={handleChange}
                />
                <label htmlFor="username">Password</label>
              </span>
              <p className={'text-red-300 mt-0.5 ml-1 text-xs'}>
                {errors.password}
              </p>
            </div>

            <div>
              <Button
                className={'w-full !block'}
                type="submit"
                severity="success"
              >
                Sign in
              </Button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?{' '}
            <a
              href=""
              className="font-semibold leading-6 text-emerald-600 hover:text-indigo-500"
            >
              Register now!
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
