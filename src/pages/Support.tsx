
import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { 
  Plus, 
  MessageSquare, 
  AlertCircle,
  X,
  CheckCircle,
  Clock
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import TicketForm from '@/components/support/TicketForm';
import { useTickets } from '@/hooks/useTickets';
import { useCustomers } from '@/hooks/useCustomers';
import { useCurrentBusinessId } from '@/hooks/useCurrentBusinessId';

const getStatusBadgeClass = (status: string) => {
  switch (status.toLowerCase()) {
    case 'open':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'closed':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getPriorityBadgeClass = (priority: string) => {
  switch (priority.toLowerCase()) {
    case 'high':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'low':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case 'open':
      return <AlertCircle size={14} />;
    case 'pending':
      return <Clock size={14} />;
    case 'closed':
      return <CheckCircle size={14} />;
    default:
      return <MessageSquare size={14} />;
  }
};

const Support: React.FC = () => {
  const { businessId } = useCurrentBusinessId();
  const { tickets, createTicket, updateTicket } = useTickets(businessId);
  const { customers } = useCustomers(businessId);
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isTicketSheetOpen, setIsTicketSheetOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [replyText, setReplyText] = useState('');

  const handleCreateTicket = async (formData: any) => {
    if (!businessId) return;
    
    try {
      await createTicket({
        ...formData,
        business_id: businessId
      });
      setIsCreateDialogOpen(false);
    } catch (error) {
      // Error already handled in the hook
    }
  };

  const handleStatusChange = async (status: 'open' | 'pending' | 'closed') => {
    if (!selectedTicket) return;
    
    try {
      await updateTicket(selectedTicket.id, { status });
    } catch (error) {
      // Error already handled in the hook
    }
  };

  const handleViewTicket = (ticket: any) => {
    setSelectedTicket(ticket);
    setIsTicketSheetOpen(true);
  };

  const closeTicketSheet = () => {
    setIsTicketSheetOpen(false);
    setSelectedTicket(null);
    setReplyText('');
  };

  return (
    <DashboardLayout>
      <div className="dashboard-container">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Support</h1>
          <Button onClick={() => setIsCreateDialogOpen(true)} className="flex items-center gap-2">
            <Plus size={16} />
            <span>Create Ticket</span>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Support Tickets</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tickets.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10 text-gray-500">
                        No tickets found. Create your first support ticket.
                      </TableCell>
                    </TableRow>
                  ) : (
                    tickets.map((ticket) => (
                      <TableRow key={ticket.id}>
                        <TableCell className="font-medium">
                          {ticket.subject}
                        </TableCell>
                        <TableCell>
                          {ticket.customers?.full_name || '—'}
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center w-fit gap-1 border ${getStatusBadgeClass(ticket.status)}`}>
                            {getStatusIcon(ticket.status)}
                            {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityBadgeClass(ticket.priority)}`}>
                            {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell>
                          {format(new Date(ticket.created_at), 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewTicket(ticket)}
                          >
                            <MessageSquare size={16} className="mr-1" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Create Ticket Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Support Ticket</DialogTitle>
            </DialogHeader>
            <TicketForm 
              onSubmit={handleCreateTicket} 
              onCancel={() => setIsCreateDialogOpen(false)}
              customers={customers}
            />
          </DialogContent>
        </Dialog>

        {/* Ticket Detail Sheet */}
        <Sheet open={isTicketSheetOpen} onOpenChange={setIsTicketSheetOpen}>
          <SheetContent className="sm:max-w-lg">
            {selectedTicket && (
              <>
                <SheetHeader>
                  <SheetTitle>{selectedTicket.subject}</SheetTitle>
                  <SheetDescription>
                    {selectedTicket.customers?.full_name 
                      ? `From: ${selectedTicket.customers.full_name}` 
                      : 'No customer associated'}
                  </SheetDescription>
                </SheetHeader>
                
                <div className="mt-6 space-y-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadgeClass(selectedTicket.status)}`}>
                        {selectedTicket.status.charAt(0).toUpperCase() + selectedTicket.status.slice(1)}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityBadgeClass(selectedTicket.priority)}`}>
                        {selectedTicket.priority.charAt(0).toUpperCase() + selectedTicket.priority.slice(1)}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {format(new Date(selectedTicket.created_at), 'MMM dd, yyyy hh:mm a')}
                    </span>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-md">
                    <p className="whitespace-pre-wrap">{selectedTicket.message}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium">Update Status</h3>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant={selectedTicket.status === 'open' ? 'default' : 'outline'}
                          className={selectedTicket.status === 'open' ? 'bg-red-600 hover:bg-red-700' : ''}
                          onClick={() => handleStatusChange('open')}
                        >
                          <AlertCircle size={14} className="mr-1" />
                          Open
                        </Button>
                        <Button 
                          size="sm" 
                          variant={selectedTicket.status === 'pending' ? 'default' : 'outline'}
                          className={selectedTicket.status === 'pending' ? 'bg-yellow-600 hover:bg-yellow-700' : ''}
                          onClick={() => handleStatusChange('pending')}
                        >
                          <Clock size={14} className="mr-1" />
                          Pending
                        </Button>
                        <Button 
                          size="sm" 
                          variant={selectedTicket.status === 'closed' ? 'default' : 'outline'}
                          className={selectedTicket.status === 'closed' ? 'bg-green-600 hover:bg-green-700' : ''}
                          onClick={() => handleStatusChange('closed')}
                        >
                          <CheckCircle size={14} className="mr-1" />
                          Closed
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mt-4">
                      <h3 className="text-sm font-medium">Add Reply</h3>
                      <Textarea 
                        placeholder="Type your response..."
                        rows={4}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                      />
                      <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={closeTicketSheet}>
                          Close
                        </Button>
                        <Button type="button" disabled={!replyText.trim()}>
                          Send Reply
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </DashboardLayout>
  );
};

export default Support;
