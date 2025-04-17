
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';

const PostGenerator: React.FC = () => {
  const [platform, setPlatform] = useState('twitter');
  const [generatedContent, setGeneratedContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [businessType, setBusinessType] = useState('hair_salon');

  const businessTypes = [
    { value: 'hair_salon', label: 'Hair Salon' },
    { value: 'landscaper', label: 'Landscaping Service' },
    { value: 'dog_walker', label: 'Dog Walker' },
    { value: 'cleaning_service', label: 'Cleaning Service' }
  ];

  const handleGenerate = () => {
    setLoading(true);
    
    // Simulate API call to OpenAI
    setTimeout(() => {
      const contents = {
        twitter: "✂️ Ready for a fresh look? Enjoy 20% OFF all haircuts this week only! Book your appointment through our website or app today. #HairSalon #SpecialDiscount #NewLook",
        instagram: "Transform your look with our expert stylists! 💇‍♀️✨\n\nFor a limited time, enjoy 20% OFF all haircut services. Our team uses premium products and the latest techniques to give you that perfect style.\n\nTap the link in bio to book your appointment!\n\n#HairSalon #BeautyServices #SpecialOffer #Discount",
        facebook: "🌟 SPECIAL OFFER: 20% OFF ALL HAIRCUTS! 🌟\n\nLooking for a change? Our expert stylists are here to help you transform your look! Book your appointment this week and receive 20% off any haircut service.\n\nCall us or book online - limited slots available!\n\n#HairSalon #SpecialDiscount"
      };
      
      setGeneratedContent(contents[platform as keyof typeof contents]);
      setLoading(false);
    }, 2000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    // In a real app, you'd add a toast notification here
    console.log('Content copied to clipboard');
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Business Type</Label>
        <Select value={businessType} onValueChange={setBusinessType}>
          <SelectTrigger>
            <SelectValue placeholder="Select business type" />
          </SelectTrigger>
          <SelectContent>
            {businessTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label>Platform</Label>
        <Tabs defaultValue="twitter" value={platform} onValueChange={setPlatform}>
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="twitter">Twitter</TabsTrigger>
            <TabsTrigger value="instagram">Instagram</TabsTrigger>
            <TabsTrigger value="facebook">Facebook</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <Button 
        onClick={handleGenerate} 
        className="w-full"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 size={16} className="mr-2 animate-spin" />
            Generating...
          </>
        ) : 'Generate Post'}
      </Button>
      
      {generatedContent && (
        <div className="space-y-2 mt-6">
          <Label>Generated Content</Label>
          <Textarea 
            value={generatedContent} 
            readOnly 
            rows={6}
            className="resize-none"
          />
          <div className="flex justify-end">
            <Button size="sm" variant="outline" onClick={handleCopy}>
              Copy to Clipboard
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostGenerator;
