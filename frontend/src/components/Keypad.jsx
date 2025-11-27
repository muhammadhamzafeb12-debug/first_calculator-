import React from 'react';
import { Button } from './Button';

export function Keypad({ onButtonClick, angleMode }) {
    const buttons = [
        // Row 1: Memory and Mode functions
        { label: angleMode, variant: 'secondary', action: 'toggleAngle' },
        { label: 'MC', variant: 'secondary', action: 'memoryClear' },
        { label: 'MR', variant: 'secondary', action: 'memoryRecall' },
        { label: 'M+', variant: 'secondary', action: 'memoryAdd' },
        { label: 'M-', variant: 'secondary', action: 'memorySubtract' },

        // Row 2: Advanced functions
        { label: 'sin', variant: 'secondary', action: 'func', value: 'Math.sin(' },
        { label: 'cos', variant: 'secondary', action: 'func', value: 'Math.cos(' },
        { label: 'tan', variant: 'secondary', action: 'func', value: 'Math.tan(' },
        { label: 'C', variant: 'secondary', action: 'clear' },
        { label: '⌫', variant: 'secondary', action: 'backspace' },

        // Row 3: Inverse trig functions
        { label: 'asin', variant: 'secondary', action: 'func', value: 'Math.asin(' },
        { label: 'acos', variant: 'secondary', action: 'func', value: 'Math.acos(' },
        { label: 'atan', variant: 'secondary', action: 'func', value: 'Math.atan(' },
        { label: '(', variant: 'secondary', action: 'operator', value: '(' },
        { label: ')', variant: 'secondary', action: 'operator', value: ')' },

        // Row 4: Hyperbolic functions
        { label: 'sinh', variant: 'secondary', action: 'func', value: 'Math.sinh(' },
        { label: 'cosh', variant: 'secondary', action: 'func', value: 'Math.cosh(' },
        { label: 'tanh', variant: 'secondary', action: 'func', value: 'Math.tanh(' },
        { label: 'x!', variant: 'secondary', action: 'factorial' },
        { label: '÷', variant: 'accent', action: 'operator', value: '/' },

        // Row 5: Log and exponential
        { label: 'ln', variant: 'secondary', action: 'func', value: 'Math.log(' },
        { label: 'log', variant: 'secondary', action: 'func', value: 'Math.log10(' },
        { label: 'e^x', variant: 'secondary', action: 'func', value: 'Math.exp(' },
        { label: '7', variant: 'default', action: 'number', value: '7' },
        { label: '×', variant: 'accent', action: 'operator', value: '*' },

        // Row 6: Powers and roots
        { label: '√', variant: 'secondary', action: 'func', value: 'Math.sqrt(' },
        { label: 'x²', variant: 'secondary', action: 'operator', value: '**2' },
        { label: 'x^y', variant: 'secondary', action: 'operator', value: '**' },
        { label: '8', variant: 'default', action: 'number', value: '8' },
        { label: '9', variant: 'default', action: 'number', value: '9' },

        // Row 7: Special functions
        { label: '|x|', variant: 'secondary', action: 'func', value: 'Math.abs(' },
        { label: '%', variant: 'secondary', action: 'percentage' },
        { label: 'π', variant: 'secondary', action: 'constant', value: 'Math.PI' },
        { label: '4', variant: 'default', action: 'number', value: '4' },
        { label: '5', variant: 'default', action: 'number', value: '5' },

        // Row 8: Numbers and operators
        { label: '6', variant: 'default', action: 'number', value: '6' },
        { label: '-', variant: 'accent', action: 'operator', value: '-' },
        { label: '1', variant: 'default', action: 'number', value: '1' },
        { label: '2', variant: 'default', action: 'number', value: '2' },
        { label: '3', variant: 'default', action: 'number', value: '3' },

        // Row 9: Bottom row
        { label: 'e', variant: 'secondary', action: 'constant', value: 'Math.E' },
        { label: '0', variant: 'default', action: 'number', value: '0' },
        { label: '.', variant: 'default', action: 'decimal', value: '.' },
        { label: '+', variant: 'accent', action: 'operator', value: '+' },
        { label: '=', variant: 'primary', action: 'calculate' },
    ];

    return (
        <div className="grid grid-cols-5 gap-3">
            {buttons.map((btn, index) => (
                <Button
                    key={index}
                    variant={btn.variant}
                    className={btn.className || 'h-14 text-lg'}
                    onClick={() => onButtonClick(btn)}
                >
                    {btn.label}
                </Button>
            ))}
        </div>
    );
}
