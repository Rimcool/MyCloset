import React, { createContext, useContext, useState, ReactNode } from 'react';

type InterfaceType = 'retro' | 'modern' | 'dark' | 'pastel';

interface ThemeColors {
  primary: string;
  secondary: string;
  tertiary: string;
  light: string;
  background: string;
  textColor: string;
}

interface ThemeContextType {
  currentInterface: InterfaceType;
  setCurrentInterface: (interfaceType: InterfaceType) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const themeConfigs: Record<InterfaceType, ThemeColors> = {
  retro: {
    primary: '#ff1493', // Deep pink instead of navy
    secondary: '#ff69b4', // Hot pink
    tertiary: '#ff00ff', // Bright magenta
    light: '#ffc0cb', // Light pink
    background: 'linear-gradient(135deg, #ff69b4 0%, #ffb6e1 50%, #9370db 100%)',
    textColor: '#4a0e4e', // Dark purple
  },
  modern: {
    primary: '#d946ef', // Vibrant purple-pink
    secondary: '#ec4899', // Rose
    tertiary: '#f472b6', // Pink
    light: '#fbcfe8', // Very light pink
    background: 'linear-gradient(to bottom, #fce7f3 0%, #f3e8ff 100%)',
    textColor: '#4a0e4e', // Dark purple
  },
  dark: {
    primary: '#c2185b', // Dark rose
    secondary: '#e91e63', // Pink
    tertiary: '#ff1493', // Deep pink
    light: '#80004d', // Dark pink
    background: 'linear-gradient(135deg, #1a0033 0%, #330066 50%, #660099 100%)',
    textColor: '#ffb6e1', // Light pink text on dark
  },
  pastel: {
    primary: '#ffa0d0', // Pastel pink
    secondary: '#ffb6e1', // Light pink
    tertiary: '#e6b3ff', // Pastel purple
    light: '#fff0f7', // Very pale pink
    background: 'linear-gradient(to bottom, #fff5f9 0%, #f0e6ff 50%, #ffe6f5 100%)',
    textColor: '#6b4c9a', // Soft purple
  },
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentInterface, setCurrentInterface] = useState<InterfaceType>('retro');

  const applyTheme = (interfaceType: InterfaceType) => {
    const root = document.documentElement;
    const body = document.body;
    const selectedTheme = themeConfigs[interfaceType];

    // Set CSS variables on html element
    root.style.setProperty('--ion-color-primary', selectedTheme.primary);
    root.style.setProperty('--ion-color-secondary', selectedTheme.secondary);
    root.style.setProperty('--ion-color-tertiary', selectedTheme.tertiary);
    root.style.setProperty('--ion-color-light', selectedTheme.light);
    root.style.setProperty('--ion-background-gradient', selectedTheme.background);
    root.style.setProperty('--ion-text-color', selectedTheme.textColor);
    root.style.setProperty('--ion-toolbar-background', selectedTheme.primary);

    // Also set on body for safety
    body.style.setProperty('--ion-color-primary', selectedTheme.primary);
    body.style.setProperty('--ion-color-secondary', selectedTheme.secondary);
    body.style.setProperty('--ion-color-tertiary', selectedTheme.tertiary);
    body.style.setProperty('--ion-color-light', selectedTheme.light);
    body.style.setProperty('--ion-background-gradient', selectedTheme.background);
    body.style.setProperty('--ion-text-color', selectedTheme.textColor);
    body.style.setProperty('--ion-toolbar-background', selectedTheme.primary);

    // Force ion-content background update
    const ionContents = document.querySelectorAll('ion-content');
    ionContents.forEach((el) => {
      (el as HTMLElement).style.setProperty('--background', selectedTheme.background);
    });
  };

  const handleSetInterface = (interfaceType: InterfaceType) => {
    setCurrentInterface(interfaceType);
    applyTheme(interfaceType);
  };

  // Apply initial theme on mount
  React.useEffect(() => {
    applyTheme(currentInterface);
  }, []);

  return (
    <ThemeContext.Provider value={{ currentInterface, setCurrentInterface: handleSetInterface }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
