import './index.css';

interface RefreshButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const RefreshButton = ({
  onClick,
  disabled = false,
  children = 'Refetch',
  className = '',
}: RefreshButtonProps) => {
  return (
    <button
      className={`refresh-button ${className}`.trim()}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default RefreshButton;
