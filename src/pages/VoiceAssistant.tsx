
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Circle, Terminal } from 'lucide-react';

const VoiceAssistant: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [commandHistory, setCommandHistory] = useState<Array<{command: string, response: string}>>([]);

  const statusClasses = {
    idle: 'text-gray-500',
    processing: 'text-gray-500',
    success: 'text-green-600',
    error: 'text-red-600'
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    if (!isListening) {
      // Start listening
      setTranscript('');
      setStatus('idle');
      // Simulate speech recognition
      setTimeout(() => {
        setTranscript('Check today\'s invoices');
      }, 2000);
    } else {
      // Stop listening and process
      if (transcript) {
        processCommand(transcript);
      }
    }
  };

  const processCommand = (command: string) => {
    setStatus('processing');
    // Simulate processing delay
    setTimeout(() => {
      let responseText = '';
      let newStatus: 'success' | 'error' = 'success';

      // Mock command processing
      if (command.toLowerCase().includes('invoice')) {
        responseText = 'You have 3 invoices due today totaling $547.99';
      } else if (command.toLowerCase().includes('schedule') || command.toLowerCase().includes('book')) {
        responseText = 'I\'ve scheduled a haircut appointment for 3:00 PM tomorrow';
      } else if (command.toLowerCase().includes('cancel')) {
        responseText = 'I\'ve cancelled your booking for tomorrow';
      } else {
        responseText = 'I\'m sorry, I couldn\'t understand that command';
        newStatus = 'error';
      }

      setResponse(responseText);
      setStatus(newStatus);
      setCommandHistory([{ command, response: responseText }, ...commandHistory]);
    }, 1500);
  };

  // Simulate stopping listening after transcript is received
  useEffect(() => {
    if (transcript && isListening) {
      const timer = setTimeout(() => {
        setIsListening(false);
        processCommand(transcript);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [transcript, isListening]);

  return (
    <DashboardLayout>
      <div className="dashboard-container">
        <h1 className="text-2xl font-bold mb-6">Voice Assistant</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Voice Commands</CardTitle>
              <CardDescription>Speak to your assistant to manage your business</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-10 space-y-6">
              <div className="relative">
                <Button
                  onClick={toggleListening}
                  size="lg"
                  className={`rounded-full w-24 h-24 flex items-center justify-center ${
                    isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary/90'
                  }`}
                >
                  {isListening ? (
                    <MicOff size={32} />
                  ) : (
                    <Mic size={32} />
                  )}
                </Button>
                {isListening && (
                  <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-sm text-red-500 animate-pulse flex items-center">
                    <Circle size={8} className="mr-1 fill-red-500" />
                    Recording...
                  </span>
                )}
              </div>
              
              {transcript && (
                <div className="w-full max-w-md">
                  <div className="bg-gray-100 rounded-lg p-4 mb-3">
                    <p className="text-sm text-gray-600 mb-1">Transcript:</p>
                    <p className="font-medium">{transcript}</p>
                  </div>
                  
                  {status !== 'idle' && (
                    <div className="rounded-lg p-4 border">
                      <div className="flex items-center mb-1">
                        <p className="text-sm text-gray-600 mr-2">Status:</p>
                        <p className={`text-sm font-medium ${statusClasses[status]}`}>
                          {status === 'processing' ? 'Processing...' : 
                           status === 'success' ? 'Success' : 'Error'}
                        </p>
                      </div>
                      
                      {response && status !== 'processing' && (
                        <p>{response}</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Terminal size={20} className="mr-2" />
                Command History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {commandHistory.length > 0 ? (
                <div className="space-y-4">
                  {commandHistory.map((item, index) => (
                    <div key={index} className="border rounded-lg overflow-hidden">
                      <div className="bg-gray-50 p-3 border-b">
                        <p className="font-medium">{item.command}</p>
                      </div>
                      <div className="p-3">
                        <p className="text-gray-700">{item.response}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-gray-500">
                  No commands yet. Try asking something!
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default VoiceAssistant;
