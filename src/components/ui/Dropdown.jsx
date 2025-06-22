// src/components/ui/Dropdown.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Dropdown = ({ 
  trigger, 
  items,
  align = 'right',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);
  
  const toggleDropdown = () => setIsOpen(!isOpen);
  
  const alignmentClasses = {
    left: 'left-0',
    right: 'right-0',
    center: 'left-1/2 transform -translate-x-1/2'
  };
  
  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <div onClick={toggleDropdown} className="cursor-pointer">
        {trigger}
      </div>
      
      {isOpen && (
        <div className={`absolute z-10 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 ${alignmentClasses[align]}`}>
          <div className="py-1" role="menu" aria-orientation="vertical">
            {items.map((item, index) => {
              if (item.divider) {
                return <hr key={index} className="my-1 border-gray-200 dark:border-gray-700" />;
              }
              
              const itemContent = (
                <div className={`flex items-center px-4 py-2 text-sm ${item.disabled ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                  {item.icon && (
                    <span className="mr-2">{item.icon}</span>
                  )}
                  <span>{item.label}</span>
                </div>
              );
              
              if (item.to) {
                return (
                  <Link
                    key={index}
                    to={item.to}
                    className={item.disabled ? 'pointer-events-none' : ''}
                    onClick={() => {
                      setIsOpen(false);
                      item.onClick && item.onClick();
                    }}
                  >
                    {itemContent}
                  </Link>
                );
              }
              
              if (item.href) {
                return (
                  <a
                    key={index}
                    href={item.href}
                    className={item.disabled ? 'pointer-events-none' : ''}
                    onClick={() => {
                      setIsOpen(false);
                      item.onClick && item.onClick();
                    }}
                  >
                    {itemContent}
                  </a>
                );
              }
              
              return (
                <div
                  key={index}
                  onClick={() => {
                    if (!item.disabled) {
                      setIsOpen(false);
                      item.onClick && item.onClick();
                    }
                  }}
                >
                  {itemContent}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;