import { Suspense } from "react";
import OTPForm from "../components/OTPForm";

export default function VerifyOTPPage() {
  return (
    <div className="min-h-screen bg-[#292c43] flex items-center justify-center p-4 font-sans">
      <Suspense
        fallback={<div className="text-white">Loading OTP form...</div>}
      >
        <OTPForm />
      </Suspense>
    </div>
  );
}
