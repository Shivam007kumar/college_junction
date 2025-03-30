"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";

export default function SignUpPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Send a POST request to your backend to create a new user
      const response = await axios.post("http://localhost:3001/register", {
        email,
        password,
      });

      // Check if the response indicates success
      if (response.data && response.status === 200) {
        // Redirect to the login page after successful account creation
        router.push("/components/Login");
      } else {
        setError("Failed to create account. Please try again.");
      }
    } catch (err) {
      // Handle specific error messages from the backend
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.error || "An error occurred. Please try again.");
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="logincontainer">
      <div className="login">
        <div className="card">
          <h2>Sign Up</h2>
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="button" type="submit" disabled={loading}>
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>
          <p className="toggle">
            <Link href="/components/Login">Already have an account? Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}