"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "@/validation/authSchema";
import Input from "../Input";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/rootReducer";
import { signIn } from "@/redux/apiSlice";
import Button from "../Button";
import { useRouter } from "next/navigation";

interface LoginFormValues {
  email: string;
  password: string;
}

const LoginForm = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const payload = {
        email: data.email,
        password: data.password,
      };
      const response = await dispatch(signIn(payload)).unwrap();
      router.push("/work-track");
      reset();
    } catch (err: any) {
      console.error("Signup failed:", err);
    }
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
        <a
          href="/forgot-password"
          className="text-white/60 hover:text-white text-sm"
        >
          Forgot password?
        </a>
      </div>

      <Button
        type="submit"
        loader={isSubmitting}
        className="w-full bg-white text-black font-semibold text-xl py-5 rounded-3xl active:scale-[0.97] transition-all duration-200 shadow-lg shadow-black/30"
      >
        Log In
      </Button>
    </form>
  );
};

export default LoginForm;
