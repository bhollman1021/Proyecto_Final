import React from "react";
import { signIn, useSession } from "next-auth/client";
import { useForm } from "react-hook-form";
const Login = () => {
  const { register, handleSubmit } = useForm();
  const [session] = useSession();

  const iniciarSession = (data, e) => {
    e.preventDefault();
    signIn("credentials", {
      redirect: false,
      usuario: data.usuario,
      password: data.contraseña,
    });
  };

  return (
    <div className="flex height-container justify-center items-center  ">
      <div className="w-full max-w-xs ">
        <form
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
          onSubmit={handleSubmit(iniciarSession)}
        >
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              placeholder="usuario"
              {...register("usuario")}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              className="shadow appearance-none borderrounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              type="password"
              placeholder="******************"
              {...register("contraseña")}
            />
            <p className="text-red-500 text-xs italic">
              Please choose a password.
            </p>
          </div>
          <div className="flex flex-center center-contain ">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Sign In
            </button>
          </div>
        </form>
        <p className="text-center text-gray-500 text-xs">
          &copy;2020 Acme Corp. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
