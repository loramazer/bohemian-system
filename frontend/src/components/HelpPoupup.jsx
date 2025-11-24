import React, { useState } from 'react';
import '../styles/HelpPoupups.css';

const HelpPopup = ({ title, content }) => {
  const [open, setOpen] = useState(false);

  const closePopup = () => setOpen(false);

  return (
    <>
      <button className="help-floating-btn" onClick={() => setOpen(true)}>?</button>

      {open && (
        <div className="help-overlay" onClick={closePopup}>
          <div className="help-modal" onClick={(e) => e.stopPropagation()}>
            <h3>{title}</h3>
            <p>{content}</p>
            <button className="help-close-btn" onClick={closePopup}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default HelpPopup;