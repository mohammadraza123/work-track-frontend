"use client";

import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/rootReducer";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { OtpSchema } from "@/validation/authSchema";
import { verifyOtp } from "@/redux/apiSlice";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "../Button"; // adjust path if needed

interface OTPFormValues {
  otp: string;
}

export default function OTPForm() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const searchParams = useSearchParams();

  const type = searchParams.get("type");
  const email = searchParams.get("email");

  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const inputsRef = useRef<HTMLInputElement[]>([]);

  const {
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<OTPFormValues>({
    resolver: yupResolver(OtpSchema),
    defaultValues: { otp: "" },
  });

  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setValue("otp", newOtp.join(""));

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const onSubmit = async (data: OTPFormValues) => {
    try {
      const payload = { email, type, otp: data.otp };
      const response = await dispatch(verifyOtp(payload)).unwrap();
      console.log("OTP success:", response);
      router.push("/work-track");
    } catch (err) {
      console.error("OTP verification failed:", err);
    }
  };

  return (
    <div className="w-full max-w-sm sm:max-w-md bg-[#32364f] border border-white/10 rounded-3xl shadow-2xl overflow-hidden mx-auto">
      <div className="pt-8 sm:pt-10 pb-6 px-6 sm:px-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-white">Enter OTP</h1>
        <p className="text-white/60 mt-2 text-sm sm:text-base">
          Enter the 6-digit code sent to {email || "your email"}
        </p>
      </div>

      <div className="px-6 sm:px-8 pb-8 sm:pb-10">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex justify-center gap-2 sm:gap-3 md:gap-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                pattern="\d*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => {
                  if (el) inputsRef.current[index] = el;
                }}
                className={`
                  w-10 h-12 sm:w-12 sm:h-14 
                  text-center text-lg sm:text-xl font-semibold 
                  rounded-2xl bg-white/10 border border-white/20 
                  text-white outline-none 
                  focus:border-white focus:bg-white/20 
                  transition-all
                `}
              />
            ))}
          </div>

          {errors.otp && (
            <p className="text-red-400 text-sm text-center mt-2">
              {errors.otp.message}
            </p>
          )}

          <Button type="submit" loader={isSubmitting}>
            Verify OTP
          </Button>
        </form>
      </div>
    </div>
  );
}
