import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Edit, Trash2, Save, X, Scissors, Sparkles, Star, DollarSign, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  image: string;
  popular: boolean;
}

export function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([
    {
      id: '1',
      name: 'Classic Cut & Style',
      description: 'Professional haircut with styling',
      price: 85,
      duration: 60,
      category: 'Hair',
      image: 'https://images.unsplash.com/photo-1712481846921-d5df6dc4abfd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYWlyJTIwc3R5bGluZyUyMHNhbG9uJTIwd29tYW58ZW58MXx8fHwxNzU4NTE5NDQ1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      popular: true
    },
    {
      id: '2',
      name: 'Luxury Facial',
      description: 'Rejuvenating facial treatment',
      price: 120,
      duration: 90,
      category: 'Skincare',
      image: 'https://images.unsplash.com/photo-1554424518-336ec861b705?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGElMjByZWxheGF0aW9uJTIwd2VsbG5lc3N8ZW58MXx8fHwxNzU4NTE5NDQ4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      popular: false
    }
  ]);

  const [isAddingService, setIsAddingService] = useState(false);
  const [editingService, setEditingService] = useState<string | null>(null);
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    price: 0,
    duration: 60,
    category: 'Hair',
    image: '',
    popular: false
  });

  const categories = ['Hair', 'Skincare', 'Nails', 'Massage', 'Wellness'];

  const handleAddService = () => {
    const service: Service = {
      id: Date.now().toString(),
      ...newService
    };
    setServices([...services, service]);
    setNewService({
      name: '',
      description: '',
      price: 0,
      duration: 60,
      category: 'Hair',
      image: '',
      popular: false
    });
    setIsAddingService(false);
  };

  const handleDeleteService = (id: string) => {
    setServices(services.filter(service => service.id !== id));
  };

  const handleTogglePopular = (id: string) => {
    setServices(services.map(service => 
      service.id === id ? { ...service, popular: !service.popular } : service
    ));
  };

  const handleEditService = (id: string) => {
    const service = services.find(s => s.id === id);
    if (service) {
      setNewService({
        name: service.name,
        description: service.description,
        price: service.price,
        duration: service.duration,
        category: service.category,
        image: service.image,
        popular: service.popular
      });
      setEditingService(id);
    }
  };

  const handleUpdateService = () => {
    setServices(services.map(service => 
      service.id === editingService 
        ? { ...service, ...newService }
        : service
    ));
    setEditingService(null);
    setNewService({
      name: '',
      description: '',
      price: 0,
      duration: 60,
      category: 'Hair',
      image: '',
      popular: false
    });
  };

  const groupedServices = services.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {} as Record<string, Service[]>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-secondary/30 to-accent/20 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-light text-foreground mb-2">
                Services Management
              </h1>
              <p className="text-muted-foreground">
                Add, edit, and manage salon services
              </p>
            </div>
            <Button
              onClick={() => setIsAddingService(true)}
              className="bg-gradient-to-r from-primary to-accent text-primary-foreground"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Service
            </Button>
          </div>
        </motion.div>

        {/* Add/Edit Service Form */}
        {(isAddingService || editingService) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                {editingService ? 'Edit Service' : 'Add New Service'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Service Name</Label>
                    <Input
                      value={newService.name}
                      onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                      placeholder="Enter service name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      value={newService.description}
                      onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                      placeholder="Enter service description"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">Price ($)</Label>
                      <Input
                        type="number"
                        value={newService.price}
                        onChange={(e) => setNewService({ ...newService, price: parseFloat(e.target.value) })}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="duration">Duration (minutes)</Label>
                      <Input
                        type="number"
                        value={newService.duration}
                        onChange={(e) => setNewService({ ...newService, duration: parseInt(e.target.value) })}
                        placeholder="60"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={newService.category}
                      onValueChange={(value) => setNewService({ ...newService, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="image">Image URL</Label>
                    <Input
                      value={newService.image}
                      onChange={(e) => setNewService({ ...newService, image: e.target.value })}
                      placeholder="Enter image URL"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="popular"
                      checked={newService.popular}
                      onChange={(e) => setNewService({ ...newService, popular: e.target.checked })}
                      className="rounded border-primary"
                    />
                    <Label htmlFor="popular">Mark as Popular Service</Label>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2 mt-6">
                <Button 
                  onClick={editingService ? handleUpdateService : handleAddService}
                  className="bg-gradient-to-r from-primary to-accent text-primary-foreground"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {editingService ? 'Update' : 'Save'} Service
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsAddingService(false);
                    setEditingService(null);
                    setNewService({
                      name: '',
                      description: '',
                      price: 0,
                      duration: 60,
                      category: 'Hair',
                      image: '',
                      popular: false
                    });
                  }}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Services by Category */}
        <div className="grid gap-6">
          {categories.map((category, categoryIndex) => (
            groupedServices[category] && (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: categoryIndex * 0.1 }}
              >
                <Card className="p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <Scissors className="w-5 h-5 text-primary" />
                    <h3 className="text-xl font-semibold">{category}</h3>
                    <span className="text-sm text-muted-foreground">
                      ({groupedServices[category]?.length || 0} services)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groupedServices[category].map((service) => (
                      <motion.div
                        key={service.id}
                        className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                        whileHover={{ scale: 1.02 }}
                      >
                        {service.image && (
                          <div className="h-40 overflow-hidden">
                            <ImageWithFallback
                              src={service.image}
                              alt={service.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold">{service.name}</h4>
                            {service.popular && (
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {service.description}
                          </p>
                          <div className="flex items-center justify-between text-sm mb-3">
                            <div className="flex items-center space-x-1">
                              <DollarSign className="w-4 h-4 text-primary" />
                              <span className="font-medium">${service.price}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4 text-primary" />
                              <span>{service.duration}min</span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditService(service.id)}
                              className="flex-1"
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleTogglePopular(service.id)}
                              className={service.popular ? 'text-yellow-600' : ''}
                            >
                              <Star className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteService(service.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )
          ))}
        </div>
      </div>
    </div>
  );
}