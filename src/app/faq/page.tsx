'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FaChevronDown, FaChevronUp, FaSearch } from 'react-icons/fa';
import MainLayout from '@/components/Layout/MainLayout';
import SearchBar from '@/components/Search/SearchBar';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const FAQPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // FAQ Categories
  const categories = [
    { id: 'all', name: 'All Questions' },
    { id: 'deals', name: 'Deals & Discounts' },
    { id: 'shopping', name: 'Shopping' },
    { id: 'account', name: 'Account' },
    { id: 'partnership', name: 'Partnerships' },
  ];

  // FAQ Data
  const faqItems: FAQItem[] = [
    {
      id: 'expired-deals',
      question: 'How do I report a deal that has expired?',
      answer: 'If you find an expired deal on our platform, please click the "Report Expired" button on the deal page. Alternatively, you can contact us through our support form with details about the expired deal. We appreciate your help in keeping our deals up-to-date!',
      category: 'deals'
    },
    {
      id: 'submit-deal',
      question: 'Can I submit a deal I found online?',
      answer: 'Yes! We welcome deal submissions from our community. Click on the "Submit Deal" button in the navigation menu, fill out the form with all relevant details including the product link, price, and discount information. Our team will review your submission and publish it if it meets our criteria.',
      category: 'deals'
    },
    {
      id: 'notifications',
      question: 'How do I get notified about new deals?',
      answer: 'You can receive notifications about new deals in several ways: 1) Subscribe to our email newsletter, 2) Join our Telegram channel, 3) Enable browser notifications on our website, or 4) Follow us on social media platforms. You can customize your notification preferences in your account settings.',
      category: 'deals'
    },
    {
      id: 'deal-verification',
      question: 'How do you verify deals before posting?',
      answer: 'Our team manually verifies each deal before publishing it on our platform. We check for accuracy of pricing, availability, and terms. We also test coupon codes to ensure they work. This process helps maintain the quality and reliability of deals on OnlineDaku.',
      category: 'deals'
    },
    {
      id: 'price-tracking',
      question: 'Does OnlineDaku track price history?',
      answer: 'Yes, for many popular products, we track price history across major retailers. This helps you determine if a current deal is truly a good value compared to historical prices. You can view price history charts on individual product pages where available.',
      category: 'shopping'
    },
    {
      id: 'cashback',
      question: 'How does cashback work on OnlineDaku?',
      answer: 'When you click on certain deals on our site and make a purchase, we may earn a commission. We share a portion of this commission with you as cashback. To receive cashback, you need to be logged into your OnlineDaku account before clicking on the deal. Cashback typically appears in your account within 30-60 days after purchase confirmation.',
      category: 'shopping'
    },
    {
      id: 'return-policy',
      question: 'What is your return policy?',
      answer: 'OnlineDaku is a deal discovery platform, not a retailer. Return policies are determined by the individual stores where you make your purchases. We recommend checking the return policy of each retailer before completing your purchase. You can find links to most retailers\'s return policies on our Return Policy page.',
      category: 'shopping'
    },
    {
      id: 'account-creation',
      question: 'Do I need an account to use OnlineDaku?',
      answer: 'No, you can browse deals without creating an account. However, creating a free account gives you additional benefits such as deal alerts, saved favorites, cashback opportunities, and the ability to comment on deals and participate in our community.',
      category: 'account'
    },
    {
      id: 'delete-account',
      question: 'How do I delete my account?',
      answer: 'To delete your account, go to Account Settings > Privacy, and click on "Delete Account". Follow the prompts to confirm deletion. Please note that account deletion is permanent and will remove all your saved deals, comments, and earned cashback that hasn\'t been paid out.',
      category: 'account'
    },
    {
      id: 'affiliate',
      question: 'Do you have an affiliate program?',
      answer: 'Yes, we have an affiliate program for content creators, bloggers, and influencers. As an affiliate, you can earn commissions by referring users to OnlineDaku. Visit our Affiliates page for more information on commission rates and how to join the program.',
      category: 'partnership'
    },
    {
      id: 'partnership',
      question: 'How can I partner with OnlineDaku?',
      answer: 'We offer various partnership opportunities for brands and retailers. These include featured deals, sponsored content, and exclusive promotions. Please contact our partnerships team at partnerships@onlinedaku.live with details about your company and partnership interests.',
      category: 'partnership'
    },
    {
      id: 'brand-promotion',
      question: 'How can my brand be featured on OnlineDaku?',
      answer: 'Brands can be featured on OnlineDaku through our promotional packages. Options include homepage features, category sponsorships, dedicated email campaigns, and social media promotions. Contact our marketing team at marketing@onlinedaku.live for current rates and availability.',
      category: 'partnership'
    },
  ];

  // Toggle FAQ item expansion
  const toggleItem = (id: string) => {
    setExpandedItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Filter FAQ items based on search and category
  const filteredFAQs = faqItems.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <MainLayout>
       <SearchBar />
      <main className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-black opacity-30"></div>
        </div>
        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Frequently Asked Questions</h1>
            <p className="text-xl md:text-2xl mb-8 text-indigo-100">
              Find answers to common questions about OnlineDaku and our services.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0)' }}></div>
      </section>

      {/* Search and Categories Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Search Bar */}
            <div className="mb-8 relative">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Categories */}
            <div className="mb-12 flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeCategory === category.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* FAQ Items */}
            <div className="space-y-6">
              {filteredFAQs.length > 0 ? (
                filteredFAQs.map(item => (
                  <div 
                    key={item.id} 
                    id={item.id}
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <button
                      onClick={() => toggleItem(item.id)}
                      className="w-full flex items-center justify-between p-6 text-left bg-white hover:bg-gray-50 transition-colors"
                    >
                      <h3 className="text-lg font-medium text-gray-900">{item.question}</h3>
                      {expandedItems.includes(item.id) ? (
                        <FaChevronUp className="text-indigo-600 flex-shrink-0" />
                      ) : (
                        <FaChevronDown className="text-indigo-600 flex-shrink-0" />
                      )}
                    </button>
                    {expandedItems.includes(item.id) && (
                      <div className="p-6 bg-gray-50 border-t border-gray-200">
                        <p className="text-gray-700 whitespace-pre-line">{item.answer}</p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <p className="text-gray-500 text-lg">No questions found matching your search.</p>
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      setActiveCategory('all');
                    }}
                    className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Clear search and show all questions
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Still Have Questions Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Still Have Questions?</h2>
            <p className="text-gray-700 text-lg mb-8">
              Cant find the answer youre looking for? Please contact our friendly support team.
            </p>
            <Link 
              href="/contact" 
              className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-700 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
    </MainLayout>
  );
};

export default FAQPage;