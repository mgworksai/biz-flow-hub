
import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Image, Hash, CheckCircle, XCircle } from 'lucide-react';
import PostGenerator from '../components/marketing/PostGenerator';
import PostScheduler from '../components/marketing/PostScheduler';
import ApprovalWorkflow from '../components/marketing/ApprovalWorkflow';

const Marketing: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="dashboard-container">
        <h1 className="text-2xl font-bold mb-6">Marketing</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Post Generator Card */}
          <Card>
            <CardHeader>
              <CardTitle>Post Generator</CardTitle>
              <CardDescription>Create social media content for your business</CardDescription>
            </CardHeader>
            <CardContent>
              <PostGenerator />
            </CardContent>
          </Card>
          
          {/* Post Scheduler Card */}
          <Card>
            <CardHeader>
              <CardTitle>Scheduler</CardTitle>
              <CardDescription>Schedule and manage your social media posts</CardDescription>
            </CardHeader>
            <CardContent>
              <PostScheduler />
            </CardContent>
          </Card>
          
          {/* Approval Workflow Card */}
          <Card>
            <CardHeader>
              <CardTitle>Approvals</CardTitle>
              <CardDescription>Review and approve content before publishing</CardDescription>
            </CardHeader>
            <CardContent>
              <ApprovalWorkflow />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Marketing;
