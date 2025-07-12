import React from 'react';

// The component now accepts a "renderFooter" prop to render a sticky footer.
const Modal = ({ isOpen, onClose, title, children, renderFooter }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>×</button>

                {title && (
                    <div className="modal-header">
                        <h2>{title}</h2>
                    </div>
                )}

                <div className="modal-body">
                    {children}
                </div>

                {/* A dedicated, non-scrolling footer area */}
                {renderFooter && (
                    <div className="modal-footer">
                        {renderFooter()}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Modal;