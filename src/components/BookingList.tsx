import { Calendar, Clock, Star, CheckCircle2 } from 'lucide-react';

interface BookingsListProps {
  bookings: Booking[];
  onSelectBooking: (booking: Booking) => void;
}

export function BookingsList({ bookings, onSelectBooking }: BookingsListProps) {
  return (
    <div className="space-y-4">
      {bookings.map((booking, index) => (
        <div
          key={booking.id}
          style={{ animationDelay: `${index * 80}ms` }}
          className="animate-cardEnter opacity-0
                     bg-[#FAF8F5] rounded-2xl p-6 
                     shadow-md hover:shadow-lg 
                     transition-all duration-300
                     border border-stone-200/50
                     hover:-translate-y-1"
        >
          <div className="flex items-start justify-between gap-4">

            {/* Left Section */}
            <div className="flex-1 text-left">

              <div className="mb-2">
                <h3 className="text-xl font-semibold text-stone-800 leading-tight">
                  {booking.serviceName}
                </h3>
                <p className="text-stone-600 leading-tight">
                  with {booking.stylistName}
                </p>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-stone-500 mt-3">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>{booking.date}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>{booking.time}</span>
                </div>
                <div className="font-medium text-stone-700">
                  {booking.price}
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex flex-col items-end gap-3">
              {booking.hasReview ? (
                <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-sm font-medium">Reviewed</span>
                </div>
              ) : (
                <button
                  onClick={() => onSelectBooking(booking)}
                  className="flex items-center gap-2 px-2 py-2.5 
           bg-primary text-primary-foreground 
           rounded-full font-medium 
           hover:opacity-90 transition-all shadow-md hover:shadow-lg"
                >
                  <Star className="w-4 h-4" />
                  <span>Leave Review</span>
                </button>
              )}
            </div>

          </div>
        </div>
      ))}
    </div>
  );
}
