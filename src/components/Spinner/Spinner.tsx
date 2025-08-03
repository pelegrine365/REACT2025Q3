import './index.css';

const Spinner = () => {
  return (
    <div
      className="spinner"
      role="status"
      aria-label="Loading..."
      data-testid="spinner"
    ></div>
  );
};

export default Spinner;
