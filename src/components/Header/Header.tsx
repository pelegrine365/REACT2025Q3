import './index.css';

type HeaderProps = {
  title: string;
};

const Header = ({ title }: HeaderProps) => {
  return (
    <div className="header">
      <h1 className="header__title">{title}</h1>
    </div>
  );
};

export default Header;
