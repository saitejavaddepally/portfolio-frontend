import React, { useState, useEffect } from 'react';

const CommandLine = ({ command, output, delay = 0, onComplete, isTypingActive }) => {
    const [displayedCommand, setDisplayedCommand] = useState('');
    const [showOutput, setShowOutput] = useState(false);

    // Typing effect
    useEffect(() => {
        if (!isTypingActive) return;

        // Initial delay
        const timer = setTimeout(() => {
            let i = 0;
            const interval = setInterval(() => {
                setDisplayedCommand(command.substring(0, i + 1));
                i++;
                if (i === command.length) {
                    clearInterval(interval);
                    setTimeout(() => {
                        setShowOutput(true);
                        if (onComplete) onComplete();
                    }, 300); // Delay before showing output
                }
            }, 50 + Math.random() * 50); // Random typing speed

            return () => clearInterval(interval);
        }, delay);

        return () => clearTimeout(timer);
    }, [command, delay, isTypingActive, onComplete]);

    // If typing already done (re-render), show full
    useEffect(() => {
        if (!isTypingActive && displayedCommand !== command) {
            setDisplayedCommand(command);
            setShowOutput(true);
        }
    }, [isTypingActive, command, displayedCommand]);

    return (
        <div className="term-block">
            <div className="term-line">
                <span className="term-prompt">visitor@portfolio:~$</span>
                <span className="term-cmd">{displayedCommand}</span>
                {isTypingActive && !showOutput && <span className="term-cursor"></span>}
            </div>
            {showOutput && (
                <div className="term-output">
                    {output}
                </div>
            )}
        </div>
    );
};

export default CommandLine;
