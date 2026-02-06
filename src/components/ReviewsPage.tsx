import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Star, Heart, Quote, ThumbsUp, Filter, Calendar, User, MessageCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar } from './ui/avatar';
import { Progress } from './ui/progress';
import { ImageWithFallback } from './figma/ImageWithFallback';

import { ReviewModal } from './ReviewModal';
import { BookingsList } from './BookingList';

export interface Booking {
  id: string;
  serviceName: string;
  stylistName: string;
  date: string;
  time: string;
  hasReview: boolean;
  price: string;
}

interface ReviewsPageProps {
  setCurrentPage: (page: string) => void;
}

interface Review {
  _id: string;
  userId: {
    firstname: string;
    lastname: string;
  };
  serviceId?: {
    name: string;
  };
  stylistId?: {
    name: string;
  };
  rating: number;
  comment?: string;
  createdAt: string;
  likes?: number;
}




export function ReviewsPage({ setCurrentPage }: ReviewsPageProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
const [reviewsLoading, setReviewsLoading] = useState(true);
  const [selectedRating, setSelectedRating] = useState("all");
  const [selectedService, setSelectedService] = useState("all");

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBookingsModalOpen, setIsBookingsModalOpen] = useState(false);

  // ✅ Fetch bookings from backend
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          "api/bookings/pending-reviews",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch bookings");
        }

        const data = await res.json();

        if (Array.isArray(data)) {
          setBookings(data);
        } else if (Array.isArray(data.bookings)) {
          setBookings(data.bookings);
        } else {
          setBookings([]);
        }


      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.3]);

  const [ratingStats, setRatingStats] = useState({
    average: 0,
    total: 0,
    breakdown: {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0
    }
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/reviews/stats");
        if (!res.ok) throw new Error("Failed to fetch stats");

        const data = await res.json();

        setRatingStats({
          average: data.averageRating || 0,
          total: data.totalReviews || 0,
          breakdown: data.breakdown || {
            5: 0,
            4: 0,
            3: 0,
            2: 0,
            1: 0
          }
        });

      } catch (err) {
        console.error("Error fetching rating stats:", err);
      }
    };

    fetchStats();
  }, []);



  const services = [
    { id: 'all', label: 'All Services' },
    { id: 'haircut', label: 'Hair Cuts' },
    { id: 'color', label: 'Color Services' },
    { id: 'spa', label: 'Spa Treatments' },
    { id: 'bridal', label: 'Bridal Services' }
  ];

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch("/api/reviews/all");

        if (!res.ok) throw new Error("Failed to fetch reviews");

        const data = await res.json();
        setReviews(data);

      } catch (err) {
        console.error("Error fetching reviews:", err);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, []);


  const getStarColor = (rating: number, starIndex: number) => {
    return starIndex < rating ? 'text-yellow-400 fill-current' : 'text-gray-300';
  };

  const handleSelectBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  };

  const handleReviewSubmit = () => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === selectedBooking?.id
          ? { ...b, hasReview: true }
          : b
      )
    );

    setSelectedBooking(null);
    setIsModalOpen(false);
  };



  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-white via-secondary/30 to-accent/20">
      {/* Hero Section */}
      <motion.section
        className="relative min-h-screen flex items-center justify-center bg-gradient-to-r from-primary/5 to-accent/10 overflow-hidden"
        style={{ y: heroY, opacity: heroOpacity }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5" />

        <div className="container mx-auto px-4 z-10">
          <motion.div
            className="text-center space-y-8 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span className="text-sm font-medium text-foreground">{ratingStats.average} • {ratingStats.total} Reviews</span>
            </motion.div>

            <motion.h1
              className="text-4xl md:text-6xl lg:text-7xl font-light text-foreground leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Stories of
              <span className="block text-primary italic">Transformation</span>
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              Real experiences from real people. Discover why our clients trust us with their beauty journey
              and become part of our growing family of satisfied customers.
            </motion.p>

            <motion.div
              className="flex items-center justify-center space-x-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <div className="text-center">
                <div className="text-3xl font-semibold text-primary">{ratingStats.average}</div>
                <div className="flex justify-center space-x-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <div className="text-sm text-muted-foreground">Average Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-semibold text-primary">{ratingStats.total}</div>
                <div className="text-sm text-muted-foreground">Total Reviews</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-semibold text-primary">{ratingStats.breakdown[5]}%</div>
                <div className="text-sm text-muted-foreground">5-Star Reviews</div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Quote Icons */}
        <motion.div
          className="absolute top-20 right-10 w-16 h-16 rounded-full bg-primary/10 backdrop-blur-sm flex items-center justify-center"
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Quote className="w-8 h-8 text-primary" />
        </motion.div>
        <motion.div
          className="absolute bottom-20 left-10 w-12 h-12 rounded-full bg-accent/20 backdrop-blur-sm flex items-center justify-center"
          animate={{ y: [0, 15, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <Heart className="w-6 h-6 text-primary" />
        </motion.div>
      </motion.section>

      {/* Rating Overview */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Card className="p-8 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-semibold text-foreground mb-4">
                    What Our Clients Say
                  </h3>
                  <div className="flex items-center justify-center md:justify-start space-x-2 mb-4">
                    <div className="text-4xl font-bold text-primary">{ratingStats.average}</div>
                    <div>
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <div className="text-sm text-muted-foreground">Based on {ratingStats.total} reviews</div>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    Join thousands of satisfied clients who have experienced our exceptional service.
                  </p>
                </div>

                <div className="space-y-3">
                  {Object.entries(ratingStats.breakdown).reverse().map(([rating, percentage]) => (
                    <div key={rating} className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1 w-16">
                        <span className="text-sm">{rating}</span>
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      </div>
                      <Progress value={percentage} className="flex-1 h-2" />
                      <span className="text-sm text-muted-foreground w-12">{percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center space-y-6 mb-12"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-5xl font-light text-foreground">
              Client Experiences
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Every review tells a story of trust, artistry, and the personal connections we build with each client.
            </p>
          </motion.div>

          {/* Filter Options */}
          <motion.div
            className="flex flex-wrap justify-center gap-3 mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            {services.map((service) => (
              <Button
                key={service.id}
                variant={selectedService === service.id ? "default" : "outline"}
                onClick={() => setSelectedService(service.id)}
                className={`rounded-full px-6 py-2 transition-all duration-300 ${selectedService === service.id
                  ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground border-0'
                  : 'border-primary/20 hover:border-primary hover:bg-primary/5'
                  }`}
              >
                {service.label}
              </Button>
            ))}
          </motion.div>

          {/* Reviews Grid */}
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            layout
          >
            {reviews.map((review, index) => (
              <motion.div
                key={review._id}
                layout
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group"
              >
                <Card className="p-6 h-full border-0 shadow-lg group-hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm">

                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                        <User className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {review.userId?.firstname} {review.userId?.lastname}
                        </h3>

                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < review.rating
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                                }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Service Info */}
                  <div className="mb-4 p-3 rounded-lg bg-secondary/30">
                    <div className="text-sm text-muted-foreground">Service</div>
                    <div className="font-medium text-foreground">
                      {review.serviceId?.name || "Service"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      with {review.stylistId?.name || "Stylist"}
                    </div>
                  </div>

                  {/* Review Text */}
                  <div className="mb-4">
                    <Quote className="w-6 h-6 text-primary/30 mb-2" />
                    <p className="text-muted-foreground leading-relaxed text-sm">
                      {review.comment || "No comment provided."}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t border-border">
                    <div>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center space-x-1">
                      <ThumbsUp className="w-4 h-4" />
                      <span>{review.likes || 0}</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}

          </motion.div>

          {/* Load More */}
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Button
              variant="outline"
              className="px-8 py-4 border-primary/20 hover:border-primary hover:bg-primary/5"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              View More Reviews
            </Button>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-secondary to-accent">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center space-y-6 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-light text-foreground">
              Join Our Family of Happy Clients
            </h2>
            <p className="text-muted-foreground">
              Experience the same exceptional service that has earned us thousands of five-star reviews.
              Your transformation story starts here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => setCurrentPage('booking')}
                className="bg-gradient-to-r from-primary to-accent text-primary-foreground border-0 px-8 py-6"
              >
                Book Your Experience
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setIsBookingsModalOpen(true)}
                className="px-8 py-6 border-primary/20 hover:border-primary"
              >
                Leave a Review
              </Button>
              {isBookingsModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">

                  {/* Modal Container */}
                  <div className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto bg-white rounded-3xl shadow-2xl p-8 animate-in fade-in zoom-in-95 duration-300">

                    {/* Close Button */}
                    <button
                      onClick={() => setIsBookingsModalOpen(false)}
                      className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-lg font-semibold"
                    >
                      ✕
                    </button>

                    {isBookingsModalOpen && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">

                        <div className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto 
                    bg-background rounded-3xl shadow-2xl p-10">

                          <button
                            onClick={() => setIsBookingsModalOpen(false)}
                            className="absolute top-6 right-6 text-muted-foreground hover:text-primary transition-colors"
                          >
                            ✕
                          </button>

                          <div className="text-center mb-8">
                            <h3 className="text-3xl font-light text-foreground">
                              Select a Booking to Review
                            </h3>
                            <p className="text-muted-foreground mt-2">
                              Choose your recent appointment below
                            </p>
                          </div>

                          <BookingsList
                            bookings={bookings}
                            onSelectBooking={handleSelectBooking}
                          />
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              )}


            </div>

          </motion.div>
        </div>
        {selectedBooking && (
          <ReviewModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            booking={selectedBooking!}
            onSubmit={handleReviewSubmit}
          />

        )}
      </section>


    </div>
  );
}