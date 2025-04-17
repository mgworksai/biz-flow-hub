
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

export type Booking = {
  id: string;
  customer_name: string;
  service: string;
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed' | 'pending';
  notes?: string;
  starts_at: string;
  ends_at?: string;
  created_at: string;
  business_id: string;
};

export type BookingInput = {
  customer_name: string;
  service: string;
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed' | 'pending';
  notes?: string;
  starts_at: string;
  ends_at?: string;
  business_id?: string;
};

export function useBookings(businessId?: string) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!businessId) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    
    // Set up initial data fetch
    const fetchBookings = async () => {
      try {
        let query = supabase.from('bookings').select('*');
        
        if (businessId) {
          query = query.eq('business_id', businessId);
        }
        
        const { data, error } = await query.order('starts_at', { ascending: true });
        
        if (error) throw error;
        setBookings(data as Booking[]);
      } catch (err: any) {
        setError(err);
        toast({
          title: "Error fetching bookings",
          description: err.message,
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();

    // Set up realtime subscription
    const channel = supabase
      .channel('bookings_channel')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'bookings',
        filter: businessId ? `business_id=eq.${businessId}` : undefined
      }, (payload) => {
        const { eventType, new: newBooking, old: oldBooking } = payload;
        
        if (eventType === 'INSERT') {
          setBookings(current => [...current, newBooking as Booking]);
        } else if (eventType === 'UPDATE') {
          setBookings(current => 
            current.map(booking => 
              booking.id === oldBooking.id ? { ...booking, ...newBooking } as Booking : booking
            )
          );
        } else if (eventType === 'DELETE') {
          setBookings(current => 
            current.filter(booking => booking.id !== oldBooking.id)
          );
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [businessId]);

  const createBooking = async (bookingData: BookingInput): Promise<Booking> => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert([bookingData])
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Booking created",
        description: "The booking has been created successfully.",
      });
      
      return data as Booking;
    } catch (err: any) {
      toast({
        title: "Error creating booking",
        description: err.message,
        variant: "destructive"
      });
      throw err;
    }
  };

  // Add this overload for createBooking that requires business_id
  const createBookingWithBusinessId = async (
    input: Omit<BookingInput, "business_id"> & { business_id: string }
  ): Promise<void> => {
    try {
      const { error } = await supabase.from("bookings").insert([input]);
      if (error) throw error;
      
      toast({
        title: "Booking created",
        description: "The booking has been created successfully.",
      });
    } catch (err: any) {
      toast({
        title: "Error creating booking",
        description: err.message,
        variant: "destructive"
      });
      throw err;
    }
  };

  const updateBooking = async (id: string, updates: Partial<BookingInput>): Promise<Booking> => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Booking updated",
        description: "The booking has been updated successfully.",
      });
      
      return data as Booking;
    } catch (err: any) {
      toast({
        title: "Error updating booking",
        description: err.message,
        variant: "destructive"
      });
      throw err;
    }
  };

  const deleteBooking = async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Booking deleted",
        description: "The booking has been deleted successfully.",
      });
    } catch (err: any) {
      toast({
        title: "Error deleting booking",
        description: err.message,
        variant: "destructive"
      });
      throw err;
    }
  };

  return {
    bookings,
    loading,
    error,
    createBooking,
    createBookingWithBusinessId,
    updateBooking,
    deleteBooking
  };
}
