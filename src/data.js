// Dummy data for DreamStay Homes real estate marketplace

export const initialProperties = [
  {
    id: 1,
    title: "The Obsidian Pavilion",
    price: 4850000,
    purpose: "sale", // buy/sale
    type: "villa", // villa, apartment, home, room, commercial
    location: "Beverly Hills, California",
    address: "9405 Loma Vista Drive, Beverly Hills, CA 90210",
    beds: 6,
    baths: 7,
    area: 8400, // Sq Ft
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&h=700&q=80",
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&h=700&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&h=700&q=80",
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&h=700&q=80",
      "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=1200&h=700&q=80"
    ],
    featured: true,
    furnished: true,
    parking: true,
    swimmingPool: true,
    garden: true,
    description: "An architectural masterpiece in the heart of Beverly Hills, The Obsidian Pavilion represents the absolute pinnacle of ultra-luxury living. This estate boasts dramatic floor-to-ceiling glass walls, sweeping views of the LA Basin, a private infinity edge pool cascading into custom gardens, and a subterranean 5-car visual showcase garage.",
    amenities: ["Infinity Pool", "Wine Cellar", "Subterranean Garage", "Home Automation", "Private Cinema", "Outdoor Kitchen", "Spa Room", "Helper Quarters"],
    agentId: 1,
    yearBuilt: 2024,
    status: "available"
  },
  {
    id: 2,
    title: "Aura Penthouse Suite",
    price: 2450000,
    purpose: "sale",
    type: "apartment",
    location: "Tribeca, New York",
    address: "330 Greenwich St, Penthouse B, Tribeca, NY 10013",
    beds: 3,
    baths: 3.5,
    area: 3600,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&h=700&q=80",
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&h=700&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&h=700&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&h=700&q=80"
    ],
    featured: true,
    furnished: true,
    parking: true,
    swimmingPool: false,
    garden: true, // Rooftop terrace
    description: "Suspended high above the streets of Tribeca, this pristine duplex penthouse evokes a sense of tranquil isolation with majestic river-to-city skylines. Designed by world-renowned minimalist masters, it contains a private wrap-around terrace, custom marble detailing, and state-of-the-art chef's quarters.",
    amenities: ["Rooftop Garden", "Concierge 24/7", "Private Elevator", "Gourmet Kitchen", "Custom Marble", "Panoramic Windows"],
    agentId: 2,
    yearBuilt: 2023,
    status: "available"
  },
  {
    id: 3,
    title: "Miramar Coastal Cliff Retreat",
    price: 6800000,
    purpose: "sale",
    type: "villa",
    location: "Malibu, California",
    address: "22800 Pacific Coast Hwy, Malibu, CA 90265",
    beds: 5,
    baths: 6,
    area: 6900,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&h=700&q=80",
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&h=700&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&h=700&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&h=700&q=80"
    ],
    featured: true,
    furnished: true,
    parking: true,
    swimmingPool: true,
    garden: true,
    description: "Perched majestically on a private cliffside overlooking Malibu's most tranquil sandy beaches, Miramar is an architectural gem. Featuring absolute direct beach access via private motorized tramway, full wraparound glass decks, custom ocean-facing infinity wellness pools, and private yoga sanctuaries.",
    amenities: ["Direct Beach Access", "Private Tramway", "Infinity Pool", "Yoga Deck", "Tesla Solar Battery Roof", "Hot Tub"],
    agentId: 1,
    yearBuilt: 2022,
    status: "available"
  },
  {
    id: 4,
    title: "Sanctuary Scandinavian Chalet",
    price: 1550000,
    purpose: "sale",
    type: "home",
    location: "Aspen, Colorado",
    address: "710 S Aspen Street, Aspen, CO 81611",
    beds: 4,
    baths: 4.5,
    area: 4200,
    image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&h=700&q=80",
    images: [
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&h=700&q=80",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&h=700&q=80"
    ],
    featured: false,
    furnished: true,
    parking: true,
    swimmingPool: false,
    garden: true,
    description: "A gorgeous luxury modern mountain chalet nestled in Aspen's most coveted aspen forested cliffs. Blending dark wood structures, warm fires, soaring cathedral architectural beams, and deep floor-to-ceiling windows tracking sunset colors off of high mountain ski runs.",
    amenities: ["Ski-in/Ski-out Access", "Heated Driveway", "Outdoor Firepit", "Sauna & Steam Bath", "Wine Lounge", "Geothermal Heating"],
    agentId: 3,
    yearBuilt: 2021,
    status: "available"
  },
  {
    id: 5,
    title: "Chic Minimalist Studio Loft",
    price: 3200, // Monthly Rent
    purpose: "rent",
    type: "room",
    location: "Downtown, Chicago",
    address: "444 N Michigan Ave, Chicago, IL 60611",
    beds: 1,
    baths: 1,
    area: 950,
    image: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&h=700&q=80",
    images: [
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&h=700&q=80",
      "https://images.unsplash.com/photo-1502672016913-74e404d8b02a?auto=format&fit=crop&w=1200&h=700&q=80"
    ],
    featured: false,
    furnished: true,
    parking: false,
    swimmingPool: true, // Building pool
    garden: false,
    description: "An elegant, bespoke modernist loft located premium-ly in central Downtown Chicago. Incredible overhead steel beam finishes, customizable industrial room separation, smart luxury lighting schemes, and immediate access to the rooftop pool and wellness fitness lounges.",
    amenities: ["High ceilings", "Rooftop Building Pool", "Fitness Gym", "24/7 Security", "In-unit Smart Washer"],
    agentId: 2,
    yearBuilt: 2020,
    status: "available"
  },
  {
    id: 6,
    title: "The Platinum Monolith Business Center",
    price: 18500000,
    purpose: "sale",
    type: "commercial",
    location: "Miami, Florida",
    address: "701 Brickell Ave, Miami, FL 33131",
    beds: 12,
    baths: 15,
    area: 25000,
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&h=700&q=80",
    images: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&h=700&q=80",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&h=700&q=80"
    ],
    featured: true,
    furnished: false,
    parking: true,
    swimmingPool: false,
    garden: true,
    description: "An iconic corporate multi-tenant showcase building right on Brickell Avenue, Miami. Highlighted by structural steel prisms, full carbon cooling screens, triple-pane sound-attenuated bay-facing window systems, and direct executive helicopter deck compatibility.",
    amenities: ["Executive Helipad", "Corporate Boardrooms", "High-speed Fiber Uplink", "Triple Sound-proofing", "Sub-level Vault", "Rooftop Executive Club"],
    agentId: 3,
    yearBuilt: 2025,
    status: "available"
  },
  {
    id: 7,
    title: "Golden Sands Oasis Apartment",
    price: 4500, // Monthly rent
    purpose: "rent",
    type: "apartment",
    location: "Dubai Marina, Dubai",
    address: "Al Marsa St, Dubai Marina, United Arab Emirates",
    beds: 2,
    baths: 2.5,
    area: 1800,
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&h=700&q=80",
    images: [
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&h=700&q=80",
      "https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&w=1200&h=700&q=80"
    ],
    featured: false,
    furnished: true,
    parking: true,
    swimmingPool: true,
    garden: false,
    description: "Soaring above the marina boat lanes, this beautifully furnished executive apartment brings together Middle Eastern luxury and custom European fittings. Stunning view corridors tracking Superyachts drifting directly underneath your dual cantilever balconies.",
    amenities: ["Marina Balcony Views", "Infinity Horizon Pool", "Private Parking Space", "Custom Italian Linens", "Smart Access Locks"],
    agentId: 1,
    yearBuilt: 2023,
    status: "available"
  },
  {
    id: 8,
    title: "Greenwich Suburban Sanctuary",
    price: 3200000,
    purpose: "sale",
    type: "home",
    location: "Greenwich, Connecticut",
    address: "24 Round Hill Rd, Greenwich, CT 06831",
    beds: 5,
    baths: 5.5,
    area: 6200,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&h=700&q=80",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&h=700&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&h=700&q=80"
    ],
    featured: false,
    furnished: false,
    parking: true,
    swimmingPool: true,
    garden: true,
    description: "An elegant English manor style luxury residence sitting on over 2.5 wooded acres in prime Greenwich. Rich hardwood timberings, historical brick chimneys, outdoor heated salt-water pools, and manicured high boxwood botanical mazes and classic rose gardens.",
    amenities: ["Botanical Gardens", "Salt-water Heated Pool", "Acre Wooded Land", "Historic Library", "Wine Cellar 2000 Bottles"],
    agentId: 2,
    yearBuilt: 2019,
    status: "available"
  }
];

