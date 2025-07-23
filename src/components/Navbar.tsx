import React from 'react';

const navItems = [
  { label: 'Home', href: '#hero' },
  { label: 'Work', href: '#work' },
  { label: 'Toolbox', href: '#toolbox' },
  { label: 'Bookshelf', href: '#bookshelf' },
  { label: 'Notes', href: '#notes' },
  { label: 'Resume', href: '#resume' },
];

const Navbar: React.FC = () => (
  <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-neutral-200">
    <div className="max-w-3xl mx-auto px-4 py-3 flex gap-4 text-sm font-medium">
      {navItems.map((item) => (
        <a
          key={item.href}
          href={item.href}
          className="hover:text-blue-600 transition-colors"
        >
          {item.label}
        </a>
      ))}
    </div>
  </nav>
);

export default Navbar;
