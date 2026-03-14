"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signupSchema } from "@/validation/authSchema";
import Input from "../Input";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/rootReducer";
import { signUp } from "@/redux/apiSlice";

interface SignupFormValues {
  name: string;
  email: string;
  password: string;
}

const SignupForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignupFormValues>({
    resolver: yupResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormValues) => {
    try {
      const payload = {
        username: data.name,
        email: data.email,
        password: data.password,
      };

      // Redux async thunk call
      const response = await dispatch(signUp(payload)).unwrap();

      console.log("Signup success:", response);

      // Reset form after successful submit
      reset();
    } catch (err: any) {
      console.error("Signup failed:", err);
      // You can also show toast notification here
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        label="Full Name"
        placeholder="John Doe"
        name="name"
        register={register}
        errorMessage={errors.name?.message}
      />

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

      <button
        type="submit"
        className="w-full bg-white text-[#292c43] font-semibold text-xl py-5 rounded-3xl active:scale-[0.97] transition-all duration-200 shadow-lg shadow-black/30"
      >
        Create Account
      </button>
    </form>
  );
};

export default SignupForm;
