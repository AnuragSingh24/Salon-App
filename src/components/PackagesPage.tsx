import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import {
  Gift,
  Sparkles,
  Heart,
  Star,
  Clock,
  DollarSign,
  Check,
  Crown,
  Zap
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface PackagesPageProps {
  setCurrentPage: (page: string) => void;
}

/* 🔥 ICON MAPPING */
const iconMap: Record<string, any> = {
  Crown,
  Heart,
  Sparkles,
  Zap,
  Gift
};

export function PackagesPage({ setCurrentPage }: PackagesPageProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
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

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/package/cat?category=${selectedCategory}`
        );
        const data = await res.json();
        setPackages(data.packages || []);
      } catch (err) {
        console.error('Failed to fetch packages', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [selectedCategory]);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-white via-secondary/30 to-accent/20"

    >
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
              <span className="text-sm font-medium text-foreground">
                Curated Experiences
              </span>
            </motion.div>

            <motion.h1 className="text-4xl md:text-6xl lg:text-7xl font-light text-foreground leading-tight">
              Luxury
              <span className="block text-primary italic">Packages</span>
            </motion.h1>

            <motion.p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Indulge in our thoughtfully curated beauty packages designed to
              provide complete transformation experiences.
            </motion.p>
          </motion.div>
        </div>
      </motion.section>
      {/* ---------------- PACKAGES SECTION ---------------- */}
      <section id="packages-section" className="py-20">
        <div className="container mx-auto px-4">
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={
                  selectedCategory === category.id ? 'default' : 'outline'
                }
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.label}
              </Button>
            ))}
          </div>

          {/* Packages Grid */}
          <motion.div className="grid lg:grid-cols-2 gap-8">
            {packages.map((pkg, index) => {
              const Icon = iconMap[pkg.icon] || Gift;
              const savings =
                pkg.originalPrice && pkg.price
                  ? pkg.originalPrice - pkg.price
                  : 0;

              return (
                <motion.div
                  key={pkg._id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden shadow-lg bg-white/90">
                    <div className="relative h-64">
                      <ImageWithFallback
                        src={pkg.image}
                        alt={pkg.name}
                        className="w-full h-full object-cover"
                      />

                      {/* ✅ SAVE BADGE */}
                      {savings > 0 && (
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-green-100 text-green-800 border border-green-200">
                            Save ${savings}
                          </Badge>
                        </div>
                      )}

                      {/* ✅ POPULAR BADGE */}
                      {pkg.popular && (
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-200">
                            Popular
                          </Badge>
                        </div>
                      )}

                      <div className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-white flex items-center justify-center">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                    </div>

                    <div className="p-6 space-y-2">
                      {/* Package Name */}
                      <h3 className="text-xl font-semibold">{pkg.name}</h3>

                      {/* Subtitle */}
                      {pkg.subtitle && (
                        <p className="text-sm text-muted-foreground">{pkg.subtitle}</p>
                      )}

                      {/* Price */}
                      <div className="text-right">
                        <div className="text-xl font-bold text-primary">
                          ${pkg.price}
                        </div>
                        {pkg.originalPrice && pkg.originalPrice > pkg.price && (
                          <div className="text-sm line-through text-muted-foreground">
                            ${pkg.originalPrice}
                          </div>
                        )}
                      </div>

                      <p className="text-muted-foreground mt-2">{pkg.description}</p>

                      <div className="flex items-center text-sm">
                        <Clock className="w-4 h-4 mr-2 text-primary" />
                        {pkg.duration} minutes
                      </div>

                      <Separator />

                      <div className="grid sm:grid-cols-2 gap-2">
                        {pkg.services?.map((service: string, i: number) => (
                          <div key={i} className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-600" />
                            <span className="text-sm">{service}</span>
                          </div>
                        ))}
                      </div>

                      <Button
                        onClick={() => {
                          sessionStorage.setItem(
                            'selectedBooking',
                            JSON.stringify({
                              bookingType: 'package',
                              packageId: pkg._id,
                              name: pkg.name,
                              price: pkg.price,
                              duration: pkg.duration
                            })
                          );

                          setCurrentPage('booking');
                        }}
                        className="w-full mt-2"
                      >
                        Book Package
                      </Button>

                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>


        </div>
      </section>
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
                  description:
                    'Save up to 30% compared to booking services individually'
                },
                {
                  icon: Clock,
                  title: 'Time Efficient',
                  description: 'Complete transformation in a single, convenient session'
                },
                {
                  icon: Star,
                  title: 'Premium Experience',
                  description:
                    'Enhanced service with luxury amenities and personal attention'
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
                    <h3 className="text-lg font-semibold text-foreground">
                      {benefit.title}
                    </h3>
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
