import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { StarIcon } from "@phosphor-icons/react";
import React from "react";

const EventsPageReviews = () => {
  const staticReviews = [
    {
      name: "Sarah Johnson",
      rating: 5,
      text: "Amazing event! The speaker was engaging and the content was very informative. Would definitely attend again.",
      date: "2 days ago",
      avatar: "SJ",
    },
    {
      name: "Michael Chen",
      rating: 4,
      text: "Great experience overall. The venue was perfect and everything was well-organized.",
      date: "1 week ago",
      avatar: "MC",
    },
    {
      name: "Emily Davis",
      rating: 5,
      text: "Fantastic event with excellent networking opportunities. Highly recommend!",
      date: "2 weeks ago",
      avatar: "ED",
    },
  ];

  return (
    <div className="bg-white space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-[15px] font-semibold text-primary">Reviews</h4>
          <p className="text-gray-600 text-xs mt-1">
            See what others are saying about this event
          </p>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="col-span-1 text-center">
          <div className="flex items-center justify-center gap-1 mb-2">
            <span className="text-2xl font-bold text-gray-900">4.8</span>
            <StarIcon className="w-5 h-5 fill-yellow-400 text-yellow-400" />
          </div>
          <p className="text-gray-600 text-xs">20 reviews</p>
        </div>
        <div className="col-span-1 md:col-span-4 space-y-3">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center gap-3">
              <span className="text-sm text-gray-600 w-8">{rating}★</span>
              <Progress
                value={
                  rating === 5 ? 80 : rating === 4 ? 15 : rating === 3 ? 5 : 0
                }
                className="flex-1 h-2"
              />
              <span className="text-xs text-gray-500 w-8">
                {rating === 5 ? 16 : rating === 4 ? 3 : rating === 3 ? 1 : 0}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Review Cards */}
      <div className="space-y-6">
        {staticReviews.map((review, index) => (
          <div key={index}>
            <div className="flex items-start gap-4">
              <div className="size-8 bg-primary text-white rounded-full flex items-center justify-center text-xs font-semibold">
                {review.avatar}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="text-xs font-semibold text-gray-900">
                    {review.name}
                  </h5>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon
                        key={star}
                        className={`w-3 h-3 ${
                          star <= review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed mb-2">
                  {review.text}
                </p>
                <p className="text-gray-500 text-[11px]">{review.date}</p>
              </div>
            </div>
            {index < staticReviews.length - 1 && <Separator className="mt-6" />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsPageReviews;