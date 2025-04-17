
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

export type Ticket = {
  id: string;
  business_id: string;
  customer_id?: string;
  subject: string;
  message: string;
  status: 'open' | 'pending' | 'closed';
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
};

export type TicketInput = {
  business_id: string;
  customer_id?: string;
  subject: string;
  message: string;
  status?: 'open' | 'pending' | 'closed';
  priority?: 'low' | 'medium' | 'high';
};

export function useTickets(businessId: string | null) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [openTicketCount, setOpenTicketCount] = useState(0);

  useEffect(() => {
    if (!businessId) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    
    // Set up initial data fetch
    const fetchTickets = async () => {
      try {
        const { data, error } = await supabase
          .from('tickets')
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
        setTickets(data as any);
        
        // Count open tickets
        const openCount = data.filter((ticket: any) => ticket.status === 'open').length;
        setOpenTicketCount(openCount);
      } catch (err: any) {
        setError(err);
        toast({
          title: "Error fetching tickets",
          description: err.message,
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();

    // Set up realtime subscription
    const channel = supabase
      .channel('tickets_channel')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'tickets',
        filter: `business_id=eq.${businessId}`
      }, (payload) => {
        fetchTickets(); // Refetch all data to include customers relation
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [businessId]);

  const createTicket = async (ticketData: TicketInput): Promise<Ticket> => {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .insert([ticketData])
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Ticket created",
        description: "The support ticket has been created successfully.",
      });
      
      return data as Ticket;
    } catch (err: any) {
      toast({
        title: "Error creating ticket",
        description: err.message,
        variant: "destructive"
      });
      throw err;
    }
  };

  const updateTicket = async (id: string, updates: Partial<Ticket>): Promise<Ticket> => {
    try {
      // Add updated_at timestamp
      const updateData = {
        ...updates,
        updated_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('tickets')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Ticket updated",
        description: "The ticket has been updated successfully.",
      });
      
      return data as Ticket;
    } catch (err: any) {
      toast({
        title: "Error updating ticket",
        description: err.message,
        variant: "destructive"
      });
      throw err;
    }
  };

  const deleteTicket = async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('tickets')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Ticket deleted",
        description: "The ticket has been deleted successfully.",
      });
    } catch (err: any) {
      toast({
        title: "Error deleting ticket",
        description: err.message,
        variant: "destructive"
      });
      throw err;
    }
  };

  return {
    tickets,
    loading,
    error,
    openTicketCount,
    createTicket,
    updateTicket,
    deleteTicket
  };
}
