import React from "react";
import Link from "next/link";

const QuickLinks = () => {
  return (
    <section className="bg-white pt-14 md:pt-8 pb-6 md:pb-10">
      <div className="mx-auto w-full max-w-7xl px-5 md:px-10">
        <h1 className="text-primary text-center text-base md:text-xl/tight md:text-left font-semibold">
          Discover what&apos;s happening near you
        </h1>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5 mt-10 md:mt-12">
          {[
            {
              title: "Concerts",
              description: "Enjoy live music and unforgettable performances",
              image:
                "https://img.freepik.com/free-photo/man-with-dreads-representing-rastafari-movement_23-2151532087.jpg?uid=R137948985&ga=GA1.1.1977978369.1744267390&semt=ais_hybrid&w=740",
            },
            {
              title: "Nightlife",
              description:
                "Experience vibrant nightlife with clubs and exclusive events",
              image:
                "https://img.freepik.com/free-photo/group-colombian-male-friends-spending-time-together-having-fun_23-2151356456.jpg?uid=R137948985&ga=GA1.1.1977978369.1744267390&semt=ais_items_boosted&w=740",
            },
            {
              title: "Exhibitions",
              description:
                "Explore inspiring art galleries and cultural exhibitions",
              image:
                "https://img.freepik.com/free-photo/portrait-man-with-fantasy-unicorn-animal-cinematic-atmosphere_23-2151586587.jpg?uid=R137948985&ga=GA1.1.1977978369.1744267390&semt=ais_hybrid&w=740",
            },
            {
              title: "Conference",
              description:
                "Join industry leaders for insightful conferences and networking",
              image:
                "https://img.freepik.com/free-photo/women-s-panel-discussion_23-2151932835.jpg?uid=R137948985&ga=GA1.1.1977978369.1744267390&semt=ais_items_boosted&w=740",
            },
            {
              title: "Wellness",
              description:
                "Stay active with fitness classes and wellness retreats",
              image:
                "https://img.freepik.com/free-photo/view-children-practicing-health-wellness-activity_23-2151402036.jpg?uid=R137948985&ga=GA1.1.1977978369.1744267390&semt=ais_hybrid&w=740",
            },
            {
              title: "Workshops",
              description: "Learn new skills through workshops and classes",
              image:
                "https://img.freepik.com/premium-photo/man-speaking-front-large-audience_1276913-30195.jpg?uid=R137948985&ga=GA1.1.1977978369.1744267390&semt=ais_items_boosted&w=740",
            },
            {
              title: "Games",
              description:
                "Compete in exciting games and tournaments for all ages",
              image:
                "https://img.freepik.com/free-photo/portrait-athlete-competing-olympic-games-tournament_23-2151470915.jpg?uid=R137948985&ga=GA1.1.1977978369.1744267390&semt=ais_items_boosted&w=740",
            },
            {
              title: "Religious",
              description:
                "Participate in spiritual events and religious gatherings",
              image:
                "https://img.freepik.com/premium-photo/woman-sits-pew-church-congregation-with-altar-other-attendees-backg_924727-83293.jpg?uid=R137948985&ga=GA1.1.1977978369.1744267390&semt=ais_items_boosted&w=740",
            },
          ].map((item, index) => (
            <Link href="/" key={index} className="cursor-pointer">
              <article className="quick-link-card group">
                <img
                  alt={item.title}
                  src={item.image}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="relative pt-40">
                  <div className="p-4">
                    <h1 className="text-white text-xs md:text-sm font-semibold mb-1 group-hover:-translate-y-9 transition-transform duration-300">
                      {item.title}
                    </h1>
                    <p className="text-white/80 text-xs/normal absolute bottom-0 group-hover:bottom-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      {item.description}
                    </p>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickLinks;
