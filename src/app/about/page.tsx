'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaLinkedin, FaTwitter, FaEnvelope, FaArrowRight } from 'react-icons/fa';
import MainLayout from '@/components/Layout/MainLayout';

const AboutPage = () => {
  // Team members data
  const teamMembers = [
    {
      name: 'Rahul Sharma',
      role: 'Founder & CEO',
      bio: 'Passionate about finding the best deals and making them accessible to everyone.',
      image: '/images/placeholder.png',
      social: {
        linkedin: '#',
        twitter: '#',
        email: 'rahul@onlinedaku.live'
      }
    },
    {
      name: 'Priya Patel',
      role: 'Chief Marketing Officer',
      bio: 'Digital marketing expert with a knack for spotting trends before they go mainstream.',
      image: '/images/placeholder.png',
      social: {
        linkedin: '#',
        twitter: '#',
        email: 'priya@onlinedaku.live'
      }
    },
    {
      name: 'Vikram Singh',
      role: 'Head of Partnerships',
      bio: 'Building relationships with top brands to bring exclusive deals to our users.',
      image: '/images/placeholder.png',
      social: {
        linkedin: '#',
        twitter: '#',
        email: 'vikram@onlinedaku.live'
      }
    },
    {
      name: 'Neha Gupta',
      role: 'Content Manager',
      bio: 'Curating the best deals and creating engaging content for our community.',
      image: '/images/placeholder.png',
      social: {
        linkedin: '#',
        twitter: '#',
        email: 'neha@onlinedaku.live'
      }
    }
  ];

  // Testimonials data
  const testimonials = [
    {
      quote: "OnlineDaku has saved me thousands of rupees on my online shopping. It's my go-to site before making any purchase!",
      author: "Amit K.",
      location: "Mumbai"
    },
    {
      quote: "I love the daily deal alerts. The team finds discounts I would never discover on my own.",
      author: "Sneha R.",
      location: "Delhi"
    },
    {
      quote: "The blog posts about saving money have completely changed how I shop online. Highly recommended!",
      author: "Rajesh M.",
      location: "Bangalore"
    }
  ];

  // Stats
  const stats = [
    { value: '10,000+', label: 'Daily Visitors' },
    { value: '50,000+', label: 'Deals Shared' },
    { value: '₹1 Crore+', label: 'User Savings' },
    { value: '500+', label: 'Partner Brands' }
  ];

  return (
    <MainLayout>
      <main className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-black opacity-30"></div>
        </div>
        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About OnlineDaku</h1>
            <p className="text-xl md:text-2xl mb-8 text-indigo-100">
              Were on a mission to help Indians save money on every online purchase.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0)' }}></div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <Image 
                src="/images/placeholder.png" 
                alt="Our Story" 
                width={600} 
                height={400} 
                className="rounded-lg shadow-xl object-cover"
              />
            </div>
            <div className="md:w-1/2 space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">Our Story</h2>
              <p className="text-gray-700 leading-relaxed">
                Founded in 2020, OnlineDaku started with a simple idea: everyone deserves to get the best value for their money when shopping online.
              </p>
              <p className="text-gray-700 leading-relaxed">
                What began as a small WhatsApp group sharing deals among friends quickly grew into one of Indias most trusted platforms for discovering discounts, coupons, and shopping tips.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Today, we help millions of shoppers save money every month by curating the best deals from hundreds of online stores and brands across India.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission & Values</h2>
            <p className="text-gray-700 text-lg">
              We believe in transparency, community, and making smart shopping accessible to everyone.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md transition-transform hover:translate-y-[-5px]">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Save Money</h3>
              <p className="text-gray-700">
                Were committed to helping our community save on every purchase by finding and sharing the best deals, discounts, and shopping strategies.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md transition-transform hover:translate-y-[-5px]">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Build Community</h3>
              <p className="text-gray-700">
                We foster a community of smart shoppers who share tips, experiences, and discoveries to help each other make informed purchasing decisions.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md transition-transform hover:translate-y-[-5px]">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Ensure Trust</h3>
              <p className="text-gray-700">
                We verify every deal we share and maintain complete transparency about our partnerships, ensuring our users can shop with confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-indigo-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="p-6">
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-indigo-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-gray-700 text-lg">
              The passionate people behind OnlineDaku who work tirelessly to find you the best deals.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md transition-all hover:shadow-xl">
                <div className="h-64 overflow-hidden">
                  <Image 
                    src={member.image} 
                    alt={member.name} 
                    width={300} 
                    height={300} 
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                  <p className="text-indigo-600 mb-3">{member.role}</p>
                  <p className="text-gray-700 mb-4">{member.bio}</p>
                  <div className="flex space-x-3">
                    <a href={member.social.linkedin} className="text-gray-500 hover:text-indigo-600 transition-colors">
                      <FaLinkedin className="w-5 h-5" />
                    </a>
                    <a href={member.social.twitter} className="text-gray-500 hover:text-indigo-600 transition-colors">
                      <FaTwitter className="w-5 h-5" />
                    </a>
                    <a href={`mailto:${member.social.email}`} className="text-gray-500 hover:text-indigo-600 transition-colors">
                      <FaEnvelope className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
            <p className="text-gray-700 text-lg">
              Dont just take our word for it - hear from our community of smart shoppers.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-md">
                <div className="mb-4 text-indigo-600">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>
                <p className="text-gray-700 mb-6">{testimonial.quote}</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.author}</p>
                  <p className="text-sm text-gray-500">{testimonial.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-xl overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-3/5 p-8 md:p-12">
                <h2 className="text-3xl font-bold text-white mb-4">Join Our Community of Smart Shoppers</h2>
                <p className="text-indigo-100 mb-6">
                  Get the best deals delivered directly to your inbox. No spam, just savings!
                </p>
                <form className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="email"
                      placeholder="Your email address"
                      className="px-4 py-3 rounded-md flex-1 text-gray-900"
                      required
                    />
                    <button
                      type="submit"
                      className="bg-indigo-800 hover:bg-indigo-900 text-white px-6 py-3 rounded-md font-medium transition-colors duration-300"
                    >
                      Subscribe
                    </button>
                  </div>
                  <p className="text-xs text-indigo-200">
                    By subscribing, you agree to our Privacy Policy. We respect your privacy and will never share your information.
                  </p>
                </form>
              </div>
              <div className="md:w-2/5 bg-indigo-800 p-8 md:p-12 flex flex-col justify-center">
                <div className="space-y-4">
                  <Link 
                    href="/deals" 
                    className="flex items-center justify-between bg-white text-indigo-700 px-6 py-3 rounded-md font-medium hover:bg-indigo-50 transition-colors duration-300"
                  >
                    <span>Browse Latest Deals</span>
                    <FaArrowRight />
                  </Link>
                  <Link 
                    href="/contact" 
                    className="flex items-center justify-between bg-indigo-700 text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-600 transition-colors duration-300"
                  >
                    <span>Contact Us</span>
                    <FaArrowRight />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
    </MainLayout>
  );
};

export default AboutPage;
