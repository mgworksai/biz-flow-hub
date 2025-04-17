
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Calendar, Clock } from 'lucide-react';

const mockedTriggers = [
  { id: 'new_booking', name: 'New Booking', message: 'New booking confirmed! Book yours now at 20% off!' },
  { id: 'review', name: 'New Review', message: 'Thanks for the great review! We just received a 5-star rating from a happy customer. Book now for the same experience!' },
  { id: 'promotion', name: 'New Promotion', message: 'We\'ve just launched a special promotion! Get 20% off all services until the end of the month.' }
];

const PostScheduler: React.FC = () => {
  const [selectedTrigger, setSelectedTrigger] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['twitter']);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');

  const handlePlatformToggle = (platform: string) => {
    if (selectedPlatforms.includes(platform)) {
      setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform));
    } else {
      setSelectedPlatforms([...selectedPlatforms, platform]);
    }
  };

  const handleSchedule = () => {
    console.log('Scheduling post:', {
      trigger: selectedTrigger,
      platforms: selectedPlatforms,
      date: scheduledDate,
      time: scheduledTime
    });
    // In a real app, this would make an API call to schedule the post
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Trigger</Label>
        <Select value={selectedTrigger} onValueChange={setSelectedTrigger}>
          <SelectTrigger>
            <SelectValue placeholder="Select trigger event" />
          </SelectTrigger>
          <SelectContent>
            {mockedTriggers.map((trigger) => (
              <SelectItem key={trigger.id} value={trigger.id}>
                {trigger.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {selectedTrigger && (
          <div className="mt-2 text-sm text-muted-foreground">
            <span className="font-medium">Message: </span>
            {mockedTriggers.find(t => t.id === selectedTrigger)?.message}
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <Label>Platforms</Label>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant={selectedPlatforms.includes('twitter') ? 'default' : 'outline'}
            size="sm"
            onClick={() => handlePlatformToggle('twitter')}
          >
            Twitter
          </Button>
          <Button
            type="button"
            variant={selectedPlatforms.includes('instagram') ? 'default' : 'outline'}
            size="sm"
            onClick={() => handlePlatformToggle('instagram')}
          >
            Instagram
          </Button>
          <Button
            type="button"
            variant={selectedPlatforms.includes('facebook') ? 'default' : 'outline'}
            size="sm"
            onClick={() => handlePlatformToggle('facebook')}
          >
            Facebook
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="flex items-center gap-1">
            <Calendar size={16} />
            <span>Date</span>
          </Label>
          <Input 
            type="date" 
            min={new Date().toISOString().split('T')[0]}
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label className="flex items-center gap-1">
            <Clock size={16} />
            <span>Time</span>
          </Label>
          <Input 
            type="time" 
            value={scheduledTime}
            onChange={(e) => setScheduledTime(e.target.value)}
          />
        </div>
      </div>
      
      <Button 
        onClick={handleSchedule} 
        className="w-full"
        disabled={!selectedTrigger || selectedPlatforms.length === 0 || !scheduledDate || !scheduledTime}
      >
        Schedule Post
      </Button>
    </div>
  );
};

export default PostScheduler;
