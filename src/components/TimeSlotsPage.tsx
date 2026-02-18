import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Clock, Plus, Edit, Trash2, Calendar, Save, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from './ui/select';

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  duration: number;
  available: boolean;
  dayOfWeek: string;
}

export function TimeSlotsPage() {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isAddingSlot, setIsAddingSlot] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [newSlot, setNewSlot] = useState({
    dayOfWeek: 'Monday',
    startTime: '',
    endTime: '',
    duration: 60
  });

  const daysOfWeek = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
  ];

  const durations = [30, 45, 60, 90, 120];

  /* ================= FETCH SLOTS ================= */
  const fetchTimeSlots = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await fetch('/api/timeSlot/admin', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      // ✅ normalize response
      const slots: TimeSlot[] = Array.isArray(data)
        ? data
        : Array.isArray(data.slots)
          ? data.slots
          : [];

      setTimeSlots(slots);
    } catch (err) {
      console.error('Error fetching time slots', err);
      setTimeSlots([]);
    }
  };

  useEffect(() => {
    fetchTimeSlots();
  }, [refresh]);

  const handleToggleAvailability = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`/api/timeSlot/admin/${id}/toggle`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (data.success) {
        setTimeSlots(prev =>
          prev.map(slot =>
            slot._id === id
              ? { ...slot, available: data.slot.available }
              : slot
          )
        );
      }
    } catch (err) {
      console.error("Failed to toggle availability", err);
    }
  };



  /* ================= ADD SLOT ================= */
  const handleAddSlot = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await fetch('/api/timeSlot/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newSlot)
      });

      const data = await res.json();

      const createdSlots: TimeSlot[] = Array.isArray(data)
        ? data
        : data.slot
          ? [data.slot]
          : [];

      setTimeSlots(prev => [...prev, ...createdSlots]);
      setIsAddingSlot(false);
      setRefresh(prev => !prev); // ✅ trigger refetch

      setNewSlot({
        dayOfWeek: 'Monday',
        startTime: '',
        endTime: '',
        duration: 60
      });
    } catch (err) {
      console.error('Failed to create slot', err);
    }
  };

  /* ================= DELETE SLOT ================= */
  const handleDeleteSlot = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`/api/timeSlot/admin/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (data.success) {
        setTimeSlots(prev => prev.filter(slot => slot._id !== id));
      }
    } catch (err) {
      console.error("Failed to delete slot", err);
    }
  };
  /* ================= GROUP BY DAY ================= */
  const groupedSlots = timeSlots.reduce((acc, slot) => {
    if (!acc[slot.dayOfWeek]) acc[slot.dayOfWeek] = [];
    acc[slot.dayOfWeek].push(slot);
    return acc;
  }, {} as Record<string, TimeSlot[]>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-secondary/30 py-8">
      <div className="container mx-auto px-4">

        {/* HEADER */}
        <div className="flex justify-between mb-6">
          <h1 className="text-3xl font-light">Time Slot Management</h1>
          <Button onClick={() => setIsAddingSlot(true)}>
            <Plus className="w-4 h-4 mr-2" /> Add Slot
          </Button>
        </div>

        {/* ADD SLOT FORM */}
        {isAddingSlot && (
          <Card className="p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

              <div>
                <Label>Day</Label>
                <Select
                  value={newSlot.dayOfWeek}
                  onValueChange={v => setNewSlot({ ...newSlot, dayOfWeek: v })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {daysOfWeek.map(d => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Start Time</Label>
                <Input
                  type="time"
                  value={newSlot.startTime}
                  onChange={e => setNewSlot({ ...newSlot, startTime: e.target.value })}
                />
              </div>

              <div>
                <Label>End Time</Label>
                <Input
                  type="time"
                  value={newSlot.endTime}
                  onChange={e => setNewSlot({ ...newSlot, endTime: e.target.value })}
                />
              </div>

              <div>
                <Label>Duration</Label>
                <Select
                  value={String(newSlot.duration)}
                  onValueChange={v =>
                    setNewSlot({ ...newSlot, duration: Number(v) })
                  }
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {durations.map(d => (
                      <SelectItem key={d} value={String(d)}>
                        {d} min
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 items-end">
                <Button onClick={handleAddSlot}>
                  <Save className="w-4 h-4 mr-2" /> Save
                </Button>
                <Button variant="outline" onClick={() => setIsAddingSlot(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

            </div>
          </Card>
        )}

        {/* SLOTS LIST */}
        {daysOfWeek.map(day => (
          <Card key={day} className="p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" /> {day}
            </h3>

            {groupedSlots[day]?.length ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupedSlots[day]
                  .sort((a, b) => a.startTime.localeCompare(b.startTime))
                  .map(slot => (
                    <div key={slot.id} className="border rounded p-4">
                      <div className="flex justify-between">
                        <span className="font-medium">
                          {slot.startTime} – {slot.endTime}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteSlot(slot._id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Duration: {slot.duration} min
                      </p>
                      <div>

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleToggleAvailability(slot._id)}
                          className={slot.available ? "text-primary" : "text-destructive"}
                        >
                          {slot.available ? "Available" : "Unavailable"}
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No slots for {day}</p>
            )}

          </Card>
        ))}
      </div>
    </div>
  );
}
