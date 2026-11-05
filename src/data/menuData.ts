/**
 * Centralized Menu Data & Restaurant Configuration for Sam's Cafe
 * All items, categories, prices (PKR), and cafe details can be updated directly here.
 * Note: Unverified entries are flagged with isDemo: true so customers and management
 * clearly know they represent sample showcase dishes pending menu finalization.
 */

export interface MenuItem {
  id: string;
  name: string;
  category: 'pizza' | 'burgers' | 'wings' | 'pasta' | 'coffee' | 'drinks' | 'desserts';
  description: string;
  price: number; // In PKR
  image: string;
  available?: boolean;
  isPopular?: boolean;
  isNew?: boolean;
  isDemo?: boolean;
}

export interface CafeInfo {
  name: string;
  tagline: string;
  address: string;
  city: string;
  country: string;
  phoneDisplay: string;
  phoneRaw: string;
  whatsappNumber: string; // E.g. "923444443322" without spaces or plus
  googleMapsUrl: string;
  googleMapsEmbedQuery: string;
  provisionalHours: {
    days: string;
    openTime: string; // "10:00"
    closeTime: string; // "02:00" (next morning)
    displayHours: string;
  };
}

export const CAFE_INFO: CafeInfo = {
  name: "SAM'S CAFE",
  tagline: "GOOD FOOD. GREAT MOMENTS.",
  address: "Allama Iqbal Road",
  city: "Mian Channu",
  country: "Pakistan",
  phoneDisplay: "+92 344 4443322",
  phoneRaw: "+923444443322",
  whatsappNumber: "923444443322",
  googleMapsUrl: "https://maps.app.goo.gl/he4U9VhCXzaLS1Nw7?g_st=ac",
  googleMapsEmbedQuery: "Sam's Cafe Allama Iqbal Road Mian Channu Pakistan",
  provisionalHours: {
    days: "Monday – Sunday",
    openTime: "10:00",
    closeTime: "02:00",
    displayHours: "10:00 AM – 2:00 AM (Next Day)"
  }
};

export const MENU_CATEGORIES = [
  { id: 'all', label: 'All Items' },
  { id: 'pizza', label: 'Artisan Pizza' },
  { id: 'burgers', label: 'Gourmet Burgers' },
  { id: 'wings', label: 'Crispy Wings' },
  { id: 'pasta', label: 'Pasta & Skillets' },
  { id: 'coffee', label: 'Specialty Coffee' },
  { id: 'drinks', label: 'Beverages' },
  { id: 'desserts', label: 'Desserts & Snacks' },
] as const;

export const MENU_ITEMS: MenuItem[] = [
  // Pizza
  {
    id: 'pizza-sam-special',
    name: "Sam's Crown Supreme Pizza",
    category: 'pizza',
    description: "Char-crusted artisan dough layered with house marinara, smoky grilled chicken, bell peppers, black olives, and overflowing mozzarella strings.",
    price: 1450,
    image: "/src/assets/images/food_artisan_pizza_1793898483490.jpg",
    isPopular: true,
    isDemo: true
  },
  {
    id: 'pizza-tikka-classic',
    name: "Spiced Chicken Tikka Feast",
    category: 'pizza',
    description: "Tender spiced chicken tikka morsels, rings of red onion, hot green chilies, and aromatic herbs over a rich double-cheese blend.",
    price: 1350,
    image: "/src/assets/images/food_artisan_pizza_1793898483490.jpg",
    isPopular: false,
    isDemo: true
  },
  {
    id: 'pizza-fajita-melt',
    name: "Smoked Fajita Chicken Pizza",
    category: 'pizza',
    description: "Zesty Mexican-spiced chicken, bell peppers, sweet corn kernels, jalapenos, and a blanket of golden broiled mozzarella.",
    price: 1390,
    image: "/src/assets/images/food_artisan_pizza_1793898483490.jpg",
    isNew: true,
    isDemo: true
  },

  // Burgers
  {
    id: 'burger-double-smash',
    name: "Signature Double Smash Burger",
    category: 'burgers',
    description: "Double crisp-edged smashed beef patties smothered in melted aged cheddar, caramelized grilled onions, and house sauce on a buttered brioche bun.",
    price: 850,
    image: "/src/assets/images/food_smash_burger_1793898484448.jpg",
    isPopular: true,
    isDemo: true
  },
  {
    id: 'burger-crispy-zing',
    name: "Sam's Crispy Crunch Burger",
    category: 'burgers',
    description: "Golden fried extra-crunchy chicken fillet coated in spicy herb dust, chilled iceberg slaw, pickles, and garlic aioli in toasted sesame brioche.",
    price: 750,
    image: "/src/assets/images/food_smash_burger_1793898484448.jpg",
    isPopular: true,
    isDemo: true
  },
  {
    id: 'burger-bbq-melt',
    name: "Smoky BBQ Cheddar Burger",
    category: 'burgers',
    description: "Flame-kissed patty glazed with smoky hickory glaze, grilled mushrooms, melted cheese slice, and crispy onion crunch.",
    price: 890,
    image: "/src/assets/images/food_smash_burger_1793898484448.jpg",
    isNew: true,
    isDemo: true
  },

  // Wings
  {
    id: 'wings-hot-buffalo',
    name: "Honey Fire Glazed Wings (6 Pcs)",
    category: 'wings',
    description: "Oven-roasted then crisp-fried wings drenched in spicy honey glaze, toasted sesame seeds, and garden scallions in a sizzling skillet.",
    price: 650,
    image: "/src/assets/images/food_crispy_wings_1793898484408.jpg",
    isPopular: true,
    isDemo: true
  },
  {
    id: 'wings-smoky-bbq',
    name: "Charcoal BBQ Wings (6 Pcs)",
    category: 'wings',
    description: "Tender wings brushed with rich dark molasses barbecue marinade, cracked black pepper, and ranch dip on the side.",
    price: 620,
    image: "/src/assets/images/food_crispy_wings_1793898484408.jpg",
    isDemo: true
  },
  {
    id: 'wings-peri-peri',
    name: "Flame Peri-Peri Hot Wings (10 Pcs)",
    category: 'wings',
    description: "Large portion of spicy African bird's eye chili tossed wings, tangy lemon zest, and dipping garlic emulsion.",
    price: 980,
    image: "/src/assets/images/food_crispy_wings_1793898484408.jpg",
    isNew: true,
    isDemo: true
  },

  // Pasta
  {
    id: 'pasta-creamy-alfredo',
    name: "Velvet White Alfredo Pasta",
    category: 'pasta',
    description: "Penne tossed in a garlic butter cream reduction, sliced grilled herb chicken, button mushrooms, and shredded parmesan.",
    price: 920,
    image: "/src/assets/images/hero_sams_cafe_feast_1793898482416.jpg",
    isPopular: true,
    isDemo: true
  },
  {
    id: 'pasta-spicy-arrabbiata',
    name: "Fiery Tuscan Penne",
    category: 'pasta',
    description: "Fresh tomato chili reduction, Kalamata black olives, sweet basil leaves, and cracked red pepper with garlic toasted bread.",
    price: 840,
    image: "/src/assets/images/hero_sams_cafe_feast_1793898482416.jpg",
    isDemo: true
  },

  // Coffee
  {
    id: 'coffee-caramel-latte',
    name: "Artisan Caramel Rosetta Latte",
    category: 'coffee',
    description: "Freshly pulled double espresso shot blended with velvety micro-foam steamed milk, silky salted caramel, and delicate barista art.",
    price: 480,
    image: "/src/assets/images/food_specialty_coffee_1793898484615.jpg",
    isPopular: true,
    isDemo: true
  },
  {
    id: 'coffee-spanish-latte',
    name: "Iced Spanish Sweet Brew",
    category: 'coffee',
    description: "Slow-dripped dark roast layered over condensed sweet milk, chilled whole milk, and crystal ice cubes.",
    price: 520,
    image: "/src/assets/images/food_specialty_coffee_1793898484615.jpg",
    isNew: true,
    isDemo: true
  },
  {
    id: 'coffee-cappuccino-classic',
    name: "Signature Dark Roast Cappuccino",
    category: 'coffee',
    description: "Bold 100% Arabica espresso with equal parts rich steamed milk and dense chocolate-dusted froth.",
    price: 440,
    image: "/src/assets/images/food_specialty_coffee_1793898484615.jpg",
    isDemo: true
  },

  // Drinks
  {
    id: 'drink-mint-margarita',
    name: "Frosted Mint Mojito Cooler",
    category: 'drinks',
    description: "Crushed wild garden mint, sparkling soda, fresh lime juice, and rock salt over crushed crystal ice.",
    price: 360,
    image: "/src/assets/images/food_specialty_coffee_1793898484615.jpg",
    isPopular: true,
    isDemo: true
  },
  {
    id: 'drink-iced-peach-tea',
    name: "Sun-Brewed Iced Peach Infusion",
    category: 'drinks',
    description: "Black Ceylon tea infused with real orchard peach puree, lemon wheel, and fresh rosemary sprig.",
    price: 380,
    image: "/src/assets/images/food_specialty_coffee_1793898484615.jpg",
    isDemo: true
  },

  // Desserts
  {
    id: 'dessert-molten-lava',
    name: "Gooey Dark Chocolate Lava Cake",
    category: 'desserts',
    description: "Warm Belgian chocolate cake with a molten hot fudge center, paired with vanilla bean gelato scoop.",
    price: 580,
    image: "/src/assets/images/hero_sams_cafe_feast_1793898482416.jpg",
    isPopular: true,
    isDemo: true
  },
  {
    id: 'dessert-loaded-fries',
    name: "Sam's Crispy Loaded Cheesy Fries",
    category: 'desserts',
    description: "Golden shoestring french fries smothered in melted cheddar cheese sauce, crispy beef bits, jalapenos, and spring onions.",
    price: 490,
    image: "/src/assets/images/hero_sams_cafe_feast_1793898482416.jpg",
    isPopular: true,
    isDemo: true
  }
];