export const initialAgents = [
  {
    id: 1,
    name: "Aidan Sterling",
    role: "Principal Managing Partner",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&h=300&q=80",
    phone: "+1 (555) 301-4491",
    email: "aidan@dreamstay.com",
    activeListings: 12,
    rating: 4.9,
    reviewsCount: 148,
    bio: "With over 15 years overseeing ultra-high-net-worth real estate transactions across California and New York, Aidan manages DreamStay Homes' premier asset portfolios with unmatched confidentiality and precision.",
    languages: ["English", "French", "German"],
    experience: "15 Years",
    specialty: "Luxury Architectural Estates, Oceanfront Properties",
    reviews: [
      { id: 1, author: "Genevieve K.", rating: 5, text: "Aidan managed our Malibu purchase with absolute discretion. Absolute master of commercial and ultra-luxury negotiations.", date: "April 14, 2026" },
      { id: 2, author: "Carlton V.", rating: 5, text: "The perfect experience. Handled complex property transfer logistics smoothly without hassle.", date: "March 2, 2026" }
    ]
  },
  {
    id: 2,
    name: "Victoria Fontaine",
    role: "Senior Associate, Global Relocation",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&h=300&q=80",
    phone: "+1 (555) 709-1182",
    email: "victoria@dreamstay.com",
    activeListings: 8,
    rating: 4.8,
    reviewsCount: 92,
    bio: "Specializing in premium high-rise penthouses and bespoke metropolitan retreats, Victoria aligns international relocations with properties that make immediate, meaningful aesthetic statements.",
    languages: ["English", "Spanish", "Mandarin"],
    experience: "9 Years",
    specialty: "Duplex/Penthouses, Global Portfolio Relocation",
    reviews: [
      { id: 1, author: "Marco R.", rating: 5, text: "Victoria works incredibly fast. She found our Manhattan duplex over a single weekend and locked in the terms seamlessly.", date: "May 10, 2026" }
    ]
  },
  {
    id: 3,
    name: "Cyrus Vance",
    role: "Director of Estates & Investment Strategies",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&h=300&q=80",
    phone: "+1 (555) 442-9908",
    email: "cyrus@dreamstay.com",
    activeListings: 15,
    rating: 5.0,
    reviewsCount: 205,
    bio: "A legal background and investment advisory portfolio make Cyrus unique. He advises hedge funds, institutional buyers, and private entities on luxury asset performance metrics and commercial zoning rules.",
    languages: ["English", "Italian", "Arabic"],
    experience: "12 Years",
    specialty: "High-yield Commercial Properties, Mountain Chalets",
    reviews: [
      { id: 1, author: "Sonia G.", rating: 5, text: "Cyrus is an asset analysis genius. Not only is our chalet beautiful, but the tax mitigation structure he advised has been flawless.", date: "May 1, 2026" }
    ]
  }
];

