import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Star, Heart, Quote, ThumbsUp, Filter, Calendar, User, MessageCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar } from './ui/avatar';
import { Progress } from './ui/progress';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ReviewsPageProps {
  setCurrentPage: (page: string) => void;
}

export function ReviewsPage({ setCurrentPage }: ReviewsPageProps) {
  const [selectedRating, setSelectedRating] = useState('all');
  const [selectedService, setSelectedService] = useState('all');
  
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.3]);

  const ratingStats = {
    average: 4.9,
    total: 1247,
    breakdown: {
      5: 89,
      4: 8,
      3: 2,
      2: 1,
      1: 0
    }
  };

  const services = [
    { id: 'all', label: 'All Services' },
    { id: 'haircut', label: 'Hair Cuts' },
    { id: 'color', label: 'Color Services' },
    { id: 'spa', label: 'Spa Treatments' },
    { id: 'bridal', label: 'Bridal Services' }
  ];

  const reviews = [
    {
      id: 1,
      name: 'Sarah Johnson',
      rating: 5,
      service: 'Balayage Highlights',
      stylist: 'Emma Rodriguez',
      date: '2024-01-10',
      text: "Absolutely incredible transformation! Emma understood exactly what I wanted and delivered beyond my expectations. The balayage looks so natural and has grown out beautifully. The whole experience was relaxing and professional. I've already booked my next appointment!",
      image: 'https://images.unsplash.com/photo-1642337707259-0fdcc8fd06f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGN1c3RvbWVyJTIwc2Fsb24lMjB0ZXN0aW1vbmlhbHxlbnwxfHx8fDE3NTg1MjE3MzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      verified: true,
      helpful: 24
    },
    {
      id: 2,
      name: 'Maria Garcia',
      rating: 5,
      service: 'Bridal Package',
      stylist: 'Maria Santos',
      date: '2024-01-08',
      text: "My wedding day hair and makeup were absolutely perfect! Maria was so calm and professional, which helped ease my nerves. The trial run was thorough and the final look lasted all day and night. All my bridesmaids looked stunning too. Worth every penny!",
      image: 'https://images.unsplash.com/photo-1642337707259-0fdcc8fd06f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGN1c3RvbWVyJTIwc2Fsb24lMjB0ZXN0aW1vbmlhbHxlbnwxfHx8fDE3NTg1MjE3MzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      verified: true,
      helpful: 31
    },
    {
      id: 3,
      name: 'Amanda Chen',
      rating: 5,
      service: 'Precision Cut',
      stylist: 'Sarah Chen',
      date: '2024-01-05',
      text: "After years of disappointing haircuts elsewhere, I finally found my forever stylist! Sarah has an incredible eye for what works with your face shape and lifestyle. My cut grows out beautifully and always looks put-together. The consultation was thorough and educational.",
      image: 'https://images.unsplash.com/photo-1642337707259-0fdcc8fd06f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGN1c3RvbWVyJTIwc2Fsb24lMjB0ZXN0aW1vbmlhbHxlbnwxfHx8fDE3NTg1MjE3MzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      verified: true,
      helpful: 18
    },
    {
      id: 4,
      name: 'Jessica Williams',
      rating: 5,
      service: 'Color Transformation',
      stylist: 'Alex Thompson',
      date: '2024-01-03',
      text: "Alex is a color genius! I wanted to go from dark brown to a warm caramel and was nervous about the process. They explained every step, showed me examples, and the result is exactly what I dreamed of. The color correction was flawless and my hair feels healthy and vibrant.",
      image: 'https://images.unsplash.com/photo-1642337707259-0fdcc8fd06f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGN1c3RvbWVyJTIwc2Fsb24lMjB0ZXN0aW1vbmlhbHxlbnwxfHx8fDE3NTg1MjE3MzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      verified: true,
      helpful: 27
    },
    {
      id: 5,
      name: 'Rachel Thompson',
      rating: 5,
      service: 'Spa Facial',
      stylist: 'Maria Santos',
      date: '2023-12-28',
      text: "The most relaxing and rejuvenating facial I've ever had! Maria's technique is amazing and she really customized the treatment for my skin concerns. My skin has been glowing for weeks. The atmosphere is so peaceful and the products smell incredible. Pure luxury!",
      image: 'https://images.unsplash.com/photo-1642337707259-0fdcc8fd06f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGN1c3RvbWVyJTIwc2Fsb24lMjB0ZXN0aW1vbmlhbHxlbnwxfHx8fDE3NTg1MjE3MzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      verified: true,
      helpful: 22
    },
    {
      id: 6,
      name: 'Emily Rodriguez',
      rating: 4,
      service: 'Luxury Manicure',
      stylist: 'Emma Rodriguez',
      date: '2023-12-25',
      text: "Beautiful manicure that lasted two weeks without chipping! Emma was detail-oriented and the nail art was exactly what I asked for. The only minor issue was the wait time, but the quality made up for it. Will definitely be back for special occasions.",
      image: 'https://images.unsplash.com/photo-1642337707259-0fdcc8fd06f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGN1c3RvbWVyJTIwc2Fsb24lMjB0ZXN0aW1vbmlhbHxlbnwxfHx8fDE3NTg1MjE3MzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      verified: true,
      helpful: 15
    }
  ];

  const getStarColor = (rating: number, starIndex: number) => {
    return starIndex < rating ? 'text-yellow-400 fill-current' : 'text-gray-300';
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
                className={`rounded-full px-6 py-2 transition-all duration-300 ${
                  selectedService === service.id 
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
                key={review.id}
                layout
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
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
                        <h3 className="font-semibold text-foreground">{review.name}</h3>
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${getStarColor(review.rating, i)}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    {review.verified && (
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        Verified
                      </Badge>
                    )}
                  </div>

                  {/* Service Info */}
                  <div className="mb-4 p-3 rounded-lg bg-secondary/30">
                    <div className="text-sm text-muted-foreground">Service</div>
                    <div className="font-medium text-foreground">{review.service}</div>
                    <div className="text-sm text-muted-foreground">with {review.stylist}</div>
                  </div>

                  {/* Review Text */}
                  <div className="mb-4">
                    <Quote className="w-6 h-6 text-primary/30 mb-2" />
                    <p className="text-muted-foreground leading-relaxed text-sm">
                      {review.text}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t border-border">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(review.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ThumbsUp className="w-4 h-4" />
                      <span>{review.helpful}</span>
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
                onClick={() => setCurrentPage('contact')}
                className="px-8 py-6 border-primary/20 hover:border-primary"
              >
                Leave a Review
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}