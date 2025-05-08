import './Modal.css';

export default function Modal({ onClose, children, theme }) {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className={`modal-content ${theme === 'dark' ? 'theme-dark' : 'theme-light'}`}
                onClick={e => e.stopPropagation()}
            >
                <button className="modal-close" onClick={onClose}>✖</button>
                {children}
            </div>
        </div>
    );
}
