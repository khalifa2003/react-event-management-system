import React, { useState } from "react";
import { ForgotPasswordForm } from "./ForgotPasswordForm";
import { VerifyResetCodeForm } from "./VerifyResetCodeForm";
import { ResetPasswordForm } from "./ResetPasswordForm";
import { SuccessMessage } from "./SuccessMessage";

const ResetStep = {
  FORGOT_PASSWORD: "forgot",
  VERIFY_CODE: "verify",
  RESET_PASSWORD: "reset",
  SUCCESS: "success",
} as const;

type ResetStepType = typeof ResetStep[keyof typeof ResetStep];

export const PasswordResetFlow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<ResetStepType>(ResetStep.FORGOT_PASSWORD);
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");

  const handleForgotPasswordSuccess = (userEmail: string) => {
    setEmail(userEmail);
    setCurrentStep(ResetStep.VERIFY_CODE);
  };

  const handleVerifyCodeSuccess = (code: string) => {
    setResetCode(code);
    setCurrentStep(ResetStep.RESET_PASSWORD);
  };

  const handleResetPasswordSuccess = () => {
    setCurrentStep(ResetStep.SUCCESS);
  };

  const handleBackToForgot = () => {
    setCurrentStep(ResetStep.FORGOT_PASSWORD);
  };

  const handleGoToLogin = () => {
    // Reset all state
    setCurrentStep(ResetStep.FORGOT_PASSWORD);
    setEmail("");
    setResetCode("");
    
    // In a real app, navigate to login page
    // Example: router.push('/login');
    window.location.href = '/login';
  };

  switch (currentStep) {
    case ResetStep.FORGOT_PASSWORD:
      return <ForgotPasswordForm onSuccess={handleForgotPasswordSuccess} />;
      
    case ResetStep.VERIFY_CODE:
      return (
        <VerifyResetCodeForm
          email={email}
          onSuccess={handleVerifyCodeSuccess}
          onBack={handleBackToForgot}
        />
      );
      
    case ResetStep.RESET_PASSWORD:
      return (
        <ResetPasswordForm
          email={email}
          resetCode={resetCode}
          onSuccess={handleResetPasswordSuccess}
        />
      );
      
    case ResetStep.SUCCESS:
      return <SuccessMessage onGoToLogin={handleGoToLogin} />;
      
    default:
      return null;
  }
};

export default PasswordResetFlow;