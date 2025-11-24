// src/hooks/useHelpContext.js
import HelpContent from '../utils/HelpContent';
 
const useHelpContext = (pageName) => {
    
    return HelpContent[pageName] || HelpContent['Default'];
};

export default useHelpContext;