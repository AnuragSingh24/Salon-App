import React, { useState } from "react";
import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface Props {
  setCurrentPage: (page: string) => void;
}

export function ForgotPasswordPage({ setCurrentPage }: Props) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSendOtp = async () => {
    await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });

    setOtpSent(true);
  };

  const handleVerifyOtp = async () => {
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp })
    });

    const data = await res.json();

    if (data.success) {
      setOtpVerified(true);
    } else {
      alert(data.message);
    }
  };

  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.success) {
      alert("Password updated successfully");
      setCurrentPage("auth");
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="p-6 w-96 space-y-4">
          <h2 className="text-xl font-semibold text-center">Forgot Password</h2>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            disabled={otpVerified}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />

          {otpSent && !otpVerified && (
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          )}

          {otpVerified && (
            <>
              <input
                type="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />

              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </>
          )}

          {!otpSent && (
            <Button className="w-full" onClick={handleSendOtp}>
              Send OTP
            </Button>
          )}

          {otpSent && !otpVerified && (
            <>
              <Button className="w-full" onClick={handleVerifyOtp}>
                Verify OTP
              </Button>

              <button
                className="text-sm text-primary hover:underline w-full"
                onClick={handleSendOtp}
              >
                Resend OTP
              </button>
            </>
          )}

          {otpVerified && (
            <Button className="w-full" onClick={handleResetPassword}>
              Update Password
            </Button>
          )}

          <button
            className="text-sm text-muted-foreground hover:underline w-full"
            onClick={() => setCurrentPage("auth")}
          >
            Back to Login
          </button>
        </Card>
      </motion.div>
    </div>
  );
}
