import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import * as dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

// Setup environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../../.env') });

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

// Define the Admin Schema exactly as in src/models/Admin.ts
const AdminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false,
  },
  role: {
    type: String,
    enum: ['admin', 'super_admin'],
    default: 'admin',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  lastLogin: {
    type: Date,
  },
  permissions: [{
    type: String,
    enum: [
      'manage_deals',
      'manage_coupons',
      'manage_users',
      'manage_admins',
      'view_analytics',
      'manage_settings'
    ]
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

// Add the same methods as in the Admin model
AdminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

AdminSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

AdminSchema.methods.getPermissions = function() {
  if (this.role === 'super_admin') {
    return [
      'manage_deals',
      'manage_coupons',
      'manage_users',
      'manage_admins',
      'view_analytics',
      'manage_settings'
    ];
  }
  return this.permissions;
};

const settingsSchema = new mongoose.Schema({
  settingKey: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  settingValue: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'site',
      'deals',
      'coupons',
      'notifications',
      'security',
      'analytics'
    ]
  },
  description: {
    type: String,
    required: true
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create models
const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);
const AdminSettings = mongoose.models.AdminSettings || mongoose.model('AdminSettings', settingsSchema);

async function dbConnect() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    console.log('Database name:', mongoose.connection.name);
    console.log('Connection state:', mongoose.connection.readyState);
    
    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
    // Count existing admins before deletion
    const existingAdminsCount = await Admin.countDocuments();
    console.log('Existing admins before deletion:', existingAdminsCount);
    
    return mongoose.connection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

async function seedAdminData() {
  try {
    const connection = await dbConnect();
    console.log('Using database:', connection.name);

    // First, clear existing data
    console.log('Clearing existing data...');
    const deleteAdminsResult = await Admin.deleteMany({});
    console.log('Deleted admins count:', deleteAdminsResult.deletedCount);
    
    const deleteSettingsResult = await AdminSettings.deleteMany({});
    console.log('Deleted settings count:', deleteSettingsResult.deletedCount);

    console.log('Creating admin accounts...');

    // Create super admin
    const superAdmin = await Admin.create({
      name: 'Super Admin',
      email: 'super@onlinedaku.live',
      password: 'SuperAdmin@123',
      role: 'super_admin',
      isActive: true,
      permissions: [
        'manage_deals',
        'manage_coupons',
        'manage_users',
        'manage_admins',
        'view_analytics',
        'manage_settings'
      ]
    });

    console.log('Super admin created:', superAdmin.toObject());

    // Create regular admin
    const admin = await Admin.create({
      name: 'Regular Admin',
      email: 'admin@onlinedaku.live',
      password: 'Admin@123', // Will be hashed by pre-save middleware
      role: 'admin',
      permissions: ['manage_deals', 'manage_coupons', 'view_analytics'],
      isActive: true,
    });

    console.log('Regular admin created:', admin.email);

    // Create settings...
    const settings = [
      {
        settingKey: 'site_name',
        settingValue: 'Online Daku',
        category: 'site',
        description: 'Website name',
        lastUpdatedBy: superAdmin._id,
        isPublic: true,
      },
      {
        settingKey: 'deals_per_page',
        settingValue: 12,
        category: 'deals',
        description: 'Number of deals to show per page',
        lastUpdatedBy: superAdmin._id,
        isPublic: true,
      },
      {
        settingKey: 'maintenance_mode',
        settingValue: false,
        category: 'site',
        description: 'Enable/disable maintenance mode',
        lastUpdatedBy: superAdmin._id,
        isPublic: false,
      },
    ];

    await AdminSettings.insertMany(settings);
    console.log('Settings created successfully');

    console.log('Admin data seeded successfully!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin data:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

// Execute the seed function
(async () => {
  try {
    await seedAdminData();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
})(); 