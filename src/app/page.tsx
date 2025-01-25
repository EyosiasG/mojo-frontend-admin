"use client";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { authApi } from "@/api/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Next.js Router for redirection

  // Add timer management
  useEffect(() => {
    // Function to handle logout
    const handleLogout = () => {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      localStorage.removeItem("admin");
      router.push("/"); // Redirect to login page
      
      toast.warning('Session Expired - You have been logged out due to inactivity.', {
        position: "top-center",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    };

    // Reset timer on user activity
    const resetTimer = () => {
      localStorage.setItem('lastActivity', Date.now().toString());
    };

    // Check for inactivity
    const checkInactivity = () => {
      const lastActivity = localStorage.getItem('lastActivity');
      if (lastActivity) {
        const inactiveTime = Date.now() - parseInt(lastActivity);
        if (inactiveTime > 15 * 60 * 1000) { // 15 minutes in milliseconds
          handleLogout();
        }
      }
    };

    // Set up activity listeners
    const activities = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];
    activities.forEach(activity => {
      document.addEventListener(activity, resetTimer);
    });

    // Set initial activity timestamp
    resetTimer();

    // Set up interval to check inactivity
    const intervalId = setInterval(checkInactivity, 60000); // Check every minute

    // Cleanup function
    return () => {
      activities.forEach(activity => {
        document.removeEventListener(activity, resetTimer);
      });
      clearInterval(intervalId);
    };
  }, [router]); // Add router as dependency

  // Handle form submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Reset previous errors

    try {
      
      const response = await authApi.loginAdmin(email, password);
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        // Store the token and user data in localStorage
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("admin", "pass");

        console.log("Access Token:", localStorage.getItem("access_token"));

        toast.success('Login successful! Redirecting to dashboard...', {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        router.push("/admin-dashboard");
      } else {
        // Handle errors (e.g., invalid credentials or other server errors)
        if (data.message) {
          // If the response has a message (like 'Invalid credentials')
          setError(data.message);
          // Show error alert
          toast.error(data.message, {
            position: "top-center",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        } else {
          // Handle generic errors
          setError("An error occurred during login. Please try again.");
          // Show error alert
          toast.error("An error occurred during login. Please try again.", {
            position: "top-center",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      // Make the error message more specific
      const errorMessage = error instanceof Error ? error.message : 'Network error. Please check your internet connection and try again.';
      setError(errorMessage);
      
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
      />
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 relative">
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
    </>
  );
}
