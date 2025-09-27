import React from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { StarIcon } from "@phosphor-icons/react";

const SuggestedEvents = () => {
  const relatedEvents = [
    {
      title: "Tech Innovation Summit 2024",
      slug: "tech-innovation-summit-2024",
      image:
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop",
      category: "Conference",
      price: "₦25,000",
      rating: 4.8,
    },
    {
      title: "Startup Networking Event",
      slug: "startup-networking-event",
      image:
        "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=300&fit=crop",
      category: "Networking",
      price: "₦15,000",
      rating: 4.6,
    },
    {
      title: "Digital Marketing Workshop",
      slug: "digital-marketing-workshop",
      image:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
      category: "Workshop",
      price: "₦12,000",
      rating: 4.9,
    },
  ];

  return (
    <div className="bg-white space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-[15px] font-semibold text-primary">
            Suggested Events
          </h4>
          <p className="text-gray-600 text-xs mt-1">
            Discover more amazing events
          </p>
        </div>
      </div>

      <div>
        {relatedEvents.map((item, index) => (
          <div key={index} className="group cursor-pointer">
            <div className="relative overflow-hidden rounded-lg mb-3">
              <Image
                src={item.image}
                alt={item.title}
                width={300}
                height={200}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 right-3">
                <Badge className="bg-white/90 text-gray-700 text-xs">
                  {item.category}
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 group-hover:text-primary transition-colors">
                {item.title}
              </h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <StarIcon className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs text-gray-600">{item.rating}</span>
                </div>
                <span className="font-semibold text-primary text-sm">
                  {item.price}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestedEvents;