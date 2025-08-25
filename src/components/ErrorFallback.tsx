"use client";

import React from "react";
import { Button } from "@nextui-org/react";
import { FaExclamationTriangle, FaRedo, FaHome } from "react-icons/fa";

interface ErrorFallbackProps {
  error?: Error;
  resetError?: () => void;
  title?: string;
  message?: string;
  showRefresh?: boolean;
  showHome?: boolean;
  variant?: "default" | "minimal" | "detailed";
}

export default function ErrorFallback({
  error,
  resetError,
  title = "Something went wrong",
  message = "We're sorry, but something unexpected happened. Please try again.",
  showRefresh = true,
  showHome = false,
  variant = "default",
}: ErrorFallbackProps) {
  const handleRefresh = () => {
    window.location.reload();
  };

  const handleHome = () => {
    window.location.href = "/";
  };

  if (variant === "minimal") {
    return (
      <div className="flex items-center justify-center p-4 text-danger-600">
        <FaExclamationTriangle className="mr-2" />
        <span className="text-sm">Unable to load content</span>
        {resetError && (
          <Button
            size="sm"
            variant="light"
            color="danger"
            className="ml-2"
            onClick={resetError}
          >
            Retry
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-danger-50 rounded-lg border border-danger-200 min-h-[200px]">
      <div className="flex items-center gap-3 mb-4">
        <FaExclamationTriangle className="text-danger-500" size={24} />
        <h2 className="text-lg font-semibold text-danger-800">{title}</h2>
      </div>

      <p className="text-danger-600 text-center mb-6 max-w-md">{message}</p>

      <div className="flex gap-3 flex-wrap justify-center">
        {resetError && (
          <Button
            color="danger"
            variant="flat"
            startContent={<FaRedo />}
            onClick={resetError}
          >
            Try Again
          </Button>
        )}

        {showRefresh && (
          <Button
            color="danger"
            variant="solid"
            onClick={handleRefresh}
          >
            Refresh Page
          </Button>
        )}

        {showHome && (
          <Button
            color="primary"
            variant="flat"
            startContent={<FaHome />}
            onClick={handleHome}
          >
            Go Home
          </Button>
        )}
      </div>

      {/* Show error details in development for detailed variant */}
      {variant === "detailed" && 
       process.env.NODE_ENV === "development" && 
       error && (
        <details className="mt-6 w-full max-w-2xl">
          <summary className="cursor-pointer text-sm text-danger-700 font-medium mb-2">
            Error Details (Development Only)
          </summary>
          <pre className="bg-danger-100 p-4 rounded text-xs text-danger-800 overflow-auto max-h-40">
            {error.toString()}
            {error.stack}
          </pre>
        </details>
      )}
    </div>
  );
}