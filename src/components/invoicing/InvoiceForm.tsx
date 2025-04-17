
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';

interface InvoiceFormProps {
  onCancel: () => void;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ onCancel }) => {
  const [logoUrl, setLogoUrl] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [address, setAddress] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('');
  const [headerColor, setHeaderColor] = useState('#2563EB'); // Default blue
  const [customer, setCustomer] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Will be replaced with actual API call to save invoice
    console.log({
      logoUrl,
      businessName,
      address,
      paymentTerms,
      headerColor,
      customer,
      amount,
      dueDate
    });
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="logoUrl">Logo URL</Label>
          <Input 
            id="logoUrl" 
            placeholder="https://example.com/logo.png" 
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
          />
        </div>
        
        <div>
          <Label htmlFor="businessName">Business Name</Label>
          <Input 
            id="businessName" 
            placeholder="Your Business Name" 
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
          />
        </div>
        
        <div className="md:col-span-2">
          <Label htmlFor="address">Business Address</Label>
          <Textarea 
            id="address" 
            placeholder="123 Business St, City, State, ZIP" 
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        
        <div className="md:col-span-2">
          <Label htmlFor="paymentTerms">Payment Terms</Label>
          <Textarea 
            id="paymentTerms" 
            placeholder="Payment is due within 30 days of receipt." 
            value={paymentTerms}
            onChange={(e) => setPaymentTerms(e.target.value)}
          />
        </div>
        
        <div>
          <Label htmlFor="headerColor">Header Color</Label>
          <div className="flex items-center space-x-2">
            <Input 
              id="headerColor" 
              type="color" 
              value={headerColor}
              onChange={(e) => setHeaderColor(e.target.value)}
              className="w-12 h-10"
            />
            <span className="text-sm text-gray-500">{headerColor}</span>
          </div>
        </div>
        
        <div>
          <Label htmlFor="customer">Customer</Label>
          <Input 
            id="customer" 
            placeholder="Customer Name" 
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
          />
        </div>
        
        <div>
          <Label htmlFor="amount">Amount</Label>
          <Input 
            id="amount" 
            placeholder="99.99" 
            type="number" 
            min="0" 
            step="0.01" 
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        
        <div>
          <Label htmlFor="dueDate">Due Date</Label>
          <Input 
            id="dueDate" 
            type="date" 
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Invoice</Button>
      </div>
    </form>
  );
};

export default InvoiceForm;
