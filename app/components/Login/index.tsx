"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "@/validation/authSchema";
import Input from "../Input";

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = (data: any) => {
    console.log("Login", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        label="Email Address"
        placeholder="you@email.com"
        name="email"
        register={register}
        errorMessage={errors.email?.message}
      />

      <Input
        type="password"
        label="Password"
        placeholder="••••••••"
        name="password"
        register={register}
        errorMessage={errors.password?.message}
      />

      <div className="text-right">
        <a className="text-white/60 hover:text-white text-sm">
          Forgot password?
        </a>
      </div>

      <button
        type="submit"
        className="w-full bg-white text-[#292c43] font-semibold text-xl py-5 rounded-3xl active:scale-[0.97] transition-all duration-200 shadow-lg shadow-black/30"
      >
        Log In
      </button>
    </form>
  );
};

export default LoginForm;
