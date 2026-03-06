// ============================================================
// dummyData.js — Fashion Cloth Center Management System
// Replace these arrays with API calls when backend is ready.
// ============================================================

export const products = [
  { id: 1,  name: "Silk Evening Gown",       category: "Dresses",   size: "M",   color: "Midnight Blue", price: 12500, stock: 8  },
  { id: 2,  name: "Linen Blazer",            category: "Tops",      size: "L",   color: "Ivory",         price: 7800,  stock: 15 },
  { id: 3,  name: "High-Waist Trousers",     category: "Bottoms",   size: "S",   color: "Charcoal",      price: 4500,  stock: 3  },
  { id: 4,  name: "Cashmere Turtleneck",     category: "Tops",      size: "M",   color: "Camel",         price: 6200,  stock: 20 },
  { id: 5,  name: "Pleated Midi Skirt",      category: "Bottoms",   size: "XS",  color: "Dusty Rose",    price: 3800,  stock: 2  },
  { id: 6,  name: "Leather Trench Coat",     category: "Outerwear", size: "L",   color: "Cognac",        price: 22000, stock: 5  },
  { id: 7,  name: "Embroidered Kaftan",      category: "Dresses",   size: "XL",  color: "Emerald",       price: 9500,  stock: 7  },
  { id: 8,  name: "Wide-Leg Denim",          category: "Bottoms",   size: "M",   color: "Indigo Wash",   price: 5500,  stock: 1  },
  { id: 9,  name: "Chiffon Wrap Blouse",     category: "Tops",      size: "S",   color: "Champagne",     price: 3200,  stock: 12 },
  { id: 10, name: "Wool Overcoat",           category: "Outerwear", size: "M",   color: "Slate Grey",    price: 18500, stock: 4  },
  { id: 11, name: "Sequin Cocktail Dress",   category: "Dresses",   size: "S",   color: "Onyx",          price: 14000, stock: 6  },
  { id: 12, name: "Satin Cargo Pants",       category: "Bottoms",   size: "L",   color: "Sage Green",    price: 6800,  stock: 9  },
  { id: 13, name: "Velvet Blazer",           category: "Tops",      size: "M",   color: "Burgundy",      price: 9000,  stock: 90 },
];

export const customers = [
  { id: 1,  name: "Ayesha Tariq",    phone: "0321-4567890", address: "House 12, F-7/2, Islamabad"       },
  { id: 2,  name: "Maryam Noor",     phone: "0311-9876543", address: "Flat 4B, DHA Phase 5, Lahore"     },
  { id: 3,  name: "Sana Iqbal",      phone: "0333-1122334", address: "Plot 88, Clifton Block 2, Karachi" },
  { id: 4,  name: "Zainab Raza",     phone: "0345-5678901", address: "Street 3, G-11, Islamabad"         },
  { id: 5,  name: "Fatima Malik",    phone: "0300-2233445", address: "Gulberg III, House 7, Lahore"      },
  { id: 6,  name: "Hira Baig",       phone: "0312-8899001", address: "Nazimabad No.3, Karachi"           },
  { id: 7,  name: "Nadia Hussain",   phone: "0323-4455667", address: "F-10 Markaz, Islamabad"            },
  { id: 8,  name: "Sara Chaudhry",   phone: "0301-7788990", address: "Johar Town Block D, Lahore"        },
];

export const orders = [
  { id: 1, customerId: 1, customerName: "Ayesha Tariq",  productId: 1,  productName: "Silk Evening Gown",    quantity: 1, unitPrice: 12500, total: 12500, date: "2025-01-10", status: "Delivered" },
  { id: 2, customerId: 2, customerName: "Maryam Noor",   productId: 4,  productName: "Cashmere Turtleneck",  quantity: 2, unitPrice: 6200,  total: 12400, date: "2025-01-14", status: "Processing"},
  { id: 3, customerId: 3, customerName: "Sana Iqbal",    productId: 6,  productName: "Leather Trench Coat",  quantity: 1, unitPrice: 22000, total: 22000, date: "2025-01-15", status: "Shipped"   },
  { id: 4, customerId: 4, customerName: "Zainab Raza",   productId: 9,  productName: "Chiffon Wrap Blouse",  quantity: 3, unitPrice: 3200,  total: 9600,  date: "2025-01-18", status: "Delivered" },
  { id: 5, customerId: 5, customerName: "Fatima Malik",  productId: 11, productName: "Sequin Cocktail Dress",quantity: 1, unitPrice: 14000, total: 14000, date: "2025-01-20", status: "Pending"   },
  { id: 6, customerId: 1, customerName: "Ayesha Tariq",  productId: 2,  productName: "Linen Blazer",         quantity: 2, unitPrice: 7800,  total: 15600, date: "2025-01-22", status: "Processing"},
  { id: 7, customerId: 6, customerName: "Hira Baig",     productId: 7,  productName: "Embroidered Kaftan",   quantity: 1, unitPrice: 9500,  total: 9500,  date: "2025-01-25", status: "Shipped"   },
  { id: 8, customerId: 8, customerName: "Sara Chaudhry", productId: 12, productName: "Satin Cargo Pants",    quantity: 2, unitPrice: 6800,  total: 13600, date: "2025-01-28", status: "Delivered" },
];
