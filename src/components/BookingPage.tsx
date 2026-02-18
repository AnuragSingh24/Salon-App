
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, User, Check, ArrowLeft, ArrowRight, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';

interface BookingPageProps {
  setCurrentPage: (page: string) => void;
}

type TimeSlot = {
  _id: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  duration: number;
  available: boolean;
};

type Stylist = {
  _id: string;              // use MongoDB _id
  name: string;
  specialty?: string;
  rating?: number;
  image?: string;
};

type AvailabilityResponse = {
  available: boolean;
  reason?: string;
  stylist?: {
    _id: string;
    name: string;
    specialty?: string;
    rating?: number;
  };
};

function getToken() {
  try {
    return localStorage.getItem('token');
  } catch {
    return null;
  }
}

async function fetchStylists(): Promise<Stylist[]> {
  const token = getToken();
  if (!token) throw new Error('Not authenticated. Please login.');

  const res = await fetch('/api/stylist', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed: ${res.status} ${text}`);
  }
  return res.json();
}

export function BookingPage({ setCurrentPage }: BookingPageProps) {
  const storedBooking = sessionStorage.getItem('selectedBooking');
  const selectedBooking = storedBooking ? JSON.parse(storedBooking) : null;
  useEffect(() => {
    if (!selectedBooking) {
      setCurrentPage('home');
    }
  }, []);

  const [step, setStep] = useState(1);

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedStylist, setSelectedStylist] = useState(''); // will store stylist _id
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });


  const [stylists, setStylists] = useState<Stylist[]>([]);
  const [loadingStylists, setLoadingStylists] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkingSlot, setCheckingSlot] = useState(false);
  const [creatingBooking, setCreatingBooking] = useState(false);
  const [selectedDay, setSelectedDay] = useState("");
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);



  useEffect(() => {
    (async () => {
      setLoadingStylists(true);
      setError(null);
      try {
        const data = await fetchStylists();
        setStylists(data);
      } catch (err: any) {
        setError(err.message || 'Something went wrong while fetching stylists.');
      } finally {
        setLoadingStylists(false);
      }
    })();
  }, []);


  useEffect(() => {
    fetchTimeSlots(selectedDay);
  }, [selectedDay]);

  const fetchTimeSlots = async (day: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`/api/timeSlot/getTime?day=${day}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setTimeSlots(data.slots || []);
    } catch (err) {
      console.error("Error fetching time slots", err);
      setTimeSlots([]);
    }
  };



  const generateCalendarDays = () => {
    const today = new Date();
    const days: { date: string; day: number; weekday: string; isToday: boolean }[] = [];

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


  async function handleReviewAndContinue() {
    if (step !== 2) return setStep(step + 1);

    if (!selectedDate || !selectedTime || !selectedStylist) {
      alert('Please select date, time and stylist before continuing.');
      return;
    }

    setCheckingSlot(true);
    try {
      const token = getToken();

      // 1️⃣ CHECK AVAILABILITY
      const checkRes = await fetch('/api/bookings/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          date: selectedDate,
          timeSlot: selectedTime,
          stylistId: selectedStylist
        })
      });

      const checkData: AvailabilityResponse = await checkRes.json();

      if (!checkRes.ok || !checkData.available) {
        alert(checkData.reason || 'Selected slot is unavailable. Please choose another.');
        return;
      }

      // 2️⃣ CREATE BOOKING AFTER CHECK SUCCESS
      setCreatingBooking(true);
      const bookingRes = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          bookingType: selectedBooking.bookingType, // service | package | appointment

          serviceIds:
            selectedBooking.bookingType === 'service'
              ? [selectedBooking.serviceId]
              : [],

          packageId:
            selectedBooking.bookingType === 'package'
              ? selectedBooking.packageId
              : null,

          date: selectedDate,
          timeSlot: selectedTime,
          stylistIds: [selectedStylist],
          customerInfo,
          totalPrice:
            selectedBooking.bookingType === 'appointment'
              ? 0
              : selectedBooking.price
        })


      });

      const bookingData = await bookingRes.json();


      // 3️⃣ GOTO SUCCESS PAGE
      setStep(3);


    } catch (err) {
      alert('Error processing booking. Try again.');
    } finally {
      setCheckingSlot(false);
      setCreatingBooking(false);
    }
  }


  const renderStepContent = () => {
    switch (step) {
      // If you want Step 0 service selection, uncomment and adapt; current flow uses Step 1 = date/time
      case 1:
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
              <div>
                <Label className="text-base font-medium mb-4 block">Select Date</Label>
                <div className="grid grid-cols-7 gap-2">
                  {calendarDays.map((day) => (
                    <motion.button
                      key={day.date}
                      className={`p-3 rounded-lg text-center transition-all ${selectedDate === day.date
                        ? 'bg-primary text-primary-foreground'
                        : 'border border-border hover:border-primary hover:bg-secondary'
                        } ${day.isToday ? 'ring-2 ring-primary/20' : ''}`}
                      onClick={() => {
                        setSelectedDate(day.date);

                        const fullDay = new Date(day.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                        });

                        setSelectedDay(fullDay);
                      }}

                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="text-xs text-muted-foreground">{day.weekday}</div>
                      <div className="font-medium">{day.day}</div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {selectedDate && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Label className="text-base font-medium mb-4 block">Select Time</Label>

                  {timeSlots.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center">
                      No slots available for this day
                    </p>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {timeSlots.map((slot) => (
                        <motion.button
                          key={slot._id}
                          className={`p-3 rounded-lg text-center transition-all ${selectedTime === slot.startTime
                            ? 'bg-primary text-primary-foreground'
                            : 'border border-border hover:border-primary hover:bg-secondary'
                            }`}
                          onClick={() => setSelectedTime(slot.startTime)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {slot.startTime} – {slot.endTime}
                        </motion.button>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

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
              <h2 className="text-2xl font-semibold text-foreground">Select Stylist & Details</h2>
              <p className="text-muted-foreground">Choose your stylist and provide your information</p>
            </div>

            <div className="space-y-6">
              <div>
                <Label className="text-base font-medium mb-4 block">Choose Your Stylist</Label>

                {loadingStylists ? (
                  <div className="text-center py-6">Loading stylists...</div>
                ) : error ? (
                  <div className="text-center text-sm text-red-500">{error}</div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {stylists.map((stylist) => (
                      <motion.div
                        key={stylist._id}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedStylist === stylist._id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50 hover:bg-secondary/50'
                          }`}
                        onClick={() => setSelectedStylist(stylist._id)}
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
                              <span className="text-sm font-medium">{stylist.rating ?? '—'}</span>
                            </div>
                          </div>
                          {selectedStylist === stylist._id && (
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
                )}
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={customerInfo.firstName}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, firstName: e.target.value })}
                    className="rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={customerInfo.lastName}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, lastName: e.target.value })}
                    className="rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                    className="rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                    className="rounded-lg"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 3:
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
              transition={{ delay: 0.2, type: 'spring' }}
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
                  <span className="text-muted-foreground">
                    {selectedBooking.bookingType === 'service'
                      ? 'Service:'
                      : selectedBooking.bookingType === 'package'
                        ? 'Package:'
                        : 'Appointment:'}

                  </span>
                  <span className="font-medium">{selectedBooking.name}</span>

                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span className="font-medium">{selectedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time:</span>
                  <span className="font-medium">{selectedTime}</span>
                </div>
                {selectedBooking.bookingType !== 'appointment' && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="font-medium">{selectedBooking.duration} minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total:</span>
                      <span className="font-semibold text-primary">${selectedBooking.price}</span>
                    </div>
                  </>
                )}

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
      case 1: return selectedDate && selectedTime;
      case 2: return Boolean(selectedStylist && customerInfo.firstName && customerInfo.lastName && customerInfo.email && customerInfo.phone);
      case 3: return true;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-secondary/30 to-accent/20">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {step <= 3 && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                {[1, 2].map((stepNum) => (
                  <div
                    key={stepNum}
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${step >= stepNum
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

          <Card className="p-6 md:p-8 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            {renderStepContent()}

            {/* Navigation Buttons */}
            {step < 3 && (
              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={() => step > 1 ? setStep(step - 1) : setCurrentPage('services')}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{step > 1 ? 'Previous' : 'Back to Services'}</span>
                </Button>

                <div className="ml-auto">
                  <Button
                    onClick={
                      step === 1
                        ? () => setStep(2)
                        : step === 2
                          ? handleReviewAndContinue  // now CHECK + CREATE BOOKING
                          : undefined
                    }

                    disabled={!canProceed() || checkingSlot || creatingBooking}
                    className="bg-gradient-to-r from-primary to-accent text-primary-foreground border-0 flex items-center space-x-2"
                  >
                    <span>
                      {step === 1 ? 'Next' : step === 2 ? (checkingSlot ? 'Checking...' : 'Review & Continue') : (creatingBooking ? 'Booking...' : 'Confirm Booking')}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
