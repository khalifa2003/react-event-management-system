import React, { useState } from "react";
import { AlertCircle, Shield, ArrowLeft } from "lucide-react";
import { verifyResetCode } from "../services/auth.service";

interface VerifyResetCodeFormProps {
  email: string;
  onSuccess: (resetCode: string) => void;
  onBack: () => void;
}

export const VerifyResetCodeForm: React.FC<VerifyResetCodeFormProps> = ({ 
  email, 
  onSuccess, 
  onBack 
}) => {
  const [resetCode, setResetCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resetCode.trim()) {
      setError("Reset code is required");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await verifyResetCode({ resetCode });
      onSuccess(resetCode);
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid or expired reset code");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
            <Shield className="h-6 w-6 text-indigo-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Verify Reset Code
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter the reset code sent to {email}
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="resetCode" className="sr-only">
              Reset Code
            </label>
            <input
              id="resetCode"
              name="resetCode"
              type="text"
              autoComplete="off"
              placeholder="Enter reset code"
              value={resetCode}
              onChange={(e) => setResetCode(e.target.value)}
              className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              required
              disabled={isLoading}
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onBack}
              className="group relative flex-1 flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex-1 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoading ? "Verifying..." : "Verify Code"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
