import { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

interface FullScreenChartProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  controls?: React.ReactNode;
}

const FullScreenChart = ({ 
  isOpen, 
  onClose, 
  title, 
  description, 
  icon, 
  children,
  controls
}: FullScreenChartProps) => {
  // Handle escape key and prevent background scrolling
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent background scrolling
      document.body.classList.add('modal-open');
      document.documentElement.classList.add('modal-open');
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.classList.remove('modal-open');
      document.documentElement.classList.remove('modal-open');
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Render the modal using a portal to avoid layout conflicts
  return createPortal(
    <div 
      className="fullscreen-modal-overlay"
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 50000,
        margin: 0,
        padding: '1rem',
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="fullscreen-modal-content bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
        style={{
          width: '100%',
          height: '100%',
          maxWidth: 'none',
          maxHeight: 'none',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '0.5rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 flex-shrink-0 bg-white dark:bg-gray-900"
          style={{ flexShrink: 0 }}
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {icon}
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-light text-gray-900 dark:text-gray-100 truncate">{title}</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-light truncate">{description}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 flex-shrink-0 ml-2 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Controls */}
        {controls && (
          <div 
            className="px-4 py-2 border-b border-gray-200 dark:border-gray-800 flex-shrink-0 bg-white dark:bg-gray-900"
            style={{ flexShrink: 0 }}
          >
            {controls}
          </div>
        )}

        {/* Chart Content */}
        <div 
          className="flex-1 bg-white dark:bg-gray-900"
          style={{ 
            flex: 1,
            minHeight: 0,
            overflow: 'hidden',
            position: 'relative',
            padding: '1rem 1rem 0.5rem 1rem'
          }}
        >
          <div 
            style={{
              width: '100%',
              height: '100%',
              minHeight: '400px',
              position: 'relative',
              overflow: 'visible'
            }}
          >
            {children}
          </div>
        </div>

        {/* Footer */}
        <div 
          className="p-3 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 flex-shrink-0"
          style={{ flexShrink: 0 }}
        >
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Press ESC to close • Click outside to close</span>
            <span>Full-screen view for detailed analysis</span>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default FullScreenChart;