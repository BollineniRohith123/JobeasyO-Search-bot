"use client";

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    console.log('Error object:', error);
    console.log('Error info:', errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900/80 max-w-lg w-full rounded-lg border border-red-500/30 p-6 text-center">
            <div className="flex justify-center mb-4">
              <AlertTriangle size={48} className="text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-red-400 mb-4">
              Something went wrong
            </h2>
            <div className="bg-black/50 rounded p-4 mb-6 text-left">
              <p className="text-gray-400 text-sm font-mono break-all">
                {this.state.error?.message ? JSON.stringify(this.state.error.message) : 'An unexpected error occurred'}
              </p>
            </div>
            <div className="space-y-4">
              <button
                onClick={this.handleRetry}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
              >
                Try Again
              </button>
              <p className="text-sm text-gray-500">
                If the problem persists, please refresh the page or contact support.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
