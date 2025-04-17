
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import type { Tables } from '@/integrations/supabase/types';

export type Invoice = Tables['invoices']['Row'] & { 
  customers?: Pick<Tables['customers']['Row'], 'full_name' | 'email'> 
};
export type InvoiceInput = Omit<Invoice, 'id' | 'created_at' | 'customers'>;

export function useInvoices(businessId: string | null) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!businessId) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    
    const fetchInvoices = async () => {
      try {
        const { data, error } = await supabase
          .from('invoices')
          .select(`
            *,
            customers (
              full_name,
              email
            )
          `)
          .eq('business_id', businessId)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setInvoices(data ?? []);
      } catch (err: any) {
        setError(err);
        toast({
          title: "Error fetching invoices",
          description: err.message,
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();

    const channel = supabase
      .channel('invoices_channel')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'invoices',
        filter: `business_id=eq.${businessId}`
      }, () => {
        fetchInvoices(); // Refetch to ensure latest data with relations
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [businessId]);

  const createInvoice = async (invoiceData: Omit<InvoiceInput, 'status'>): Promise<Invoice> => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .insert([{ ...invoiceData, status: 'draft' }])
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Invoice created",
        description: "The invoice has been created as a draft.",
      });
      
      return data as Invoice;
    } catch (err: any) {
      toast({
        title: "Error creating invoice",
        description: err.message,
        variant: "destructive"
      });
      throw err;
    }
  };

  const updateInvoice = async (id: string, updates: Partial<InvoiceInput>): Promise<Invoice> => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Invoice updated",
        description: "The invoice has been updated successfully.",
      });
      
      return data as Invoice;
    } catch (err: any) {
      toast({
        title: "Error updating invoice",
        description: err.message,
        variant: "destructive"
      });
      throw err;
    }
  };

  const sendInvoice = async (invoiceId: string): Promise<string> => {
    try {
      const response = await fetch('/api/functions/v1/stripe/createInvoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({ invoiceId })
      });
      
      if (!response.ok) {
        throw new Error('Failed to create payment session');
      }
      
      const { url } = await response.json();
      
      toast({
        title: "Invoice sent",
        description: "The invoice has been sent for payment.",
      });
      
      return url;
    } catch (err: any) {
      toast({
        title: "Error sending invoice",
        description: err.message,
        variant: "destructive"
      });
      throw err;
    }
  };

  return {
    invoices,
    loading,
    error,
    createInvoice,
    updateInvoice,
    sendInvoice
  };
}
