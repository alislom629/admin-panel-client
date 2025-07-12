import React from 'react';

const Button = ({ children, onClick, type = 'button', primary, danger, disabled, ...rest }) => {
    const classNames = [
        'btn',
        primary ? 'btn--primary' : '',
        danger ? 'btn--danger' : '',
    ].join(' ').trim();

    return (
        <button
            type={type}
            className={classNames}
            onClick={onClick}
            disabled={disabled}
            {...rest}
        >
            {children}
        </button>
    );
};

export default Button;