import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { loginUser } from "../services/auth.service";
import { useNavigate } from "react-router-dom";


const Login: React.FC = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async () => {
    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      return;
    }
    setError("");
    try {
      const data = await loginUser(formData);
      localStorage.setItem("token", data.token);
      navigate("/events");
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Sign In</h2>
          <p className="text-gray-600 mt-2">Welcome back! Please login to your account</p>
        </div>
        <div className="space-y-6">
          {error && ( <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg"><AlertCircle className="w-5 h-5" /><span className="text-sm">{error}</span></div>)}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="Enter your email" required/>
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input type={showPassword ? "text" : "password"} id="password" name="password" value={formData.password} onChange={handleInputChange} className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="Enter your password" required/>
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
            </div>
          </div>
          <button onClick={handleSubmit} disabled={isLoading} className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" >{isLoading ? "Signing In..." : "Sign In"}</button>
        </div>
        <div className="mt-6 text-center">
          <p className="text-gray-600">Don't have an account? <button onClick={() => navigate("/register")} className="text-indigo-600 hover:text-indigo-700 font-medium">Create Account</button></p>
        </div>
        <div>
        <div>
          <h4>For Admin</h4> 
          <p>email: khalifa14112003@gmail.com</p>
          <p>password: 123456</p>
        </div>
        <br />
        <div>
          <h4>For User</h4> 
          <p>email: user@event.com</p>
          <p>password: 123456</p>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
