"use client";

import React, { useRef, useState } from "react";
import Button from "../components/Button";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/rootReducer";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { OtpSchema } from "@/validation/authSchema";
import { verifyOtp } from "@/redux/apiSlice";
import { useRouter, useSearchParams } from "next/navigation";

interface OTPFormValues {
  otp: string;
}

const OTPPage = () => {
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
    defaultValues: {
      otp: "",
    },
  });

  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    const otpValue = newOtp.join("");
    setValue("otp", otpValue);

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
      const payload = {
        email,
        type,
        otp: data.otp,
      };
      router.push("/work-track");

      const response = await dispatch(verifyOtp(payload)).unwrap();
      console.log(response);
    } catch (err) {
      console.error("OTP verification failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#292c43] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-[#32364f] border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
        <div className="pt-10 pb-6 px-8 text-center">
          <h1 className="text-4xl font-bold text-white">Enter OTP</h1>
          <p className="text-white/60 mt-2">
            Enter the 6-digit code sent to {email}
          </p>
        </div>

        <div className="px-8 pb-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex justify-between gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  ref={(el: any) => (inputsRef.current[index] = el!)}
                  className="w-12 h-14 text-center text-xl font-semibold rounded-2xl bg-white/10 border border-white/20 text-white outline-none focus:border-white focus:bg-white/20 transition-all"
                />
              ))}
            </div>

            {errors.otp && (
              <p className="text-red-400 text-sm text-center">
                {errors.otp.message}
              </p>
            )}

            <Button type="submit" loader={isSubmitting}>
              Verify OTP
            </Button>
          </form>

          {/* <p className="text-white/60 mt-4 text-center text-sm">
            Didn't receive the code?{" "}
            <button
              type="button"
              className="text-white font-semibold hover:underline"
            >
              Resend OTP
            </button>
          </p> */}
        </div>
      </div>
    </div>
  );
};

export default OTPPage;