export const initialMessages = [
  {
    id: 101,
    sender: "Aidan Sterling",
    senderAvatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&h=150&q=80",
    recipient: "Aria Thorne",
    text: "Hello Aria, I saw your interest in 'The Obsidian Pavilion'. Is there a specific day this week you would like to queue a private physical walk-through with our concierge team?",
    timestamp: "10:14 AM",
    property: "The Obsidian Pavilion",
    unread: true
  },
  {
    id: 102,
    sender: "Aria Thorne",
    senderAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
    recipient: "Aidan Sterling",
    text: "Hi Aidan! Thank you. I would actually prefer Thursday afternoon, around 3:00 PM if that works, so we can witness the sunset views over the canyon.",
    timestamp: "10:35 AM",
    property: "The Obsidian Pavilion",
    unread: false
  },
  {
    id: 103,
    sender: "Aidan Sterling",
    senderAvatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&h=150&q=80",
    recipient: "Aria Thorne",
    text: "Perfect. 3:00 PM Thursday is locked in. Our private chauffeur will pick you up at your convenience or we can greet you at the main Loma Vista compound gates directly.",
    timestamp: "11:00 AM",
    property: "The Obsidian Pavilion",
    unread: false
  },
  {
    id: 104,
    sender: "Victoria Fontaine",
    senderAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80",
    recipient: "Aria Thorne",
    text: "Dear Aria, I am putting together the custom floor plans for the Tribeca Penthouse now. Let me know if you would like me to match you with similar industrial lofts in Manhattan as backups.",
    timestamp: "Yesterday, 4:20 PM",
    property: "Aura Penthouse Suite",
    unread: false
  }
];

export const initialTestimonials = [
  {
    id: 1,
    name: "Maximilian Drake",
    title: "Founder, Drake Capital",
    quote: "DreamStay Homes completely redesigned how we acquire investment properties globally. The simplicity, curated options, and direct discrete contact channels to highly elite real estate agents are absolutely unparalleled.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80"
  },
  {
    id: 2,
    name: "Dr. Evelyn Cartwright",
    title: "Philanthropist & Art Collector",
    quote: "Finding an estate that fits an extensive custom light sculpture collection is daunting. Aidan Sterling didn't just find a house; he discovered a private geological sanctuary that elevates our life.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&h=100&q=80"
  },
  {
    id: 3,
    name: "Hassan Al-Maktoum",
    title: "Managing Director, Marina Holdings",
    quote: "The visual precision of DreamStay Homes' listing presentation is highly accurate, matching real world assets perfectly. Finding a Dubai Penthouse that lives exactly like the initial photographs has never been simpler.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80"
  }
];
