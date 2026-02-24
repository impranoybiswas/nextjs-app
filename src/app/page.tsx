"use client";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-4xl font-bold text-primary">
        NextJS App with Better Auth
      </h1>
      <div className="flex gap-4">
        <Link href="/login" className="btn-primary">
          Login
        </Link>
        <Link href="/register" className="btn-primary">
          Register
        </Link>
      </div>
    </main>
  );
}
