import { Suspense } from "react";
import ResetPasswordForm from "../components/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[#292c43] flex items-center justify-center p-4 font-sans">
      <Suspense
        fallback={
          <div className="text-white text-xl">Loading reset form...</div>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
