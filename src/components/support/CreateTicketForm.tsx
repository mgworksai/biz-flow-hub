
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CreateTicketFormProps {
  onCancel: () => void;
}

const CreateTicketForm: React.FC<CreateTicketFormProps> = ({ onCancel }) => {
  const [customerName, setCustomerName] = useState('');
  const [priority, setPriority] = useState('medium');
  const [issue, setIssue] = useState('');
  const [assignedStaff, setAssignedStaff] = useState('');

  // Mock staff list
  const staffList = [
    { id: 1, name: 'Sarah Johnson' },
    { id: 2, name: 'Michael Chen' },
    { id: 3, name: 'Emily Williams' },
    { id: 4, name: 'Tom Anderson' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Will be replaced with actual API call to create ticket
    console.log({
      customerName,
      priority,
      issue,
      assignedStaff
    });
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="customerName">Customer Name</Label>
          <Input 
            id="customerName" 
            placeholder="Enter customer name" 
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="priority">Priority</Label>
          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger id="priority">
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="md:col-span-2">
          <Label htmlFor="issue">Issue</Label>
          <Textarea 
            id="issue" 
            placeholder="Describe the issue in detail" 
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
            required
            rows={4}
          />
        </div>
        
        <div>
          <Label htmlFor="assignedStaff">Assigned Staff</Label>
          <Select value={assignedStaff} onValueChange={setAssignedStaff}>
            <SelectTrigger id="assignedStaff">
              <SelectValue placeholder="Select staff member" />
            </SelectTrigger>
            <SelectContent>
              {staffList.map((staff) => (
                <SelectItem key={staff.id} value={staff.name}>
                  {staff.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Create Ticket</Button>
      </div>
    </form>
  );
};

export default CreateTicketForm;
