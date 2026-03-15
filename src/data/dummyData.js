// ============================================================
// dummyData.js — Fashion Cloth Center Management System
// Updated: orders now support multi-product, discount, payment
// Replace arrays with API calls when backend is ready.
// ============================================================

// NOTE ON IMAGES:
// Using Unsplash Source API — free, no API key needed, clothing-specific searches.
// Format: https://source.unsplash.com/400x500/?SEARCH_TERM
// Each search term returns a relevant fashion/clothing photo.
// When connecting to backend, replace `image` with your own uploaded file path.

export const products = [
  { id: 1,  name: "Silk Evening Gown",     category: "Dresses",   size: "M",  color: "Midnight Blue", price: 12500, stock: 8,  image: "https://source.unsplash.com/400x500/?evening,gown,dress"        },
  { id: 2,  name: "Linen Blazer",          category: "Tops",      size: "L",  color: "Ivory",         price: 7800,  stock: 15, image: "https://source.unsplash.com/400x500/?blazer,jacket,fashion"      },
  { id: 3,  name: "High-Waist Trousers",   category: "Bottoms",   size: "S",  color: "Charcoal",      price: 4500,  stock: 3,  image: "https://source.unsplash.com/400x500/?trousers,pants,fashion"     },
  { id: 4,  name: "Cashmere Turtleneck",   category: "Tops",      size: "M",  color: "Camel",         price: 6200,  stock: 20, image: "https://source.unsplash.com/400x500/?turtleneck,sweater,knit"    },
  { id: 5,  name: "Pleated Midi Skirt",    category: "Bottoms",   size: "XS", color: "Dusty Rose",    price: 3800,  stock: 2,  image: "https://source.unsplash.com/400x500/?skirt,fashion,women"        },
  { id: 6,  name: "Leather Trench Coat",   category: "Outerwear", size: "L",  color: "Cognac",        price: 22000, stock: 5,  image: "https://source.unsplash.com/400x500/?trench,coat,leather"        },
  { id: 7,  name: "Embroidered Kaftan",    category: "Dresses",   size: "XL", color: "Emerald",       price: 9500,  stock: 7,  image: "https://source.unsplash.com/400x500/?kaftan,ethnic,dress"        },
  { id: 8,  name: "Wide-Leg Denim",        category: "Bottoms",   size: "M",  color: "Indigo Wash",   price: 5500,  stock: 1,  image: "https://source.unsplash.com/400x500/?denim,jeans,fashion"        },
  { id: 9,  name: "Chiffon Wrap Blouse",   category: "Tops",      size: "S",  color: "Champagne",     price: 3200,  stock: 12, image: "https://source.unsplash.com/400x500/?blouse,chiffon,women"       },
  { id: 10, name: "Wool Overcoat",         category: "Outerwear", size: "M",  color: "Slate Grey",    price: 18500, stock: 4,  image: "https://source.unsplash.com/400x500/?overcoat,wool,winter"       },
  { id: 11, name: "Sequin Cocktail Dress", category: "Dresses",   size: "S",  color: "Onyx",          price: 14000, stock: 6,  image: "https://source.unsplash.com/400x500/?cocktail,dress,sequin"      },
  { id: 12, name: "Satin Cargo Pants",     category: "Bottoms",   size: "L",  color: "Sage Green",    price: 6800,  stock: 9,  image: "https://source.unsplash.com/400x500/?cargo,pants,streetwear"     },
];

export const customers = [
  { id: 1, name: "Ayesha Tariq",  phone: "0321-4567890", address: "House 12, F-7/2, Islamabad"        },
  { id: 2, name: "Maryam Noor",   phone: "0311-9876543", address: "Flat 4B, DHA Phase 5, Lahore"      },
  { id: 3, name: "Sana Iqbal",    phone: "0333-1122334", address: "Plot 88, Clifton Block 2, Karachi"  },
  { id: 4, name: "Zainab Raza",   phone: "0345-5678901", address: "Street 3, G-11, Islamabad"          },
  { id: 5, name: "Fatima Malik",  phone: "0300-2233445", address: "Gulberg III, House 7, Lahore"       },
  { id: 6, name: "Hira Baig",     phone: "0312-8899001", address: "Nazimabad No.3, Karachi"            },
  { id: 7, name: "Nadia Hussain", phone: "0323-4455667", address: "F-10 Markaz, Islamabad"             },
  { id: 8, name: "Sara Chaudhry", phone: "0301-7788990", address: "Johar Town Block D, Lahore"         },
];

// ============================================================
// NEW ORDER STRUCTURE
// Each order is ONE bill for ONE customer with MULTIPLE items.
//
// Fields:
//   id           — unique order ID
//   customerId   — links to customers array
//   customerName — denormalized for easy display
//   customerPhone— denormalized for easy display
//   date         — ISO date string
//   items[]      — list of ordered products (see below)
//   subtotal     — sum of (price × qty) before discounts
//   totalDiscount— sum of all item discounts
//   finalTotal   — subtotal - totalDiscount (what customer owes)
//   paymentStatus— "Paid" | "Partial" | "Unpaid"
//   amountPaid   — cash received from customer
//   amountDue    — finalTotal - amountPaid (remaining debt)
//
// Each item inside items[]:
//   productId, productName, unitPrice, quantity,
//   discount (fixed Rs), itemTotal = (unitPrice × qty) - discount
// ============================================================

