/* eslint-disable react-refresh/only-export-components, react/only-export-components */
import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import MainLayout from '@/layouts/MainLayout';
import Loading from '@/components/ui/Loading';

// Auth Route Guards
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, isLoaded } = useAuth();
  if (!isLoaded) return <Loading variant="overlay" text="Verifying session..." />;
  if (!session) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, isLoaded } = useAuth();
  if (!isLoaded) return <Loading variant="overlay" text="Verifying session..." />;
  if (session) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
};

// Lazy loading pages
const LandingPage = lazy(() => import('@/pages/LandingPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const PredictionPage = lazy(() => import('@/pages/PredictionPage'));
const DeliveriesPage = lazy(() => import('@/pages/DeliveriesPage'));
const DigitalTwinPage = lazy(() => import('@/pages/DigitalTwinPage'));
const HealthPage = lazy(() => import('@/pages/HealthPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

// Auth Pages
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const SignUpPage = lazy(() => import('@/pages/auth/SignUpPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'));

/**
 * Global Router definition for Venlix AI platform.
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<Loading variant="overlay" text="Loading Venlix AI..." />}>
        <LandingPage />
      </Suspense>
    ),
  },
  {
    path: '/login',
    element: (
      <PublicRoute>
        <Suspense fallback={<Loading variant="overlay" text="Authenticating..." />}>
          <LoginPage />
        </Suspense>
      </PublicRoute>
    ),
  },
  {
    path: '/signup',
    element: (
      <PublicRoute>
        <Suspense fallback={<Loading variant="overlay" text="Preparing registration..." />}>
          <SignUpPage />
        </Suspense>
      </PublicRoute>
    ),
  },
  {
    path: '/forgot-password',
    element: (
      <PublicRoute>
        <Suspense fallback={<Loading variant="overlay" text="Loading..." />}>
          <ForgotPasswordPage />
        </Suspense>
      </PublicRoute>
    ),
  },
  {
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '/dashboard',
        element: (
          <Suspense fallback={<Loading variant="shimmer" text="Loading dashboard..." />}>
            <DashboardPage />
          </Suspense>
        ),
      },
      {
        path: '/prediction',
        element: (
          <Suspense fallback={<Loading variant="shimmer" text="Loading models..." />}>
            <PredictionPage />
          </Suspense>
        ),
      },
      {
        path: '/deliveries',
        element: (
          <Suspense fallback={<Loading variant="shimmer" text="Loading fleet..." />}>
            <DeliveriesPage />
          </Suspense>
        ),
      },
      {
        path: '/digital-twin',
        element: (
          <Suspense fallback={<Loading variant="shimmer" text="Loading replication matrix..." />}>
            <DigitalTwinPage />
          </Suspense>
        ),
      },
      {
        path: '/health',
        element: (
          <Suspense fallback={<Loading variant="shimmer" text="Running diagnostics..." />}>
            <HealthPage />
          </Suspense>
        ),
      },
      {
        path: '*',
        element: (
          <Suspense fallback={<Loading variant="shimmer" text="Locating waypoint..." />}>
            <NotFoundPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
]);

export default router;
