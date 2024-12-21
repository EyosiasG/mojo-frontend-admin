"use client";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Next.js Router for redirection

  // Handle form submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setLoading(true);
    setError(null); // Reset previous errors

    try {
      const response = await fetch("https://mojoapi.siltet.com/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: username, // Assuming you are using email for username
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store the token and user data in localStorage
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Log the token to the console (for debugging)
        // console.log("Access Token:", data.access_token);

        // Redirect to the agent dashboard
        router.push("/agent-dashboard");
      } else {
        // Handle errors (e.g., invalid credentials or other server errors)
        if (data.message) {
          // If the response has a message (like 'Invalid credentials')
          setError(data.message);
        } else {
          // Handle generic errors
          setError("An error occurred during login. Please try again.");
        }
      }
    } catch (error) {
      // Catch network or other unexpected errors
      setError("Network error. Please try again later.");
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
          {/* Optionally, add an image */}
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

              {/* Display error message */}
              {error && (
                <div className="text-red-500 text-center mb-4">{error}</div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="username"
                    className="text-sm font-medium text-gray-700"
                  >
                    Username
                  </label>
                  <Input
                    id="username"
                    type="email"
                    placeholder="username"
                    className="w-full"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
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
