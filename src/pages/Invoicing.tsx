
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { 
  Download, 
  Plus, 
  CreditCard,
  Check,
  Clock,
  Ban,
  ExternalLink
} from 'lucide-react';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import InvoiceForm from '@/components/invoices/InvoiceForm';
import { useInvoices } from '@/hooks/useInvoices';
import { useCustomers } from '@/hooks/useCustomers';
import { useCurrentBusinessId } from '@/hooks/useCurrentBusinessId';

const getStatusBadgeClass = (status: string) => {
  switch (status.toLowerCase()) {
    case 'draft':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'sent':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'paid':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'overdue':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case 'draft':
      return <Clock size={14} />;
    case 'sent':
      return <ExternalLink size={14} />;
    case 'paid':
      return <Check size={14} />;
    case 'overdue':
      return <Ban size={14} />;
    default:
      return <Clock size={14} />;
  }
};

const Invoicing: React.FC = () => {
  const location = useLocation();
  const { businessId } = useCurrentBusinessId();
  const { toast } = useToast();
  const { invoices, createInvoice, sendInvoice } = useInvoices(businessId);
  const { customers } = useCustomers(businessId);
  
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);

  // Check for success or cancelled status from URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('success') === 'true') {
      toast({
        title: "Payment successful",
        description: "The invoice has been marked as paid.",
      });
      // Remove query params
      window.history.replaceState({}, '', location.pathname);
    } else if (searchParams.get('cancelled') === 'true') {
      toast({
        title: "Payment cancelled",
        description: "The customer cancelled the payment process.",
        variant: "destructive"
      });
      // Remove query params
      window.history.replaceState({}, '', location.pathname);
    }
  }, [location, toast]);

  const handleCreateInvoice = async (values: {
    customer_id: string;
    amount_cents: number;
    due_date?: string;
  }) => {
    if (!businessId) {
      toast({
        title: "Error",
        description: "Business ID not found. Please try again or contact support.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await createInvoice({
        ...values,
        business_id: businessId,
        status: 'draft'
      });
      setShowInvoiceForm(false);
    } catch (error) {
      // Error already handled in the hook
    }
  };

  const handleSendInvoice = async (invoiceId: string) => {
    try {
      const url = await sendInvoice(invoiceId);
      window.open(url, '_blank');
    } catch (error) {
      // Error already handled in the hook
    }
  };

  const formatCurrency = (cents: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(cents / 100);
  };

  return (
    <DashboardLayout>
      <div className="dashboard-container">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Invoicing</h1>
          <Button onClick={() => setShowInvoiceForm(true)} className="flex items-center gap-2">
            <Plus size={16} />
            <span>Create Invoice</span>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Invoices</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10 text-gray-500">
                        No invoices found. Create your first invoice to get started.
                      </TableCell>
                    </TableRow>
                  ) : (
                    invoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">
                          {invoice.id.substring(0, 8)}
                        </TableCell>
                        <TableCell>
                          {invoice.customers?.full_name || '—'}
                        </TableCell>
                        <TableCell>
                          {formatCurrency(invoice.amount_cents, invoice.currency)}
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center w-fit gap-1 border ${getStatusBadgeClass(invoice.status)}`}>
                            {getStatusIcon(invoice.status)}
                            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell>
                          {invoice.due_date 
                            ? format(new Date(invoice.due_date), 'MMM dd, yyyy')
                            : '—'}
                        </TableCell>
                        <TableCell>
                          {format(new Date(invoice.created_at), 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            {invoice.status === 'draft' && (
                              <Button 
                                size="sm" 
                                onClick={() => handleSendInvoice(invoice.id)}
                              >
                                <CreditCard size={16} className="mr-1" />
                                Send
                              </Button>
                            )}
                            {invoice.status === 'sent' && invoice.stripe_checkout_url && (
                              <Button 
                                size="sm" 
                                onClick={() => window.open(invoice.stripe_checkout_url, '_blank')}
                              >
                                <ExternalLink size={16} className="mr-1" />
                                View
                              </Button>
                            )}
                            {invoice.pdf_url && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => window.open(invoice.pdf_url, '_blank')}
                              >
                                <Download size={16} />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Create Invoice Dialog */}
        <Dialog open={showInvoiceForm} onOpenChange={setShowInvoiceForm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Invoice</DialogTitle>
            </DialogHeader>
            <InvoiceForm 
              onSubmit={handleCreateInvoice} 
              onCancel={() => setShowInvoiceForm(false)}
              customers={customers}
            />
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Invoicing;
