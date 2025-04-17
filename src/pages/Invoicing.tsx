
import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { 
  Download, 
  Plus, 
  FileText,
  Edit,
  Trash,
  CreditCard
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
import InvoiceForm from '../components/invoicing/InvoiceForm';

// Mock invoice data for UI development
const mockInvoices = [
  { 
    id: 'INV-001', 
    customer: 'John Doe', 
    amount: '$199.99', 
    status: 'Pending', 
    dueDate: '2025-05-01' 
  },
  { 
    id: 'INV-002', 
    customer: 'Jane Smith', 
    amount: '$299.99', 
    status: 'Paid', 
    dueDate: '2025-04-15' 
  },
  { 
    id: 'INV-003', 
    customer: 'Robert Johnson', 
    amount: '$99.99', 
    status: 'Overdue', 
    dueDate: '2025-04-10' 
  },
  { 
    id: 'INV-004', 
    customer: 'Emily Williams', 
    amount: '$149.99', 
    status: 'Pending', 
    dueDate: '2025-05-10' 
  },
  { 
    id: 'INV-005', 
    customer: 'Michael Brown', 
    amount: '$499.99', 
    status: 'Paid', 
    dueDate: '2025-04-20' 
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

const Invoicing: React.FC = () => {
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);

  const toggleInvoiceForm = () => {
    setShowInvoiceForm(!showInvoiceForm);
  };

  const handlePayNow = (invoiceId: string) => {
    console.log(`Process payment for invoice ${invoiceId}`);
    // This will be replaced with Stripe integration
  };

  const handleDownloadPDF = (invoiceId: string) => {
    console.log(`Download PDF for invoice ${invoiceId}`);
    // This will be replaced with PDF generation
  };

  return (
    <DashboardLayout>
      <div className="dashboard-container">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Invoicing</h1>
          <Button onClick={toggleInvoiceForm} className="flex items-center gap-2">
            <Plus size={16} />
            <span>Create Invoice</span>
          </Button>
        </div>

        {showInvoiceForm ? (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Create New Invoice</CardTitle>
            </CardHeader>
            <CardContent>
              <InvoiceForm onCancel={toggleInvoiceForm} />
            </CardContent>
          </Card>
        ) : null}

        <Card>
          <CardContent className="p-0">
            <div className="table-container">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice ID</TableHead>
                    <TableHead>Customer</TableHead>
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
                      <TableCell>{invoice.customer}</TableCell>
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
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-gray-500"
                          >
                            <Edit size={16} />
                          </Button>
                          {invoice.status === 'Pending' && (
                            <Button 
                              size="sm" 
                              className="bg-primary text-white"
                              onClick={() => handlePayNow(invoice.id)}
                            >
                              <CreditCard size={16} className="mr-1" />
                              Pay Now
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
    </DashboardLayout>
  );
};

export default Invoicing;
