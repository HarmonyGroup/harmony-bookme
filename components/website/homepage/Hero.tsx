"use client";
import React from "react";
// import Link from "next/link";
import Image from "next/image";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card } from "@/components/ui/card";
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   CheersIcon,
//   PuzzlePieceIcon,
//   BuildingsIcon,
//   PopcornIcon,
//   MartiniIcon,
//   AirplaneIcon
// } from "@phosphor-icons/react";
import BG from "@/public/assets/dreamy-atmosphere-pastel-colored-scene-travel-content.jpg";

const Hero = () => {
  // const [activeTab, setActiveTab] = useState("events");

  // const searchTabs = [
  //   { id: "events", label: "Events", icon: MartiniIcon },
  //   { id: "leisure", label: "Leisure", icon: PuzzlePieceIcon },
  //   { id: "accommodations", label: "Stay", icon: BuildingsIcon },
  //   { id: "movies", label: "Movies", icon: PopcornIcon },
  //   { id: "travel", label: "Travel", icon: AirplaneIcon },
  //   // { id: "visa", label: "Visa Application", icon: FileText },
  // ];

  return (
    <div>
      {/* Hero Section with Background */}
      <section className="relative min-h-[30vh] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src={BG}
            alt="Travel Background"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-primary/65" />
        </div>
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white">
              Bookings Made Easy
            </h1>
          </div>
        </div>
      </section>

      {/* <section className="relative -mt-28 !z-50 px-4">
        <div className="relative grid grid-cols-5 bg-white max-w-3xl mx-auto rounded-lg shadow-sm !z-20 gap-4 p-3">
          {searchTabs?.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <div
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center gap-2 border-primary p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-5 h-5 block " />
                <span className="hidden sm:inline text-[13px] font-medium">
                  {tab.label}
                </span>
              </div>
            );
          })}
        </div>
        <div className="max-w-4xl mx-auto bg-white rounded-lg light-shadow p-6 pt-14 -mt-8">
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="flex-1">
              <div className="relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.8"
                  stroke="currentColor"
                  className="size-[15px] absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                  />
                </svg>
                <Input
                  placeholder="Destination"
                  className="!ps-8 !py-6 bg-muted !text-xs font-normal placeholder:text-gray-600 placeholder:text-xs placeholder:font-normal border-none shadow-none focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
                />
              </div>
            </div>

            <div className="flex-1">
              <div className="flex gap-2.5 items-center">
                <div className="relative flex-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.8"
                    stroke="currentColor"
                    className="size-[15px] absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                    />
                  </svg>
                  <Input
                    placeholder="Departure"
                    className="!ps-8 !py-6 bg-muted !text-xs font-normal placeholder:text-gray-600 placeholder:text-xs placeholder:font-normal border-none shadow-none focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
                  />
                </div>

                <div className="relative flex-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.8"
                    stroke="currentColor"
                    className="size-[15px] absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                    />
                  </svg>
                  <Input
                    placeholder="Return"
                    className="!ps-8 !py-6 bg-muted !text-xs font-normal placeholder:text-gray-600 placeholder:text-xs placeholder:font-normal border-none shadow-none focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
                  />
                </div>
              </div>
            </div>

            <Button className="bg-primary hover:bg-primary/80 text-white text-xs font-medium transition-colors duration-300 !py-6 !px-8 cursor-pointer">
              Search
            </Button>
          </div>
        </div>
      </section> */}

      {/* <Card className="max-w-4xl mx-auto bg-white/95 backdrop-blur-sm shadow-2xl -mt-24">
        <div className="p-6">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4 mb-6 bg-gray-100">
              {searchTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="flex items-center gap-2 text-xs sm:text-sm data-[state=active]:bg-orange-500 data-[state=active]:text-white"
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Destination"
                    className="pl-10 h-12 text-lg"
                    defaultValue="Kuala Lumpur"
                  />
                </div>
              </div>

              <div className="flex-1">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      placeholder="Departure"
                      className="pl-10 h-12"
                      defaultValue="28 Mar 2022"
                    />
                  </div>
                  <div className="flex items-center text-gray-400">→</div>
                  <div className="relative flex-1">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      placeholder="Return"
                      className="pl-10 h-12"
                      defaultValue="28 Mar 2022"
                    />
                  </div>
                </div>
              </div>

              <Button className="bg-orange-500 hover:bg-orange-600 text-white h-12 px-8 text-lg font-semibold">
                <Search className="w-5 h-5 mr-2" />
                Search
              </Button>
            </div>
          </Tabs>
        </div>
      </Card> */}

      {/* Promotional Banners Carousel */}
      {/* <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <Button variant="outline" size="icon" className="rounded-full">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="flex gap-4">
              {promotionalBanners.map((banner) => (
                <Card
                  key={banner.id}
                  className={`${banner.bgColor} text-white p-6 flex-1 min-w-[300px] relative overflow-hidden`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="bg-blue-900 text-white px-3 py-1 rounded-full text-sm font-semibold inline-block mb-3">
                        {banner.badge}
                      </div>
                      <h3 className="text-xl font-bold mb-2">{banner.title}</h3>
                      <div className="flex items-center text-sm">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>oppa travel</span>
                      </div>
                    </div>
                    <div className="text-6xl opacity-20">
                      {banner.image}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <Button variant="outline" size="icon" className="rounded-full">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section> */}

      {/* Destinations Grid */}
      {/* <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Malaysia City</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {destinations.map((destination, index) => (
              <Card
                key={index}
                className="relative h-48 rounded-2xl overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center text-6xl">
                  {destination.image}
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-semibold text-sm">
                    {destination.name}
                  </h3>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
              See more
            </Button>
          </div>
        </div>
      </section> */}
    </div>
  );
};

export default Hero;