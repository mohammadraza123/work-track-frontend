import toast from "react-hot-toast";
import { getUser, logout, signIn, signUp, verifyOtp } from "./apiSlice";
import Cookies from "js-cookie";

export const extraReducersBuilder = (builder: any) => {
  builder

    // Sign Up
    .addCase(signUp.pending, (state: any, action: any) => {
      state.status = "loading";
    })
    .addCase(signUp.fulfilled, (state: any, action: any) => {
      state.status = "succeeded";
      state.error = null;
      Cookies.set("token", action?.payload?.accessToken, { expires: 7 });
      toast.success(action?.payload?.message);
    })
    .addCase(signUp.rejected, (state: any, action: any) => {
      state.status = "failed";
      state.error = action?.payload?.meta?.message;
      toast.error(action?.payload?.meta?.message);
    }) 

    // Sign In
    .addCase(signIn.pending, (state: any, action: any) => {
      state.status = "loading";
    })
    .addCase(signIn.fulfilled, (state: any, action: any) => {
      state.status = "succeeded";
      state.error = null;
      state.user = action?.payload?.data;
      toast.success(action?.payload?.message?.text);
      Cookies.set("token", action?.payload?.data.token, { expires: 7 });
      localStorage.setItem("user", JSON.stringify(action?.payload?.data));
    })
    .addCase(signIn.rejected, (state: any, action: any) => {
      state.status = "failed";
      state.error = action?.payload?.meta?.message;
      toast.error(action?.payload?.message);
    })

    // Verify Email
    .addCase(verifyOtp.pending, (state: any, action: any) => {
      state.status = "loading";
    })
    .addCase(verifyOtp.fulfilled, (state: any, action: any) => {
      state.status = "succeeded";
      state.error = null;
      toast.success(action?.payload?.message);
    })
    .addCase(verifyOtp.rejected, (state: any, action: any) => {
      state.status = "failed";
      state.error = action?.payload?.meta?.message;
      toast.error(action?.payload?.message);
    })

    // Get User
    .addCase(getUser.pending, (state: any, action: any) => {
      state.status = "loading";
    })
    .addCase(getUser.fulfilled, (state: any, action: any) => {
      state.status = "succeeded";
      state.error = null;
      localStorage.setItem("user", JSON.stringify(action?.payload?.user));
    })
    .addCase(getUser.rejected, (state: any, action: any) => {
      state.status = "failed";
      state.error = action?.payload?.meta?.message;
      toast.error(action?.payload?.meta?.message);
    })

    // Log out
    .addCase(logout.pending, (state: any, action: any) => {
      state.status = "loading";
    })
    .addCase(logout.fulfilled, (state: any, action: any) => {
      state.status = "succeeded";
      state.error = null;
      localStorage.removeItem("user");
      Cookies.remove("token");
      toast.success("Logout Successfully");
    })
    .addCase(logout.rejected, (state: any, action: any) => {
      state.status = "failed";
      state.error = action?.payload?.meta?.message;
      toast.error(action?.payload?.meta?.message);
    });
};
