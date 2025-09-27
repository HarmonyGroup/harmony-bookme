export type BookingSubtype = {
  key: string;
  value: string;
  description: string;
};

export type BookingService = {
  key: string;
  value: string;
  description: string;
  subtypes: BookingSubtype[];
};

const bookingServices = [
  {
    key: "events",
    value: "Events",
    description:
      "Offer events, movies, or tours for memorable activities. Customize schedules to engage explorers.",
    subtypes: [
      {
        key: "concerts",
        value: "Concerts",
        description:
          "Host live music performances like bands or orchestras. Set ticket prices to attract music lovers.",
      },
      {
        key: "social_and_nightlife",
        value: "Social and Nightlife",
        description:
          "Offer parties, club nights, or bar crawls. Create vibrant social experiences for explorers.",
      },
      {
        key: "art_and_exhibitions",
        value: "Art and Exhibitions",
        description:
          "Showcase gallery exhibitions or art workshops. Engage visitors with creative cultural events.",
      },
      {
        key: "fitness_and_wellness",
        value: "Fitness and Wellness",
        description:
          "Provide yoga, meditation, or fitness classes. Inspire explorers with health-focused activities.",
      },
      {
        key: "workshops_and_classes",
        value: "Workshops and Classes",
        description:
          "Teach skills like cooking or coding in workshops. Offer hands-on learning for curious minds.",
      },
      {
        key: "games_and_tournaments",
        value: "Games and Tournaments",
        description:
          "Run esports, trivia, or sports tournaments. Create competitive fun for thrill-seekers.",
      },
      {
        key: "religious",
        value: "Religious",
        description:
          "Organize spiritual events or religious gatherings. Connect attendees with meaningful experiences.",
      },
      {
        key: "movies_and_cinema",
        value: "Movies and Cinema",
        description:
          "Screen movies or host cinema events. Attract film fans with unique viewings.",
      },
      {
        key: "others",
        value: "Others",
        description:
          "Offer unique activities like pop-ups. Craft memorable moments for explorers.",
      },
    ],
  },
  {
    key: "movies_and_cinema",
    value: "Movie and cinema",
    description:
      "Provide flights, buses, or car rentals for seamless movement. Specify schedules to connect explorers.",
    subtypes: [],
  },
  {
    key: "leisure",
    value: "Leisure",
    description:
      "Provide flights, buses, or car rentals for seamless movement. Specify schedules to connect explorers.",
    subtypes: [],
  },
  {
    key: "accommodations",
    value: "Accommodations",
    description:
      "List hotels, apartments, lodges, or vacation rentals for stays. Set pricing and amenities for explorers.",
    subtypes: [
      {
        key: "hotels",
        value: "Hotels",
        description: "Offer hotel rooms with amenities.",
      },
      {
        key: "apartments",
        value: "Apartments",
        description: "List apartments for short or long-term stays.",
      },
    ],
  },
  {
    key: "travel",
    value: "Travel",
    description:
      "Provide flights, buses, or car rentals for seamless movement. Specify schedules to connect explorers.",
    subtypes: [
      {
        key: "flights",
        value: "Flights",
        description: "Offer flight services.",
      },
      {
        key: "trains",
        value: "Trains",
        description: "Provide train travel options.",
      },
      {
        key: "buses",
        value: "Buses",
        description: "List bus services for regional travel.",
      },
      {
        key: "car_rentals",
        value: "Car Rentals",
        description: "Offer car rentals for flexibility.",
      },
      {
        key: "ferries",
        value: "Ferries",
        description: "Provide ferry services for coastal travel.",
      },
    ],
  },
];

export default bookingServices;