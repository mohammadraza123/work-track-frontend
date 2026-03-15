"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { resetPasswordSchema } from "@/validation/authSchema";
import { useRouter, useSearchParams } from "next/navigation";
import Input from "../Input";
import Button from "../Button";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/rootReducer";
import { resetPassword } from "@/redux/apiSlice";
import toast from "react-hot-toast";

interface ResetPasswordFormValues {
  password: string;
  confirmPassword: string;
}

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();

  const email = searchParams.get("email");
  const otp = searchParams.get("otp");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: yupResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    try {
      const payload = { email, otp, password: data?.password };
      const response = await dispatch(resetPassword(payload)).unwrap();
      router.push("/work-track");
      toast.success(response?.message?.text);
    } catch (err) {
      console.error("OTP verification failed:", err);
    }
  };

  return (
    <div className="w-full max-w-xl bg-[#32364f] border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
      <div className="pt-10 pb-6 px-8 text-center">
        <h1 className="text-4xl font-bold text-white">Reset Password</h1>
        <p className="text-white/60 mt-2">
          Create a new password for {email ? email : "your account"}
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
            errorMessage={errors.password?.message as string | undefined}
          />

          <Input
            type="password"
            label="Confirm Password"
            placeholder="••••••••"
            name="confirmPassword"
            register={register}
            errorMessage={errors.confirmPassword?.message as string | undefined}
          />

          <Button type="submit" loader={isSubmitting}>
            {isSubmitting ? "Resetting..." : "Reset Password"}
          </Button>
        </form>
      </div>
    </div>
  );
}
