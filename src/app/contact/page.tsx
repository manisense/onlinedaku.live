'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaWhatsapp, FaTelegram, FaArrowRight } from 'react-icons/fa';
import MainLayout from '@/components/Layout/MainLayout';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Contact information
  const contactInfo = [
    {
      icon: FaMapMarkerAlt,
      title: 'Our Location',
      details: ['123 Deal Street', 'Mumbai, Maharashtra 400001', 'India']
    },
    {
      icon: FaPhone,
      title: 'Phone Number',
      details: ['+91 98765 43210', 'Mon-Fri 9am to 6pm']
    },
    {
      icon: FaEnvelope,
      title: 'Email Address',
      details: ['support@onlinedaku.live', 'info@onlinedaku.live']
    }
  ];

  // FAQ questions for quick links
  const faqLinks = [
    { question: 'How do I report a deal that has expired?', href: '/faq#expired-deals' },
    { question: 'Can I submit a deal I found online?', href: '/faq#submit-deal' },
    { question: 'How do I get notified about new deals?', href: '/faq#notifications' },
    { question: 'Do you have an affiliate program?', href: '/faq#affiliate' },
    { question: 'How can I partner with OnlineDaku?', href: '/faq#partnership' }
  ];

  return (
    <MainLayout>
      <main className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-black opacity-30"></div>
        </div>
        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
            <p className="text-xl md:text-2xl mb-8 text-indigo-100">
              Have questions or feedback? We'd love to hear from you.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0)' }}></div>
      </section>

      {/* Contact Information Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {contactInfo.map((info, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-8 text-center transition-transform hover:transform hover:scale-105">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 mb-6">
                  <info.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{info.title}</h3>
                <div className="text-gray-600">
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="mb-1">{detail}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
              
              {submitSuccess && (
                <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-md">
                  Thank you for your message! We'll get back to you soon.
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Your Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${errors.subject ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.subject && <p className="mt-1 text-sm text-red-600">{errors.subject}</p>}
                </div>
                
                <div className="mb-6">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Your Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${errors.message ? 'border-red-500' : 'border-gray-300'}`}
                  ></textarea>
                  {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md font-medium hover:bg-indigo-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
            
            {/* FAQ and Quick Links */}
            <div>
              <div className="bg-gray-50 rounded-lg p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
                <ul className="space-y-4">
                  {faqLinks.map((faq, index) => (
                    <li key={index}>
                      <Link href={faq.href} className="flex items-center justify-between p-4 bg-white rounded-md shadow-sm hover:shadow-md transition-shadow">
                        <span className="text-gray-700">{faq.question}</span>
                        <FaArrowRight className="text-indigo-500" />
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 text-center">
                  <Link href="/faq" className="inline-flex items-center text-indigo-600 font-medium hover:text-indigo-800">
                    View all FAQs
                    <FaArrowRight className="ml-2" />
                  </Link>
                </div>
              </div>
              
              <div className="bg-indigo-600 text-white rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-6">Connect With Us</h2>
                <p className="mb-6">Follow us on social media for the latest deals and updates.</p>
                <div className="flex space-x-4">
                  <a href="https://t.me/onlinedaku" target="_blank" rel="noopener noreferrer" className="bg-white text-indigo-600 p-3 rounded-full hover:bg-indigo-100 transition-colors">
                    <FaTelegram className="w-6 h-6" />
                  </a>
                  <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="bg-white text-indigo-600 p-3 rounded-full hover:bg-indigo-100 transition-colors">
                    <FaWhatsapp className="w-6 h-6" />
                  </a>
                  <a href="mailto:support@onlinedaku.live" className="bg-white text-indigo-600 p-3 rounded-full hover:bg-indigo-100 transition-colors">
                    <FaEnvelope className="w-6 h-6" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Visit Our Office</h2>
            <p className="text-gray-600">
              We're located in the heart of Mumbai. Feel free to drop by during business hours!
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* This would be replaced with an actual map component in production */}
            <div className="h-96 bg-gray-200 flex items-center justify-center">
              <p className="text-gray-500">Google Map would be embedded here</p>
            </div>
          </div>
        </div>
      </section>
    </main>
    </MainLayout>
  );
};

export default ContactPage;