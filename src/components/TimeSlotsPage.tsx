import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Clock, Plus, Edit, Trash2, Calendar, Save, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface TimeSlot {
  id: string;
  time: string;
  duration: number;
  available: boolean;
  dayOfWeek: string;
}

export function TimeSlotsPage() {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    { id: '1', time: '09:00', duration: 60, available: true, dayOfWeek: 'Monday' },
    { id: '2', time: '10:00', duration: 60, available: true, dayOfWeek: 'Monday' },
    { id: '3', time: '11:00', duration: 60, available: true, dayOfWeek: 'Monday' },
    { id: '4', time: '14:00', duration: 90, available: true, dayOfWeek: 'Monday' },
    { id: '5', time: '15:30', duration: 90, available: false, dayOfWeek: 'Monday' },
  ]);

  const [isAddingSlot, setIsAddingSlot] = useState(false);
  const [editingSlot, setEditingSlot] = useState<string | null>(null);
  const [newSlot, setNewSlot] = useState({
    time: '',
    duration: 60,
    dayOfWeek: 'Monday',
    available: true
  });

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const durations = [30, 45, 60, 90, 120];

  const handleAddSlot = () => {
    const slot: TimeSlot = {
      id: Date.now().toString(),
      ...newSlot
    };
    setTimeSlots([...timeSlots, slot]);
    setNewSlot({ time: '', duration: 60, dayOfWeek: 'Monday', available: true });
    setIsAddingSlot(false);
  };

  const handleDeleteSlot = (id: string) => {
    setTimeSlots(timeSlots.filter(slot => slot.id !== id));
  };

  const handleToggleAvailability = (id: string) => {
    setTimeSlots(timeSlots.map(slot => 
      slot.id === id ? { ...slot, available: !slot.available } : slot
    ));
  };

  const groupedSlots = timeSlots.reduce((acc, slot) => {
    if (!acc[slot.dayOfWeek]) {
      acc[slot.dayOfWeek] = [];
    }
    acc[slot.dayOfWeek].push(slot);
    return acc;
  }, {} as Record<string, TimeSlot[]>);

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
                Time Slot Management
              </h1>
              <p className="text-muted-foreground">
                Manage appointment time slots and availability
              </p>
            </div>
            <Button
              onClick={() => setIsAddingSlot(true)}
              className="bg-gradient-to-r from-primary to-accent text-primary-foreground"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Time Slot
            </Button>
          </div>
        </motion.div>

        {/* Add New Slot Form */}
        {isAddingSlot && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Add New Time Slot</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="day">Day of Week</Label>
                  <Select
                    value={newSlot.dayOfWeek}
                    onValueChange={(value) => setNewSlot({ ...newSlot, dayOfWeek: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {daysOfWeek.map(day => (
                        <SelectItem key={day} value={day}>{day}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="time">Time</Label>
                  <Input
                    type="time"
                    value={newSlot.time}
                    onChange={(e) => setNewSlot({ ...newSlot, time: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Select
                    value={newSlot.duration.toString()}
                    onValueChange={(value) => setNewSlot({ ...newSlot, duration: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {durations.map(duration => (
                        <SelectItem key={duration} value={duration.toString()}>
                          {duration} minutes
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end space-x-2">
                  <Button onClick={handleAddSlot} className="flex-1">
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="outline" onClick={() => setIsAddingSlot(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Time Slots by Day */}
        <div className="grid gap-6">
          {daysOfWeek.map((day, dayIndex) => (
            <motion.div
              key={day}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: dayIndex * 0.1 }}
            >
              <Card className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Calendar className="w-5 h-5 text-primary" />
                  <h3 className="text-xl font-semibold">{day}</h3>
                  <span className="text-sm text-muted-foreground">
                    ({groupedSlots[day]?.length || 0} slots)
                  </span>
                </div>

                {groupedSlots[day]?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {groupedSlots[day]
                      .sort((a, b) => a.time.localeCompare(b.time))
                      .map((slot) => (
                        <motion.div
                          key={slot.id}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            slot.available
                              ? 'border-primary/20 bg-white'
                              : 'border-destructive/20 bg-destructive/5'
                          }`}
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4 text-primary" />
                              <span className="font-medium">{slot.time}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleToggleAvailability(slot.id)}
                                className={slot.available ? 'text-primary' : 'text-destructive'}
                              >
                                {slot.available ? 'Available' : 'Unavailable'}
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setEditingSlot(slot.id)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteSlot(slot.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="mt-2 text-sm text-muted-foreground">
                            Duration: {slot.duration} minutes
                          </div>
                        </motion.div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No time slots configured for {day}</p>
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}