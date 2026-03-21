import { createContext, useContext } from 'react';
import { useToast } from '@chakra-ui/react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const toast = useToast();

  const addToast = (message, type = 'info') => {
    toast({
      title: type.charAt(0).toUpperCase() + type.slice(1),
      description: message,
      status: type,
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
}; 