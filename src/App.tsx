import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LocationProvider } from "@/contexts/LocationContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import LockIn from "./pages/LockIn";
import LockInMap from "./pages/LockInMap";
import LockInList from "./pages/LockInList";
import Events from "./pages/Events";
import EventsMap from "./pages/EventsMap";
import EventsList from "./pages/EventsList";
import CreateEvent from "./pages/CreateEvent";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LocationProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              }
            />
            <Route
              path="/lock-in"
              element={
                <ProtectedRoute>
                  <LockIn />
                </ProtectedRoute>
              }
            />
            <Route
              path="/lock-in/map"
              element={
                <ProtectedRoute>
                  <LockInMap />
                </ProtectedRoute>
              }
            />
            <Route
              path="/lock-in/list"
              element={
                <ProtectedRoute>
                  <LockInList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/events"
              element={
                <ProtectedRoute>
                  <Events />
                </ProtectedRoute>
              }
            />
            <Route
              path="/events/map"
              element={
                <ProtectedRoute>
                  <EventsMap />
                </ProtectedRoute>
              }
            />
            <Route
              path="/events/list"
              element={
                <ProtectedRoute>
                  <EventsList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create"
              element={
                <ProtectedRoute>
                  <CreateEvent />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
      </LocationProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
