import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { Scissors, Palette, Sparkles, Clock, DollarSign, Star, ArrowRight } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';

// interface ServicesPageProps {
//   setCurrentPage: (page: string) => void;
// }

interface ServicesPageProps {
  setCurrentPage: (page: string) => void;
}

type CategoryId = 'all' | 'hair' | 'spa' | 'nails' | 'makeup';

interface Service {
  _id: string;
  category: string;
  name: string;          // ✅ change from title to name
  description: string;
  price: number;
  duration: number;
  popular?: boolean;
  rating?: number;
  image: string;         // ✅ now required from backend
}




export function ServicesPage({ setCurrentPage }: ServicesPageProps) {
  // const [selectedCategory, setSelectedCategory] = useState('all');

  // const categories = [
  //   { id: 'all', label: 'All Services' },
  //   { id: 'hair', label: 'Hair Services' },
  //   { id: 'spa', label: 'Spa & Wellness' },
  //   { id: 'nails', label: 'Nail Care' },
  //   { id: 'makeup', label: 'Makeup' }
  // ];

  // const services = [
  //   {
  //     id: 1,
  //     category: 'hair',
  //     title: 'Precision Haircut',
  //     description: 'Expert cutting and styling tailored to your face shape and lifestyle.',
  //     price: 85,
  //     duration: 60,
  //     image: 'https://images.unsplash.com/photo-1712481846921-d5df6dc4abfd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYWlyJTIwc3R5bGluZyUyMHNhbG9uJTIwd29tYW58ZW58MXx8fHwxNzU4NTE5NDQ1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  //     popular: true,
  //     rating: 4.9
  //   },
  //   {
  //     id: 2,
  //     category: 'hair',
  //     title: 'Color Transformation',
  //     description: 'Full color service with premium products for stunning results.',
  //     price: 150,
  //     duration: 120,
  //     image: 'https://images.unsplash.com/photo-1712213396688-c6f2d536671f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYWlyJTIwY29sb3JpbmclMjBzYWxvbnxlbnwxfHx8fDE3NTg0OTQwMjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  //     popular: false,
  //     rating: 4.8
  //   },
  //   {
  //     id: 3,
  //     category: 'hair',
  //     title: 'Balayage Highlights',
  //     description: 'Natural-looking highlights with hand-painted technique.',
  //     price: 180,
  //     duration: 150,
  //     image: 'https://images.unsplash.com/photo-1712213396688-c6f2d536671f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYWlyJTIwY29sb3JpbmclMjBzYWxvbnxlbnwxfHx8fDE3NTg0OTQwMjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  //     popular: true,
  //     rating: 4.9
  //   },
  //   {
  //     id: 4,
  //     category: 'spa',
  //     title: 'Signature Facial',
  //     description: 'Deep cleansing and rejuvenating facial treatment.',
  //     price: 120,
  //     duration: 90,
  //     image: 'https://images.unsplash.com/photo-1731514771613-991a02407132?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYWNpYWwlMjBzcGElMjB0cmVhdG1lbnR8ZW58MXx8fHwxNzU4NDMxMjUwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  //     popular: false,
  //     rating: 4.7
  //   },
  //   {
  //     id: 5,
  //     category: 'spa',
  //     title: 'Relaxation Massage',
  //     description: 'Full body massage for ultimate relaxation and stress relief.',
  //     price: 110,
  //     duration: 60,
  //     image: 'https://images.unsplash.com/photo-1737352777897-e22953991a32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXNzYWdlJTIwdGhlcmFweSUyMHNwYXxlbnwxfHx8fDE3NTg1MTY5ODR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  //     popular: true,
  //     rating: 4.8
  //   },
  //   {
  //     id: 6,
  //     category: 'nails',
  //     title: 'Luxury Manicure',
  //     description: 'Complete nail care with premium polish and nail art.',
  //     price: 65,
  //     duration: 45,
  //     image: 'https://images.unsplash.com/photo-1554424518-336ec861b705?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGElMjByZWxheGF0aW9uJTIwd2VsbG5lc3N8ZW58MXx8fHwxNzU4NTE5NDQ4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  //     popular: false,
  //     rating: 4.6
  //   },
  //   {
  //     id: 7,
  //     category: 'makeup',
  //     title: 'Bridal Makeup',
  //     description: 'Professional makeup for your special day with trial session.',
  //     price: 200,
  //     duration: 120,
  //     image: 'https://images.unsplash.com/photo-1758188753373-5b01a0fc6d9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBzYWxvbiUyMGludGVyaW9yJTIwbW9kZXJufGVufDF8fHx8MTc1ODQzMzk4Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  //     popular: true,
  //     rating: 5.0
  //   },
  //   {
  //     id: 8,
  //     category: 'makeup',
  //     title: 'Event Makeup',
  //     description: 'Glamorous makeup for special occasions and photoshoots.',
  //     price: 95,
  //     duration: 75,
  //     image: 'https://images.unsplash.com/photo-1758188753373-5b01a0fc6d9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBzYWxvbiUyMGludGVyaW9yJTIwbW9kZXJufGVufDF8fHx8MTc1ODQzMzk4Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  //     popular: false,
  //     rating: 4.8
  //   }
  // ];

  // const filteredServices = selectedCategory === 'all' 
  //   ? services 
  //   : services.filter(service => service.category === selectedCategory);

  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Static image links (unchanged)
  // const imageMap: Record<string, string> = {
  //   'Precision Haircut': 'https://images.unsplash.com/photo-1712481846921-d5df6dc4abfd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYWlyJTIwc3R5bGluZyUyMHNhbG9uJTIwd29tYW58ZW58MXx8fHwxNzU4NTE5NDQ1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  //   'Color Transformation': 'https://images.unsplash.com/photo-1712213396688-c6f2d536671f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYWlyJTIwY29sb3JpbmclMjBzYWxvbnxlbnwxfHx8fDE3NTg0OTQwMjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  //   'Balayage Highlights': 'https://images.unsplash.com/photo-1712213396688-c6f2d536671f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYWlyJTIwY29sb3JpbmclMjBzYWxvbnxlbnwxfHx8fDE3NTg0OTQwMjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  //   'Signature Facial': 'https://images.unsplash.com/photo-1731514771613-991a02407132?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYWNpYWwlMjBzcGElMjB0cmVhdG1lbnR8ZW58MXx8fHwxNzU4NDMxMjUwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  //   'Relaxation Massage': 'https://images.unsplash.com/photo-1737352777897-e22953991a32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXNzYWdlJTIwdGhlcmFweSUyMHNwYXxlbnwxfHx8fDE3NTg1MTY5ODR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  //   'Luxury Manicure': 'https://images.unsplash.com/photo-1554424518-336ec861b705?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGElMjByZWxheGF0aW9uJTIwd2VsbG5lc3N8ZW58MXx8fHwxNzU4NTE5NDQ4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  //   'Bridal Makeup': 'https://images.unsplash.com/photo-1758188753373-5b01a0fc6d9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBzYWxvbiUyMGludGVyaW9yJTIwbW9kZXJufGVufDF8fHx8MTc1ODQzMzk4Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  //   'Event Makeup': 'https://images.unsplash.com/photo-1758188753373-5b01a0fc6d9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBzYWxvbiUyMGludGVyaW9yJTIwbW9kZXJufGVufDF8fHx8MTc1ODQzMzk4Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  // };

  const categories = [
    { id: 'all', label: 'All Services' },
    { id: 'Hair', label: 'Hair Services' },
    { id: 'Spa', label: 'Spa & Wellness' },
    { id: 'Nails', label: 'Nail Care' },
    { id: 'Makeup', label: 'Makeup' },
  ] as const;



  useEffect(() => {
    const controller = new AbortController();

    const fetchServices = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");

        const param =
          selectedCategory === "all"
            ? ""
            : `?category=${selectedCategory.toLowerCase()}`;

        const res = await fetch(`/api/services${param}`, {
          signal: controller.signal,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch services");
        }

        const data: Service[] = await res.json();
        setServices(data);   // ✅ direct from backend

      } catch (err: any) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
    return () => controller.abort();
  }, [selectedCategory]);

  const handleCategoryChange = (cat: CategoryId) => setSelectedCategory(cat);


  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-secondary/30 to-accent/20">
      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-r from-primary/5 to-accent/10">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center space-y-6 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-primary uppercase tracking-wide text-sm">Professional Services</p>
            <h1 className="text-4xl md:text-6xl font-light text-foreground">
              Our Services
            </h1>
            <p className="text-lg text-muted-foreground">
              Experience our comprehensive range of beauty and wellness services,
              delivered by expert professionals using premium products.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-12 bg-white/50 backdrop-blur-sm border-y border-primary/10">
        <div className="container mx-auto px-4">
          <motion.div
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className={`rounded-full px-6 py-2 transition-all duration-300 ${selectedCategory === category.id
                  ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground border-0'
                  : 'border-primary/20 hover:border-primary hover:bg-primary/5'
                  }`}
              >
                {category.label}
              </Button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            layout
          >
            {services.map((service, index) => (
              <motion.div
                key={service._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group cursor-pointer"
              >
                <Card className="overflow-hidden border-0 shadow-lg group-hover:shadow-2xl transition-all duration-500 bg-white/80 backdrop-blur-sm">
                  <div className="relative h-64 overflow-hidden">
                    <ImageWithFallback
                      src={service.image}
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex gap-2">
                      {service.popular && (
                        <Badge className="bg-primary text-primary-foreground border-0">
                          <Star className="w-3 h-3 mr-1" />
                          Popular
                        </Badge>
                      )}
                    </div>

                    {/* Rating */}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{service.rating}</span>
                    </div>

                    {/* Price */}
                    <div className="absolute bottom-4 right-4 bg-primary text-primary-foreground rounded-full px-4 py-2">
                      <span className="font-semibold">${service.price}</span>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                        {service.name}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {service.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{service.duration}min</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <DollarSign className="w-4 h-4" />
                          <span>${service.price}</span>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        onClick={() => {
                          // 🔐 Save selected service to sessionStorage
                          sessionStorage.setItem(
                            'selectedBooking',
                            JSON.stringify({
                              bookingType: 'service',
                              serviceId: service._id,
                              name: service.name,
                              price: service.price,
                              duration: service.duration
                            })
                          );


                          const isLoggedIn = JSON.parse(
                            sessionStorage.getItem('isLoggedIn') ?? 'false'
                          );

                          if (isLoggedIn) {
                            setCurrentPage('booking');
                          } else {
                            setCurrentPage('auth');
                          }
                        }}
                        className="bg-gradient-to-r from-primary to-accent text-primary-foreground border-0 group-hover:scale-105 transition-transform"
                      >
                        Book Now
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>

                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
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
              Ready to Book Your Service?
            </h2>
            <p className="text-muted-foreground">
              Our expert team is ready to provide you with exceptional service.
              Book your appointment today and experience the luxury you deserve.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => setCurrentPage('booking')}
                className="bg-gradient-to-r from-primary to-accent text-primary-foreground border-0 px-8 py-6"
              >
                Book Appointment
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setCurrentPage('packages')}
                className="px-8 py-6 border-primary/20 hover:border-primary"
              >
                View Packages
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}