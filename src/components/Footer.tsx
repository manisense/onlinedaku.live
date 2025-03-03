"use client"

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaTelegram, FaInstagram } from 'react-icons/fa';

const Footer: React.FC = () => {
  const categories = [
    { name: 'Electronics', href: '/category/electronics' },
    { name: 'Fashion', href: '/category/fashion' },
    { name: 'Home & Kitchen', href: '/category/home-kitchen' },
    { name: 'Travel', href: '/category/travel' },
    { name: 'Books', href: '/category/books' },
    { name: 'Gaming', href: '/category/gaming' }
  ];

  const primaryNavLinks = [
    { name: 'Home', href: '/' },
    { name: 'Deals', href: '/deals' },
    { name: 'Coupons', href: '/coupons' },
    { name: 'Freebies', href: '/freebies' },
    { name: 'Stores', href: '/stores' },
    { name: 'Blog', href: '/blog' }
  ];

  const secondaryNavLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Terms of Conditions', href: '/terms' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Return Policy', href: '/returns' }
  ];

  const socialLinks = [
    { name: 'Telegram', href: 'https://t.me/onlinedaku', icon: FaTelegram },
    { name: 'Instagram', href: 'https://www.instagram.com/onlinedaku/', icon: FaInstagram }
  ];

  return (
    <footer className="bg-gray-800 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Branding & Overview */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <div className="flex items-center space-x-2">
                <Image src="/logo.svg" alt="OnlineDaku Logo" width={40} height={40} />
                <span className="text-xl font-bold">OnlineDaku</span>
              </div>
            </Link>
            <p className="text-gray-300 text-sm">
              Your one-stop-shop for unbeatable offers - Daily deals, coupons, and freebies to help you save big!
            </p>
            {/* Newsletter Signup */}
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Get Daily Deals</h3>
              <form className="flex" onSubmit={async (e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const emailInput = form.querySelector('input[type="email"]') as HTMLInputElement;
                const email = emailInput?.value;
                
                if (!email) {
                  alert('Please enter your email address');
                  return;
                }
                
                try {
                  const response = await fetch('/api/newsletter/subscribe', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email }),
                  });
                  
                  const data = await response.json();
                  
                  if (response.ok) {
                    alert(data.message);
                    emailInput.value = '';
                  } else {
                    alert(data.message || 'Failed to subscribe. Please try again.');
                  }
                } catch (error) {
                  console.error('Newsletter subscription error:', error);
                  alert('An error occurred. Please try again later.');
                }
              }}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 rounded-l-md text-gray-900 text-sm"
                  required
                />
                <button
                  type="submit"
                  className="bg-indigo-600 px-4 py-2 rounded-r-md text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <nav className="grid grid-cols-2 gap-2">
              {primaryNavLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <nav className="grid grid-cols-2 gap-2">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  href={category.href}
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  {category.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact & Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Contact & Support</h3>
            <div className="text-gray-300 text-sm space-y-2">
              <p>Email: support@onlinedaku.live</p>
              <p>Support Hours: 24/7</p>
            </div>
            {/* Social Links */}
            <div className="mt-4">
              <h4 className="text-sm font-semibold mb-2">Follow Us</h4>
              <div className="flex space-x-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-300 hover:text-white transition-colors"
                      aria-label={`Follow us on ${social.name}`}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Navigation & Legal */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Secondary Nav */}
            <nav className="flex flex-wrap gap-4 justify-center md:justify-start">
              {secondaryNavLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
            {/* Copyright */}
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} OnlineDaku. All rights reserved.
            </p>
          </div>
        </div>

        {/* Back to Top Button */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
          aria-label="Back to top"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      </div>
    </footer>
  );
};

export default Footer;