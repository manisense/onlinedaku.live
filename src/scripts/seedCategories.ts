import mongoose from 'mongoose';
import Category from '../models/Category';
import dbConnect from '../utils/dbConnect';

interface CategorySeed {
  name: string;
  description: string;
  tags: string[];
  parentCategory?: mongoose.Types.ObjectId;
  icon?: string;
}

async function seedCategories() {
  try {
    await dbConnect();
    console.log('Connected to database');

    // Check if categories already exist
    const count = await Category.countDocuments();
    if (count > 0) {
      console.log(`Database already has ${count} categories. Skipping seed.`);
      console.log('If you want to reseed, please drop the categories collection first.');
      process.exit(0);
    }

    // Define the core categories
    const coreCategories: CategorySeed[] = [
      {
        name: 'Mobile Phones',
        description: 'Smartphones, feature phones, and mobile accessories',
        tags: ['smartphones', 'accessories', 'cases', 'chargers', 'refurbished phones']
      },
      {
        name: 'Laptops & Computers',
        description: 'Laptops, desktops, components, and computer accessories',
        tags: ['laptops', 'desktops', 'gaming PCs', 'keyboards', 'mice', 'monitors']
      },
      {
        name: 'Fashion & Apparel',
        description: 'Clothing, footwear, and accessories for men, women, and kids',
        tags: ['men\'s clothing', 'women\'s clothing', 'kids clothing', 'footwear', 'ethnic wear']
      },
      {
        name: 'Home Appliances',
        description: 'Major home appliances for modern living',
        tags: ['ACs', 'refrigerators', 'washing machines', 'microwaves', 'dishwashers']
      },
      {
        name: 'Beauty & Personal Care',
        description: 'Beauty, grooming, and personal care products',
        tags: ['skincare', 'makeup', 'haircare', 'men\'s grooming', 'fragrances']
      },
      {
        name: 'Electronics & Gadgets',
        description: 'Consumer electronics and tech gadgets',
        tags: ['smartwatches', 'headphones', 'power banks', 'cameras', 'speakers']
      },
      {
        name: 'Kitchen Appliances',
        description: 'Appliances and tools for your kitchen',
        tags: ['mixer grinders', 'air fryers', 'cookware', 'utensils', 'coffee makers']
      },
      {
        name: 'Health & Wellness',
        description: 'Products for health, fitness, and wellbeing',
        tags: ['fitness gear', 'supplements', 'ayurvedic products', 'healthcare devices']
      },
      {
        name: 'Groceries & Daily Essentials',
        description: 'Food items and daily household necessities',
        tags: ['snacks', 'spices', 'organic foods', 'regional specialties', 'household items']
      },
      {
        name: 'Books & Education',
        description: 'Books, stationery, and educational materials',
        tags: ['academic books', 'competitive exam guides', 'stationery', 'e-books']
      },
      {
        name: 'Toys & Baby Care',
        description: 'Products for children and babies',
        tags: ['educational toys', 'baby gear', 'maternity products', 'baby food']
      },
      {
        name: 'Automotive & Accessories',
        description: 'Products for vehicles and automotive needs',
        tags: ['car care', 'bike helmets', 'vehicle electronics', 'automotive tools']
      },
      {
        name: 'Sports & Fitness',
        description: 'Equipment and gear for sports and fitness activities',
        tags: ['gym equipment', 'yoga mats', 'cycling gear', 'sports accessories']
      },
      {
        name: 'Ethnic Wear',
        description: 'Traditional and cultural clothing and accessories',
        tags: ['sarees', 'kurta sets', 'lehengas', 'traditional jewelry', 'ethnic footwear']
      },
      {
        name: 'Gaming & Accessories',
        description: 'Video games, consoles, and gaming accessories',
        tags: ['consoles', 'gaming chairs', 'headsets', 'game keys', 'controllers']
      },
      {
        name: 'Smart Home Devices',
        description: 'Connected devices for the modern smart home',
        tags: ['smart lights', 'security cameras', 'voice assistants', 'smart appliances']
      },
      {
        name: 'Travel & Luggage',
        description: 'Products for travelers and commuters',
        tags: ['suitcases', 'backpacks', 'travel accessories', 'travel gadgets']
      },
      {
        name: 'Regional Groceries',
        description: 'Food items specific to different regions of India',
        tags: ['indian snacks', 'pickles', 'sweets', 'regional spices', 'traditional foods']
      },
      {
        name: 'Luxury & Premium',
        description: 'High-end and luxury products',
        tags: ['designer apparel', 'premium gadgets', 'luxury watches', 'premium accessories']
      },
      {
        name: 'Festive & Seasonal Shopping',
        description: 'Products for festivals and seasonal occasions',
        tags: ['diwali lights', 'rakhi gifts', 'christmas decor', 'holi colors']
      },
      {
        name: 'Pet Supplies',
        description: 'Products for pets and pet care',
        tags: ['pet food', 'toys', 'grooming kits', 'pet accessories']
      },
      {
        name: 'Eco-Friendly Products',
        description: 'Sustainable and environmentally friendly products',
        tags: ['reusable bags', 'solar gadgets', 'organic clothing', 'sustainable products']
      },
    ];

    // Insert categories
    const insertedCategories = await Category.insertMany(coreCategories);
    console.log(`Successfully inserted ${insertedCategories.length} categories`);

    // Create some subcategories for demonstration
    const mobileCategory = insertedCategories.find(c => c.name === 'Mobile Phones');
    const fashionCategory = insertedCategories.find(c => c.name === 'Fashion & Apparel');
    
    if (mobileCategory && fashionCategory) {
      // Mobile subcategories
      const mobileSubcategories = [
        {
          name: 'Smartphones',
          description: 'Latest smartphones from all brands',
          tags: ['android', 'ios', 'flagship', 'budget phones'],
          parentCategory: mobileCategory._id
        },
        {
          name: 'Phone Accessories',
          description: 'Cases, chargers, screen protectors and more',
          tags: ['cases', 'chargers', 'screen guards', 'power banks'],
          parentCategory: mobileCategory._id
        }
      ];

      // Fashion subcategories
      const fashionSubcategories = [
        {
          name: 'Men\'s Clothing',
          description: 'Clothing for men including casual, formal and ethnic wear',
          tags: ['shirts', 'trousers', 'jeans', 't-shirts', 'formal wear'],
          parentCategory: fashionCategory._id
        },
        {
          name: 'Women\'s Clothing',
          description: 'Clothing for women including western, formal and ethnic wear',
          tags: ['dresses', 'tops', 'jeans', 'sarees', 'kurtis'],
          parentCategory: fashionCategory._id
        },
        {
          name: 'Kids Clothing',
          description: 'Clothing for children of all ages',
          tags: ['boys clothing', 'girls clothing', 'infant wear', 'school uniforms'],
          parentCategory: fashionCategory._id
        }
      ];

      // Insert subcategories
      const insertedSubcategories = await Category.insertMany([...mobileSubcategories, ...fashionSubcategories]);
      console.log(`Successfully inserted ${insertedSubcategories.length} subcategories`);
    }

    console.log('Category seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding categories:', error);
    process.exit(1);
  }
}

// Run the seed function
seedCategories();