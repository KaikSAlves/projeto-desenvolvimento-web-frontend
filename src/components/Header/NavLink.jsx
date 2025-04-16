const NavLink = ({ href, children, onClick }) => {
  return (
    <li>
      <a 
        href={href}
        onClick={onClick}
        className="text-gray-600 hover:text-primary transition-colors relative group"
      >
        {children}
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
      </a>
    </li>
  );
};

export default NavLink;