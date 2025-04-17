
import React, { useState, useRef } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Play, RotateCcw } from 'lucide-react';

// Mock transcription data
const mockCommands = [
  { id: 1, text: "Schedule a haircut for tomorrow at 3 PM", status: "Success", response: "Appointment scheduled for tomorrow at 3 PM" },
  { id: 2, text: "Show me all overdue invoices", status: "Success", response: "Displaying 3 overdue invoices" },
  { id: 3, text: "Cancel my appointment on Friday", status: "Error", response: "No appointment found for Friday" }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Processing':
      return 'text-gray-500';
    case 'Success':
      return 'text-green-600';
    case 'Error':
      return 'text-red-500';
    default:
      return 'text-gray-500';
  }
};

const VoiceAssistant: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [processingStatus, setProcessingStatus] = useState<'Idle' | 'Recording' | 'Processing' | 'Success' | 'Error'>('Idle');
  const [commandHistory, setCommandHistory] = useState(mockCommands);
  const [response, setResponse] = useState('');
  
  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };
  
  const startRecording = () => {
    setIsRecording(true);
    setProcessingStatus('Recording');
    setTranscript('');
    setResponse('');
    
    // Simulate recording and processing
    setTimeout(() => {
      setTranscript('Schedule a meeting with client at 2 PM tomorrow');
      setProcessingStatus('Processing');
      
      // Simulate processing completion
      setTimeout(() => {
        setProcessingStatus('Success');
        setResponse('I\'ve scheduled a meeting for tomorrow at 2 PM. Would you like me to send a reminder?');
        setCommandHistory(prev => [
          { 
            id: Date.now(), 
            text: 'Schedule a meeting with client at 2 PM tomorrow', 
            status: 'Success', 
            response: 'I\'ve scheduled a meeting for tomorrow at 2 PM.' 
          },
          ...prev
        ]);
        setIsRecording(false);
      }, 2000);
    }, 3000);
  };
  
  const stopRecording = () => {
    setIsRecording(false);
    
    // If the recording is stopped before processing completes
    if (processingStatus === 'Recording') {
      setProcessingStatus('Processing');
      
      // Simulate processing of partial transcript
      setTimeout(() => {
        if (transcript) {
          setProcessingStatus('Success');
          setResponse('I understand you want to schedule something, but I didn\'t catch all details. Can you repeat?');
        } else {
          setProcessingStatus('Error');
          setResponse('I didn\'t catch that. Please try again.');
        }
      }, 1000);
    }
  };
  
  const clearHistory = () => {
    setCommandHistory([]);
  };

  return (
    <DashboardLayout>
      <div className="dashboard-container">
        <h1 className="text-2xl font-bold mb-6">Voice Assistant</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Voice Commands</CardTitle>
              <CardDescription>Press the mic button and speak a command</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg">
                <Button
                  onClick={toggleRecording}
                  className={`size-16 rounded-full flex items-center justify-center ${
                    isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary/90'
                  }`}
                >
                  {isRecording ? <MicOff size={24} /> : <Mic size={24} />}
                </Button>
                
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-500">
                    {isRecording ? 'Listening...' : 'Press to speak'}
                  </p>
                </div>
              </div>
              
              {transcript && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium mb-2">Transcript:</p>
                  <p className="text-gray-700">{transcript}</p>
                  <p className={`mt-2 font-medium ${getStatusColor(processingStatus)}`}>
                    Status: {processingStatus}
                  </p>
                </div>
              )}
              
              {response && (
                <div className="p-4 bg-primary/10 rounded-lg">
                  <p className="font-medium mb-2">Assistant Response:</p>
                  <p className="text-gray-700">{response}</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Command History</CardTitle>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearHistory} 
                disabled={commandHistory.length === 0}
              >
                <RotateCcw size={16} className="mr-1" />
                Clear
              </Button>
            </CardHeader>
            <CardContent>
              {commandHistory.length > 0 ? (
                <div className="space-y-4 max-h-[500px] overflow-y-auto">
                  {commandHistory.map((command) => (
                    <div key={command.id} className="border-b pb-3 last:border-0">
                      <p className="font-medium text-sm truncate">{command.text}</p>
                      <p className={`text-xs mt-1 ${getStatusColor(command.status)}`}>
                        {command.status}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{command.response}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No commands yet
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
