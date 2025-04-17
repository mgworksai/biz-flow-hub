
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

export type Customer = {
  id: string;
  business_id: string;
  full_name: string;
  email?: string | null;
  phone?: string | null;
  notes?: string | null;
  created_at?: string;
};

export type CustomerInput = Omit<Customer, 'id' | 'created_at'>;

export function useCustomers(businessId: string | null) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!businessId) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    
    const fetchCustomers = async () => {
      try {
        const { data, error } = await supabase
          .from('customers')
          .select('*')
          .eq('business_id', businessId)
          .order('full_name', { ascending: true });
        
        if (error) throw error;
        setCustomers(data ?? []);
      } catch (err: any) {
        setError(err);
        toast({
          title: "Error fetching customers",
          description: err.message,
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();

    const channel = supabase
      .channel('customers_channel')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'customers',
        filter: `business_id=eq.${businessId}`
      }, (payload) => {
        const { eventType, new: newCustomer, old: oldCustomer } = payload;
        
        if (eventType === 'INSERT') {
          setCustomers(current => [...current, newCustomer as Customer]);
        } else if (eventType === 'UPDATE') {
          setCustomers(current => 
            current.map(customer => 
              customer.id === (oldCustomer as Customer).id 
                ? { ...customer, ...(newCustomer as Customer) } 
                : customer
            )
          );
        } else if (eventType === 'DELETE') {
          setCustomers(current => 
            current.filter(customer => customer.id !== (oldCustomer as Customer).id)
          );
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [businessId]);

  const createCustomer = async (customerData: CustomerInput): Promise<Customer> => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .insert([customerData])
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Customer created",
        description: "The customer has been created successfully.",
      });
      
      return data as Customer;
    } catch (err: any) {
      toast({
        title: "Error creating customer",
        description: err.message,
        variant: "destructive"
      });
      throw err;
    }
  };

  const updateCustomer = async (id: string, updates: Partial<CustomerInput>): Promise<Customer> => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Customer updated",
        description: "The customer has been updated successfully.",
      });
      
      return data as Customer;
    } catch (err: any) {
      toast({
        title: "Error updating customer",
        description: err.message,
        variant: "destructive"
      });
      throw err;
    }
  };

  const deleteCustomer = async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Customer deleted",
        description: "The customer has been deleted successfully.",
      });
    } catch (err: any) {
      toast({
        title: "Error deleting customer",
        description: err.message,
        variant: "destructive"
      });
      throw err;
    }
  };

  return {
    customers,
    loading,
    error,
    createCustomer,
    updateCustomer,
    deleteCustomer
  };
}
