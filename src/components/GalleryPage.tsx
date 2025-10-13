import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Camera, Eye, Heart, Star, Filter, Grid, Play, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface GalleryPageProps {
  setCurrentPage: (page: string) => void;
}

export function GalleryPage({ setCurrentPage }: GalleryPageProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);
  
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.3]);

  const categories = [
    { id: 'all', label: 'All Work', count: 24 },
    { id: 'transformations', label: 'Transformations', count: 8 },
    { id: 'color', label: 'Color Work', count: 6 },
    { id: 'cuts', label: 'Cuts & Styling', count: 5 },
    { id: 'bridal', label: 'Bridal', count: 3 },
    { id: 'events', label: 'Special Events', count: 2 }
  ];

  const galleryItems = [
    {
      id: 1,
      category: 'transformations',
      title: 'Dramatic Color Change',
      description: 'From brunette to platinum blonde - a complete transformation',
      image: 'https://images.unsplash.com/photo-1590503347339-ccd768ad83d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWZvcmUlMjBhZnRlciUyMGhhaXIlMjB0cmFuc2Zvcm1hdGlvbnxlbnwxfHx8fDE3NTg1MjE2Njd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      stylist: 'Emma Rodriguez',
      likes: 142,
      featured: true
    },
    {
      id: 2,
      category: 'color',
      title: 'Balayage Perfection',
      description: 'Natural sun-kissed highlights with seamless blending',
      image: 'https://images.unsplash.com/photo-1701977082153-4ac2c0e9899d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYWlyJTIwY29sb3JpbmclMjBwcm9jZXNzJTIwc2Fsb258ZW58MXx8fHwxNzU4NDY0MzE0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      stylist: 'Sarah Chen',
      likes: 98,
      featured: false
    },
    {
      id: 3,
      category: 'cuts',
      title: 'Modern Bob Cut',
      description: 'Chic and sophisticated bob with subtle layers',
      image: 'https://images.unsplash.com/photo-1700168333927-023e01cc748f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWxvbiUyMGludGVyaW9yJTIwc3R5bGluZyUyMGNoYWlyfGVufDF8fHx8MTc1ODUyMTY3MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      stylist: 'Emma Rodriguez',
      likes: 76,
      featured: false
    },
    {
      id: 4,
      category: 'bridal',
      title: 'Bridal Updo Elegance',
      description: 'Romantic updo perfect for your special day',
      image: 'https://images.unsplash.com/photo-1590503347339-ccd768ad83d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWZvcmUlMjBhZnRlciUyMGhhaXIlMjB0cmFuc2Zvcm1hdGlvbnxlbnwxfHx8fDE3NTg1MjE2Njd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      stylist: 'Maria Santos',
      likes: 203,
      featured: true
    },
    {
      id: 5,
      category: 'color',
      title: 'Rainbow Highlights',
      description: 'Bold and creative color placement for a unique look',
      image: 'https://images.unsplash.com/photo-1701977082153-4ac2c0e9899d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYWlyJTIwY29sb3JpbmclMjBwcm9jZXNzJTIwc2Fsb258ZW58MXx8fHwxNzU4NDY0MzE0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      stylist: 'Alex Thompson',
      likes: 156,
      featured: false
    },
    {
      id: 6,
      category: 'cuts',
      title: 'Layered Waves',
      description: 'Flowing layers that enhance natural texture',
      image: 'https://images.unsplash.com/photo-1700168333927-023e01cc748f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWxvbiUyMGludGVyaW9yJTIwc3R5bGluZyUyMGNoYWlyfGVufDF8fHx8MTc1ODUyMTY3MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      stylist: 'Emma Rodriguez',
      likes: 89,
      featured: false
    }
  ];

  const filteredItems = selectedCategory === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedCategory);

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
              <Camera className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-foreground">Our Portfolio</span>
            </motion.div>

            <motion.h1 
              className="text-4xl md:text-6xl lg:text-7xl font-light text-foreground leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Artistry in
              <span className="block text-primary italic">Motion</span>
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              Every transformation tells a story. Explore our gallery of stunning makeovers, 
              creative color work, and signature styles that showcase the artistry behind each creation.
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
                Book Your Transformation
              </Button>
              <Button 
                variant="outline"
                onClick={() => document.getElementById('gallery-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-6 text-lg border-primary/20 hover:border-primary"
              >
                <Eye className="w-5 h-5 mr-2" />
                View Gallery
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <motion.div
          className="absolute top-20 right-10 w-20 h-20 rounded-full bg-primary/10 backdrop-blur-sm"
          animate={{ y: [0, -20, 0], rotate: [0, 180, 360] }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-20 left-10 w-16 h-16 rounded-full bg-accent/20 backdrop-blur-sm"
          animate={{ y: [0, 20, 0], rotate: [360, 180, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
      </motion.section>

      {/* Gallery Section */}
      <section id="gallery-section" className="py-20">
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
              Our Creative Journey
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Each image captures a moment of transformation, a story of confidence restored, 
              and the artistry that defines our craft.
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
                <Badge variant="secondary" className="ml-2 text-xs">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </motion.div>

          {/* Gallery Grid */}
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            layout
          >
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group cursor-pointer"
                onClick={() => setSelectedImage(item)}
              >
                <Card className="overflow-hidden border-0 shadow-lg group-hover:shadow-2xl transition-all duration-500 bg-white/90 backdrop-blur-sm">
                  <div className="relative h-80 overflow-hidden">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Featured Badge */}
                    {item.featured && (
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-primary text-primary-foreground border-0">
                          <Star className="w-3 h-3 mr-1 fill-current" />
                          Featured
                        </Badge>
                      </div>
                    )}

                    {/* Hover Content */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button 
                        size="sm"
                        className="bg-white/90 text-foreground border-0 backdrop-blur-sm hover:bg-white"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>

                    {/* Bottom Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <div className="text-white">
                        <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                        <p className="text-sm text-white/80 mb-2">{item.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-white/70">by {item.stylist}</span>
                          <div className="flex items-center space-x-1">
                            <Heart className="w-4 h-4 text-red-400" />
                            <span className="text-sm">{item.likes}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Load More Button */}
          <motion.div 
            className="text-center mt-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Button 
              variant="outline"
              className="px-8 py-4 border-primary/20 hover:border-primary hover:bg-primary/5"
            >
              Load More Transformations
              <ArrowRight className="w-4 h-4 ml-2" />
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
              Ready for Your Transformation?
            </h2>
            <p className="text-muted-foreground">
              Every masterpiece starts with a vision. Let our talented team bring your dream look to life 
              and create the next stunning addition to our gallery.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => setCurrentPage('booking')}
                className="bg-gradient-to-r from-primary to-accent text-primary-foreground border-0 px-8 py-6"
              >
                Book Your Session
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => setCurrentPage('contact')}
                className="px-8 py-6 border-primary/20 hover:border-primary"
              >
                Consultation Call
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}