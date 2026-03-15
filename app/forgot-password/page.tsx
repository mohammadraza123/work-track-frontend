"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { forgotPasswordSchema } from "@/validation/authSchema";
import Input from "../components/Input";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/rootReducer";
import { forgotPassword } from "@/redux/apiSlice";
import Button from "../components/Button";
import toast from "react-hot-toast";

const ForgotPasswordPage = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: any) => {
    try {
      const payload = {
        email: data.email,
      };
      const response = await dispatch(forgotPassword(payload)).unwrap();
      router.push(`/verify-otp?type=forgot&email=${data?.email}`);
      reset();
    } catch (err: any) {
      console.error("Signup failed:", err);
      toast.error(err?.message);
    }
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

            <Button loader={isSubmitting} type="submit">
              Send Otp
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