export const orders = [
  {
    id: 1,
    customerId: 1, customerName: "Ayesha Tariq",  customerPhone: "0321-4567890",
    date: "2025-01-10",
    items: [
      { productId: 1,  productName: "Silk Evening Gown",    unitPrice: 12500, quantity: 1, discount: 500,  itemTotal: 12000 },
      { productId: 9,  productName: "Chiffon Wrap Blouse",  unitPrice: 3200,  quantity: 2, discount: 0,    itemTotal: 6400  },
    ],
    subtotal: 18900, totalDiscount: 500, finalTotal: 18400,
    paymentStatus: "Paid", amountPaid: 18400, amountDue: 0,
  },
  {
    id: 2,
    customerId: 2, customerName: "Maryam Noor",   customerPhone: "0311-9876543",
    date: "2025-01-14",
    items: [
      { productId: 4,  productName: "Cashmere Turtleneck",  unitPrice: 6200,  quantity: 2, discount: 400,  itemTotal: 11800 },
    ],
    subtotal: 12400, totalDiscount: 400, finalTotal: 11800,
    paymentStatus: "Partial", amountPaid: 6000, amountDue: 5800,
  },
  {
    id: 3,
    customerId: 3, customerName: "Sana Iqbal",    customerPhone: "0333-1122334",
    date: "2025-01-15",
    items: [
      { productId: 6,  productName: "Leather Trench Coat",  unitPrice: 22000, quantity: 1, discount: 2000, itemTotal: 20000 },
      { productId: 3,  productName: "High-Waist Trousers",  unitPrice: 4500,  quantity: 1, discount: 0,    itemTotal: 4500  },
    ],
    subtotal: 26500, totalDiscount: 2000, finalTotal: 24500,
    paymentStatus: "Unpaid", amountPaid: 0, amountDue: 24500,
  },
  {
    id: 4,
    customerId: 4, customerName: "Zainab Raza",   customerPhone: "0345-5678901",
    date: "2025-01-18",
    items: [
      { productId: 9,  productName: "Chiffon Wrap Blouse",  unitPrice: 3200,  quantity: 3, discount: 300,  itemTotal: 9300  },
    ],
    subtotal: 9600, totalDiscount: 300, finalTotal: 9300,
    paymentStatus: "Paid", amountPaid: 9300, amountDue: 0,
  },
  {
    id: 5,
    customerId: 5, customerName: "Fatima Malik",  customerPhone: "0300-2233445",
    date: "2025-01-20",
    items: [
      { productId: 11, productName: "Sequin Cocktail Dress", unitPrice: 14000, quantity: 1, discount: 1000, itemTotal: 13000 },
      { productId: 5,  productName: "Pleated Midi Skirt",    unitPrice: 3800,  quantity: 1, discount: 0,    itemTotal: 3800  },
    ],
    subtotal: 17800, totalDiscount: 1000, finalTotal: 16800,
    paymentStatus: "Partial", amountPaid: 10000, amountDue: 6800,
  },
  {
    id: 6,
    customerId: 2, customerName: "Maryam Noor",   customerPhone: "0311-9876543",
    date: "2025-01-22",
    items: [
      { productId: 2,  productName: "Linen Blazer",          unitPrice: 7800,  quantity: 2, discount: 600,  itemTotal: 15000 },
    ],
    subtotal: 15600, totalDiscount: 600, finalTotal: 15000,
    paymentStatus: "Unpaid", amountPaid: 0, amountDue: 15000,
  },
  {
    id: 7,
    customerId: 6, customerName: "Hira Baig",     customerPhone: "0312-8899001",
    date: "2025-01-25",
    items: [
      { productId: 7,  productName: "Embroidered Kaftan",    unitPrice: 9500,  quantity: 1, discount: 0,    itemTotal: 9500  },
    ],
    subtotal: 9500, totalDiscount: 0, finalTotal: 9500,
    paymentStatus: "Paid", amountPaid: 9500, amountDue: 0,
  },
  {
    id: 8,
    customerId: 8, customerName: "Sara Chaudhry", customerPhone: "0301-7788990",
    date: "2025-01-28",
    items: [
      { productId: 12, productName: "Satin Cargo Pants",     unitPrice: 6800,  quantity: 2, discount: 500,  itemTotal: 13100 },
      { productId: 4,  productName: "Cashmere Turtleneck",   unitPrice: 6200,  quantity: 1, discount: 200,  itemTotal: 6000  },
    ],
    subtotal: 19800, totalDiscount: 700, finalTotal: 19100,
    paymentStatus: "Partial", amountPaid: 12000, amountDue: 7100,
  },
];
