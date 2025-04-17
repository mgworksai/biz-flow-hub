
import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Plus, Search, Edit, Trash, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import CustomerForm from '@/components/customers/CustomerForm';
import { Customer, useCustomers } from '@/hooks/useCustomers';
import { useCurrentBusinessId } from '@/hooks/useCurrentBusinessId';
import { toast } from '@/hooks/use-toast';

const Customers = () => {
  const { businessId } = useCurrentBusinessId();
  const { customers, createCustomer, updateCustomer, deleteCustomer } = useCustomers(businessId);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const filteredCustomers = customers.filter(customer => 
    customer.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (customer.phone && customer.phone.includes(searchTerm))
  );

  const handleAddCustomer = async (formData: any) => {
    if (!businessId) {
      toast({
        title: "Error",
        description: "Business ID not found",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await createCustomer({
        ...formData,
        business_id: businessId
      });
      setIsAddDialogOpen(false);
    } catch (error) {
      // Error already handled in the hook
    }
  };

  const handleEditCustomer = async (formData: any) => {
    if (!selectedCustomer) return;
    
    try {
      await updateCustomer(selectedCustomer.id, formData);
      setIsEditDialogOpen(false);
      setSelectedCustomer(null);
    } catch (error) {
      // Error already handled in the hook
    }
  };

  const handleDeleteCustomer = async (id: string) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      try {
        await deleteCustomer(id);
      } catch (error) {
        // Error already handled in the hook
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="dashboard-container">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-2xl font-bold">Customers</h1>
          <Button 
            onClick={() => setIsAddDialogOpen(true)} 
            className="mt-2 sm:mt-0"
          >
            <Plus size={16} className="mr-2" />
            Add Customer
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-0">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
              <CardTitle>Customer Directory</CardTitle>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  type="text"
                  placeholder="Search customers..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                        {customers.length === 0 
                          ? "No customers found. Add your first customer to get started." 
                          : "No customers match your search criteria."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCustomers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell className="font-medium">{customer.full_name}</TableCell>
                        <TableCell>
                          {customer.email ? (
                            <a href={`mailto:${customer.email}`} className="flex items-center text-primary hover:underline">
                              <Mail size={14} className="mr-1" />
                              {customer.email}
                            </a>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {customer.phone ? (
                            <a href={`tel:${customer.phone}`} className="flex items-center text-primary hover:underline">
                              <Phone size={14} className="mr-1" />
                              {customer.phone}
                            </a>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {customer.notes || <span className="text-gray-400">—</span>}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                Actions
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedCustomer(customer);
                                  setIsEditDialogOpen(true);
                                }}
                              >
                                <Edit size={14} className="mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteCustomer(customer.id)}
                                className="text-red-600"
                              >
                                <Trash size={14} className="mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Add Customer Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
            </DialogHeader>
            <CustomerForm 
              onSubmit={handleAddCustomer} 
              onCancel={() => setIsAddDialogOpen(false)} 
            />
          </DialogContent>
        </Dialog>

        {/* Edit Customer Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Customer</DialogTitle>
            </DialogHeader>
            {selectedCustomer && (
              <CustomerForm 
                onSubmit={handleEditCustomer} 
                onCancel={() => {
                  setIsEditDialogOpen(false);
                  setSelectedCustomer(null);
                }} 
                defaultValues={{
                  full_name: selectedCustomer.full_name,
                  email: selectedCustomer.email,
                  phone: selectedCustomer.phone,
                  notes: selectedCustomer.notes
                }}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Customers;
