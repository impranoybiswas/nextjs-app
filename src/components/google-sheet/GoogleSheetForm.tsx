import React, { useState } from "react";
import { ActionResponse, createUser } from "@/lib/google-sheet";

export default function GoogleSheetForm() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<ActionResponse | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);

    const formData = new FormData(e.currentTarget);

    const userData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
    };

    const result = await createUser(userData);
    setResponse(result);
    setLoading(false);

    if (result.success) {
      (e.target as HTMLFormElement).reset();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input type="text" name="name" placeholder="Name" className="input" />
      <input type="email" name="email" placeholder="Email" className="input" />
      {response && <p className="text-sm">{response?.message}</p>}
      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? "Adding..." : "Add User to Sheet"}
      </button>
    </form>
  );
}
