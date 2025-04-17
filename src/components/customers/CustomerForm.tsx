
import React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useCurrentBusinessId } from '@/hooks/useCurrentBusinessId';

const CustomerSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal(''))
});

type CustomerFormProps = {
  onSubmit: (values: z.infer<typeof CustomerSchema>) => Promise<void>;
  onCancel: () => void;
  defaultValues?: Partial<z.infer<typeof CustomerSchema>>;
};

const CustomerForm = ({ onSubmit, onCancel, defaultValues = {} }: CustomerFormProps) => {
  const { businessId } = useCurrentBusinessId();
  
  const form = useForm<z.infer<typeof CustomerSchema>>({
    resolver: zodResolver(CustomerSchema),
    defaultValues: {
      full_name: defaultValues.full_name || '',
      email: defaultValues.email || '',
      phone: defaultValues.phone || '',
      notes: defaultValues.notes || ''
    }
  });

  const handleSubmit = async (values: z.infer<typeof CustomerSchema>) => {
    if (!businessId) {
      toast({
        title: "Error",
        description: "Business ID not found. Please try again or contact support.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await onSubmit({
        ...values,
        email: values.email || undefined,
        phone: values.phone || undefined,
        notes: values.notes || undefined
      });
    } catch (error) {
      // Error is handled in the onSubmit function
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="john@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input placeholder="+1 (555) 123-4567" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Additional information about this customer..." 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            Save Customer
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CustomerForm;
