import React, { useState, useEffect } from 'react';
import '../styles/HelpPoupups.css';

const HelpPopup = ({ title, content }) => {
  const [open, setOpen] = useState(false);

  const closePopup = () => setOpen(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'F1') {
        event.preventDefault();
        setOpen((prev) => !prev);
      }

      if (event.key === 'Escape' && open) {
        event.preventDefault();
        setOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return (
    <>
      <button
        className="help-floating-btn"
        onClick={() => setOpen(true)}
        aria-label="Ajuda (F1)"
        title="Ajuda (F1)"
      >
        ?
      </button>

      {open && (
        <div className="help-overlay" onClick={closePopup}>
          <div className="help-modal" onClick={(e) => e.stopPropagation()}>
            <h3>{title}</h3>
            <p>{content}</p>

            <button className="help-close-btn" onClick={closePopup}>
              Fechar
            </button>

            <div style={{ marginTop: '15px', fontSize: '0.8rem', color: '#888' }}>
              Pressione <strong>ESC</strong> ou <strong>F1</strong> para fechar.
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HelpPopup;