import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const { logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <nav className="navbar">
            <div className="navbar__brand">
                <NavLink to="/">Admin Panel</NavLink>
            </div>
            <div className="navbar__menu-toggle" onClick={toggleMenu}>
                <div className={`hamburger ${isOpen ? 'open' : ''}`}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
            <div className={`navbar__links ${isOpen ? 'open' : ''}`}>
                {/* Translated Links */}
                <NavLink to="/" onClick={() => setIsOpen(false)}>Boshqaruv Paneli</NavLink>
                <NavLink to="/cards" onClick={() => setIsOpen(false)}>Kartalar</NavLink>
                <NavLink to="/platforms" onClick={() => setIsOpen(false)}>Platformalar</NavLink>
                <NavLink to="/transactions" onClick={() => setIsOpen(false)}>Tranzaksiyalar</NavLink>
                <NavLink to="/lottery" onClick={() => setIsOpen(false)}>Lotereya</NavLink>
                <NavLink to="/login-devices" onClick={() => setIsOpen(false)}>Kirishlar Tarixi</NavLink>
                <NavLink to="/admins" onClick={() => setIsOpen(false)}>Adminlar</NavLink>
                <NavLink to="/currency" onClick={() => setIsOpen(false)}>Valyuta Kurslari</NavLink>
                <NavLink to="/oson-config" onClick={() => setIsOpen(false)}>Oson Sozlamalari</NavLink>

                {/* Translated Button */}
                <button onClick={logout} className="navbar__logout">Chiqish</button>
            </div>
        </nav>
    );
};

export default Navbar;