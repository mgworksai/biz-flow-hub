
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Customer } from '@/hooks/useCustomers';
import { useCurrentBusinessId } from '@/hooks/useCurrentBusinessId';

const InvoiceSchema = z.object({
  customer_id: z.string().min(1, "Customer is required"),
  amount: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number().min(0.01, "Amount must be greater than 0")
  ),
  due_date: z.date().optional()
});

type InvoiceFormProps = {
  onSubmit: (values: {
    customer_id: string;
    amount_cents: number;
    due_date?: string;
  }) => Promise<void>;
  onCancel: () => void;
  customers: Customer[];
};

const InvoiceForm = ({ onSubmit, onCancel, customers }: InvoiceFormProps) => {
  const { businessId } = useCurrentBusinessId();
  const [date, setDate] = useState<Date | undefined>(undefined);
  
  const form = useForm<z.infer<typeof InvoiceSchema>>({
    resolver: zodResolver(InvoiceSchema),
    defaultValues: {
      customer_id: '',
      amount: undefined
    }
  });

  const handleSubmit = async (values: z.infer<typeof InvoiceSchema>) => {
    if (!businessId) {
      toast({
        title: "Error",
        description: "Business ID not found. Please try again or contact support.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const amount_cents = Math.round(values.amount * 100);
      
      await onSubmit({
        customer_id: values.customer_id,
        amount_cents,
        due_date: values.due_date ? format(values.due_date, 'yyyy-MM-dd') : undefined
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
          name="customer_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Customer</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a customer" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount ($)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.01" 
                  placeholder="0.00" 
                  {...field}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="due_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Due Date (Optional)</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal ${
                        !field.value && "text-muted-foreground"
                      }`}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <Calendar className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={field.value}
                    onSelect={(date) => {
                      field.onChange(date);
                      setDate(date);
                    }}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            Create Invoice
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default InvoiceForm;
