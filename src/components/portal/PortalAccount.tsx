
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Paperclip, Save, Layout, Grid3X3, LayoutList } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface PortalAccountProps {
  theme: {
    headerColor: string;
    logoUrl: string;
  };
  setTheme: React.Dispatch<React.SetStateAction<{
    headerColor: string;
    logoUrl: string;
  }>>;
}

const PortalAccount: React.FC<PortalAccountProps> = ({ theme, setTheme }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john.doe@example.com');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [headerColor, setHeaderColor] = useState(theme.headerColor);
  const [logoUrl, setLogoUrl] = useState(theme.logoUrl);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [logo, setLogo] = useState<File | null>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      
      // Check file type
      const validTypes = ['image/jpeg', 'image/png'];
      if (!validTypes.includes(selectedFile.type)) {
        alert('Please select a JPEG or PNG image');
        return;
      }
      
      // Check file size (1MB limit)
      if (selectedFile.size > 1 * 1024 * 1024) {
        alert('File size must be less than 1MB');
        return;
      }
      
      setLogo(selectedFile);
      // Create a local URL for preview
      setLogoUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Profile updated:', { name, email });
    // In a real app, this would make an API call to update the profile
    alert('Profile updated successfully!');
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    console.log('Password updated');
    // In a real app, this would make an API call to update the password
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    alert('Password updated successfully!');
  };

  const handleBrandingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Branding updated:', { headerColor, logoUrl, viewMode });
    // In a real app, this would make an API call to update branding preferences
    setTheme({ headerColor, logoUrl });
    alert('Branding preferences updated successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6 grid grid-cols-3 w-full">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input 
                      id="name" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <Button type="submit" className="flex items-center gap-2">
                  <Save size={16} />
                  <span>Save Changes</span>
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input 
                      id="currentPassword" 
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input 
                      id="newPassword" 
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input 
                      id="confirmPassword" 
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <Button type="submit" className="flex items-center gap-2">
                  <Save size={16} />
                  <span>Change Password</span>
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="branding">
          <Card>
            <CardHeader>
              <CardTitle>Branding Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleBrandingSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="logo">Logo</Label>
                    <div className="mt-1 flex items-center space-x-4">
                      <div className="h-20 w-20 overflow-hidden rounded-md border flex items-center justify-center">
                        <img 
                          src={logoUrl} 
                          alt="Logo Preview" 
                          className="h-full w-full object-contain"
                        />
                      </div>
                      <label className="block">
                        <span className="sr-only">Choose logo file</span>
                        <input 
                          id="logo"
                          type="file" 
                          className="block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-md file:border-0
                            file:text-sm file:font-medium
                            file:bg-primary file:text-primary-foreground
                            hover:file:cursor-pointer hover:file:bg-primary/90"
                          onChange={handleLogoChange}
                          accept=".jpg,.jpeg,.png"
                        />
                      </label>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">JPEG or PNG, max 1MB</p>
                  </div>
                  
                  <div>
                    <Label htmlFor="headerColor">Header Color</Label>
                    <div className="flex items-center space-x-2">
                      <Input 
                        id="headerColor" 
                        type="color" 
                        value={headerColor}
                        onChange={(e) => setHeaderColor(e.target.value)}
                        className="w-12 h-10"
                      />
                      <span className="text-sm text-gray-500">{headerColor}</span>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Booking Display Layout</Label>
                    <div className="mt-2 flex items-center space-x-4">
                      <Button
                        type="button"
                        variant={viewMode === 'grid' ? 'default' : 'outline'}
                        size="sm"
                        className="flex items-center gap-2"
                        onClick={() => setViewMode('grid')}
                      >
                        <Grid3X3 size={16} />
                        <span>Grid</span>
                      </Button>
                      <Button
                        type="button"
                        variant={viewMode === 'list' ? 'default' : 'outline'}
                        size="sm"
                        className="flex items-center gap-2"
                        onClick={() => setViewMode('list')}
                      >
                        <LayoutList size={16} />
                        <span>List</span>
                      </Button>
                    </div>
                  </div>
                </div>
                
                <Button type="submit" className="flex items-center gap-2">
                  <Save size={16} />
                  <span>Save Preferences</span>
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PortalAccount;
