import { useState, useEffect } from 'react';
import { X, Star } from 'lucide-react';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking;
  onSubmit: () => void;
}

export function ReviewModal({
  isOpen,
  onClose,
  booking,
  onSubmit,
}: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');
  const [recommend, setRecommend] = useState<boolean | null>(null);

  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsClosing(false);
    } else if (shouldRender) {
      setIsClosing(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 200); // match exit animation duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  const handleSubmit = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login again");
      return;
    }

    const response = await fetch("/api/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        bookingId: booking.id,
        rating,
        comment: review,
        recommend,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.error || "Failed to submit review");
      return;
    }

    alert("Review submitted successfully!");

    onSubmit();   // refresh bookings
    onClose();    // close modal

  } catch (err) {
    console.error(err);
    alert("Something went wrong");
  }
};


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm ${
          isClosing ? 'animate-backdropExit' : 'animate-backdropEnter'
        }`}
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className={`relative bg-[#FAF8F5] rounded-[20px] shadow-2xl w-full max-w-[500px] overflow-hidden ${
          isClosing ? 'animate-modalExit' : 'animate-modalEnter'
        }`}
      >
        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-stone-200/60 relative">
          <button
            onClick={handleClose}
            className="absolute top-6 right-6 text-stone-400 hover:text-stone-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-semibold text-stone-800 text-left">
            Leave a Review
          </h2>
        </div>

        {/* Content */}
        <div className="px-8 py-6 space-y-6 text-left">
          <div className="space-y-1">
            <h3 className="text-lg font-medium text-stone-800">
              {booking.serviceName}
            </h3>
            <p className="text-stone-600">
              with {booking.stylistName}
            </p>
            <p className="text-sm text-stone-400">
              {booking.date} • {booking.time}
            </p>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-stone-200 to-transparent" />

          {/* Rating */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-stone-700">
              Rate Your Experience
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      star <= (hoverRating || rating)
                        ? 'fill-yellow-600 text-yellow-600'
                        : 'fill-none text-stone-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Review */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-stone-700">
              Your Review
            </label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows={5}
              maxLength={500}
              className="w-full px-4 py-3 bg-white border border-stone-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-yellow-600/30"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 pb-8 pt-4 space-y-3">
          <button
            onClick={handleSubmit}
            disabled={rating === 0}
            className="w-full py-3.5 bg-yellow-600 text-black rounded-full font-medium hover:bg-yellow-700 active:bg-yellow-800 active:scale-[0.97] transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50"
          >
            Submit Review
          </button>

          <button
            onClick={handleClose}
            className="w-full py-3 text-stone-600 rounded-full font-medium hover:bg-stone-100 transition-colors border border-stone-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
