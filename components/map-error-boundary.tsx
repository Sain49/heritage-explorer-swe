import React from "react";

// error boundary class component
class MapErrorBoundary extends React.Component<
  { children: React.ReactNode }, // Props: just the children (map component)
  { hasError: boolean } // State: tracks if an error happened
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false }; // start with no error
  }

  // This method runs when an error occurs in children
  static getDerivedStateFromError(error: Error) {
    // Update state to show error
    return { hasError: true };
  }

  // This method logs the error (optional, for debugging)
  componentDidCatch(_error: Error, errorInfo: React.ErrorInfo) {
    console.error("Map error:", _error, errorInfo); // log to console for debugging
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-96 w-full flex items-center justify-center border border-gray-300">
          <p className="text-gray-700 text-center px-4">
            Sorry, the map could not load. Please check your internet connection
            and try again.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default MapErrorBoundary;
