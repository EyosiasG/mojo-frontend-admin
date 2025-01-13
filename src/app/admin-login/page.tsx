"use client";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from 'sweetalert2';
import { authApi } from "@/api/auth";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Next.js Router for redirection

  // Handle form submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setLoading(true);
    setError(null);

    try {
      const response = await authApi.loginAgent(email, password);
      const data = await response.json();
      
      if (!response.ok) {
        toast.error(data.message || 'Admin login failed');
        setLoading(false);
        return;
      }

      const token = data.token || data.access_token || data.accessToken || data.admin_access_token;
      
      if (!token) {
        toast.error('Invalid server response: No token received');
        setLoading(false);
        return;
      }

      localStorage.setItem('access_token', token);
      localStorage.setItem('admin', 'true');
      toast.success('Admin login successful');
      setTimeout(() => {
        router.push("/admin-dashboard");
      }, 1500);
    } catch (error) {
      toast.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
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

            <div className="space-y-6 px-4">
              <h1 className="text-2xl font-semibold text-center">
                Admin Login
              </h1>

              {/* Display error message */}
              {/* {error && (
                <div className="text-red-500 text-center mb-4">{error}</div>
              )} */}

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
                    placeholder="Enter your username"
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
                    placeholder="Enter your password"
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
