import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Users, DollarSign, TrendingUp, Clock, Settings, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface AdminDashboardProps {
  setCurrentPage: (page: string) => void;
}

export function AdminDashboard({ setCurrentPage }: AdminDashboardProps) {
  const [selectedTab, setSelectedTab] = useState('overview');

  const stats = [
    { icon: DollarSign, label: 'Today\'s Revenue', value: '$2,850', change: '+12%', color: 'text-green-600' },
    { icon: Users, label: 'Total Clients', value: '156', change: '+8%', color: 'text-blue-600' },
    { icon: Calendar, label: 'Appointments Today', value: '24', change: '+5%', color: 'text-purple-600' },
    { icon: TrendingUp, label: 'Monthly Growth', value: '18%', change: '+3%', color: 'text-orange-600' }
  ];

  const todayAppointments = [
    { id: 1, time: '9:00 AM', client: 'Sarah Johnson', service: 'Balayage Highlights', stylist: 'Emma Rodriguez', status: 'confirmed', duration: 150 },
    { id: 2, time: '10:30 AM', client: 'Maria Garcia', service: 'Precision Cut', stylist: 'Sarah Chen', status: 'in-progress', duration: 60 },
    { id: 3, time: '12:00 PM', client: 'Amanda Chen', service: 'Bridal Package', stylist: 'Maria Santos', status: 'confirmed', duration: 240 },
    { id: 4, time: '2:30 PM', client: 'Jessica Williams', service: 'Color Transformation', stylist: 'Alex Thompson', status: 'confirmed', duration: 120 },
    { id: 5, time: '4:00 PM', client: 'Rachel Thompson', service: 'Spa Facial', stylist: 'Maria Santos', status: 'confirmed', duration: 90 }
  ];

  const services = [
    { id: 1, name: 'Precision Haircut', price: 85, duration: 60, category: 'Hair', active: true },
    { id: 2, name: 'Color Transformation', price: 150, duration: 120, category: 'Hair', active: true },
    { id: 3, name: 'Balayage Highlights', price: 180, duration: 150, category: 'Hair', active: true },
    { id: 4, name: 'Signature Facial', price: 120, duration: 90, category: 'Spa', active: true },
    { id: 5, name: 'Relaxation Massage', price: 110, duration: 60, category: 'Spa', active: true }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-secondary/30 to-accent/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-light text-foreground mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back! Here's what's happening at MK Salon today.
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline"
                className="border-primary/20 hover:border-primary"
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button 
                onClick={() => setCurrentPage('booking')}
                className="bg-gradient-to-r from-primary to-accent text-primary-foreground border-0"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Appointment
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="p-6 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                      <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
                      <p className={`text-sm ${stat.color} flex items-center mt-1`}>
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {stat.change}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Main Content Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
            <TabsList className="grid w-full lg:w-auto lg:inline-grid grid-cols-3 lg:grid-cols-3 bg-white/80 backdrop-blur-sm">
              <TabsTrigger value="overview">Today's Schedule</TabsTrigger>
              <TabsTrigger value="appointments">All Appointments</TabsTrigger>
              <TabsTrigger value="services">Manage Services</TabsTrigger>
            </TabsList>

            {/* Today's Schedule */}
            <TabsContent value="overview" className="space-y-6">
              <Card className="p-6 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-foreground">Today's Appointments</h3>
                  <Badge className="bg-primary/10 text-primary border-primary/20">
                    {todayAppointments.length} appointments
                  </Badge>
                </div>

                <div className="space-y-4">
                  {todayAppointments.map((appointment, index) => (
                    <motion.div
                      key={appointment.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-secondary/30 transition-colors"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <div className="text-sm font-medium text-foreground">{appointment.time}</div>
                          <div className="text-xs text-muted-foreground">{appointment.duration}min</div>
                        </div>
                        <div className="w-px h-12 bg-border" />
                        <div>
                          <h4 className="font-medium text-foreground">{appointment.client}</h4>
                          <p className="text-sm text-muted-foreground">{appointment.service}</p>
                          <p className="text-xs text-muted-foreground">with {appointment.stylist}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status}
                        </Badge>
                        <div className="flex space-x-1">
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            {/* All Appointments */}
            <TabsContent value="appointments" className="space-y-6">
              <Card className="p-6 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-foreground">Appointment Management</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="border-primary/20 hover:border-primary">
                      <Calendar className="w-4 h-4 mr-2" />
                      Filter by Date
                    </Button>
                    <Button size="sm" className="bg-gradient-to-r from-primary to-accent text-primary-foreground border-0">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Appointment
                    </Button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Time</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Stylist</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {todayAppointments.map((appointment) => (
                        <TableRow key={appointment.id}>
                          <TableCell className="font-medium">{appointment.time}</TableCell>
                          <TableCell>{appointment.client}</TableCell>
                          <TableCell>{appointment.service}</TableCell>
                          <TableCell>{appointment.stylist}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(appointment.status)}>
                              {appointment.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-destructive">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            </TabsContent>

            {/* Services Management */}
            <TabsContent value="services" className="space-y-6">
              <Card className="p-6 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-foreground">Service Management</h3>
                  <Button className="bg-gradient-to-r from-primary to-accent text-primary-foreground border-0">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Service
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Service Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {services.map((service) => (
                        <TableRow key={service.id}>
                          <TableCell className="font-medium">{service.name}</TableCell>
                          <TableCell>{service.category}</TableCell>
                          <TableCell className="text-primary font-semibold">${service.price}</TableCell>
                          <TableCell>{service.duration} min</TableCell>
                          <TableCell>
                            <Badge className={service.active ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-800 border-gray-200'}>
                              {service.active ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-destructive">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}