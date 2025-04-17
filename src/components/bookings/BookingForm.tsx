
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { BookingInput } from '@/hooks/useBookings';
import { useCurrentBusinessId } from '@/hooks/useCurrentBusinessId';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const bookingFormSchema = z.object({
  customer_name: z.string().min(2, { message: "Customer name is required" }),
  service: z.string().min(1, { message: "Service is required" }),
  status: z.enum(['scheduled', 'confirmed', 'cancelled', 'completed', 'pending']),
  notes: z.string().optional(),
  starts_at: z.date({ required_error: "Start date is required" }),
  ends_at: z.date().optional(),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

interface BookingFormProps {
  initialData?: Partial<BookingInput> & { id?: string };
  onSubmit: (data: BookingInput) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const services = [
  "Haircut",
  "Beard Trim",
  "Lawn Mowing",
  "House Cleaning",
  "Dog Walking",
  "Consultation",
  "Coaching",
  "Training",
];

const timeSlots = [];
for (let hour = 8; hour < 20; hour++) {
  for (let minute = 0; minute < 60; minute += 30) {
    const hourString = hour.toString().padStart(2, '0');
    const minuteString = minute.toString().padStart(2, '0');
    timeSlots.push(`${hourString}:${minuteString}`);
  }
}

const BookingForm: React.FC<BookingFormProps> = ({
  initialData = {},
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const { businessId } = useCurrentBusinessId();
  
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      customer_name: initialData.customer_name || "",
      service: initialData.service || "",
      status: initialData.status || "scheduled",
      notes: initialData.notes || "",
      starts_at: initialData.starts_at ? new Date(initialData.starts_at) : undefined,
      ends_at: initialData.ends_at ? new Date(initialData.ends_at) : undefined,
    },
  });

  const handleSubmit = async (values: BookingFormValues) => {
    try {
      if (!businessId) {
        toast({
          title: "Error",
          description: "No business context; please refresh or log in again.",
          variant: "destructive"
        });
        return;
      }
      
      // Convert dates to ISO strings for the API
      const bookingData: BookingInput & { business_id: string } = {
        customer_name: values.customer_name,
        service: values.service,
        status: values.status,
        notes: values.notes,
        starts_at: values.starts_at.toISOString(),
        ends_at: values.ends_at ? values.ends_at.toISOString() : undefined,
        business_id: businessId,
      };
      
      await onSubmit(bookingData);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="customer_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Customer Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="service"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service} value={service}>
                      {service}
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
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="starts_at"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="starts_at"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time</FormLabel>
                <Select
                  onValueChange={(time) => {
                    if (field.value) {
                      const date = new Date(field.value);
                      const [hours, minutes] = time.split(':').map(Number);
                      date.setHours(hours, minutes);
                      field.onChange(date);
                    }
                  }}
                  defaultValue={field.value ? format(field.value, "HH:mm") : undefined}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a time" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add any additional details here..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || !businessId}>
            {isSubmitting ? "Saving..." : initialData.id ? "Update Booking" : "Create Booking"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default BookingForm;
