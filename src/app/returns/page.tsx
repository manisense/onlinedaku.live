'use client';

import React from 'react';
import Link from 'next/link';
import { FaExchangeAlt,  FaInfoCircle, FaQuestionCircle } from 'react-icons/fa';
import MainLayout from '@/components/Layout/MainLayout';
import SearchBar from '@/components/Search/SearchBar';

const ReturnPolicyPage = () => {
  // Last updated date
  const lastUpdated = 'November 15, 2023';

  // Common retailer return policies
  const retailerPolicies = [
    {
      name: 'Amazon',
      period: '10 days for electronics, 30 days for most other items',
      conditions: 'Items must be unused and in original packaging',
      link: 'https://www.amazon.in/gp/help/customer/display.html?nodeId=201149900'
    },
    {
      name: 'Flipkart',
      period: '7-10 days depending on product category',
      conditions: 'Items must be unused with all original tags and packaging',
      link: 'https://www.flipkart.com/pages/returnpolicy'
    },
    {
      name: 'Myntra',
      period: '14-30 days depending on product category',
      conditions: 'Items must be unworn/unused with original tags',
      link: 'https://www.myntra.com/returnpolicy'
    },
    {
      name: 'Nykaa',
      period: '7-15 days depending on product category',
      conditions: 'Products must be unused and in original packaging',
      link: 'https://www.nykaa.com/return-and-exchange-policy'
    }
  ];

  // Return process steps
  const returnSteps = [
    {
      title: 'Check the retailer\'s policy',
      description: 'Verify the return window and conditions for the specific retailer where you made your purchase.'
    },
    {
      title: 'Initiate the return',
      description: 'Log into your account on the retailer\'s website and find your order to start the return process.'
    },
    {
      title: 'Package the item',
      description: 'Carefully repack the item in its original packaging with all accessories and documentation.'
    },
    {
      title: 'Ship or drop off',
      description: 'Follow the retailer\'s instructions to either ship the item back or drop it at a designated location.'
    },
    {
      title: 'Track your refund',
      description: 'Most retailers provide tracking for returns and will notify you when your refund is processed.'
    }
  ];

  // FAQ items
  const faqs = [
    {
      question: 'Does OnlineDaku handle returns directly?',
      answer: 'No, OnlineDaku is a deal discovery platform, not a retailer. All returns must be processed through the retailer where you made your purchase.'
    },
    {
      question: 'What if my item arrived damaged?',
      answer: 'Contact the retailer immediately with photos of the damaged item and packaging. Most retailers have special procedures for damaged items.'
    },
    {
      question: 'Can OnlineDaku help if I have issues with a return?',
      answer: 'While we don\'t process returns, our customer support team can provide guidance if you\'re having difficulty with a retailer. Contact us at support@onlinedaku.live.'
    },
    {
      question: 'Do I need to pay for return shipping?',
      answer: 'This depends on the retailer\'s policy and the reason for return. Many retailers offer free returns for defective items, but may charge for returns due to change of mind.'
    },
    {
      question: 'How long do refunds typically take?',
      answer: 'Most retailers process refunds within 5-14 business days after receiving your return. The time for the refund to appear in your account depends on your payment method and bank.'
    }
  ];

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
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Return Policy</h1>
            <p className="text-xl md:text-2xl mb-8 text-indigo-100">
              Information about returns and refunds for purchases made through our platform
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0)' }}></div>
      </section>

      {/* Policy Overview */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <p className="text-gray-600 text-sm">
                Last Updated: {lastUpdated}
              </p>
              <p className="text-gray-600 text-sm mt-2">
                OnlineDaku is a deal discovery platform that connects you with offers from various retailers. As we are not a direct retailer, all purchases are made through third-party websites, and returns are subject to each retailers specific return policy.
              </p>
            </div>

            <div className="prose prose-lg max-w-none mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Role in Returns</h2>
              <p>
                When you click on a deal on OnlineDaku and make a purchase, your transaction is with the retailer, not with OnlineDaku. This means:
              </p>
              <ul className="list-disc pl-6 mb-6">
                <li>All returns must be initiated and processed through the retailer where you made your purchase</li>
                <li>Return eligibility, timeframes, and conditions are determined by each retailers policy</li>
                <li>Refunds are processed by the retailer according to their refund procedures</li>
              </ul>
              <p>
                While we strive to partner with reputable retailers who offer fair return policies, OnlineDaku cannot guarantee the return policy of any retailer or intervene in the return process.
              </p>
            </div>

            {/* Return Process Steps */}
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">General Return Process</h2>
              <div className="relative">
                {/* Process timeline line */}
                <div className="absolute left-8 top-0 bottom-0 w-1 bg-indigo-100 hidden md:block"></div>
                
                <div className="space-y-8">
                  {returnSteps.map((step, index) => (
                    <div key={index} className="flex items-start">
                      <div className="flex-shrink-0 bg-indigo-500 text-white w-16 h-16 rounded-full flex items-center justify-center mr-4 z-10">
                        <span className="text-xl font-bold">{index + 1}</span>
                      </div>
                      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 flex-grow">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                        <p className="text-gray-700">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Common Retailer Policies */}
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Common Retailer Return Policies</h2>
              <p className="text-gray-700 mb-6">
                Below is a general overview of return policies for some popular retailers. Please note that these are subject to change, and you should always check the retailers official website for the most current policy.
              </p>
              
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="py-3 px-4 text-left text-gray-700 font-semibold border-b">Retailer</th>
                      <th className="py-3 px-4 text-left text-gray-700 font-semibold border-b">Return Period</th>
                      <th className="py-3 px-4 text-left text-gray-700 font-semibold border-b">Conditions</th>
                      <th className="py-3 px-4 text-left text-gray-700 font-semibold border-b">Policy Link</th>
                    </tr>
                  </thead>
                  <tbody>
                    {retailerPolicies.map((retailer, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="py-3 px-4 border-b border-gray-200 font-medium">{retailer.name}</td>
                        <td className="py-3 px-4 border-b border-gray-200">{retailer.period}</td>
                        <td className="py-3 px-4 border-b border-gray-200">{retailer.conditions}</td>
                        <td className="py-3 px-4 border-b border-gray-200">
                          <a 
                            href={retailer.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-800 underline"
                          >
                            View Policy
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* FAQs */}
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <FaQuestionCircle className="text-indigo-500 mr-2" />
                      {faq.question}
                    </h3>
                    <p className="text-gray-700">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Section */}
            <div className="bg-indigo-50 p-8 rounded-lg border border-indigo-100">
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Need More Help?</h2>
                  <p className="text-gray-700 mb-4">
                    If youre experiencing issues with a return or have questions about a retailers policy, our support team is here to help guide you.
                  </p>
                  <div className="flex space-x-4">
                    <Link 
                      href="/contact" 
                      className="bg-indigo-600 text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-700 transition-colors inline-flex items-center"
                    >
                      <FaInfoCircle className="mr-2" />
                      Contact Support
                    </Link>
                    <Link 
                      href="/faq" 
                      className="bg-white text-indigo-600 border border-indigo-600 px-6 py-3 rounded-md font-medium hover:bg-indigo-50 transition-colors inline-flex items-center"
                    >
                      <FaQuestionCircle className="mr-2" />
                      View FAQs
                    </Link>
                  </div>
                </div>
                <div className="md:w-1/3 flex justify-center">
                  <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                    <FaExchangeAlt className="w-12 h-12" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Related Policies</h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/terms" className="px-4 py-2 bg-white rounded-md shadow-sm text-indigo-600 hover:bg-indigo-50 transition-colors text-center">
                  Terms of Service
                </Link>
                <Link href="/privacy" className="px-4 py-2 bg-white rounded-md shadow-sm text-indigo-600 hover:bg-indigo-50 transition-colors text-center">
                  Privacy Policy
                </Link>
                <Link href="/contact" className="px-4 py-2 bg-white rounded-md shadow-sm text-indigo-600 hover:bg-indigo-50 transition-colors text-center">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
    </MainLayout>
  );
};

export default ReturnPolicyPage;