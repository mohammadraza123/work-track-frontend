"use client";

import { initializeAuth } from "@/redux/apiSlice";
import { AppDispatch } from "@/redux/rootReducer";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function InitializeAuth() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  return null;
}