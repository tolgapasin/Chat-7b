import "./LoadingSpinner.css";

const LoadingSpinner = ({ isLoading }: { isLoading: boolean }) => {
  if (isLoading) {
    return <div className="spinner"></div>;
  }

  return null;
};

export default LoadingSpinner;
