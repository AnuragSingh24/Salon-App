import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, User, Check, ArrowLeft, ArrowRight, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';

interface BookingPageProps {
  setCurrentPage: (page: string) => void;
}

export function BookingPage({ setCurrentPage }: BookingPageProps) {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedStylist, setSelectedStylist] = useState('');
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  const services = [
    { id: 'haircut', name: 'Precision Haircut', price: 85, duration: 60 },
    { id: 'color', name: 'Color Transformation', price: 150, duration: 120 },
    { id: 'highlights', name: 'Balayage Highlights', price: 180, duration: 150 },
    { id: 'facial', name: 'Signature Facial', price: 120, duration: 90 },
    { id: 'massage', name: 'Relaxation Massage', price: 110, duration: 60 },
    { id: 'manicure', name: 'Luxury Manicure', price: 65, duration: 45 },
  ];

  const stylists = [
    { id: 'emma', name: 'Emma Rodriguez', specialty: 'Hair Styling', rating: 4.9, image: '/api/placeholder/100/100' },
    { id: 'sarah', name: 'Sarah Chen', specialty: 'Color Specialist', rating: 4.8, image: '/api/placeholder/100/100' },
    { id: 'maria', name: 'Maria Santos', specialty: 'Spa & Wellness', rating: 5.0, image: '/api/placeholder/100/100' },
    { id: 'alex', name: 'Alex Thompson', specialty: 'Makeup Artist', rating: 4.9, image: '/api/placeholder/100/100' },
  ];

  const timeSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
    '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM'
  ];

  const generateCalendarDays = () => {
    const today = new Date();
    const days = [];
    
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push({
        date: date.toISOString().split('T')[0],
        day: date.getDate(),
        weekday: date.toLocaleDateString('en-US', { weekday: 'short' }),
        isToday: i === 0
      });
    }
    return days;
  };

  const calendarDays = generateCalendarDays();
  const selectedServiceObj = services.find(s => s.id === selectedService);

  const handleBookingSubmit = () => {
    // Handle booking logic here
    setStep(4); // Success step
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-2xl font-semibold text-foreground">Select Service</h2>
              <p className="text-muted-foreground">Choose the service you'd like to book</p>
            </div>

            <div className="grid gap-4">
              {services.map((service) => (
                <motion.div
                  key={service.id}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedService === service.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50 hover:bg-secondary/50'
                  }`}
                  onClick={() => setSelectedService(service.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <h3 className="font-medium text-foreground">{service.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{service.duration}min</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-primary font-semibold">${service.price}</span>
                        </div>
                      </div>
                    </div>
                    {selectedService === service.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                      >
                        <Check className="w-4 h-4 text-primary-foreground" />
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-2xl font-semibold text-foreground">Select Date & Time</h2>
              <p className="text-muted-foreground">Choose your preferred appointment time</p>
            </div>

            <div className="space-y-6">
              {/* Calendar */}
              <div>
                <Label className="text-base font-medium mb-4 block">Select Date</Label>
                <div className="grid grid-cols-7 gap-2">
                  {calendarDays.map((day) => (
                    <motion.button
                      key={day.date}
                      className={`p-3 rounded-lg text-center transition-all ${
                        selectedDate === day.date
                          ? 'bg-primary text-primary-foreground'
                          : 'border border-border hover:border-primary hover:bg-secondary'
                      } ${day.isToday ? 'ring-2 ring-primary/20' : ''}`}
                      onClick={() => setSelectedDate(day.date)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="text-xs text-muted-foreground">{day.weekday}</div>
                      <div className="font-medium">{day.day}</div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Time Slots */}
              {selectedDate && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Label className="text-base font-medium mb-4 block">Select Time</Label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {timeSlots.map((time) => (
                      <motion.button
                        key={time}
                        className={`p-3 rounded-lg text-center transition-all ${
                          selectedTime === time
                            ? 'bg-primary text-primary-foreground'
                            : 'border border-border hover:border-primary hover:bg-secondary'
                        }`}
                        onClick={() => setSelectedTime(time)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {time}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-2xl font-semibold text-foreground">Select Stylist & Details</h2>
              <p className="text-muted-foreground">Choose your stylist and provide your information</p>
            </div>

            <div className="space-y-6">
              {/* Stylist Selection */}
              <div>
                <Label className="text-base font-medium mb-4 block">Choose Your Stylist</Label>
                <div className="grid sm:grid-cols-2 gap-4">
                  {stylists.map((stylist) => (
                    <motion.div
                      key={stylist.id}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedStylist === stylist.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50 hover:bg-secondary/50'
                      }`}
                      onClick={() => setSelectedStylist(stylist.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                          <User className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-foreground">{stylist.name}</h3>
                          <p className="text-sm text-muted-foreground">{stylist.specialty}</p>
                          <div className="flex items-center space-x-1 mt-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium">{stylist.rating}</span>
                          </div>
                        </div>
                        {selectedStylist === stylist.id && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                          >
                            <Check className="w-4 h-4 text-primary-foreground" />
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Customer Information */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={customerInfo.firstName}
                    onChange={(e) => setCustomerInfo({...customerInfo, firstName: e.target.value})}
                    className="rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={customerInfo.lastName}
                    onChange={(e) => setCustomerInfo({...customerInfo, lastName: e.target.value})}
                    className="rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                    className="rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                    className="rounded-lg"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div 
            className="text-center space-y-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <motion.div
              className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <Check className="w-10 h-10 text-green-600" />
            </motion.div>
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">Booking Confirmed!</h2>
              <p className="text-muted-foreground">
                Your appointment has been successfully booked. We've sent a confirmation email with all the details.
              </p>
            </div>
            
            <Card className="p-6 text-left bg-gradient-to-r from-secondary to-accent border-0">
              <h3 className="font-semibold text-foreground mb-4">Appointment Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service:</span>
                  <span className="font-medium">{selectedServiceObj?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span className="font-medium">{selectedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time:</span>
                  <span className="font-medium">{selectedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-medium">{selectedServiceObj?.duration} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total:</span>
                  <span className="font-semibold text-primary">${selectedServiceObj?.price}</span>
                </div>
              </div>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => setCurrentPage('home')} variant="outline">
                Back to Home
              </Button>
              <Button onClick={() => setCurrentPage('profile')} className="bg-gradient-to-r from-primary to-accent text-primary-foreground border-0">
                View My Bookings
              </Button>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1: return selectedService;
      case 2: return selectedDate && selectedTime;
      case 3: return selectedStylist && customerInfo.firstName && customerInfo.lastName && customerInfo.email && customerInfo.phone;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-secondary/30 to-accent/20">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Progress Bar */}
          {step < 4 && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                {[1, 2, 3].map((stepNum) => (
                  <div
                    key={stepNum}
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                      step >= stepNum
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-background text-muted-foreground'
                    }`}
                  >
                    {step > stepNum ? <Check className="w-5 h-5" /> : stepNum}
                  </div>
                ))}
              </div>
              <div className="w-full bg-border rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-primary to-accent h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${((step - 1) / 2) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          )}

          {/* Step Content */}
          <Card className="p-6 md:p-8 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            {renderStepContent()}

            {/* Navigation Buttons */}
            {step < 4 && (
              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={() => step > 1 ? setStep(step - 1) : setCurrentPage('services')}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{step > 1 ? 'Previous' : 'Back to Services'}</span>
                </Button>
                
                <Button
                  onClick={() => step < 3 ? setStep(step + 1) : handleBookingSubmit()}
                  disabled={!canProceed()}
                  className="bg-gradient-to-r from-primary to-accent text-primary-foreground border-0 flex items-center space-x-2"
                >
                  <span>{step < 3 ? 'Next' : 'Confirm Booking'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}