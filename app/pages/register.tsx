import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { auth } from '../firebaseConfig';// Firebaseの設定ファイルからauthオブジェクトをインポート
import { signUpWithEmail } from '../lib/firebase/apis/auth';
import { useRouter } from 'next/router';

const Register = () => {
  const { handleSubmit, register } = useForm();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const router = useRouter();

  const onSubmit = handleSubmit(async (data) => {
    signUpWithEmail({ email: data.email, password: data.password }).then(
      (res) => {
        if (res) {
          console.log('新規登録成功');
          router.push('/');
          // 登録成功したときにポップアップ表示を出す
        } else {
          console.log('新規登録失敗');
          // 失敗した時もポップアップ表示
        }
      }
    );
  });

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmVisibility = () => {
    setConfirmVisible(!confirmVisible);
  };

  return (
    <div className="h-screen bg-white flex justify-center items-center">
      <div className="lg:w-96 md:w-1/2 w-2/3 flex flex-col justify-center items-center">
        <form
          onSubmit={onSubmit}
          className="bg-white p-8 rounded-lg shadow-[0_4px_6px_5px_rgba(0,0,0,0.1)] max-w-md w-400"
        >
          <h1 className="text-center text-2xl mb-6 text-gray-600 font-bold font-sans">
            Register
          </h1>

          <div>
            <label
              className="text-gray-800 font-semibold block my-3 text-md"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="w-full bg-gray-100 px-4 py-2 rounded-lg focus:outline-none"
              type="text"
              id="email"
              placeholder="@email"
              {...register('email')}
            />
          </div>
          <div>
            <label
              className="text-gray-800 font-semibold block my-3 text-md"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="w-full bg-gray-100 px-4 py-2 rounded-lg focus:outline-none"
              type={passwordVisible ? 'text' : 'password'}
              id="password"
              placeholder="password"
              {...register('password')}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="focus:outline-none"
            >
              {passwordVisible ? 'Hide' : 'Show'}
            </button>
          </div>
          <div>
            <label
              className="text-gray-800 font-semibold block my-3 text-md"
              htmlFor="confirm"
            >
              Confirm password
            </label>
            <input
              className="w-full bg-gray-100 px-4 py-2 rounded-lg focus:outline-none"
              type={confirmVisible ? 'text' : 'password'}
              name="confirm"
              id="confirm"
              placeholder="confirm password"
            />
            <button
              type="button"
              onClick={toggleConfirmVisibility}
              className="focus:outline-none"
            >
              {confirmVisible ? 'Hide' : 'Show'}
            </button>
          </div>
          <button
            type="submit"
            className="w-full mt-6 bg-indigo-600 rounded-lg px-4 py-2 text-lg text-white tracking-wide font-semibold font-sans"
          >
            Register
          </button>
          <button
            type="submit"
            className="w-full mt-6 mb-3 bg-indigo-100 rounded-lg px-4 py-2 text-lg text-gray-800 tracking-wide font-semibold font-sans"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
