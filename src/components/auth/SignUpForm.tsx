"use client";

import { signUp } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import React from "react";
import GoogleSignInButton from "./GoogleSignInButton";

export default function SignUpForm() {
  const router = useRouter();
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;

    if (!email || !password) {
      alert("Email and password are required.");
      return;
    }

    const { error } = await signUp.email({ name, email, password });

    if (error) {
      alert("Sign up failed: " + error.message);
      return;
    }
    router.push("/dashboard");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        name="name"
        type="text"
        placeholder="Name"
        required
        className="input"
      />
      <input
        name="email"
        type="email"
        placeholder="Email"
        required
        className="input"
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        required
        className="input"
      />

      <button className="btn btn-primary" type="submit">
        Sign Up
      </button>
      <div className="my-4 text-center text-gray-400">or</div>
      <GoogleSignInButton />
    </form>
  );
}
