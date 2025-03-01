'use client';

import React from 'react';
import Link from 'next/link';
import MainLayout from '@/components/Layout/MainLayout';

const TermsOfServicePage = () => {
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
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Terms of Service</h1>
            <p className="text-xl md:text-2xl mb-8 text-indigo-100">
              Please read these terms carefully before using our platform.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0)' }}></div>
      </section>

      {/* Terms Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <p className="text-gray-600 text-sm">
                Last Updated: {lastUpdated}
              </p>
              <p className="text-gray-600 text-sm mt-2">
                These Terms of Service ("Terms") govern your access to and use of the OnlineDaku website, services, and applications (collectively, the "Services"). Please read these Terms carefully, and contact us if you have any questions.
              </p>
            </div>

            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="mb-6">
                By accessing or using our Services, you agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, you may not access or use the Services.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Changes to Terms</h2>
              <p className="mb-6">
                We may modify the Terms at any time. If we do this, we will post the changes on this page and update the "Last Updated" date at the top of this page. It is your responsibility to review these Terms frequently. Your continued use of the Services following the posting of revised Terms means that you accept and agree to the changes.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Using Our Services</h2>
              <p className="mb-4">
                You may use our Services only as permitted by these Terms and any applicable laws. You may not use our Services:
              </p>
              <ul className="list-disc pl-6 mb-6">
                <li>In any way that violates any applicable national, federal, state, local, or international law or regulation</li>
                <li>To transmit, or procure the sending of, any advertising or promotional material, including any "junk mail," "chain letter," "spam," or any other similar solicitation</li>
                <li>To impersonate or attempt to impersonate OnlineDaku, an OnlineDaku employee, another user, or any other person or entity</li>
                <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Services, or which may harm OnlineDaku or users of the Services</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. User Accounts</h2>
              <p className="mb-6">
                When you create an account with us, you must provide accurate, complete, and current information. You are responsible for safeguarding the password that you use to access the Services and for any activities or actions under your password. You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Content and Deals</h2>
              <p className="mb-4">
                Our Services allow you to view deals, discounts, and other content. You understand that:
              </p>
              <ul className="list-disc pl-6 mb-6">
                <li>We do not guarantee the accuracy, completeness, or quality of any deals or content displayed on our Services</li>
                <li>Deals may expire or change without notice</li>
                <li>We are not responsible for any transactions between you and third-party retailers</li>
                <li>We may earn commissions from retailers when you make purchases through links on our platform</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. User-Generated Content</h2>
              <p className="mb-4">
                Our Services may allow you to post, submit, or transmit content such as comments, reviews, or deal submissions ("User Content"). By providing any User Content, you grant us and our affiliates a nonexclusive, royalty-free, perpetual, irrevocable, and fully sublicensable right to use, reproduce, modify, adapt, publish, translate, create derivative works from, distribute, and display such content throughout the world in any media.
              </p>
              <p className="mb-6">
                You represent and warrant that:
              </p>
              <ul className="list-disc pl-6 mb-6">
                <li>You own or control all rights in and to the User Content you post</li>
                <li>All User Content you provide is accurate, complete, and not misleading</li>
                <li>Your User Content does not violate these Terms</li>
                <li>Your User Content will not cause injury to any person or entity</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Intellectual Property Rights</h2>
              <p className="mb-6">
                The Services and their entire contents, features, and functionality (including but not limited to all information, software, text, displays, images, video, and audio, and the design, selection, and arrangement thereof) are owned by OnlineDaku, its licensors, or other providers of such material and are protected by copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Termination</h2>
              <p className="mb-6">
                We may terminate or suspend your account and bar access to the Services immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms. If you wish to terminate your account, you may simply discontinue using the Services or contact us to request account deletion.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Limitation of Liability</h2>
              <p className="mb-6">
                In no event will OnlineDaku, its affiliates, or their licensors, service providers, employees, agents, officers, or directors be liable for damages of any kind, under any legal theory, arising out of or in connection with your use, or inability to use, the Services, including any direct, indirect, special, incidental, consequential, or punitive damages, including but not limited to, personal injury, pain and suffering, emotional distress, loss of revenue, loss of profits, loss of business or anticipated savings, loss of use, loss of goodwill, loss of data, and whether caused by tort (including negligence), breach of contract, or otherwise, even if foreseeable.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Disclaimer of Warranties</h2>
              <p className="mb-6">
                Your use of the Services is at your sole risk. The Services are provided on an "AS IS" and "AS AVAILABLE" basis. The Services are provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement, or course of performance.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Governing Law</h2>
              <p className="mb-6">
                These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Us</h2>
              <p className="mb-6">
                If you have any questions about these Terms, please contact us at:
              </p>
              <p className="mb-6">
                <strong>Email:</strong> legal@onlinedaku.live<br />
                <strong>Address:</strong> 123 Deal Street, Mumbai, Maharashtra 400001, India
              </p>
            </div>

            <div className="mt-12 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Related Policies</h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/privacy" className="px-4 py-2 bg-white rounded-md shadow-sm text-indigo-600 hover:bg-indigo-50 transition-colors text-center">
                  Privacy Policy
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

export default TermsOfServicePage;