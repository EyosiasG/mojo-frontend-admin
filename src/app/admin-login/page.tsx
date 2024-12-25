"use client";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle form submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Reset error state

    try {
      const response = await fetch(
        "https://mojoapi.grandafricamarket.com/api/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // On successful login, store token and redirect
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("user_id", data.user.id);
      

        // Redirect to dashboard
        window.location.href = "/admin-dashboard";
      } else {
        // Handle unsuccessful login
        setError(data.message || "An error occurred during login.");
      }
    } catch (error) {
      setError("Network error. Please try again later.");
      
      window.location.href = "/admin-dashboard";
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100">
      <div className="w-full grid lg:grid-cols-2 min-h-screen p-5 gap-5">
        {/* Left side - Animation Container */}
        <div
          className={`relative hidden lg:flex items-center justify-center bg-[url('/img/login-side-picture.png')] rounded-3xl w-full h-full`}
        >
          {/* <Image
            src="/img/login-side-picture.png"
            width={500}
            height={500}
            alt="Side Image"
            className="bg-rose-500 cover"
          /> */}
        </div>
        {/* Right side - Login Form */}
        <div className="bg-white w-full rounded-3xl flex justify-center items-center">
          <div className="w-full max-w-md mx-auto flex flex-col justify-center space-y-6">
            <div className="flex justify-center mb-8">
              <Image
                src="/img/logo.png"
                alt="MOJO Money Transfer"
                width={200}
                height={60}
                className="h-15"
              />
            </div>

            <div className="space-y-6">
              <h1 className="text-2xl font-semibold text-center">
                Login To Your Account
              </h1>

              {error && (
                <div className="text-red-500 text-center mb-4">{error}</div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="jhondoe@example.com"
                    className="w-full"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="password"
                    className="w-full"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#2E3192] hover:bg-[#1E2082] text-white my-4"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
