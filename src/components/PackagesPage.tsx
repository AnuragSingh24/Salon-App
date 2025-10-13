import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Gift, Sparkles, Heart, Star, Clock, DollarSign, Check, Crown, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface PackagesPageProps {
  setCurrentPage: (page: string) => void;
}

export function PackagesPage({ setCurrentPage }: PackagesPageProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.3]);

  const categories = [
    { id: 'all', label: 'All Packages' },
    { id: 'signature', label: 'Signature Collections' },
    { id: 'bridal', label: 'Bridal Packages' },
    { id: 'seasonal', label: 'Seasonal Offers' },
    { id: 'gift', label: 'Gift Packages' }
  ];

  const packages = [
    {
      id: 1,
      category: 'signature',
      name: 'Royal Transformation',
      subtitle: 'The Ultimate Beauty Experience',
      description: 'A complete head-to-toe transformation including cut, color, styling, facial, massage, and luxury manicure.',
      price: 450,
      originalPrice: 580,
      duration: 360,
      services: [
        'Precision Cut & Style',
        'Premium Color Treatment',
        'Signature Facial (90min)',
        'Relaxation Massage (60min)',
        'Luxury Manicure',
        'Complimentary Refreshments'
      ],
      image: 'https://images.unsplash.com/photo-1566977806197-b52b166f231f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBzcGElMjBwYWNrYWdlJTIwZ2lmdHxlbnwxfHx8fDE3NTg1MjE4MTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      popular: true,
      icon: Crown,
      savings: 130,
      features: ['Premium Products', 'Extended Sessions', 'VIP Treatment']
    },
    {
      id: 2,
      category: 'bridal',
      name: 'Bridal Bliss Package',
      subtitle: 'Your Perfect Wedding Day',
      description: 'Complete bridal beauty package including trial sessions, wedding day hair & makeup, and pre-wedding treatments.',
      price: 650,
      originalPrice: 800,
      duration: 480,
      services: [
        'Bridal Consultation',
        'Hair & Makeup Trial',
        'Wedding Day Hair Styling',
        'Wedding Day Makeup',
        'Pre-wedding Facial',
        'Touch-up Kit'
      ],
      image: 'https://images.unsplash.com/photo-1566977806197-b52b166f231f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBzcGElMjBwYWNrYWdlJTIwZ2lmdHxlbnwxfHx8fDE3NTg1MjE4MTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      popular: false,
      icon: Heart,
      savings: 150,
      features: ['Trial Included', 'Wedding Day Service', 'Photography Ready']
    },
    {
      id: 3,
      category: 'signature',
      name: 'Glow Up Special',
      subtitle: 'Radiance Redefined',
      description: 'Perfect for special occasions - hair styling, professional makeup, and glow-enhancing facial.',
      price: 285,
      originalPrice: 350,
      duration: 240,
      services: [
        'Event Hair Styling',
        'Professional Makeup',
        'Hydrating Facial',
        'Eyebrow Shaping',
        'Complimentary Touch-ups'
      ],
      image: 'https://images.unsplash.com/photo-1566977806197-b52b166f231f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBzcGElMjBwYWNrYWdlJTIwZ2lmdHxlbnwxfHx8fDE3NTg1MjE4MTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      popular: true,
      icon: Sparkles,
      savings: 65,
      features: ['Event Ready', 'Long-lasting', 'Touch-up Kit']
    },
    {
      id: 4,
      category: 'seasonal',
      name: 'Spring Renewal',
      subtitle: 'Fresh Start Package',
      description: 'Refresh your look for the new season with a cut, color refresh, and rejuvenating treatments.',
      price: 320,
      originalPrice: 420,
      duration: 300,
      services: [
        'Seasonal Cut & Style',
        'Color Refresh Treatment',
        'Deep Conditioning Mask',
        'Rejuvenating Facial',
        'Scalp Massage'
      ],
      image: 'https://images.unsplash.com/photo-1566977806197-b52b166f231f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBzcGElMjBwYWNrYWdlJTIwZ2lmdHxlbnwxfHx8fDE3NTg1MjE4MTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      popular: false,
      icon: Zap,
      savings: 100,
      features: ['Seasonal Special', 'Deep Treatment', 'Hair Health Focus']
    },
    {
      id: 5,
      category: 'gift',
      name: 'Pamper & Relax',
      subtitle: 'Perfect Gift Experience',
      description: 'The ideal gift package combining relaxation and beauty with spa treatments and styling.',
      price: 245,
      originalPrice: 310,
      duration: 180,
      services: [
        'Relaxation Massage (60min)',
        'Express Facial',
        'Blow Dry & Style',
        'Luxury Manicure',
        'Herbal Tea Service'
      ],
      image: 'https://images.unsplash.com/photo-1566977806197-b52b166f231f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBzcGElMjBwYWNrYWdlJTIwZ2lmdHxlbnwxfHx8fDE3NTg1MjE4MTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      popular: false,
      icon: Gift,
      savings: 65,
      features: ['Gift Card Available', 'Relaxation Focus', 'Perfect Present']
    }
  ];

  const filteredPackages = selectedCategory === 'all' 
    ? packages 
    : packages.filter(pkg => pkg.category === selectedCategory);

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
              <Gift className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-foreground">Curated Experiences</span>
            </motion.div>

            <motion.h1 
              className="text-4xl md:text-6xl lg:text-7xl font-light text-foreground leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Luxury
              <span className="block text-primary italic">Packages</span>
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              Indulge in our thoughtfully curated beauty packages designed to provide complete transformation 
              experiences. Each package combines our signature services for maximum value and luxury.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Button 
                onClick={() => setCurrentPage('booking')}
                className="bg-gradient-to-r from-primary to-accent text-primary-foreground border-0 px-8 py-6 text-lg"
              >
                Book Your Package
              </Button>
              <Button 
                variant="outline"
                onClick={() => document.getElementById('packages-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-6 text-lg border-primary/20 hover:border-primary"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Explore Packages
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <motion.div
          className="absolute top-20 right-10 w-20 h-20 rounded-full bg-primary/10 backdrop-blur-sm flex items-center justify-center"
          animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Crown className="w-10 h-10 text-primary" />
        </motion.div>
        <motion.div
          className="absolute bottom-20 left-10 w-16 h-16 rounded-full bg-accent/20 backdrop-blur-sm flex items-center justify-center"
          animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <Gift className="w-8 h-8 text-primary" />
        </motion.div>
      </motion.section>

      {/* Packages Section */}
      <section id="packages-section" className="py-20">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <motion.div 
            className="text-center space-y-6 mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-5xl font-light text-foreground">
              Choose Your Experience
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From signature transformations to special occasion packages, 
              find the perfect combination of services for your needs.
            </p>
          </motion.div>

          {/* Category Filter */}
          <motion.div 
            className="flex flex-wrap justify-center gap-3 mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className={`rounded-full px-6 py-2 transition-all duration-300 ${
                  selectedCategory === category.id 
                    ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground border-0' 
                    : 'border-primary/20 hover:border-primary hover:bg-primary/5'
                }`}
              >
                {category.label}
              </Button>
            ))}
          </motion.div>

          {/* Packages Grid */}
          <motion.div 
            className="grid lg:grid-cols-2 gap-8"
            layout
          >
            {filteredPackages.map((pkg, index) => {
              const Icon = pkg.icon;
              return (
                <motion.div
                  key={pkg.id}
                  layout
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="group"
                >
                  <Card className="overflow-hidden border-0 shadow-lg group-hover:shadow-2xl transition-all duration-500 bg-white/90 backdrop-blur-sm h-full">
                    <div className="relative">
                      {/* Header Image */}
                      <div className="relative h-64 overflow-hidden">
                        <ImageWithFallback
                          src={pkg.image}
                          alt={pkg.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                        
                        {/* Badges */}
                        <div className="absolute top-4 left-4 flex gap-2">
                          {pkg.popular && (
                            <Badge className="bg-primary text-primary-foreground border-0">
                              <Star className="w-3 h-3 mr-1 fill-current" />
                              Popular
                            </Badge>
                          )}
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            Save ${pkg.savings}
                          </Badge>
                        </div>

                        {/* Icon */}
                        <div className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 space-y-6">
                        {/* Header */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h3 className="text-xl font-semibold text-foreground">{pkg.name}</h3>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-primary">${pkg.price}</div>
                              <div className="text-sm text-muted-foreground line-through">${pkg.originalPrice}</div>
                            </div>
                          </div>
                          
                          <p className="text-primary font-medium text-sm">{pkg.subtitle}</p>
                          <p className="text-muted-foreground text-sm leading-relaxed">{pkg.description}</p>
                        </div>

                        {/* Duration & Features */}
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-primary" />
                            <span className="text-muted-foreground">{pkg.duration} minutes</span>
                          </div>
                          <div className="flex gap-1">
                            {pkg.features.map((feature, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <Separator />

                        {/* Services List */}
                        <div className="space-y-3">
                          <h4 className="font-medium text-foreground">What's Included:</h4>
                          <div className="grid sm:grid-cols-2 gap-2">
                            {pkg.services.map((service, i) => (
                              <div key={i} className="flex items-center space-x-2">
                                <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                                <span className="text-sm text-muted-foreground">{service}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4">
                          <Button 
                            onClick={() => setCurrentPage('booking')}
                            className="flex-1 bg-gradient-to-r from-primary to-accent text-primary-foreground border-0"
                          >
                            Book Package
                          </Button>
                          <Button 
                            variant="outline"
                            className="border-primary/20 hover:border-primary"
                          >
                            Learn More
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-r from-secondary to-accent">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center space-y-12 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-light text-foreground">
                Why Choose Our Packages?
              </h2>
              <p className="text-lg text-muted-foreground">
                Our carefully curated packages offer exceptional value while ensuring 
                a comprehensive beauty experience tailored to your needs.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: DollarSign,
                  title: 'Better Value',
                  description: 'Save up to 30% compared to booking services individually'
                },
                {
                  icon: Clock,
                  title: 'Time Efficient',
                  description: 'Complete transformation in a single, convenient session'
                },
                {
                  icon: Star,
                  title: 'Premium Experience',
                  description: 'Enhanced service with luxury amenities and personal attention'
                }
              ].map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <motion.div
                    key={benefit.title}
                    className="text-center space-y-4"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 }}
                  >
                    <div className="w-16 h-16 mx-auto rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">{benefit.title}</h3>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </motion.div>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => setCurrentPage('booking')}
                className="bg-gradient-to-r from-primary to-accent text-primary-foreground border-0 px-8 py-6"
              >
                Book Your Package
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => setCurrentPage('contact')}
                className="px-8 py-6 border-primary/20 hover:border-primary"
              >
                Custom Package Inquiry
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}