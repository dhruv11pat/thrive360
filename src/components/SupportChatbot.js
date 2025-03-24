import React, { useState, useRef, useEffect } from 'react';

const SupportChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      sender: 'bot', 
      text: 'Hello! I\'m the THRIVE360 Support Assistant. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Scroll to bottom of messages when new ones are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Pre-defined responses for common questions
  const getBotResponse = (question) => {
    const lowerQuestion = question.toLowerCase();
    
    // General THRIVE360 questions
    if (lowerQuestion.includes('what is thrive360') || lowerQuestion.includes('thrive360 suite')) {
      return 'THRIVE360 is a comprehensive platform for vaccine supply chain management. It includes tools for stock-out prediction, analytics, ticket management, forecasting, equipment monitoring, and sustainability tracking.';
    }
    
    // AI Models questions
    if (lowerQuestion.includes('ai model') || lowerQuestion.includes('machine learning') || lowerQuestion.includes('prediction')) {
      return 'Our AI models predict stock-out probability with up to 100% accuracy for some vaccines like HepB. They analyze factors such as utilization trends, geographic information, weather patterns, and historical data to help prevent stock-outs before they occur.';
    }
    
    // Dashboard questions
    if (lowerQuestion.includes('dashboard') || lowerQuestion.includes('analytics')) {
      return 'The THRIVE360 Analytics dashboard provides visual insights into your supply chain performance. It displays key metrics, trends, and predictions using PowerBI integration to help you make data-driven decisions.';
    }
    
    // Ticketing system questions
    if (lowerQuestion.includes('ticket') || lowerQuestion.includes('issue') || lowerQuestion.includes('report problem')) {
      return 'The Ticketing System allows you to report and track supply chain issues. Each ticket includes details like priority, status, assigned personnel, and resolution steps. You can create tickets directly from the stock-out dashboard when you identify potential problems.';
    }
    
    // Data Warehouse questions
    if (lowerQuestion.includes('data warehouse') || lowerQuestion.includes('database')) {
      return 'The THRIVE360 Data Warehouse is a centralized repository for all data assets and analytics. It integrates information from various sources to provide a single source of truth for your supply chain data.';
    }
    
    // Forecasting questions
    if (lowerQuestion.includes('forecast') || lowerQuestion.includes('planning') || lowerQuestion.includes('predict')) {
      return 'Our Forecasting Planning module helps optimize vaccine forecasts to improve supply chain efficiency. It uses historical data and AI models to predict future demand and recommend optimal inventory levels.';
    }
    
    // Cold Chain Equipment questions
    if (lowerQuestion.includes('cold chain') || lowerQuestion.includes('refrigerator') || lowerQuestion.includes('freezer') || lowerQuestion.includes('equipment')) {
      return 'The Cold Chain Equipment module allows you to track and manage refrigerators, freezers, and cold boxes across health facilities. It helps monitor maintenance schedules, functional status, and capacity utilization to ensure vaccines remain effective.';
    }
    
    // Temperature monitoring questions
    if (lowerQuestion.includes('temperature') || lowerQuestion.includes('rtmd') || lowerQuestion.includes('monitor')) {
      return 'The Temperature (RTMD) module provides real-time temperature monitoring for cold chain equipment. It alerts you to temperature excursions that could compromise vaccine potency and helps maintain the integrity of the cold chain.';
    }
    
    // Sustainability questions
    if (lowerQuestion.includes('solar') || lowerQuestion.includes('carbon') || lowerQuestion.includes('waste') || lowerQuestion.includes('sustainability')) {
      return 'THRIVE360 includes several sustainability modules: Solar Electrification for tracking solar power at health facilities, Waste Management for optimizing healthcare waste processes, and Carbon Footprint tracking for measuring the environmental impact of immunization programs.';
    }
    
    // Login questions
    if (lowerQuestion.includes('login') || lowerQuestion.includes('sign in') || lowerQuestion.includes('account')) {
      return 'You can log in using your credentials and selecting your role (Country Office, UNICEF, GAVI, or Administrator). Each role has different permissions and access levels appropriate to their responsibilities.';
    }
    
    // Fallback for unknown questions
    return "I don't have specific information about that yet. Please try asking about THRIVE360 features like the dashboard, AI models, ticketing system, cold chain equipment, temperature monitoring, forecasting, or sustainability modules.";
  };

  const handleSendMessage = () => {
    if (input.trim() === '') return;
    
    // Add user message
    const userMessage = {
      sender: 'user',
      text: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    
    // Simulate bot typing
    setTimeout(() => {
      const botResponse = {
        sender: 'bot',
        text: getBotResponse(input),
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Chat toggle button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center ${isOpen ? 'bg-red-500' : 'bg-blue-600'} text-white`}
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>
      
      {/* Chat window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 sm:w-96 h-96 bg-white rounded-lg shadow-xl flex flex-col overflow-hidden border border-gray-300">
          {/* Chat header */}
          <div className="bg-blue-600 text-white px-4 py-3 flex items-center">
            <div className="bg-white rounded-full w-8 h-8 flex items-center justify-center mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium">THRIVE360 Support</h3>
              <p className="text-xs text-blue-100">AI Assistant</p>
            </div>
          </div>
          
          {/* Chat messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`mb-3 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`px-4 py-3 rounded-lg max-w-[80%] ${
                    message.sender === 'user' 
                      ? 'bg-blue-600 text-white rounded-br-none' 
                      : 'bg-white text-gray-800 shadow-sm rounded-bl-none'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start mb-3">
                <div className="bg-white text-gray-800 px-4 py-3 rounded-lg rounded-bl-none shadow-sm max-w-[80%]">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Chat input */}
          <div className="border-t border-gray-200 p-3 flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about THRIVE360..."
              className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSendMessage}
              disabled={input.trim() === ''}
              className={`px-4 py-2 rounded-r-lg ${
                input.trim() === '' 
                  ? 'bg-gray-300 text-gray-500' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportChatbot; 