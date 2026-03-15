import * as yup from "yup";

export const loginSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),

  password: yup
    .string()
    .min(6, "Password must be 6 characters")
    .required("Password is required"),
});

export const signupSchema = yup.object({
  name: yup.string().required("Full name is required"),

  email: yup.string().email("Invalid email").required("Email is required"),

  password: yup
    .string()
    .min(6, "Password must be 6 characters")
    .required("Password is required"),
});

export const OtpSchema = yup.object({
  otp: yup
    .string()
    .required("OTP is required")
    .matches(/^[0-9]{6}$/, "OTP must be 6 digits"),
});

export const forgotPasswordSchema = yup.object({
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
});

export const resetPasswordSchema = yup.object({
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});
