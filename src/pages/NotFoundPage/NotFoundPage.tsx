import { useNavigate } from 'react-router';

import './index.css';

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="error-page">
      <div className="error-card">
        <h1 className="error-title">404</h1>
        <h2 className="error-heading">Page Not Found!</h2>
        <div className="error-buttons">
          <button onClick={handleGoBack} className="button button-yellow">
            Go Back
          </button>
          <button onClick={handleGoHome} className="button button-blue">
            Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
