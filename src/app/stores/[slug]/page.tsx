import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Store } from '@/models/Store';
import Deal from '@/models/Deal';
import Coupon from '@/models/Coupon';
import dbConnect from '@/utils/dbConnect';
import { Types } from 'mongoose';
import MainLayout from '@/components/Layout/MainLayout';
import SearchBar from '@/components/Search/SearchBar';



interface StoreData {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  logo?: string;
  website: string;
  isActive: boolean;
  categories: string[];
  createdAt: string;
  updatedAt: string;
}

interface DealData {
  _id: Types.ObjectId;
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  link: string;
}

interface CouponData {
  _id: Types.ObjectId;
  title: string;
  description: string;
  code: string;
}

interface StoreDocument {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  logo?: string;
  website: string;
  isActive: boolean;
  categories: Types.ObjectId[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface DealDocument {
  _id: Types.ObjectId;
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  link: string;
  store: string;
  isActive: boolean;
  __v: number;
}

interface CouponDocument {
  _id: Types.ObjectId;
  title: string;
  description: string;
  code: string;
  store: string;
  isActive: boolean;
  __v: number;
}

async function getStoreData(slug: string) {
  await dbConnect();
  
  const store = await Store.findOne({ slug, isActive: true })
    .populate('categories')
    .lean() as unknown as StoreDocument;

  if (!store) return null;

  const [deals, coupons] = await Promise.all([
    Deal.find({ store: store.name, isActive: true })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean() as unknown as Promise<DealDocument[]>,
    Coupon.find({ store: store.name, isActive: true })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean() as unknown as Promise<CouponDocument[]>
  ]);

  return { 
    store: {
      _id: store._id,
      name: store.name,
      slug: store.slug,
      description: store.description,
      logo: store.logo,
      website: store.website,
      isActive: store.isActive,
      categories: store.categories.map(category => category.toString()),
      createdAt: store.createdAt,
      updatedAt: store.updatedAt
    } as StoreData,
    deals: deals.map(deal => ({
      _id: deal._id,
      title: deal.title,
      description: deal.description,
      discountType: deal.discountType,
      discountValue: deal.discountValue,
      link: deal.link
    })) as DealData[],
    coupons: coupons.map(coupon => ({
      _id: coupon._id,
      title: coupon.title,
      description: coupon.description,
      code: coupon.code
    })) as CouponData[]
  };
}

export default async function StorePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getStoreData(slug);

  if (!data) {
    notFound();
  }

  const { store, deals, coupons } = data;

  return (
    <MainLayout >
      <SearchBar />
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Store Info Section */}
        <div className="md:col-span-2 bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center space-x-4 mb-6">
            <Image
              src={store.logo || '/images/placeholder.png'}
              alt={store.name}
              width={100}
              height={100}
              className="rounded-lg"
            />
            <div>
              <h1 className="text-3xl font-bold">{store.name}</h1>
            </div>
          </div>

          <div className="prose max-w-none mb-6">
            <h2 className="text-xl font-semibold mb-2">About {store.name}</h2>
            <p className="text-gray-600">{store.description}</p>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Website</h2>
            <a 
              href={store.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              {store.website}
            </a>
          </div>
        </div>

        {/* Deals and Coupons Section */}
        <div className="space-y-6">
          {deals.length > 0 && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Latest Deals</h2>
              <div className="space-y-4">
                {deals.map((deal) => (
                  <div key={deal._id.toString()} className="border-b pb-4 last:border-b-0 last:pb-0">
                    <h3 className="font-medium">{deal.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{deal.description}</p>
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-green-600 font-medium">
                        {deal.discountType === 'percentage' ? `${deal.discountValue}% OFF` : `₹${deal.discountValue} OFF`}
                      </span>
                      <a
                        href={deal.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Get Deal →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {coupons.length > 0 && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Active Coupons</h2>
              <div className="space-y-4">
                {coupons.map((coupon) => (
                  <div key={coupon._id.toString()} className="border-b pb-4 last:border-b-0 last:pb-0">
                    <h3 className="font-medium">{coupon.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{coupon.description}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm">{coupon.code}</code>
                      <button
                        onClick={() => navigator.clipboard.writeText(coupon.code)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Copy Code
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </MainLayout>
  );
}