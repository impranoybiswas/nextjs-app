import { signIn } from "@/lib/auth-client";
import React from "react";
import { toast } from "sonner";
import GoogleSignInButton from "./GoogleSignInButton";

export default function SignInForm() {
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;

    if (!email || !password) {
      toast.error("Email and password are required.");
      return;
    }

    const { error } = await signIn.email({
      email,
      password,
      callbackURL: "/dashboard",
    });

    if (error) {
      toast.error("Sign in failed: " + error.message);
      return;
    }

    toast.success("Signed in successfully!");
  };
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

      <button onClick={() => toast("Forgot password flow not implemented")}>
        Forgot Password?
      </button>

      <button type="submit" className="btn btn-primary">
        Sign In
      </button>
      <div className="my-4 text-center text-gray-400">or</div>
      <GoogleSignInButton />
    </form>
  );
}
