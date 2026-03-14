"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { resetPasswordSchema } from "@/validation/authSchema";
import Input from "../components/Input";

const ResetPasswordPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(resetPasswordSchema),
  });

  const onSubmit = (data: any) => {
    console.log("Reset password:", data);
  };

  return (
    <div className="min-h-screen bg-[#292c43] flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-[#32364f] border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
        <div className="pt-10 pb-6 px-8 text-center">
          <h1 className="text-4xl font-bold text-white">Reset Password</h1>
          <p className="text-white/60 mt-2">
            Create a new password for your account
          </p>
        </div>

        <div className="px-8 pt-8 pb-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              type="password"
              label="New Password"
              placeholder="••••••••"
              name="password"
              register={register}
              errorMessage={errors.password?.message}
            />

            <Input
              type="password"
              label="Confirm Password"
              placeholder="••••••••"
              name="confirmPassword"
              register={register}
              errorMessage={errors.confirmPassword?.message}
            />

            <button
              type="submit"
              className="w-full bg-white text-[#292c43] font-semibold text-xl py-5 rounded-3xl active:scale-[0.97] transition-all duration-200 shadow-lg shadow-black/30"
            >
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
