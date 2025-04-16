import { useState } from 'react';
import { Link } from 'react-router-dom';
import NavLink from './NavLink';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToCardapio = () => {
    document.getElementById('cardapio').scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
    setIsMenuOpen(false); // Fecha o menu mobile se estiver aberto
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          {/* Logo */}
          <h1 className="text-2xl font-bold text-primary">
            Geladinho & Picolé
          </h1>

          {/* Menu Desktop */}
          <nav className="hidden md:block">
            <ul className="flex space-x-8">
              <NavLink href="#inicio">Início</NavLink>
              <NavLink 
                href="#cardapio"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToCardapio();
                }}
              >
                Cardápio
              </NavLink>
              <NavLink href="#feedback">Feedback</NavLink>
              <NavLink href="#contato">Contato</NavLink>
            </ul>
          </nav>

          {/* Botão Admin */}
          <Link 
            to="/admin" 
            className="hidden md:block bg-primary hover:bg-secondary text-white px-4 py-2 rounded-lg transition-colors"
          >
            Admin
          </Link>

          {/* Botão Menu Mobile */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-primary transition-colors"
            aria-label="Menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Menu Mobile */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMenuOpen
              ? 'max-h-screen opacity-100 visible'
              : 'max-h-0 opacity-0 invisible'
          }`}
        >
          <nav className="py-4 border-t">
            <ul className="space-y-4">
              <li>
                <a
                  href="#inicio"
                  className="block px-4 py-2 text-gray-600 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Início
                </a>
              </li>
              <li>
                <a
                  href="#cardapio"
                  className="block px-4 py-2 text-gray-600 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToCardapio();
                  }}
                >
                  Cardápio
                </a>
              </li>
              <li>
                <a
                  href="#feedback"
                  className="block px-4 py-2 text-gray-600 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Feedback
                </a>
              </li>
              <li>
                <a
                  href="#contato"
                  className="block px-4 py-2 text-gray-600 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contato
                </a>
              </li>
              <li>
                <Link
                  to="/admin"
                  className="block px-4 py-2 text-primary hover:bg-primary hover:text-white rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;