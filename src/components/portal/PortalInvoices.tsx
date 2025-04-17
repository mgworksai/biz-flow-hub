
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Download, CreditCard } from 'lucide-react';

// Mock invoice data
const mockInvoices = [
  { 
    id: 'INV-001', 
    service: 'Haircut', 
    amount: '$49.99', 
    status: 'Pending', 
    dueDate: '2025-05-01' 
  },
  { 
    id: 'INV-002', 
    service: 'Hair Coloring', 
    amount: '$99.99', 
    status: 'Paid', 
    dueDate: '2025-04-15' 
  },
  { 
    id: 'INV-003', 
    service: 'Hair Treatment', 
    amount: '$79.99', 
    status: 'Overdue', 
    dueDate: '2025-04-10' 
  }
];

const getStatusBadgeClass = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'; // Pending: Yellow #FBBF24
    case 'paid':
      return 'bg-green-100 text-green-800'; // Paid: Green #10B981
    case 'overdue':
      return 'bg-red-100 text-red-800'; // Overdue: Red #EF4444
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const PortalInvoices: React.FC = () => {
  const handlePayNow = (invoiceId: string) => {
    console.log(`Pay now clicked for invoice ${invoiceId}`);
    // In a real app, this would redirect to Stripe Checkout
  };

  const handleDownloadPDF = (invoiceId: string) => {
    console.log(`Download PDF for invoice ${invoiceId}`);
    // In a real app, this would download the invoice PDF
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Your Invoices</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Invoice History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="table-container">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice ID</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>{invoice.id}</TableCell>
                    <TableCell>{invoice.service}</TableCell>
                    <TableCell>{invoice.amount}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </TableCell>
                    <TableCell>{invoice.dueDate}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-gray-500"
                          onClick={() => handleDownloadPDF(invoice.id)}
                        >
                          <Download size={16} />
                        </Button>
                        {invoice.status === 'Pending' && (
                          <Button 
                            size="sm" 
                            className="bg-primary text-white"
                            onClick={() => handlePayNow(invoice.id)}
                          >
                            <CreditCard size={16} className="mr-1" />
                            Pay
                          </Button>
                        )}
                      </div>
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

export default PortalInvoices;
