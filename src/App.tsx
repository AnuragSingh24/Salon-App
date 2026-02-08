import React, { useState, Suspense, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { FallbackPage } from './components/FallbackPage';


// Import components
import { HomePage } from './components/HomePage';
import { ServicesPage } from './components/ServicesPage';
import { BookingPage } from './components/BookingPage';
import { AuthPage } from './components/AuthPage';
import { ProfilePage } from './components/ProfilePage';
import { AdminDashboard } from './components/AdminDashboard';
import { GalleryPage } from './components/GalleryPage';
import { ReviewsPage } from './components/ReviewsPage';
import { PackagesPage } from './components/PackagesPage';
import { ContactPage } from './components/ContactPage';
import { TimeSlotsPage } from './components/TimeSlotsPage';
import { AdminServicesPage } from './components/AdminServicesPage';
import { AdminPackagesPage } from './components/AdminPackagesPage';
import { AdminReviewsPage } from './components/AdminReviewsPage';
import { SettingsPage } from './components/SettingsPage';
import { Navigation } from './components/Navigation';

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="flex items-center space-x-2">
      <div className="w-4 h-4 bg-primary rounded-full animate-pulse"></div>
      <div className="w-4 h-4 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
      <div className="w-4 h-4 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
    </div>
  </div>
);

// Component prop type definitions
interface BasePageProps {
  setCurrentPage: (page: string) => void;
}

interface AuthPageProps extends BasePageProps {
  setIsAuthenticated: (auth: boolean) => void;
  setUserRole: (role: string) => void;
}

interface HomePageProps extends BasePageProps {
  userRole?: string;
}

interface SettingsPageProps extends BasePageProps {
  setIsAuthenticated: (auth: boolean) => void;
  setUserRole: (role: string) => void;
  userRole: string;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null); // 'customer' or 'admin'
  const [isLoading, setIsLoading] = useState(true);




  useEffect(() => {
    const token = localStorage.getItem("token");
    const isLogged = sessionStorage.getItem("isLoggedIn");

    if (token && isLogged === "true") {
      setIsAuthenticated(true);

      const role = localStorage.getItem("role"); // must be set during login
      console.log(role);
      if (role === "admin") {
        setUserRole("admin");
      } else {
        setUserRole("customer");
      }
    } else {
      setIsAuthenticated(false);
      setUserRole("customer");
    }
  }, []);


  // Initialize app
  React.useEffect(() => {
    // Simple initialization check
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);



  // Render different components based on currentPage with error handling
  const renderCurrentPage = () => {
    const baseProps = { setCurrentPage };

    try {
      switch (currentPage) {
        case 'home':
          return <HomePage {...baseProps} userRole={userRole} />;
        case 'services':
          return <ServicesPage {...baseProps} />;
        case 'booking':
          return <BookingPage {...baseProps} />;
        case 'auth':
          return <AuthPage {...baseProps} setIsAuthenticated={setIsAuthenticated} setUserRole={setUserRole} />;
        case 'profile':
          return <ProfilePage {...baseProps} />;
        case 'admin':
          return userRole === "admin"
            ? <AdminDashboard {...baseProps} />
            : <HomePage {...baseProps} userRole={userRole} />;

        case 'gallery':
          return <GalleryPage {...baseProps} />;
        case 'reviews':
          return <ReviewsPage {...baseProps} />;
        case 'packages':
          return <PackagesPage {...baseProps} />;
        case 'contact':
          return <ContactPage {...baseProps} />;
        case 'timeslots':
          return <TimeSlotsPage />;
        case 'admin-services':
          return <AdminServicesPage />;
        case 'admin-packages':
          return <AdminPackagesPage />;
        case 'admin-reviews':
          return <AdminReviewsPage />;
        case 'settings':
          return <SettingsPage {...baseProps} setIsAuthenticated={setIsAuthenticated} setUserRole={setUserRole} userRole={userRole} />;
        default:
          return <HomePage {...baseProps} userRole={userRole} />;
      }
    } catch (error) {
      console.error('Error rendering page:', error);
      return <FallbackPage {...baseProps} error={`Failed to load ${currentPage} page`} />;
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        <Navigation
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          isAuthenticated={isAuthenticated}
          userRole={userRole}
        />

        <Suspense fallback={<LoadingSpinner />}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              {renderCurrentPage()}
            </motion.div>
          </AnimatePresence>
        </Suspense>
      </div>
    </ErrorBoundary>
  );
}