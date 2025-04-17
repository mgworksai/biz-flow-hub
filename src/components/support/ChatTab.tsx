
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Send } from 'lucide-react';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isStaff: boolean;
}

const ChatTab: React.FC = () => {
  const [selectedTicket, setSelectedTicket] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  // Mock tickets for dropdown
  const ticketOptions = [
    { id: 'TCK-001', customer: 'John Doe' },
    { id: 'TCK-002', customer: 'Jane Smith' },
    { id: 'TCK-003', customer: 'Robert Johnson' },
    { id: 'TCK-004', customer: 'Emily Davis' }
  ];

  // Mock message data
  const mockMessagesData = {
    'TCK-001': [
      { id: '1', sender: 'John Doe', content: 'Hi, I need help with scheduling an appointment', timestamp: '2023-04-15T10:30:00', isStaff: false },
      { id: '2', sender: 'Sarah Johnson', content: 'Hello John, I\'d be happy to help you with scheduling. What service are you looking to book?', timestamp: '2023-04-15T10:32:00', isStaff: true },
      { id: '3', sender: 'John Doe', content: 'I need a haircut appointment for next Tuesday', timestamp: '2023-04-15T10:33:00', isStaff: false }
    ],
    'TCK-002': [
      { id: '1', sender: 'Jane Smith', content: 'Hello, there seems to be an issue with my invoice #INV-002', timestamp: '2023-04-14T15:20:00', isStaff: false },
      { id: '2', sender: 'Michael Chen', content: 'Hi Jane, let me check that for you. What specifically is wrong with the invoice?', timestamp: '2023-04-14T15:22:00', isStaff: true }
    ]
  };

  useEffect(() => {
    // Scroll to bottom whenever messages change
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Load messages when ticket is selected
    if (selectedTicket) {
      const ticketMessages = mockMessagesData[selectedTicket as keyof typeof mockMessagesData] || [];
      setMessages(ticketMessages);
      
      // Simulate typing after loading messages
      if (ticketMessages.length > 0) {
        setIsTyping(true);
        const timer = setTimeout(() => {
          setIsTyping(false);
        }, 3000);
        return () => clearTimeout(timer);
      }
    } else {
      setMessages([]);
    }
  }, [selectedTicket]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedTicket) return;

    // Add new message to the conversation
    const newMsg = {
      id: Date.now().toString(),
      sender: 'Support Staff',
      content: newMessage,
      timestamp: new Date().toISOString(),
      isStaff: true
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage('');
    
    // Simulate customer typing and response
    setTimeout(() => {
      setIsTyping(true);
      
      setTimeout(() => {
        setIsTyping(false);
        const customerResponse = {
          id: (Date.now() + 1).toString(),
          sender: selectedTicket === 'TCK-001' ? 'John Doe' : 'Jane Smith',
          content: 'Thank you for your help!',
          timestamp: new Date().toISOString(),
          isStaff: false
        };
        setMessages(prevMessages => [...prevMessages, customerResponse]);
      }, 3000);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="w-full md:w-1/3">
        <Select value={selectedTicket} onValueChange={setSelectedTicket}>
          <SelectTrigger>
            <SelectValue placeholder="Select a ticket to chat" />
          </SelectTrigger>
          <SelectContent>
            {ticketOptions.map((ticket) => (
              <SelectItem key={ticket.id} value={ticket.id}>
                {ticket.id}: {ticket.customer}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedTicket ? (
        <Card className="h-[calc(100vh-300px)] flex flex-col">
          <CardContent className="flex-1 flex flex-col p-0">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${message.isStaff ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.isStaff 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="font-semibold text-sm">{message.sender}</div>
                    <div>{message.content}</div>
                    <div className="text-xs opacity-70 mt-1">
                      {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-3 text-gray-500">
                    Typing...
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            <form onSubmit={handleSendMessage} className="border-t p-4 flex gap-2">
              <Input 
                placeholder="Type your message..." 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" className="flex items-center gap-2">
                <Send size={16} />
                <span>Send</span>
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="text-center py-12 text-gray-500">
          Select a ticket to start chatting
        </div>
      )}
    </div>
  );
};

export default ChatTab;
