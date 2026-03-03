// SignupSuccess.tsx
import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';

interface SignupSuccessProps {
  onGoToLogin: () => void;
}

export function SignupSuccess({ onGoToLogin }: SignupSuccessProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-secondary/30 to-accent/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl md:text-3xl font-light text-foreground">
            Account Created Successfully
          </h1>
          <p className="text-muted-foreground mt-2">
            Your account has been created. Please sign in to continue.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card className="p-6 md:p-8 bg-white/90 backdrop-blur-sm border-0 shadow-xl text-center">
            <Button
              onClick={onGoToLogin}
              className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground border-0 py-3 text-lg"
            >
              Go to Login
            </Button>

            <p className="text-sm text-muted-foreground mt-4">
              You can now use your email and password to sign in.
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}