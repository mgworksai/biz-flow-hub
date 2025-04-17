
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, XCircle, ExternalLink } from 'lucide-react';

interface PendingPost {
  id: string;
  platform: string;
  content: string;
  createdBy: string;
  createdAt: string;
}

const mockPendingPosts: PendingPost[] = [
  {
    id: 'post-001',
    platform: 'Twitter',
    content: '✂️ Ready for a fresh look? Enjoy 20% OFF all haircuts this week only! Book your appointment through our website or app today. #HairSalon #SpecialDiscount #NewLook',
    createdBy: 'AI Generator',
    createdAt: '2023-04-17T14:30:00'
  },
  {
    id: 'post-002',
    platform: 'Instagram',
    content: 'Transform your look with our expert stylists! 💇‍♀️✨\n\nFor a limited time, enjoy 20% OFF all haircut services. Our team uses premium products and the latest techniques to give you that perfect style.\n\nTap the link in bio to book your appointment!\n\n#HairSalon #BeautyServices #SpecialOffer #Discount',
    createdBy: 'Marketing Manager',
    createdAt: '2023-04-17T09:15:00'
  }
];

const ApprovalWorkflow: React.FC = () => {
  const [pendingPosts, setPendingPosts] = useState<PendingPost[]>(mockPendingPosts);

  const handleApprove = (postId: string) => {
    console.log(`Approving post ${postId}`);
    // In a real app, this would make an API call to approve the post
    setPendingPosts(pendingPosts.filter(post => post.id !== postId));
  };

  const handleReject = (postId: string) => {
    console.log(`Rejecting post ${postId}`);
    // In a real app, this would make an API call to reject the post
    setPendingPosts(pendingPosts.filter(post => post.id !== postId));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="space-y-4">
      {pendingPosts.length === 0 ? (
        <div className="text-center py-6 text-gray-500">
          No posts pending approval
        </div>
      ) : (
        <div className="space-y-4">
          {pendingPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-4 border-b">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{post.platform}</span>
                    <span className="text-sm text-gray-500">
                      {formatDate(post.createdAt)}
                    </span>
                  </div>
                  <div className="text-sm whitespace-pre-wrap">{post.content}</div>
                  <div className="mt-2 text-xs text-gray-500">
                    Created by: {post.createdBy}
                  </div>
                </div>
                <div className="flex">
                  <Button 
                    variant="ghost" 
                    className="flex-1 rounded-none text-green-600 hover:text-green-700 hover:bg-green-50"
                    onClick={() => handleApprove(post.id)}
                  >
                    <CheckCircle size={16} className="mr-2" />
                    Approve
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="flex-1 rounded-none text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleReject(post.id)}
                  >
                    <XCircle size={16} className="mr-2" />
                    Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      <div className="pt-2">
        <Button variant="outline" className="w-full flex items-center gap-2" asChild>
          <a href="/analytics" target="_blank" rel="noopener noreferrer">
            <ExternalLink size={16} />
            <span>View Post Analytics</span>
          </a>
        </Button>
      </div>
    </div>
  );
};

export default ApprovalWorkflow;
