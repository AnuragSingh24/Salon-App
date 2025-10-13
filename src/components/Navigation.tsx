import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Scissors, Menu, X, Home, Calendar, Star, Gift, Camera, Phone, Settings, User, Clock, Plus, Package, MessageSquare, BarChart3 } from 'lucide-react';
import { Button } from './ui/button';

interface NavigationProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  isAuthenticated: boolean;
  userRole: string;
}

export function Navigation({ currentPage, setCurrentPage, isAuthenticated, userRole }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Different navigation items based on user role
  const navItems = userRole === 'admin' && isAuthenticated 
    ? [
        { id: 'admin', label: 'Dashboard', icon: BarChart3 },
        { id: 'timeslots', label: 'Time Slots', icon: Clock },
        { id: 'admin-services', label: 'Manage Services', icon: Plus },
        { id: 'admin-packages', label: 'Manage Packages', icon: Package },
        { id: 'admin-reviews', label: 'Manage Reviews', icon: MessageSquare },
      ]
    : [
        { id: 'home', label: 'Home', icon: Home },
        { id: 'services', label: 'Services', icon: Scissors },
        { id: 'packages', label: 'Packages', icon: Gift },
        { id: 'gallery', label: 'Gallery', icon: Camera },
        { id: 'reviews', label: 'Reviews', icon: Star },
        { id: 'contact', label: 'Contact', icon: Phone },
      ];

  const authItems = isAuthenticated 
    ? [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'settings', label: 'Settings', icon: Settings },
      ]
    : [{ id: 'auth', label: 'Sign In', icon: User }];

  const handleNavClick = (pageId: string) => {
    setCurrentPage(pageId);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-border"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div 
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => handleNavClick('home')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                <Scissors className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-lg text-foreground">MK Salon</span>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                      currentPage === item.id 
                        ? 'text-primary bg-secondary' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </motion.button>
                );
              })}
            </div>

            {/* Auth & CTA */}
            <div className="hidden md:flex items-center space-x-4">
              {authItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={item.id === 'auth' ? 'outline' : 'ghost'}
                    onClick={() => handleNavClick(item.id)}
                    className="flex items-center space-x-2"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Button>
                );
              })}
              {/* Only show booking button for customers or non-authenticated users */}
              {userRole !== 'admin' && (
                <Button 
                  onClick={() => handleNavClick('booking')}
                  className="bg-gradient-to-r from-primary to-accent text-primary-foreground border-0"
                >
                  Book Now
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={{ 
          opacity: isMobileMenuOpen ? 1 : 0,
          y: isMobileMenuOpen ? 0 : -20,
          pointerEvents: isMobileMenuOpen ? 'auto' : 'none'
        }}
        className="fixed top-16 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-border md:hidden"
      >
        <div className="container mx-auto px-4 py-6 space-y-4">
          {[...navItems, ...authItems].map((item) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  currentPage === item.id 
                    ? 'text-primary bg-secondary' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </motion.button>
            );
          })}
          {/* Only show booking button for customers or non-authenticated users */}
          {userRole !== 'admin' && (
            <Button 
              onClick={() => handleNavClick('booking')}
              className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground border-0"
            >
              Book Appointment
            </Button>
          )}
        </div>
      </motion.div>

      {/* Spacer for fixed navigation */}
      <div className="h-16" />
    </>
  );
}