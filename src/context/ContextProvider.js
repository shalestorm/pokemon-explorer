import React, { useState, useEffect } from 'react';
import { ThemeContext } from './ThemeContext';

export function ContextProvider({ children }) {

    const getInitialTheme = () => {
        const storedTheme = localStorage.getItem('theme');
        return storedTheme ? storedTheme : 'light';
    };

    const [theme, setTheme] = useState(getInitialTheme);

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
    };


    useEffect(() => {
        localStorage.setItem('theme', theme);

        const rootElement = document.getElementById('root');
        const body = document.body;

        rootElement.classList.remove('theme-light', 'theme-dark');
        body.classList.remove('theme-light', 'theme-dark');
        rootElement.classList.add(`theme-${theme}`);
        body.classList.add(`theme-${theme}`);
    }, [theme]);

    return React.createElement(
        ThemeContext.Provider,
        { value: { theme, toggleTheme } },
        React.createElement('div', { className: `theme-${theme}` }, children)
    );
}
