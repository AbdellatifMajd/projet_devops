export const loginFormControls = [
    {
        name: "email",
        label: "Email",
        componentType: "input",
        type: "email", 
        placeholder: "Enter your email"
    },
    {
        name: "password",
        label: "Password",
        componentType: "input",
        type: "password", 
        placeholder: "Enter your password"
    }
]

export const registerFormControls = [
      {
        name: "name",
        label: "User Name",
        componentType: "input",
        type: "text", 
        placeholder: "Enter your user name"
    },
      {
        name: "email",
        label: "Email",
        componentType: "input",
        type: "email", 
        placeholder: "Enter your email"
    },
      {
        name: "phoneNumber",
        label: "Phone Number",
        componentType: "input",
        type: "tel", 
        placeholder: "Enter your phone number"
    },
    {
        name: "password",
        label: "Password",
        componentType: "input",
        type: "password", 
        placeholder: "Enter your password"
    }
]



export const addRoomFormElements = [
  {
    label: "Title",
    name: "title",
    componentType: "input",
    type: "text",
    placeholder: "Enter room title (e.g. Deluxe Ocean View)",
  },
  {
    label: "Description",
    name: "description",
    componentType: "textarea",
    placeholder: "Enter room description and amenities",
  },
  {
    label: "Category",
    name: "category",
    componentType: "select",
    options: [
      { id: "single", label: "Single" },
      { id: "double", label: "Double" },
      { id: "family", label: "Family" },
      { id: "suite", label: "Suite" },
      { id: "deluxe", label: "Deluxe" },
    ],
  },
  {
    label: "Bed Type",
    name: "bedType",
    componentType: "select",
    options: [
      { id: "single_bed", label: "Single Bed" },
      { id: "double_bed", label: "Double Bed" },
      { id: "queen_bed", label: "Queen Bed" },
      { id: "king_bed", label: "King Bed" },
      { id: "twin_beds", label: "Twin Beds" },
    ],
  },
  {
    label: "Price per Night",
    name: "pricePerNight",
    componentType: "input",
    type: "number",
    placeholder: "Enter price per night",
  },
  {
    label: "Capacity (Max Guests)",
    name: "capacity",
    componentType: "input",
    type: "number",
    placeholder: "Enter maximum number of guests",
  },
];

export const filterOptions = {
  category: [
    { id: "single", label: "Single Room" },
    { id: "double", label: "Double Room" },
    { id: "suite", label: "Suite" },
    { id: "family", label: "Family Room" },
    { id: "deluxe", label: "Deluxe / VIP" },
  ],
  services: [
    { id: "wifi", label: "Free Wi-Fi" },
    { id: "pool", label: "Pool Access" },
    { id: "air_conditioning", label: "Air Conditioning" },
    { id: "spa", label: "Spa & Sauna" },
  ]
};

export const sortOptions = [
  { id: "price-lowtohigh", label: "Price: Low to High" },
  { id: "price-hightolow", label: "Price: High to Low" },
  { id: "title-atoz", label: "Title: A to Z" },
  { id: "title-ztoa", label: "Title: Z to A" },
];