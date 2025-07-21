// src/components/layout/Dropdown.js

import React, { useState, useEffect, useRef } from 'react';
import { FiChevronDown } from 'react-icons/fi';

const Dropdown = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // This hook handles clicks outside of the dropdown to close it
    useEffect(() => {
        const pageClickEvent = (e) => {
            // If the dropdown is open and the click is outside of it, close it
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            window.addEventListener('mousedown', pageClickEvent);
        }

        // Cleanup function to remove the event listener
        return () => {
            window.removeEventListener('mousedown', pageClickEvent);
        };
    }, [isOpen]);

    return (
        <div className="dropdown" ref={dropdownRef}>
            <button className="dropdown__toggle" onClick={() => setIsOpen(!isOpen)}>
                {title}
                <FiChevronDown className={`dropdown__chevron ${isOpen ? 'open' : ''}`} />
            </button>
            {isOpen && (
                <div className="dropdown__menu">
                    {/* We need to pass down the 'setIsOpen' to close the dropdown on link click */}
                    {React.Children.map(children, child =>
                        React.cloneElement(child, { onClick: () => {
                                setIsOpen(false);
                                // Also call original onClick if it exists (for mobile menu)
                                if (child.props.onClick) {
                                    child.props.onClick();
                                }
                            }})
                    )}
                </div>
            )}
        </div>
    );
};

export default Dropdown;