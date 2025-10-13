import React from 'react';
import { Button } from './ui/button';
import { Home, RefreshCw } from 'lucide-react';

interface FallbackPageProps {
  setCurrentPage: (page: string) => void;
  error?: string;
}

export function FallbackPage({ setCurrentPage, error = "Page temporarily unavailable" }: FallbackPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-secondary/30 to-accent/20 flex items-center justify-center">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-6">
            <RefreshCw className="w-8 h-8 text-primary-foreground animate-spin" />
          </div>
          
          <h1 className="text-3xl font-light text-foreground mb-4">
            MK Salon
          </h1>
          
          <p className="text-muted-foreground mb-8">
            {error}. Please try again or return to the home page.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => setCurrentPage('home')}
              className="bg-gradient-to-r from-primary to-accent text-primary-foreground"
            >
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => window.location.reload()}
              className="border-primary/20 hover:border-primary"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Page
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}