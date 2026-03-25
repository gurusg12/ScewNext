import { Filter } from 'lucide-react';
import { useState, useEffect } from 'react';

function Install() {
  const [installPrompt, setInstallPrompt] = useState(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    setInstallPrompt(null);
  };

  return (
    <div className='relative text-slate-50 bg-slate-950 h-screen w-screen flex items-center justify-center'>
      
      {/* 1. Install Button - Fixed to Top Right */}
      {installPrompt && (
        <button 
          onClick={handleInstallClick}
          className="absolute top-4 right-4 z-50 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg shadow-md transition-all active:scale-95"
        >
          Install App
        </button>
      )}

      {/* 2. Routing - Content appears in the center */}
     

    </div>
  );
}

export default Install