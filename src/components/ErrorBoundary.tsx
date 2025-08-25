"use client";

import React, { Component, ReactNode } from "react";
import { Button } from "@nextui-org/react";
import { FaExclamationTriangle, FaRedo } from "react-icons/fa";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error to an error reporting service
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    
    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
    
    this.setState({
      hasError: true,
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="flex flex-col items-center justify-center p-8 bg-danger-50 rounded-lg border border-danger-200">
          <div className="flex items-center gap-3 mb-4">
            <FaExclamationTriangle className="text-danger-500" size={24} />
            <h2 className="text-lg font-semibold text-danger-800">
              Something went wrong
            </h2>
          </div>
          
          <p className="text-danger-600 text-center mb-6 max-w-md">
            We're sorry, but something unexpected happened. Please try refreshing 
            the page or contact support if the problem persists.
          </p>

          <div className="flex gap-3">
            <Button
              color="danger"
              variant="flat"
              startContent={<FaRedo />}
              onClick={this.handleReset}
            >
              Try Again
            </Button>
            
            <Button
              color="danger"
              variant="solid"
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </Button>
          </div>

          {/* Show error details in development */}
          {process.env.NODE_ENV === "development" && this.state.error && (
            <details className="mt-6 w-full max-w-2xl">
              <summary className="cursor-pointer text-sm text-danger-700 font-medium mb-2">
                Error Details (Development Only)
              </summary>
              <pre className="bg-danger-100 p-4 rounded text-xs text-danger-800 overflow-auto">
                {this.state.error.toString()}
                {this.state.errorInfo?.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}