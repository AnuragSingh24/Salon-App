import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Scissors, Sparkles, Calendar, Star, ArrowRight, Award, Heart, Users, Play, Volume2, VolumeX } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface HomePageProps {
  setCurrentPage: (page: string) => void;
  userRole?: string;
}

export function HomePage({ setCurrentPage, userRole }: HomePageProps) {
  const containerRef = useRef(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3]);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const services = [
    {
      icon: Scissors,
      title: "Hair Styling",
      description: "Expert cuts, coloring, and styling for every occasion",
      image: "https://images.unsplash.com/photo-1712481846921-d5df6dc4abfd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYWlyJTIwc3R5bGluZyUyMHNhbG9uJTIwd29tYW58ZW58MXx8fHwxNzU4NTE5NDQ1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      icon: Sparkles,
      title: "Spa & Wellness",
      description: "Relaxing treatments for body and mind",
      image: "https://images.unsplash.com/photo-1554424518-336ec861b705?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGElMjByZWxheGF0aW9uJTIwd2VsbG5lc3N8ZW58MXx8fHwxNzU4NTE5NDQ4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      icon: Star,
      title: "Premium Care",
      description: "Luxury treatments with the finest products",
      image: "https://images.unsplash.com/photo-1758188753373-5b01a0fc6d9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBzYWxvbiUyMGludGVyaW9yJTIwbW9kZXJufGVufDF8fHx8MTc1ODQzMzk4Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    }
  ];

  const stats = [
    { icon: Users, value: "10,000+", label: "Happy Clients" },
    { icon: Award, value: "15+", label: "Years Experience" },
    { icon: Star, value: "4.9", label: "Average Rating" },
    { icon: Heart, value: "98%", label: "Client Retention" }
  ];

  return (
    <div ref={containerRef} className="overflow-hidden">
      {/* Hero Section */}
      <motion.section
        className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary via-white to-accent"
        style={{ y: heroY, opacity: heroOpacity }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/10" />

        <div className="container mx-auto px-4 z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="space-y-4">
                <motion.p
                  className="text-primary uppercase tracking-wide text-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Premium Beauty Experience
                </motion.p>

                <motion.h1
                  className="text-4xl md:text-6xl lg:text-7xl font-light text-foreground leading-tight"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  MK
                  <span className="block text-primary italic">Salon</span>
                </motion.h1>

                <motion.p
                  className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  Where beauty meets artistry. Experience luxury hair and beauty services
                  in our serene, modern sanctuary.
                </motion.p>
              </div>

              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                {userRole !== 'admin' && (
                  <Button
                    size="lg"
                    onClick={() => {
                      sessionStorage.setItem(
                        'selectedBooking',
                        JSON.stringify({
                          bookingType: 'appointment', // 👈 NEW TYPE
                          name: 'General Appointment',
                          duration: null,
                          price: 0
                        })
                      );
                      setCurrentPage('booking');
                    }}
                    className="bg-gradient-to-r from-primary to-accent text-primary-foreground border-0 px-8 py-6 text-lg group"
                  >
                    Book Appointment
                    <Calendar className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  </Button>

                )}

                <Button
                  size="lg"
                  variant={userRole === 'admin' ? 'default' : 'outline'}
                  onClick={() => setCurrentPage('services')}
                  className={`px-8 py-6 text-lg group ${userRole === 'admin'
                      ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground border-0'
                      : 'border-primary/20 hover:border-primary'
                    }`}
                >
                  View Services
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1758188753373-5b01a0fc6d9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBzYWxvbiUyMGludGVyaW9yJTIwbW9kZXJufGVufDF8fHx8MTc1ODQzMzk4Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Luxe Salon Interior"
                  className="w-full h-[600px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
              </div>

              {/* Floating Stats Card */}
              <motion.div
                className="absolute -bottom-8 -left-8 bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-primary/10"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                    <Star className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">4.9 Rating</p>
                    <p className="text-sm text-muted-foreground">1000+ Reviews</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Video Intro Section */}
      <section className="py-24 bg-gradient-to-br from-white via-secondary/20 to-accent/10">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center space-y-8 mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Play className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-foreground">Behind the Scenes</span>
            </motion.div>

            <h2 className="text-3xl md:text-5xl font-light text-foreground">
              Experience the
              <span className="block text-primary italic">MK Difference</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our salon's story, meet our talented team, and see the artistry
              that goes into every transformation at MK Salon.
            </p>
          </motion.div>

          <motion.div
            className="max-w-5xl mx-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-primary/10 to-accent/5 backdrop-blur-sm border border-primary/10">
              {/* Video Container */}
              <div className="relative aspect-video bg-gradient-to-br from-primary/5 to-accent/10">
                {/* Placeholder Video - Replace with actual video */}
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  poster="https://images.unsplash.com/photo-1758188753373-5b01a0fc6d9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBzYWxvbiUyMGludGVyaW9yJTIwbW9kZXJufGVufDF8fHx8MTc1ODQzMzk4Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  muted={isMuted}
                  loop
                  playsInline
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                >
                  {/* Add your video source here */}
                  <source src="/path-to-your-video.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>

                {/* Video Overlay */}
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center group hover:bg-black/10 transition-all duration-300">
                  {/* Play/Pause Button */}
                  <motion.button
                    onClick={handlePlayPause}
                    className="w-20 h-20 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-xl group-hover:scale-110 transition-all duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isPlaying ? (
                      <div className="w-6 h-6 flex space-x-1">
                        <div className="w-2 bg-primary rounded-sm"></div>
                        <div className="w-2 bg-primary rounded-sm"></div>
                      </div>
                    ) : (
                      <Play className="w-8 h-8 text-primary ml-1" />
                    )}
                  </motion.button>
                </div>

                {/* Video Controls */}
                <div className="absolute bottom-4 right-4 flex space-x-2">
                  <motion.button
                    onClick={handleMuteToggle}
                    className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isMuted ? (
                      <VolumeX className="w-4 h-4 text-primary" />
                    ) : (
                      <Volume2 className="w-4 h-4 text-primary" />
                    )}
                  </motion.button>
                </div>

                {/* Video Info Overlay */}
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
                  <h3 className="font-semibold text-foreground mb-1">MK Salon Experience</h3>
                  <p className="text-sm text-muted-foreground">See our artistry in action</p>
                </div>
              </div>

              {/* Video Description */}
              <div className="p-8 bg-white/80 backdrop-blur-sm">
                <div className="grid md:grid-cols-3 gap-6 text-center">
                  <motion.div
                    className="space-y-3"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                      <Scissors className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <h4 className="font-semibold text-foreground">Expert Craftsmanship</h4>
                    <p className="text-sm text-muted-foreground">Watch our skilled stylists create stunning transformations</p>
                  </motion.div>

                  <motion.div
                    className="space-y-3"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <h4 className="font-semibold text-foreground">Luxury Environment</h4>
                    <p className="text-sm text-muted-foreground">Experience our serene and elegant salon atmosphere</p>
                  </motion.div>

                  <motion.div
                    className="space-y-3"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                      <Heart className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <h4 className="font-semibold text-foreground">Personal Care</h4>
                    <p className="text-sm text-muted-foreground">See how we pamper each client with individual attention</p>
                  </motion.div>
                </div>

                {userRole !== 'admin' && (
                  <motion.div
                    className="text-center mt-8"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                  >
                    <Button
                      onClick={() => setCurrentPage('booking')}
                      className="bg-gradient-to-r from-primary to-accent text-primary-foreground border-0 px-8 py-3"
                    >
                      Start Your Journey
                    </Button>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Additional Video Info */}
          <motion.div
            className="grid md:grid-cols-2 gap-8 mt-16 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="text-center md:text-left space-y-4">
              <h3 className="text-xl font-semibold text-foreground">Our Story</h3>
              <p className="text-muted-foreground leading-relaxed">
                Founded with a passion for beauty and excellence, MK Salon has been transforming
                lives through the art of hair and beauty for over 15 years. Our video showcases
                the dedication, skill, and artistry that defines our approach to beauty.
              </p>
            </div>
            <div className="text-center md:text-left space-y-4">
              <h3 className="text-xl font-semibold text-foreground">Meet Our Team</h3>
              <p className="text-muted-foreground leading-relaxed">
                Get to know the talented professionals who bring their expertise and creativity
                to every appointment. Our team's commitment to excellence and continuous learning
                ensures you receive the best possible service every time you visit.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center space-y-4 mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-primary uppercase tracking-wide text-sm">Our Expertise</p>
            <h2 className="text-3xl md:text-5xl font-light text-foreground">
              Signature Services
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our range of premium beauty and wellness services,
              crafted to enhance your natural beauty.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  whileHover={{ y: -10 }}
                  className="group cursor-pointer"
                  onClick={() => setCurrentPage('services')}
                >
                  <Card className="overflow-hidden border-0 shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <div className="relative h-64 overflow-hidden">
                      <ImageWithFallback
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <div className="absolute bottom-4 left-4">
                        <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                    </div>

                    <div className="p-6 space-y-3">
                      <h3 className="text-xl font-semibold text-foreground">{service.title}</h3>
                      <p className="text-muted-foreground">{service.description}</p>
                      <div className="flex items-center text-primary group-hover:text-accent transition-colors">
                        <span className="text-sm font-medium">Learn More</span>
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-gradient-to-r from-secondary to-accent">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  className="text-center space-y-4"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="w-16 h-16 mx-auto rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl md:text-3xl font-semibold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center space-y-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-5xl font-light text-foreground">
              Ready to Transform Your Look?
            </h2>
            <p className="text-lg text-muted-foreground">
              Book your appointment today and experience the luxury you deserve.
              Our expert stylists are ready to bring your vision to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {userRole !== 'admin' && (
                <Button
                  size="lg"
                  onClick={() => setCurrentPage('booking')}
                  className="bg-gradient-to-r from-primary to-accent text-primary-foreground border-0 px-8 py-6 text-lg"
                >
                  Book Your Session
                </Button>
              )}
              <Button
                size="lg"
                variant="outline"
                onClick={() => setCurrentPage('gallery')}
                className="px-8 py-6 text-lg border-primary/20 hover:border-primary"
              >
                View Gallery
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}