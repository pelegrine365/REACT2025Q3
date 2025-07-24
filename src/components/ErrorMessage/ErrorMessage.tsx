import './index.css';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage = (props: ErrorMessageProps) => {
  return (
    <div className="error-message" role="alert">
      {props.message || 'Opppps, something went wrong!'}
    </div>
  );
};

export default ErrorMessage;
