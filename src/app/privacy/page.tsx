'use client';

import React from 'react';
import Link from 'next/link';
import { FaShieldAlt, FaUserLock, FaCookieBite, FaEnvelope } from 'react-icons/fa';
import MainLayout from '@/components/Layout/MainLayout';

const PrivacyPolicyPage = () => {
  // Last updated date
  const lastUpdated = 'November 15, 2023';

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
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Privacy Policy</h1>
            <p className="text-xl md:text-2xl mb-8 text-indigo-100">
              How we collect, use, and protect your information
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0)' }}></div>
      </section>

      {/* Key Privacy Points */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <p className="text-gray-600 text-sm">
                Last Updated: {lastUpdated}
              </p>
              <p className="text-gray-600 text-sm mt-2">
                This Privacy Policy describes how OnlineDaku (we, us, or our) collects, uses, and shares your personal information when you visit our website, use our services, or otherwise interact with us. Please read this policy carefully to understand our practices regarding your information.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <div className="flex items-center mb-4">
                  <FaShieldAlt className="text-indigo-600 text-2xl mr-3" />
                  <h3 className="text-lg font-semibold">Data Protection</h3>
                </div>
                <p className="text-gray-700">
                  We implement appropriate security measures to protect your personal information and maintain data accuracy.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <div className="flex items-center mb-4">
                  <FaUserLock className="text-indigo-600 text-2xl mr-3" />
                  <h3 className="text-lg font-semibold">Your Privacy Rights</h3>
                </div>
                <p className="text-gray-700">
                  You have the right to access, correct, or delete your personal information at any time.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <div className="flex items-center mb-4">
                  <FaCookieBite className="text-indigo-600 text-2xl mr-3" />
                  <h3 className="text-lg font-semibold">Cookie Policy</h3>
                </div>
                <p className="text-gray-700">
                  We use cookies to enhance your browsing experience and analyze site traffic.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <div className="flex items-center mb-4">
                  <FaEnvelope className="text-indigo-600 text-2xl mr-3" />
                  <h3 className="text-lg font-semibold">Marketing Communications</h3>
                </div>
                <p className="text-gray-700">
                  You can opt out of marketing emails at any time by clicking the unsubscribe link.
                </p>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
              <p className="mb-4">
                We collect several types of information from and about users of our website, including:
              </p>
              <ul className="list-disc pl-6 mb-6">
                <li><strong>Personal Information:</strong> Name, email address, postal address, phone number, and other identifiers you choose to provide when you create an account, submit a form, or communicate with us.</li>
                <li><strong>Usage Information:</strong> Information about your internet connection, the equipment you use to access our website, usage details, and browsing patterns.</li>
                <li><strong>Transaction Information:</strong> Details about purchases or other transactions you make through our website, including payment information.</li>
                <li><strong>User Content:</strong> Information and content that you submit to our website, such as reviews, comments, and feedback.</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Collect Information</h2>
              <p className="mb-4">
                We collect information in the following ways:
              </p>
              <ul className="list-disc pl-6 mb-6">
                <li><strong>Direct Collection:</strong> Information you provide when you register, subscribe to our newsletter, fill out a form, or correspond with us.</li>
                <li><strong>Automated Collection:</strong> As you navigate through our website, we may use cookies, web beacons, and other tracking technologies to collect usage information.</li>
                <li><strong>Third-Party Sources:</strong> We may receive information about you from third parties, such as business partners, analytics providers, and advertising networks.</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
              <p className="mb-4">
                We use the information we collect for various purposes, including to:
              </p>
              <ul className="list-disc pl-6 mb-6">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>Send administrative notifications, such as updates to our terms or privacy policy</li>
                <li>Send promotional communications, such as special offers or newsletters (with your consent)</li>
                <li>Personalize your experience and deliver content relevant to your interests</li>
                <li>Monitor and analyze trends, usage, and activities in connection with our website</li>
                <li>Detect, prevent, and address technical issues, fraud, or illegal activity</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Disclosure of Your Information</h2>
              <p className="mb-4">
                We may disclose personal information that we collect or you provide:
              </p>
              <ul className="list-disc pl-6 mb-6">
                <li>To our subsidiaries and affiliates</li>
                <li>To contractors, service providers, and other third parties we use to support our business</li>
                <li>To fulfill the purpose for which you provide it</li>
                <li>For any other purpose disclosed by us when you provide the information</li>
                <li>With your consent</li>
                <li>To comply with any court order, law, or legal process</li>
                <li>To enforce our terms of service and other agreements</li>
                <li>If we believe disclosure is necessary to protect the rights, property, or safety of OnlineDaku, our customers, or others</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Cookies and Tracking Technologies</h2>
              <p className="mb-6">
                We use cookies and similar tracking technologies to track activity on our website and store certain information. Cookies are files with a small amount of data that may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our website.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Third-Party Services</h2>
              <p className="mb-6">
                Our website may contain links to third-party websites, plugins, and applications. Clicking on those links or enabling those connections may allow third parties to collect or share data about you. We do not control these third-party websites and are not responsible for their privacy statements. We encourage you to read the privacy policy of every website you visit.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Data Security</h2>
              <p className="mb-6">
                We have implemented measures designed to secure your personal information from accidental loss and from unauthorized access, use, alteration, and disclosure. However, the transmission of information via the internet is not completely secure. Although we do our best to protect your personal information, we cannot guarantee the security of your personal information transmitted to our website.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Your Rights and Choices</h2>
              <p className="mb-4">
                Depending on your location, you may have certain rights regarding your personal information, including:
              </p>
              <ul className="list-disc pl-6 mb-6">
                <li>The right to access personal information we hold about you</li>
                <li>The right to request correction of inaccurate personal information</li>
                <li>The right to request deletion of your personal information</li>
                <li>The right to withdraw consent at any time, where we rely on consent to process your information</li>
                <li>The right to object to processing of your personal information</li>
                <li>The right to data portability</li>
              </ul>
              <p className="mb-6">
                To exercise these rights, please contact us using the information provided in the Contact Us section below.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Childrens Privacy</h2>
              <p className="mb-6">
                Our website is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe that your child has provided us with personal information, please contact us so that we can delete the information.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Changes to Our Privacy Policy</h2>
              <p className="mb-6">
                We may update our Privacy Policy from time to time. If we make material changes, we will notify you by email or by posting a notice on our website prior to the change becoming effective. We encourage you to review this Privacy Policy periodically for any changes.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contact Us</h2>
              <p className="mb-6">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <p className="mb-6">
                <strong>Email:</strong> privacy@onlinedaku.live<br />
                <strong>Address:</strong> 123 Deal Street, Mumbai, Maharashtra 400001, India<br />
                <strong>Phone:</strong> +91 98765 43210
              </p>
            </div>

            <div className="mt-12 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Related Policies</h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/terms" className="px-4 py-2 bg-white rounded-md shadow-sm text-indigo-600 hover:bg-indigo-50 transition-colors text-center">
                  Terms of Service
                </Link>
                <Link href="/returns" className="px-4 py-2 bg-white rounded-md shadow-sm text-indigo-600 hover:bg-indigo-50 transition-colors text-center">
                  Return Policy
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

export default PrivacyPolicyPage;