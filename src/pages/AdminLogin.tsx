import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FormField from "../components/FormField";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import bcrypt from "bcryptjs";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setpassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const backend_url = import.meta.env.VITE_BACKEND_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // const password = await bcrypt.hash(password, 12); // Lower rounds for client-side

    try {
      // API call implementation
      const response = await fetch(`${backend_url}/api/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const { token } = await response.json();
      localStorage.setItem("adminToken", token);

      // Demo purpose code - commented out
      // if (username === "admin" && password === "admin") {
      //   // Simulate storing a token
      //   localStorage.setItem("adminToken", "dummy-jwt-token");
      //   toast({
      //     title: "Login Successful",
      //     description: "Welcome to the admin dashboard",
      //   });
      //   navigate("/admin/dashboard");
      // } else {
      //   throw new Error("Invalid credentials");
      // }

      toast({
        title: "Login Successful",
        description: "Welcome to the admin dashboard",
      });
      navigate("/admin/dashboard");
    } catch (error) {
      toast({
        title: "Login Failed",
        description:
          error instanceof Error
            ? error.message
            : "Invalid username or password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-isabelline-800">
      <Header />
      <main className="flex-grow container mx-auto py-16 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-gunmetal mb-6 text-center">
            Admin Login
          </h1>
          <form onSubmit={handleSubmit}>
            <FormField label="Username" id="username" required>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo_dye-400"
              />
            </FormField>
            <FormField label="password" id="password" required>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setpassword(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo_dye-400"
              />
            </FormField>
            <div className="mt-8">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo_dye hover:bg-indigo_dye-600 text-white py-3 rounded-md transition-colors"
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminLogin;
