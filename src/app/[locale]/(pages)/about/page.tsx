"use client";
import React from "react";
import bcrypt from "bcryptjs";

export default function AboutPage() {
  const [password, setPassword] = React.useState("");

  //add to Local Storage
  function addToLocalStorage(key: string, value: string) {
    if (!key || !value) return;
    return localStorage.setItem(key, value);
  }

  //get from Local Storage
  function getFromLocalStorage(key: string) {
    if (!key) return;
    return localStorage.getItem(key);
  }

  // Hashing a password
  async function hashPassword(password: string) {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }

  // Comparing a password
  async function checkPassword(password: string, hash: string) {
    const isMatch = await bcrypt.compare(password, hash);
    return isMatch; // Returns true or false
  }

  const handleSavePassword = async () => {
    addToLocalStorage("local_password", await hashPassword(password));
  };

  const onSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const savedPassword = getFromLocalStorage("local_password");
    if (await checkPassword(password, savedPassword!)) {
      alert("Password is correct");
    } else {
      alert("Password is incorrect");
    }
  };

  const handleAddToLocal = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const key = (form.elements.namedItem("key") as HTMLInputElement).value;
    const value = (form.elements.namedItem("value") as HTMLInputElement)
      .value;
    addToLocalStorage(key, value);
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Submit</button>
        <button type="button" onClick={handleSavePassword}>
          Add to Local Storage
        </button>
      </form>
      <form className="flex gap-2" onSubmit={handleAddToLocal}>
        <input className="input" type="text" name="key" placeholder="Key" />
        <input className="input" type="text" name="value" placeholder="Value" />
        <button className="btn btn-natural" type="submit">Submit</button>
      </form>
    </div>
  );
}
