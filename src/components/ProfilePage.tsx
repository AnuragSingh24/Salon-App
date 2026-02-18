import React, { useState, useEffect } from 'react';

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


type UserInfo = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthday?: string;  // ISO string like '1992-06-15'
  address?: string;
};


type Appointment = {
  id: string | number;
  service: string;
  stylist: string;
  date: string;   // 'YYYY-MM-DD'
  time: string;   // e.g., '2:00 PM'
  duration: number;
  price: number;
  status: 'confirmed' | 'pending' | 'cancelled';
};


export function ProfilePage({ setCurrentPage }: ProfilePageProps) {

  const [userInfo, setUserInfo] = useState<UserInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthday: '',
    address: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [appointmentHistory, setAppointmentHistory] = useState<any[]>([]);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [submittingReview, setSubmittingReview] = useState<string | null>(null);


  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Not authenticated');
          setLoading(false);
          return;
        }

        const res = await fetch('/api/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load profile');

        // Map backend fields (firstname, lastname, email, phone, birthdate, address)
        const u = data.user;
        setUserInfo({
          firstName: u.firstname || '',
          lastName: u.lastname || '',
          email: u.email || '',
          phone: u.phone || '',
          birthday: u.birthdate ? new Date(u.birthdate).toISOString().slice(0, 10) : '',
          address: u.address || '',
        });
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Not authenticated');
        return;
      }

      const payload = {
        firstname: userInfo.firstName,
        lastname: userInfo.lastName,
        phone: userInfo.phone,
        birthdate: userInfo.birthday, // 'YYYY-MM-DD' -> backend converts to Date
        address: userInfo.address,
      };

      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update profile');

      // Reflect updated data back into state
      const u = data.user;
      setUserInfo({
        firstName: u.firstname || '',
        lastName: u.lastname || '',
        email: u.email || '',
        phone: u.phone || '',
        birthday: u.birthdate ? new Date(u.birthdate).toISOString().slice(0, 10) : '',
        address: u.address || '',
      });

      setIsEditing(false);
      alert('Profile updated');
    } catch (err: any) {
      alert(err.message);
    }
  };



  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([
    // (Optional) initial static entries while loading, can be empty
    // Your original static entries can stay here as fallback if you prefer.
  ]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    (async () => {
      try {
        const res = await fetch('/api/profile/upcoming', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const contentType = res.headers.get('content-type') || '';
        let data: any;

        if (contentType.includes('application/json')) {
          data = await res.json();
        } else {
          const text = await res.text();
          try {
            data = JSON.parse(text);
          } catch {
            data = { error: text };
          }
        }

        if (!res.ok) {
          throw new Error(data?.error || `Failed (${res.status})`);
        }

        const mapped: Appointment[] = (data.bookings || []).map((b: any) => ({
          id: b._id,

          bookingType: b.bookingType, // ✅ CRITICAL

          service:
            b.bookingType === 'service'
              ? b.serviceIds?.[0]?.name || 'Service'
              : null,

          packageName:
            b.bookingType === 'package'
              ? b.packageId?.name || 'Package'
              : null,

          stylist: b.stylistIds?.[0]?.name || 'Stylist',

          date: b.date ? new Date(b.date).toISOString().slice(0, 10) : '',
          time: b.timeSlot || '',
          price: b.totalPrice ?? 0,
          status: b.status
        }));


        setUpcomingAppointments(mapped);
      } catch (err) {
        console.error('Fetch upcoming bookings error:', err);
      }
    })();
  }, []);



  const handleCancelBooking = async (bookingId: string | number) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Not authenticated');
      return;
    }

    if (!confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    try {
      const res = await fetch(`/api/profile/cancel/${bookingId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to cancel booking');

      // ✅ Remove from UI after successful delete
      setUpcomingAppointments(prev =>
        prev.filter(app => app.id !== bookingId)
      );
    } catch (err: any) {
      alert(err.message);
    }
  };

  const getBookingTag = (bookingType: string) => {
    switch (bookingType) {
      case 'service':
        return { label: 'Service Booking', color: 'bg-blue-100 text-blue-700' };
      case 'package':
        return { label: 'Package Booking', color: 'bg-purple-100 text-purple-700' };
      case 'appointment':
        return { label: 'General Appointment', color: 'bg-green-100 text-green-700' };
      default:
        return { label: 'Unknown', color: 'bg-gray-100 text-gray-700' };
    }
  };


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    (async () => {
      try {
        const res = await fetch('/api/profile/history', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch history');

        // ⚠️ Backend returns { bookings: formatted }
        const mapped = (data.bookings || []).map((b: any) => ({
          id: b.id,
          bookingType: b.bookingType, // ✅ important
          service: b.title,           // ✅ unified title from backend
          stylist: b.stylistName,
          date: b.date ? new Date(b.date).toISOString().slice(0, 10) : '',
          time: b.time,
          price: b.price ?? 0,
          rating: b.review?.rating ?? 0,
        }));

        setAppointmentHistory(mapped);

      } catch (err) {
        console.error('Fetch history error:', err);
      }
    })();
  }, []);


  const handleSubmitReview = async (bookingId: string, rating: number) => {
    const token = localStorage.getItem('token');
    console.log(token);
    if (!token) return alert('Not authenticated');

    try {
      setSubmittingReview(bookingId);

      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bookingId, rating }),
      });

      const data = await res.json();


      if (!res.ok) throw new Error(data.error || 'Failed to submit review');

      // ✅ Update UI instantly
      setAppointmentHistory(prev =>
        prev.map(app =>
          app.id === bookingId
            ? { ...app, rating }
            : app
        )
      );

    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmittingReview(null);
    }
  };

  console.log(appointmentHistory);

  const ratedAppointments = appointmentHistory.filter(a => a.rating > 0);

  const averageRating =
    ratedAppointments.length > 0
      ? (
        ratedAppointments.reduce((sum, item) => sum + item.rating, 0) /
        ratedAppointments.length
      ).toFixed(1)
      : "0.0";


  const loyaltyPoints = 850;
  const nextRewardAt = 1000;
  const totalSpent = 645;

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
                    <span className="font-semibold text-primary">₹{totalSpent}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Appointments</span>
                    <span className="font-semibold text-foreground">{appointmentHistory.length + upcomingAppointments.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Average Rating</span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="font-semibold text-foreground">
                        {averageRating}
                      </span>

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
                            onChange={(e) => setUserInfo({ ...userInfo, firstName: e.target.value })}
                            className="rounded-lg"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            value={userInfo.lastName}
                            onChange={(e) => setUserInfo({ ...userInfo, lastName: e.target.value })}
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
                          onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                          className="rounded-lg"
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            value={userInfo.phone}
                            onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                            className="rounded-lg"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="birthday">Birthday</Label>
                          <Input
                            id="birthday"
                            type="date"
                            value={userInfo.birthday}
                            onChange={(e) => setUserInfo({ ...userInfo, birthday: e.target.value })}
                            className="rounded-lg"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          value={userInfo.address}
                          onChange={(e) => setUserInfo({ ...userInfo, address: e.target.value })}
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
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium text-foreground">
                                  {appointment.bookingType === 'service'
                                    ? appointment.service
                                    : appointment.bookingType === 'package'
                                      ? appointment.packageName
                                      : 'General Appointment'}
                                </h4>


                                {/* ✅ SERVICE / PACKAGE BADGE */}
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${appointment.bookingType === 'package'
                                    ? 'border-purple-300 text-purple-700'
                                    : appointment.bookingType === 'service'
                                      ? 'border-blue-300 text-blue-700'
                                      : 'border-green-300 text-green-700'
                                    }`}
                                >
                                  {appointment.bookingType === 'package'
                                    ? 'Package'
                                    : appointment.bookingType === 'service'
                                      ? 'Service'
                                      : 'Appointment'}
                                </Badge>

                              </div>

                              <p className="text-sm text-muted-foreground">
                                with {appointment.stylist}
                              </p>
                            </div>

                            {/* STATUS BADGE */}
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
                            <span className="font-semibold text-primary">
                              {appointment.price > 0 ? `₹${appointment.price}` : 'Free'}
                            </span>

                          </div>

                          <div className="flex gap-2 mt-4">
                            <Button size="sm" variant="outline" className="border-primary/20 hover:border-primary">
                              Reschedule
                            </Button>
                            <Button size="sm" variant="outline" className="border-destructive/20 hover:border-destructive text-destructive"
                              onClick={() => handleCancelBooking(appointment.id)}>
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
                                {[1, 2, 3, 4, 5].map((star) => {
                                  const isRated = !!appointment.rating;
                                  const activeValue = isRated
                                    ? appointment.rating
                                    : hoveredRating;

                                  return (
                                    <Star
                                      key={star}
                                      onMouseEnter={() => {
                                        if (!isRated) setHoveredRating(star);
                                      }}
                                      onMouseLeave={() => {
                                        if (!isRated) setHoveredRating(null);
                                      }}
                                      onClick={() => {
                                        if (!isRated) {
                                          handleSubmitReview(appointment.id, star);
                                        }
                                      }}
                                      className={`w-5 h-5 transition-all duration-200
               ${star <= (activeValue || 0)
                                          ? 'text-yellow-400 fill-current'
                                          : 'text-gray-300'
                                        }
                 ${isRated ? 'cursor-default' : 'cursor-pointer hover:scale-110'}
                                          `}
                                    />
                                  );
                                })}
                              </div>


                            </div>

                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                              <div className="flex items-center space-x-4">
                                <span>with {appointment.stylist}</span>
                                <span>{appointment.date} at {appointment.time}</span>
                              </div>
                              <span className="font-semibold text-primary">₹{appointment.price}</span>
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