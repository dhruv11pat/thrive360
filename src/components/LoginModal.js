import React, { useState, useEffect } from 'react';

const LoginModal = ({ isOpen, onLogin }) => {
  const [code, setCode] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [refs] = useState(Array(4).fill(0).map(() => React.createRef()));

  // Focus the first input when modal opens
  useEffect(() => {
    if (isOpen && refs[0].current) {
      refs[0].current.focus();
    }
  }, [isOpen, refs]);

  const handleChange = (index, value) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;

    // Update the code array
    const newCode = [...code];
    newCode[index] = value.slice(0, 1); // Only take the first character
    setCode(newCode);

    // Clear any previous error
    setError('');

    // Auto-focus next input if value is entered
    if (value && index < 3 && refs[index + 1].current) {
      refs[index + 1].current.focus();
    }

    // Try to submit if all digits are filled
    if (value && index === 3) {
      handleSubmit(newCode.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === 'Backspace' && !code[index] && index > 0 && refs[index - 1].current) {
      refs[index - 1].current.focus();
    }
  };

  const handleSubmit = (fullCode) => {
    // Check if the code is correct (1234 for this example)
    // In a real app, you would validate against an API or stored value
    if (fullCode === '8888') {
      onLogin(true);
    } else {
      setError('Invalid code. Please try again.');
      // Clear the code fields
      setCode(['', '', '', '']);
      // Focus the first input
      if (refs[0].current) {
        refs[0].current.focus();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">Stock-Out Dashboard</h2>
        <p className="text-center mb-6">Please enter the 4-digit access code to continue</p>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <div className="flex justify-center space-x-4 mb-6">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={refs[index]}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-16 text-center text-2xl border-2 border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
            />
          ))}
        </div>
        
        <button
          onClick={() => handleSubmit(code.join(''))}
          disabled={code.some(digit => !digit)}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Enter Dashboard
        </button>
      </div>
    </div>
  );
};

export default LoginModal; 