export const GALLERY_PHOTOS = [
  {
    id: 'gal-1',
    title: "Signature Feast",
    category: "Cafe Table",
    src: "/src/assets/images/hero_sams_cafe_feast_1793898482416.jpg",
    caption: "The full Sam's spread: hot artisan pizza, smash burger, and golden fries."
  },
  {
    id: 'gal-2',
    title: "Artisan Pizza Pull",
    category: "Pizzas",
    src: "/src/assets/images/food_artisan_pizza_1793898483490.jpg",
    caption: "Fresh out of the oven: charred artisan crust and bubbling mozzarella."
  },
  {
    id: 'gal-3',
    title: "Double Smash Burger",
    category: "Burgers",
    src: "/src/assets/images/food_smash_burger_1793898484448.jpg",
    caption: "Juicy grilled patties, molten cheddar, and toasted brioche goodness."
  },
  {
    id: 'gal-4',
    title: "Hot Honey Wings",
    category: "Fast Food",
    src: "/src/assets/images/food_crispy_wings_1793898484408.jpg",
    caption: "Sizzling cast-iron skillet wings glazed in chili honey with toasted sesame."
  },
  {
    id: 'gal-5',
    title: "Artisan Rosetta Latte",
    category: "Coffee Bar",
    src: "/src/assets/images/food_specialty_coffee_1793898484615.jpg",
    caption: "Handcrafted espresso with velvety micro-foam in a matte black ceramic cup."
  }
];
