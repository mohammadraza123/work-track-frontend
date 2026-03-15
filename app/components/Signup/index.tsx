"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signupSchema } from "@/validation/authSchema";
import Input from "../Input";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/rootReducer";
import { signUp } from "@/redux/apiSlice";
import Button from "../Button";
import { useRouter } from "next/navigation";

interface SignupFormValues {
  name: string;
  email: string;
  password: string;
}

const SignupForm: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
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

      const response = await dispatch(signUp(payload)).unwrap();
      router.push(`/verify-otp?type=signup&email=${data?.email}`);
      reset();
    } catch (err: any) {
      console.error("Signup failed:", err);
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

      <Button type="submit" loader={isSubmitting}>
        Create Account
      </Button>
    </form>
  );
};

export default SignupForm;
