
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

export type Invoice = {
  id: string;
  business_id: string;
  customer_id?: string;
  amount_cents: number;
  currency: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  stripe_checkout_session_id?: string;
  stripe_checkout_url?: string;
  pdf_url?: string;
  due_date?: string;
  created_at: string;
};

export type InvoiceInput = {
  business_id: string;
  customer_id?: string;
  amount_cents: number;
  currency?: string;
  status?: 'draft' | 'sent' | 'paid' | 'overdue';
  due_date?: string;
};

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
    
    // Set up initial data fetch
    const fetchInvoices = async () => {
      try {
        const { data, error } = await supabase
          .from('invoices')
          .select(`
            *,
            customers (
              id,
              full_name,
              email
            )
          `)
          .eq('business_id', businessId)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setInvoices(data as any);
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

    // Set up realtime subscription
    const channel = supabase
      .channel('invoices_channel')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'invoices',
        filter: `business_id=eq.${businessId}`
      }, (payload) => {
        fetchInvoices(); // Refetch all data to include customers relation
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [businessId]);

  const createInvoice = async (invoiceData: InvoiceInput): Promise<Invoice> => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .insert([invoiceData])
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

  const deleteInvoice = async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Invoice deleted",
        description: "The invoice has been deleted successfully.",
      });
    } catch (err: any) {
      toast({
        title: "Error deleting invoice",
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
    deleteInvoice,
    sendInvoice
  };
}
