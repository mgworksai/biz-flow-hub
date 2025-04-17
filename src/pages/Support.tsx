
import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import TicketsTab from '../components/support/TicketsTab';
import ChatTab from '../components/support/ChatTab';

const Support: React.FC = () => {
  const [activeTab, setActiveTab] = useState("tickets");

  return (
    <DashboardLayout>
      <div className="dashboard-container">
        <h1 className="text-2xl font-bold mb-6">Support</h1>
        
        <Tabs defaultValue="tickets" onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="tickets">Tickets</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tickets">
            <TicketsTab />
          </TabsContent>
          
          <TabsContent value="chat">
            <ChatTab />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Support;
