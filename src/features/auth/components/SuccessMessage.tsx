import React from "react";
import { CheckCircle } from "lucide-react";

interface SuccessMessageProps {
  onGoToLogin: () => void;
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({ onGoToLogin }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Password Reset Successful!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Your password has been successfully reset. You can now login with
            your new password.
          </p>
        </div>

        <button
          onClick={onGoToLogin}
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};