import React, { useState, useEffect } from 'react';
import './terminal.css';
import Terminal, { ColorMode, TerminalOutput } from 'react-terminal-ui';

export default function Terminals({ output, sendinput }) {
    const [terminalLineData, setTerminalLineData] = useState([
        <TerminalOutput key="welcome">Welcome to the React Terminal UI Demo!</TerminalOutput>
    ]);

    useEffect(() => {
        setTerminalLineData([
            <TerminalOutput key="output">{output}</TerminalOutput>
        ]);
    }, [output]);

    const handleSetInput = (value) => {
        sendinput(value);
    };

    return (
        <div className='ter'>
            <div className='terminal-container'>
           
                <Terminal
                    name='VANSH CODO_APP TERMINAL'
                    colorMode={ColorMode.Dark}
                    onInput={handleSetInput}

                >
                    {terminalLineData}
                </Terminal>
            </div>
        </div>
    );
}
