/* eslint-disable react-refresh/only-export-components, react/only-export-components */
import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import DriverLayout from '@/layouts/driver/DriverLayout';
import Loading from '@/components/ui/Loading';

// Lazy loading pages
const LandingPage = lazy(() => import('@/pages/LandingPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const PredictionPage = lazy(() => import('@/pages/PredictionPage'));
const DeliveriesPage = lazy(() => import('@/pages/DeliveriesPage'));
const DigitalTwinPage = lazy(() => import('@/pages/DigitalTwinPage'));
const HealthPage = lazy(() => import('@/pages/HealthPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

// Driver Pages
const DriverDashboardPage = lazy(() => import('@/pages/driver/DriverDashboardPage'));
const DriverDeliveriesPage = lazy(() => import('@/pages/driver/DriverDeliveriesPage'));
const DriverAssistantPage = lazy(() => import('@/pages/driver/DriverAssistantPage'));
const DriverPerformancePage = lazy(() => import('@/pages/driver/DriverPerformancePage'));
const DriverProfilePage = lazy(() => import('@/pages/driver/DriverProfilePage'));

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
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: 'dashboard',
        element: (
          <Suspense fallback={<Loading variant="shimmer" text="Loading dashboard..." />}>
            <DashboardPage />
          </Suspense>
        ),
      },
      {
        path: 'prediction',
        element: (
          <Suspense fallback={<Loading variant="shimmer" text="Loading models..." />}>
            <PredictionPage />
          </Suspense>
        ),
      },
      {
        path: 'deliveries',
        element: (
          <Suspense fallback={<Loading variant="shimmer" text="Loading fleet..." />}>
            <DeliveriesPage />
          </Suspense>
        ),
      },
      {
        path: 'digital-twin',
        element: (
          <Suspense fallback={<Loading variant="shimmer" text="Loading replication matrix..." />}>
            <DigitalTwinPage />
          </Suspense>
        ),
      },
      {
        path: 'health',
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
    path: '/driver',
    element: <DriverLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loading variant="shimmer" text="Loading driver dashboard..." />}>
            <DriverDashboardPage />
          </Suspense>
        ),
      },
      {
        path: 'dashboard',
        element: (
          <Suspense fallback={<Loading variant="shimmer" text="Loading driver dashboard..." />}>
            <DriverDashboardPage />
          </Suspense>
        ),
      },
      {
        path: 'deliveries',
        element: (
          <Suspense fallback={<Loading variant="shimmer" text="Loading deliveries..." />}>
            <DriverDeliveriesPage />
          </Suspense>
        ),
      },
      {
        path: 'assistant',
        element: (
          <Suspense fallback={<Loading variant="shimmer" text="Loading assistant..." />}>
            <DriverAssistantPage />
          </Suspense>
        ),
      },
      {
        path: 'performance',
        element: (
          <Suspense fallback={<Loading variant="shimmer" text="Loading performance metrics..." />}>
            <DriverPerformancePage />
          </Suspense>
        ),
      },
      {
        path: 'profile',
        element: (
          <Suspense fallback={<Loading variant="shimmer" text="Loading profile..." />}>
            <DriverProfilePage />
          </Suspense>
        ),
      },
    ],
  },
]);

export default router;
