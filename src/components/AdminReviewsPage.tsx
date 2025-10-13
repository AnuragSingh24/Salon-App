import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Star, Reply, Trash2, Eye, MessageSquare, Calendar, User, Send, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Avatar } from './ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface Review {
  id: string;
  customerName: string;
  customerAvatar: string;
  rating: number;
  comment: string;
  service: string;
  date: string;
  status: 'pending' | 'approved' | 'replied';
  reply?: string;
  replyDate?: string;
}

export function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: '1',
      customerName: 'Sarah Johnson',
      customerAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b95c?w=150',
      rating: 5,
      comment: 'Absolutely amazing experience! The staff was professional and the result was beyond my expectations.',
      service: 'Bridal Hair Styling',
      date: '2024-01-15',
      status: 'approved'
    },
    {
      id: '2',
      customerName: 'Emily Davis',
      customerAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      rating: 4,
      comment: 'Great service and lovely atmosphere. Would definitely come back!',
      service: 'Facial Treatment',
      date: '2024-01-14',
      status: 'pending'
    },
    {
      id: '3',
      customerName: 'Maria Rodriguez',
      customerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      rating: 5,
      comment: 'The team at MK Salon is incredible. They really listen to what you want and deliver perfection.',
      service: 'Color Treatment',
      date: '2024-01-13',
      status: 'replied',
      reply: 'Thank you so much for your wonderful review, Maria! We\'re thrilled that you loved your color treatment.',
      replyDate: '2024-01-14'
    }
  ]);

  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterRating, setFilterRating] = useState<string>('all');

  const handleReply = (reviewId: string) => {
    setReviews(reviews.map(review => 
      review.id === reviewId 
        ? { 
            ...review, 
            status: 'replied', 
            reply: replyText,
            replyDate: new Date().toISOString().split('T')[0]
          }
        : review
    ));
    setReplyingTo(null);
    setReplyText('');
  };

  const handleDeleteReview = (reviewId: string) => {
    setReviews(reviews.filter(review => review.id !== reviewId));
  };

  const handleStatusChange = (reviewId: string, newStatus: 'pending' | 'approved') => {
    setReviews(reviews.map(review => 
      review.id === reviewId ? { ...review, status: newStatus } : review
    ));
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'replied': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredReviews = reviews.filter(review => {
    if (filterStatus !== 'all' && review.status !== filterStatus) return false;
    if (filterRating !== 'all' && review.rating.toString() !== filterRating) return false;
    return true;
  });

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  const totalReviews = reviews.length;
  const pendingReviews = reviews.filter(r => r.status === 'pending').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-secondary/30 to-accent/20 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-light text-foreground mb-2">
            Reviews Management
          </h1>
          <p className="text-muted-foreground">
            Manage customer reviews and feedback
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 text-center">
              <div className="flex items-center justify-center space-x-1 mb-2">
                {renderStars(Math.round(averageRating))}
              </div>
              <p className="text-2xl font-semibold text-foreground">{averageRating.toFixed(1)}</p>
              <p className="text-sm text-muted-foreground">Average Rating</p>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 text-center">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-semibold text-foreground">{totalReviews}</p>
              <p className="text-sm text-muted-foreground">Total Reviews</p>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 text-center">
              <Eye className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
              <p className="text-2xl font-semibold text-foreground">{pendingReviews}</p>
              <p className="text-sm text-muted-foreground">Pending Review</p>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6 text-center">
              <Reply className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <p className="text-2xl font-semibold text-foreground">
                {reviews.filter(r => r.status === 'replied').length}
              </p>
              <p className="text-sm text-muted-foreground">Replied</p>
            </Card>
          </motion.div>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-6"
        >
          <Card className="p-6">
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Filter by Status</label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="replied">Replied</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Filter by Rating</label>
                <Select value={filterRating} onValueChange={setFilterRating}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ratings</SelectItem>
                    <SelectItem value="5">5 Stars</SelectItem>
                    <SelectItem value="4">4 Stars</SelectItem>
                    <SelectItem value="3">3 Stars</SelectItem>
                    <SelectItem value="2">2 Stars</SelectItem>
                    <SelectItem value="1">1 Star</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Reviews List */}
        <div className="space-y-6">
          {filteredReviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6">
                <div className="flex items-start space-x-4">
                  <Avatar className="w-12 h-12">
                    <img 
                      src={review.customerAvatar} 
                      alt={review.customerName}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-foreground">{review.customerName}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="flex items-center space-x-1">
                            {renderStars(review.rating)}
                          </div>
                          <Badge className={getStatusColor(review.status)}>
                            {review.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <p className="text-sm text-muted-foreground mb-1">Service: {review.service}</p>
                      <p className="text-foreground">{review.comment}</p>
                    </div>

                    {review.reply && (
                      <div className="bg-blue-50 p-4 rounded-lg mb-3">
                        <div className="flex items-center space-x-2 mb-2">
                          <Reply className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-600">Your Reply</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(review.replyDate!).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-blue-900">{review.reply}</p>
                      </div>
                    )}

                    {replyingTo === review.id ? (
                      <div className="space-y-3">
                        <Textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Write your reply..."
                          rows={3}
                        />
                        <div className="flex space-x-2">
                          <Button 
                            size="sm"
                            onClick={() => handleReply(review.id)}
                            className="bg-gradient-to-r from-primary to-accent text-primary-foreground"
                          >
                            <Send className="w-4 h-4 mr-2" />
                            Send Reply
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setReplyingTo(null);
                              setReplyText('');
                            }}
                          >
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        {!review.reply && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setReplyingTo(review.id)}
                          >
                            <Reply className="w-4 h-4 mr-2" />
                            Reply
                          </Button>
                        )}
                        {review.status === 'pending' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleStatusChange(review.id, 'approved')}
                            className="text-green-600 hover:text-green-600"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Approve
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDeleteReview(review.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredReviews.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <MessageSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Reviews Found</h3>
            <p className="text-muted-foreground">
              No reviews match your current filter criteria.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}