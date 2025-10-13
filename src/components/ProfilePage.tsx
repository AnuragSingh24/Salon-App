import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Calendar, Clock, Star, Edit, Settings, Gift, History, Phone, Mail, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';

interface ProfilePageProps {
  setCurrentPage: (page: string) => void;
}

export function ProfilePage({ setCurrentPage }: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@email.com',
    phone: '(555) 123-4567',
    birthday: '1992-06-15',
    address: '123 Main St, City, State 12345'
  });

  const upcomingAppointments = [
    {
      id: 1,
      service: 'Balayage Highlights',
      stylist: 'Emma Rodriguez',
      date: '2024-01-15',
      time: '2:00 PM',
      duration: 150,
      price: 180,
      status: 'confirmed'
    },
    {
      id: 2,
      service: 'Signature Facial',
      stylist: 'Maria Santos',
      date: '2024-01-22',
      time: '11:00 AM',
      duration: 90,
      price: 120,
      status: 'confirmed'
    }
  ];

  const appointmentHistory = [
    {
      id: 3,
      service: 'Precision Haircut',
      stylist: 'Emma Rodriguez',
      date: '2023-12-20',
      time: '3:30 PM',
      price: 85,
      rating: 5
    },
    {
      id: 4,
      service: 'Relaxation Massage',
      stylist: 'Maria Santos',
      date: '2023-11-28',
      time: '1:00 PM',
      price: 110,
      rating: 5
    },
    {
      id: 5,
      service: 'Color Transformation',
      stylist: 'Sarah Chen',
      date: '2023-10-15',
      time: '10:00 AM',
      price: 150,
      rating: 4
    }
  ];

  const loyaltyPoints = 850;
  const nextRewardAt = 1000;
  const totalSpent = 645;

  const handleSaveProfile = () => {
    setIsEditing(false);
    // Handle save logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-secondary/30 to-accent/20">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-light text-foreground mb-4">
              My Profile
            </h1>
            <p className="text-muted-foreground">
              Manage your appointments and personal information
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Information */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1"
            >
              <Card className="p-6 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center mb-4">
                    <User className="w-10 h-10 text-primary-foreground" />
                  </div>
                  <h2 className="text-xl font-semibold text-foreground">
                    {userInfo.firstName} {userInfo.lastName}
                  </h2>
                  <p className="text-muted-foreground">{userInfo.email}</p>
                </div>

                <Separator className="my-6" />

                {/* Loyalty Points */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">Loyalty Points</span>
                    <Badge className="bg-primary text-primary-foreground">
                      <Gift className="w-3 h-3 mr-1" />
                      {loyaltyPoints}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress to next reward</span>
                      <span className="text-foreground">{loyaltyPoints}/{nextRewardAt}</span>
                    </div>
                    <div className="w-full bg-border rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(loyaltyPoints / nextRewardAt) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {nextRewardAt - loyaltyPoints} points until next reward
                    </p>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Quick Stats */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Spent</span>
                    <span className="font-semibold text-primary">${totalSpent}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Appointments</span>
                    <span className="font-semibold text-foreground">{appointmentHistory.length + upcomingAppointments.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Average Rating</span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="font-semibold text-foreground">4.8</span>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="space-y-3">
                  <Button 
                    onClick={() => setCurrentPage('booking')}
                    className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground border-0"
                  >
                    Book New Appointment
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditing(!isEditing)}
                    className="w-full border-primary/20 hover:border-primary"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                  </Button>
                </div>
              </Card>
            </motion.div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Personal Information */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="p-6 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-foreground">Personal Information</h3>
                    {!isEditing && (
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => setIsEditing(true)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            value={userInfo.firstName}
                            onChange={(e) => setUserInfo({...userInfo, firstName: e.target.value})}
                            className="rounded-lg"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            value={userInfo.lastName}
                            onChange={(e) => setUserInfo({...userInfo, lastName: e.target.value})}
                            className="rounded-lg"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={userInfo.email}
                          onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                          className="rounded-lg"
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            value={userInfo.phone}
                            onChange={(e) => setUserInfo({...userInfo, phone: e.target.value})}
                            className="rounded-lg"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="birthday">Birthday</Label>
                          <Input
                            id="birthday"
                            type="date"
                            value={userInfo.birthday}
                            onChange={(e) => setUserInfo({...userInfo, birthday: e.target.value})}
                            className="rounded-lg"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          value={userInfo.address}
                          onChange={(e) => setUserInfo({...userInfo, address: e.target.value})}
                          className="rounded-lg"
                        />
                      </div>

                      <div className="flex gap-3">
                        <Button onClick={handleSaveProfile} className="bg-gradient-to-r from-primary to-accent text-primary-foreground border-0">
                          Save Changes
                        </Button>
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 p-3 rounded-lg bg-secondary/30">
                        <Mail className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p className="font-medium text-foreground">{userInfo.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 p-3 rounded-lg bg-secondary/30">
                        <Phone className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Phone</p>
                          <p className="font-medium text-foreground">{userInfo.phone}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 p-3 rounded-lg bg-secondary/30">
                        <MapPin className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Address</p>
                          <p className="font-medium text-foreground">{userInfo.address}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              </motion.div>

              {/* Upcoming Appointments */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="p-6 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                  <h3 className="text-lg font-semibold text-foreground mb-6">Upcoming Appointments</h3>
                  
                  {upcomingAppointments.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingAppointments.map((appointment) => (
                        <div key={appointment.id} className="p-4 rounded-lg border border-primary/20 bg-gradient-to-r from-secondary/50 to-accent/30">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-semibold text-foreground">{appointment.service}</h4>
                              <p className="text-sm text-muted-foreground">with {appointment.stylist}</p>
                            </div>
                            <Badge className="bg-green-100 text-green-800 border-green-200">
                              {appointment.status}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4 text-primary" />
                                <span>{appointment.date}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="w-4 h-4 text-primary" />
                                <span>{appointment.time}</span>
                              </div>
                            </div>
                            <span className="font-semibold text-primary">${appointment.price}</span>
                          </div>

                          <div className="flex gap-2 mt-4">
                            <Button size="sm" variant="outline" className="border-primary/20 hover:border-primary">
                              Reschedule
                            </Button>
                            <Button size="sm" variant="outline" className="border-destructive/20 hover:border-destructive text-destructive">
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground mb-4">No upcoming appointments</p>
                      <Button onClick={() => setCurrentPage('booking')} className="bg-gradient-to-r from-primary to-accent text-primary-foreground border-0">
                        Book Your First Appointment
                      </Button>
                    </div>
                  )}
                </Card>
              </motion.div>

              {/* Appointment History */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card className="p-6 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                  <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center">
                    <History className="w-5 h-5 mr-2" />
                    Appointment History
                  </h3>
                  
                  <div className="space-y-3">
                    {appointmentHistory.map((appointment) => (
                      <div key={appointment.id} className="p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="font-medium text-foreground">{appointment.service}</h4>
                              <div className="flex items-center space-x-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < appointment.rating
                                        ? 'text-yellow-400 fill-current'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                              <div className="flex items-center space-x-4">
                                <span>with {appointment.stylist}</span>
                                <span>{appointment.date} at {appointment.time}</span>
                              </div>
                              <span className="font-semibold text-primary">${appointment.price}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}