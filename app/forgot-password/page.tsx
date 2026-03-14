"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { forgotPasswordSchema } from "@/validation/authSchema";
import Input from "../components/Input";

const ForgotPasswordPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
  });

  const onSubmit = (data: any) => {
    console.log("Send reset email:", data);
  };

  return (
    <div className="min-h-screen bg-[#292c43] flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-[#32364f] border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
        <div className="pt-10 pb-6 px-8 text-center">
          <h1 className="text-4xl font-bold text-white">Forgot Password</h1>
          <p className="text-white/60 mt-2">
            Enter your email to reset your password
          </p>
        </div>

        <div className="px-8 pt-8 pb-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Email Address"
              placeholder="you@email.com"
              name="email"
              register={register}
              errorMessage={errors.email?.message}
            />

            <button
              type="submit"
              className="w-full bg-white text-[#292c43] font-semibold text-xl py-5 rounded-3xl active:scale-[0.97] transition-all duration-200 shadow-lg shadow-black/30"
            >
              Send Reset Link
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
