"use client";

import React, { Component, ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import { SessionBootstrap } from "@/components/auth/SessionBootstrap";
import { Toaster } from "react-hot-toast";

interface ErrorBoundaryProps {
  children: ReactNode;
}
interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Redux Error Boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-medium text-red-600 mb-4">
              Something went wrong
            </h2>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

/**
 * The store's state when the page first loads. Hydration must render from this, not from the live state: parts of
 * a streamed page hydrate later than SessionBootstrap, by which time the user and API data are already in the store,
 * and rendering them would not match the server's HTML (React error #418).
 */
const hydrationState = store.getState();

const ReduxProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ErrorBoundary>
      <Provider store={store} serverState={hydrationState}>
        {children}
        <SessionBootstrap />
        <Toaster position="top-right" reverseOrder={false} />
      </Provider>
    </ErrorBoundary>
  );
};

export default ReduxProvider;
