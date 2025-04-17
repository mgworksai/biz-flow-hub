
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Paperclip } from 'lucide-react';

// Mock ticket data
const mockTickets = [
  { 
    id: 'TCK-001', 
    subject: 'Appointment Rescheduling', 
    status: 'Pending', 
    createdAt: '2025-04-16' 
  },
  { 
    id: 'TCK-002', 
    subject: 'Question about invoice INV-002', 
    status: 'Resolved', 
    createdAt: '2025-04-10' 
  }
];

const getStatusBadgeClass = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'; // Pending: Yellow #FBBF24
    case 'resolved':
      return 'bg-green-100 text-green-800'; // Resolved: Green #10B981
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const PortalSupport: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tickets' | 'newTicket'>('tickets');
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      
      // Check file type
      const validTypes = ['image/jpeg', 'image/png'];
      if (!validTypes.includes(selectedFile.type)) {
        alert('Please select a JPEG or PNG image');
        return;
      }
      
      // Check file size (2MB limit)
      if (selectedFile.size > 2 * 1024 * 1024) {
        alert('File size must be less than 2MB');
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Ticket submitted:', {
      subject,
      category,
      description,
      file: file ? file.name : 'No file attached'
    });
    // In a real app, this would make an API call to create the ticket
    alert('Support ticket submitted successfully!');
    setSubject('');
    setCategory('');
    setDescription('');
    setFile(null);
    setActiveTab('tickets');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Support</h1>
        <Button 
          onClick={() => setActiveTab(activeTab === 'tickets' ? 'newTicket' : 'tickets')}
        >
          {activeTab === 'tickets' ? 'New Ticket' : 'View Tickets'}
        </Button>
      </div>
      
      {activeTab === 'tickets' ? (
        <Card>
          <CardHeader>
            <CardTitle>Your Support Tickets</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {mockTickets.length > 0 ? (
              <div className="table-container">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ticket ID</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockTickets.map((ticket) => (
                      <TableRow key={ticket.id}>
                        <TableCell>{ticket.id}</TableCell>
                        <TableCell>{ticket.subject}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(ticket.status)}`}>
                            {ticket.status}
                          </span>
                        </TableCell>
                        <TableCell>{ticket.createdAt}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">View</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No support tickets found
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Create Support Ticket</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input 
                    id="subject" 
                    placeholder="Brief description of your issue" 
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory} required>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="booking">Booking Issue</SelectItem>
                      <SelectItem value="invoice">Invoice Question</SelectItem>
                      <SelectItem value="service">Service Feedback</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Provide details about your issue" 
                    rows={5}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="attachment">Attachment (Optional)</Label>
                  <div className="mt-1 flex items-center">
                    <label className="block">
                      <span className="sr-only">Choose file</span>
                      <input 
                        id="attachment"
                        type="file" 
                        className="block w-full text-sm text-gray-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-md file:border-0
                          file:text-sm file:font-medium
                          file:bg-primary file:text-primary-foreground
                          hover:file:cursor-pointer hover:file:bg-primary/90"
                        onChange={handleFileChange}
                        accept=".jpg,.jpeg,.png"
                      />
                    </label>
                  </div>
                  {file && (
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <Paperclip size={16} className="mr-1" />
                      <span>{file.name}</span>
                    </div>
                  )}
                  <p className="mt-1 text-xs text-gray-500">JPEG or PNG, max 2MB</p>
                </div>
              </div>
              
              <Button type="submit" className="w-full">
                Submit Ticket
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PortalSupport;
