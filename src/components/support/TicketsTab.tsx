
import React, { useState } from 'react';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import CreateTicketForm from './CreateTicketForm';

// Mock ticket data
const mockTickets = [
  { 
    id: 'TCK-001', 
    customer: 'John Doe', 
    priority: 'Low', 
    issue: 'Need help setting up appointment scheduling', 
    status: 'Pending', 
    assignedStaff: 'Sarah Johnson' 
  },
  { 
    id: 'TCK-002', 
    customer: 'Jane Smith', 
    priority: 'Medium', 
    issue: 'Invoice not showing correct amount', 
    status: 'Pending', 
    assignedStaff: 'Michael Chen' 
  },
  { 
    id: 'TCK-003', 
    customer: 'Robert Johnson', 
    priority: 'High', 
    issue: 'Unable to login to customer portal', 
    status: 'Resolved', 
    assignedStaff: 'Emily Williams' 
  },
  { 
    id: 'TCK-004', 
    customer: 'Emily Davis', 
    priority: 'Medium', 
    issue: 'Need to cancel subscription', 
    status: 'Pending', 
    assignedStaff: 'Tom Anderson' 
  }
];

const getPriorityBadgeClass = (priority: string) => {
  switch (priority.toLowerCase()) {
    case 'low':
      return 'bg-green-100 text-green-800'; // Low: Green #10B981
    case 'medium':
      return 'bg-yellow-100 text-yellow-800'; // Medium: Yellow #FBBF24
    case 'high':
      return 'bg-red-100 text-red-800'; // High: Red #EF4444
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusBadgeClass = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'resolved':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const TicketsTab: React.FC = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);

  const toggleCreateForm = () => {
    setShowCreateForm(!showCreateForm);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={toggleCreateForm} className="flex items-center gap-2">
          <Plus size={16} />
          <span>Create Ticket</span>
        </Button>
      </div>

      {showCreateForm && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <CreateTicketForm onCancel={toggleCreateForm} />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          <div className="table-container">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket ID</TableHead>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Issue</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned Staff</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockTickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell>{ticket.id}</TableCell>
                    <TableCell>{ticket.customer}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadgeClass(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-md truncate">{ticket.issue}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(ticket.status)}`}>
                        {ticket.status}
                      </span>
                    </TableCell>
                    <TableCell>{ticket.assignedStaff}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">View</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TicketsTab;
