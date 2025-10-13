import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Edit, Trash2, Save, X, Package, DollarSign, Percent, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';

interface ServicePackage {
  id: string;
  name: string;
  description: string;
  services: string[];
  originalPrice: number;
  discountedPrice: number;
  discount: number;
  duration: string;
  popular: boolean;
  category: string;
}

export function AdminPackagesPage() {
  const [packages, setPackages] = useState<ServicePackage[]>([
    {
      id: '1',
      name: 'Bridal Package',
      description: 'Complete bridal makeover with hair, makeup, and nails',
      services: ['Bridal Hair Styling', 'Professional Makeup', 'Manicure & Pedicure'],
      originalPrice: 350,
      discountedPrice: 280,
      discount: 20,
      duration: '4 hours',
      popular: true,
      category: 'Special Occasions'
    },
    {
      id: '2',
      name: 'Relaxation Retreat',
      description: 'Full day of pampering and relaxation',
      services: ['Full Body Massage', 'Facial Treatment', 'Hair Treatment'],
      originalPrice: 300,
      discountedPrice: 240,
      discount: 20,
      duration: '6 hours',
      popular: false,
      category: 'Wellness'
    }
  ]);

  const [isAddingPackage, setIsAddingPackage] = useState(false);
  const [editingPackage, setEditingPackage] = useState<string | null>(null);
  const [newPackage, setNewPackage] = useState({
    name: '',
    description: '',
    services: [''],
    originalPrice: 0,
    discountedPrice: 0,
    discount: 0,
    duration: '',
    popular: false,
    category: 'Special Occasions'
  });

  const categories = ['Special Occasions', 'Wellness', 'Hair Care', 'Skincare', 'Couples'];
  const availableServices = [
    'Classic Cut & Style',
    'Color Treatment',
    'Bridal Hair Styling',
    'Professional Makeup',
    'Facial Treatment',
    'Full Body Massage',
    'Manicure & Pedicure',
    'Hair Treatment',
    'Deep Cleansing Facial',
    'Anti-Aging Treatment'
  ];

  const handleAddPackage = () => {
    const discount = Math.round(((newPackage.originalPrice - newPackage.discountedPrice) / newPackage.originalPrice) * 100);
    const packageData: ServicePackage = {
      id: Date.now().toString(),
      ...newPackage,
      discount,
      services: newPackage.services.filter(service => service.trim() !== '')
    };
    setPackages([...packages, packageData]);
    resetForm();
    setIsAddingPackage(false);
  };

  const handleDeletePackage = (id: string) => {
    setPackages(packages.filter(pkg => pkg.id !== id));
  };

  const handleTogglePopular = (id: string) => {
    setPackages(packages.map(pkg => 
      pkg.id === id ? { ...pkg, popular: !pkg.popular } : pkg
    ));
  };

  const handleEditPackage = (id: string) => {
    const pkg = packages.find(p => p.id === id);
    if (pkg) {
      setNewPackage({
        name: pkg.name,
        description: pkg.description,
        services: pkg.services,
        originalPrice: pkg.originalPrice,
        discountedPrice: pkg.discountedPrice,
        discount: pkg.discount,
        duration: pkg.duration,
        popular: pkg.popular,
        category: pkg.category
      });
      setEditingPackage(id);
    }
  };

  const handleUpdatePackage = () => {
    const discount = Math.round(((newPackage.originalPrice - newPackage.discountedPrice) / newPackage.originalPrice) * 100);
    setPackages(packages.map(pkg => 
      pkg.id === editingPackage 
        ? { 
            ...pkg, 
            ...newPackage, 
            discount,
            services: newPackage.services.filter(service => service.trim() !== '')
          }
        : pkg
    ));
    setEditingPackage(null);
    resetForm();
  };

  const resetForm = () => {
    setNewPackage({
      name: '',
      description: '',
      services: [''],
      originalPrice: 0,
      discountedPrice: 0,
      discount: 0,
      duration: '',
      popular: false,
      category: 'Special Occasions'
    });
  };

  const addServiceField = () => {
    setNewPackage({
      ...newPackage,
      services: [...newPackage.services, '']
    });
  };

  const removeServiceField = (index: number) => {
    setNewPackage({
      ...newPackage,
      services: newPackage.services.filter((_, i) => i !== index)
    });
  };

  const updateService = (index: number, value: string) => {
    const updatedServices = [...newPackage.services];
    updatedServices[index] = value;
    setNewPackage({
      ...newPackage,
      services: updatedServices
    });
  };

  const groupedPackages = packages.reduce((acc, pkg) => {
    if (!acc[pkg.category]) {
      acc[pkg.category] = [];
    }
    acc[pkg.category].push(pkg);
    return acc;
  }, {} as Record<string, ServicePackage[]>);

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
                Package Management
              </h1>
              <p className="text-muted-foreground">
                Create and manage service packages and special offers
              </p>
            </div>
            <Button
              onClick={() => setIsAddingPackage(true)}
              className="bg-gradient-to-r from-primary to-accent text-primary-foreground"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Package
            </Button>
          </div>
        </motion.div>

        {/* Add/Edit Package Form */}
        {(isAddingPackage || editingPackage) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                {editingPackage ? 'Edit Package' : 'Add New Package'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Package Name</Label>
                    <Input
                      value={newPackage.name}
                      onChange={(e) => setNewPackage({ ...newPackage, name: e.target.value })}
                      placeholder="Enter package name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      value={newPackage.description}
                      onChange={(e) => setNewPackage({ ...newPackage, description: e.target.value })}
                      placeholder="Enter package description"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={newPackage.category}
                      onValueChange={(value) => setNewPackage({ ...newPackage, category: value })}
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
                    <Label htmlFor="duration">Duration</Label>
                    <Input
                      value={newPackage.duration}
                      onChange={(e) => setNewPackage({ ...newPackage, duration: e.target.value })}
                      placeholder="e.g., 3 hours, Half day"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label>Included Services</Label>
                    {newPackage.services.map((service, index) => (
                      <div key={index} className="flex space-x-2 mt-2">
                        <Select
                          value={service}
                          onValueChange={(value) => updateService(index, value)}
                        >
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Select a service" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableServices.map(availableService => (
                              <SelectItem key={availableService} value={availableService}>
                                {availableService}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeServiceField(index)}
                          disabled={newPackage.services.length === 1}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addServiceField}
                      className="mt-2"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Service
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="originalPrice">Original Price ($)</Label>
                      <Input
                        type="number"
                        value={newPackage.originalPrice}
                        onChange={(e) => setNewPackage({ ...newPackage, originalPrice: parseFloat(e.target.value) })}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="discountedPrice">Discounted Price ($)</Label>
                      <Input
                        type="number"
                        value={newPackage.discountedPrice}
                        onChange={(e) => setNewPackage({ ...newPackage, discountedPrice: parseFloat(e.target.value) })}
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="popular"
                      checked={newPackage.popular}
                      onChange={(e) => setNewPackage({ ...newPackage, popular: e.target.checked })}
                      className="rounded border-primary"
                    />
                    <Label htmlFor="popular">Mark as Popular Package</Label>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2 mt-6">
                <Button 
                  onClick={editingPackage ? handleUpdatePackage : handleAddPackage}
                  className="bg-gradient-to-r from-primary to-accent text-primary-foreground"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {editingPackage ? 'Update' : 'Save'} Package
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsAddingPackage(false);
                    setEditingPackage(null);
                    resetForm();
                  }}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Packages by Category */}
        <div className="grid gap-6">
          {categories.map((category, categoryIndex) => (
            groupedPackages[category] && (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: categoryIndex * 0.1 }}
              >
                <Card className="p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <Package className="w-5 h-5 text-primary" />
                    <h3 className="text-xl font-semibold">{category}</h3>
                    <span className="text-sm text-muted-foreground">
                      ({groupedPackages[category]?.length || 0} packages)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groupedPackages[category].map((pkg) => (
                      <motion.div
                        key={pkg.id}
                        className="border rounded-lg p-6 hover:shadow-lg transition-shadow"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-semibold text-lg">{pkg.name}</h4>
                          <div className="flex space-x-1">
                            {pkg.popular && (
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            )}
                            <Badge variant="secondary">
                              <Percent className="w-3 h-3 mr-1" />
                              {pkg.discount}% OFF
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {pkg.description}
                        </p>
                        <div className="space-y-3 mb-4">
                          <div className="text-sm">
                            <span className="font-medium">Duration:</span> {pkg.duration}
                          </div>
                          <div className="space-y-1">
                            <span className="text-sm font-medium">Included Services:</span>
                            <ul className="text-xs text-muted-foreground space-y-1">
                              {pkg.services.map((service, index) => (
                                <li key={index} className="flex items-center">
                                  <span className="w-1 h-1 bg-primary rounded-full mr-2"></span>
                                  {service}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-semibold text-primary">
                              ${pkg.discountedPrice}
                            </span>
                            <span className="text-sm text-muted-foreground line-through">
                              ${pkg.originalPrice}
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditPackage(pkg.id)}
                            className="flex-1"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleTogglePopular(pkg.id)}
                            className={pkg.popular ? 'text-yellow-600' : ''}
                          >
                            <Star className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeletePackage(pkg.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
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