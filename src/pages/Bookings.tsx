
import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Calendar, Plus, Filter, ChevronLeft, ChevronRight, MoreHorizontal, Trash2, Edit } from 'lucide-react';
import { useBookings, Booking, BookingInput } from '@/hooks/useBookings';
import BookingForm from '@/components/bookings/BookingForm';
import { format, addDays, startOfWeek, isWithinInterval, parseISO } from 'date-fns';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

const timeSlots = [
  '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
  '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM',
];

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const Bookings: React.FC = () => {
  const { user } = useAuth();
  const [view, setView] = useState<'list' | 'calendar'>('calendar');
  const [currentWeek, setCurrentWeek] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Use the hook to fetch and manage bookings
  const { bookings, loading, createBooking, updateBooking, deleteBooking } = useBookings();

  const formattedWeek = `${format(currentWeek, 'MMM d')} - ${format(addDays(currentWeek, 6), 'MMM d, yyyy')}`;

  const handlePreviousWeek = () => {
    setCurrentWeek(prev => addDays(prev, -7));
  };

  const handleNextWeek = () => {
    setCurrentWeek(prev => addDays(prev, 7));
  };

  const handleCreateBooking = () => {
    setCurrentBooking(null);
    setIsCreating(true);
  };

  const handleEditBooking = (booking: Booking) => {
    setCurrentBooking(booking);
    setIsEditing(true);
  };

  const handleCloseModals = () => {
    setIsCreating(false);
    setIsEditing(false);
    setCurrentBooking(null);
  };

  const confirmDeleteBooking = (id: string) => {
    setBookingToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteBooking = async () => {
    if (bookingToDelete) {
      try {
        await deleteBooking(bookingToDelete);
        setDeleteDialogOpen(false);
        setBookingToDelete(null);
      } catch (error) {
        console.error("Error deleting booking:", error);
      }
    }
  };

  const handleSubmitBooking = async (data: BookingInput) => {
    setSubmitting(true);
    try {
      if (currentBooking) {
        await updateBooking(currentBooking.id, data);
      } else {
        await createBooking(data);
      }
      handleCloseModals();
    } catch (error) {
      console.error("Error submitting booking:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-500">Confirmed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">Cancelled</Badge>;
      case 'completed':
        return <Badge className="bg-blue-500">Completed</Badge>;
      default:
        return <Badge>Scheduled</Badge>;
    }
  };

  const isEventInCurrentWeek = (date: string) => {
    const eventDate = parseISO(date);
    const weekStart = currentWeek;
    const weekEnd = addDays(weekStart, 6);
    
    return isWithinInterval(eventDate, { start: weekStart, end: weekEnd });
  };

  const getDayFromDate = (date: string) => {
    const eventDate = parseISO(date);
    return days[eventDate.getDay() === 0 ? 6 : eventDate.getDay() - 1]; // Adjust for Monday start
  };

  const getTimeFromDate = (date: string) => {
    const eventDate = parseISO(date);
    return format(eventDate, 'h:mm a');
  };

  // Filter bookings for the current week view
  const currentWeekBookings = bookings.filter(booking => 
    booking.starts_at && isEventInCurrentWeek(booking.starts_at)
  );

  return (
    <DashboardLayout>
      <div className="dashboard-container">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-2xl font-bold">Bookings</h1>
          <div className="flex space-x-3 mt-2 sm:mt-0">
            <Button onClick={handleCreateBooking}>
              <Plus size={16} className="mr-2" />
              New Booking
            </Button>
            <div className="flex border rounded-md overflow-hidden">
              <button 
                className={`px-3 py-2 text-sm ${view === 'list' ? 'bg-primary text-primary-foreground' : 'bg-white text-gray-600'}`}
                onClick={() => setView('list')}
              >
                List
              </button>
              <button 
                className={`px-3 py-2 text-sm ${view === 'calendar' ? 'bg-primary text-primary-foreground' : 'bg-white text-gray-600'}`}
                onClick={() => setView('calendar')}
              >
                Calendar
              </button>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="dashboard-card p-6">
            <div className="space-y-4">
              <Skeleton className="h-8 w-1/3" />
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton key={index} className="h-12 w-full" />
                ))}
              </div>
            </div>
          </div>
        ) : view === 'list' ? (
          <div className="dashboard-card">
            <div className="flex justify-between items-center mb-4 p-4">
              <h2 className="flex items-center text-lg font-semibold">
                <Calendar size={20} className="mr-2 text-primary" />
                Upcoming Bookings
              </h2>
              <Button variant="outline" size="sm">
                <Filter size={16} className="mr-1" />
                Filter
              </Button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-2 text-left font-medium text-gray-600">Client</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-600">Service</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-600">Date</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-600">Time</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-600">Status</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-4 text-center text-gray-500">
                        No bookings found. Create a new booking to get started.
                      </td>
                    </tr>
                  ) : (
                    bookings.map((booking) => (
                      <tr key={booking.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-4 font-medium">{booking.customer_name}</td>
                        <td className="px-4 py-4">{booking.service}</td>
                        <td className="px-4 py-4">{format(new Date(booking.starts_at), 'yyyy-MM-dd')}</td>
                        <td className="px-4 py-4">{format(new Date(booking.starts_at), 'h:mm a')}</td>
                        <td className="px-4 py-4">
                          {getStatusBadge(booking.status)}
                        </td>
                        <td className="px-4 py-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal size={16} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleEditBooking(booking)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => confirmDeleteBooking(booking.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="dashboard-card">
            <div className="flex justify-between items-center mb-4 p-4">
              <h2 className="text-lg font-semibold">Weekly Calendar</h2>
              <div className="flex items-center space-x-3">
                <Button variant="outline" size="sm" onClick={handlePreviousWeek}>
                  <ChevronLeft size={16} />
                </Button>
                <span className="text-sm font-medium">{formattedWeek}</span>
                <Button variant="outline" size="sm" onClick={handleNextWeek}>
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
            
            <div className="overflow-x-auto pb-4">
              <div className="min-w-[800px]">
                {/* Calendar header */}
                <div className="grid grid-cols-8 border-b">
                  <div className="py-3 px-2 text-sm font-medium text-gray-500">Time</div>
                  {days.map((day) => (
                    <div key={day} className="py-3 px-2 text-sm font-medium text-gray-500">
                      {day}
                    </div>
                  ))}
                </div>
                
                {/* Calendar body */}
                <div className="relative">
                  {timeSlots.map((time, timeIndex) => (
                    <div key={time} className="grid grid-cols-8 border-b">
                      <div className="py-3 px-2 text-xs text-gray-500">{time}</div>
                      {days.map((day) => {
                        const eventsForDayAndTime = currentWeekBookings.filter(booking => 
                          getDayFromDate(booking.starts_at) === day && 
                          getTimeFromDate(booking.starts_at) === time
                        );
                        
                        return (
                          <div key={`${day}-${time}`} className="py-3 px-2 relative min-h-[60px]">
                            {eventsForDayAndTime.length > 0 ? (
                              eventsForDayAndTime.map(event => (
                                <div 
                                  key={event.id}
                                  className="absolute top-1 left-1 right-1 bg-primary/20 border-l-4 border-primary rounded-md p-2 shadow-sm text-xs cursor-pointer"
                                  onClick={() => handleEditBooking(event)}
                                >
                                  <p className="font-medium">{event.customer_name}</p>
                                  <p className="text-gray-600">{event.service}</p>
                                </div>
                              ))
                            ) : (
                              <div className="h-full w-full border border-dashed border-gray-200 rounded-md" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Booking Creation/Edit Dialog */}
      <Dialog open={isCreating || isEditing} onOpenChange={handleCloseModals}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{currentBooking ? 'Edit Booking' : 'Create New Booking'}</DialogTitle>
          </DialogHeader>
          <BookingForm
            initialData={currentBooking || {}}
            onSubmit={handleSubmitBooking}
            onCancel={handleCloseModals}
            isSubmitting={submitting}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the booking.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteBooking} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default Bookings;
