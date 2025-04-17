
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const services = [
  { id: 'haircut', name: 'Haircut' },
  { id: 'coloring', name: 'Hair Coloring' },
  { id: 'styling', name: 'Hair Styling' },
  { id: 'treatment', name: 'Hair Treatment' }
];

const timeSlots = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', 
  '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
  '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
  '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM',
  '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM'
];

// Mock function to check availability
const getSlotAvailability = (date: string, time: string) => {
  // This would be replaced with actual availability check from backend
  const random = Math.random();
  if (random < 0.3) return 'booked';
  return 'available';
};

const PortalBooking: React.FC = () => {
  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Booking submitted:', {
      service: selectedService,
      date: selectedDate,
      time: selectedTime
    });
    // In a real app, this would make an API call to create the booking
    alert('Booking submitted successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Book an Appointment</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Select Service & Time</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="service">Service</Label>
                <Select value={selectedService} onValueChange={setSelectedService} required>
                  <SelectTrigger id="service">
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map(service => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="date">Date</Label>
                <Input 
                  id="date" 
                  type="date" 
                  min={new Date().toISOString().split('T')[0]}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  required
                />
              </div>
              
              {selectedDate && (
                <div className="space-y-2">
                  <Label>Available Time Slots</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {timeSlots.map(time => {
                      const availability = getSlotAvailability(selectedDate, time);
                      return (
                        <Button
                          key={time}
                          type="button"
                          variant={selectedTime === time ? 'default' : 'outline'}
                          className={`${
                            availability === 'booked' 
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                              : availability === 'available' && selectedTime !== time
                              ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100 hover:text-green-800'
                              : ''
                          }`}
                          disabled={availability === 'booked'}
                          onClick={() => setSelectedTime(time)}
                        >
                          {time}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={!selectedService || !selectedDate || !selectedTime}
            >
              Book Appointment
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PortalBooking;
