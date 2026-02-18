import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Edit, Trash2, Save, X, Scissors, Star, DollarSign, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Service {
  _id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  image: string;
  popular: boolean;
}

export function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
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

  // IMPORTANT: Match backend lowercase categories
  const categories = ['Hair', 'Spa', 'Nails', 'Makeup'];

  /* ================= FETCH SERVICES ================= */

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services');
      const data = await res.json();

      // Handle both array or { success, data }
      const servicesArray = Array.isArray(data) ? data : data.data;

      const formatted = servicesArray.map((service: any) => ({
        ...service,
        category: service.category
          ? service.category.charAt(0).toUpperCase() +
          service.category.slice(1).toLowerCase()
          : 'Other'
      }));

      setServices(formatted);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  /* ================= CREATE SERVICE ================= */

  const handleAddService = async () => {
    try {
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          ...newService,
          category: newService.category.toLowerCase() // save lowercase
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to create service');
      }

      setServices((prev) => [
        ...prev,
        {
          ...data.data,
          category:
            data.data.category.charAt(0).toUpperCase() +
            data.data.category.slice(1).toLowerCase(),
        },
      ]);

      resetForm();
    } catch (error) {
      console.error('Create service error:', error);
    }
  };

  /* ================= DELETE ================= */

  const handleDeleteService = async (id: string) => {
    try {
      if (!window.confirm("Are you sure you want to delete this service?")) {
        return;
      }
      const res = await fetch(`/api/services/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete service");
      }

      // Remove from state after successful delete
      setServices((prev) =>
        prev.filter((service) => service._id !== id)
      );

    } catch (error) {
      console.error("Delete service error:", error);
    }
  };


  /* ================= TOGGLE POPULAR ================= */

  const handleTogglePopular = (id: string) => {
    setServices(services.map(service =>
      service._id === id
        ? { ...service, popular: !service.popular }
        : service
    ));
  };

  /* ================= EDIT ================= */

  const handleEditService = (id: string) => {
    const service = services.find(s => s._id === id);
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
      setIsAddingService(true);
    }
  };

  const handleUpdateService = async () => {
    if (!editingService) return;

    try {
      const res = await fetch(`/api/services/${editingService}`, {
        method: "PUT", // or "PATCH" if your route uses PATCH
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          ...newService,
          category: newService.category.toLowerCase() // keep backend lowercase
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update service");
      }

      // Update state with updated service from backend
      setServices((prev) =>
        prev.map((service) =>
          service._id === editingService
            ? {
              ...data,
              category:
                data.category.charAt(0).toUpperCase() +
                data.category.slice(1).toLowerCase(),
            }
            : service
        )
      );

      resetForm();

    } catch (error) {
      console.error("Update service error:", error);
    }
  };


  const resetForm = () => {
    setEditingService(null);
    setIsAddingService(false);
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

  /* ================= GROUP BY CATEGORY ================= */

  const groupedServices = services.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {} as Record<string, Service[]>);

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-secondary/30 to-accent/20 py-8">
      <div className="container mx-auto px-4">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-light mb-2">
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

        {/* ADD / EDIT FORM */}
        {(isAddingService || editingService) && (
          <Card className="p-6 mb-8">
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
                    <Label htmlFor="price">Price (₹)</Label>
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
                <Label htmlFor="category">Category</Label>
                <Select
                  value={newService.category}
                  onValueChange={(value) =>
                    setNewService({ ...newService, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Label htmlFor="image">Image URL</Label>
                <Input
                  value={newService.image}
                  onChange={(e) => setNewService({ ...newService, image: e.target.value })}
                  placeholder="Image URL"
                />
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

                <div className="flex gap-2 mt-4">
                  <Button onClick={editingService ? handleUpdateService : handleAddService}>
                    <Save className="w-4 h-4 mr-2" />
                    {editingService ? 'Update' : 'Save'}
                  </Button>

                  <Button variant="outline" onClick={resetForm}>
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* SERVICES LIST */}
        {/* SERVICES LIST */}
        <div className="grid gap-6">
          {categories.map(category => (
            groupedServices[category] && (
              <Card key={category} className="p-6">
                <h3 className="text-xl font-semibold mb-6">
                  {category} ({groupedServices[category].length})
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groupedServices[category].map(service => (

                    <motion.div
                      key={service._id}
                      whileHover={{ scale: 1.03 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      className="border rounded-lg overflow-hidden hover:shadow-xl transition-shadow bg-white"
                    >

                      {/* IMAGE */}
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
                      
                            <span className="font-medium">₹{service.price}</span>
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
                            onClick={() => handleEditService(service._id)}
                            className="flex-1"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleTogglePopular(service._id)}
                            className={service.popular ? 'text-yellow-600' : ''}
                          >
                            <Star className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteService(service._id)}
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
            )
          ))}
        </div>


      </div>
    </div>
  );
}
