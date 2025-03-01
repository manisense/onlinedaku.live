"use client"

import Link from 'next/link';
import { FaTelegram } from 'react-icons/fa';

const TelegramBanner = () => {
  return (
    <div className="bg-blue-500 text-white py-2 text-center">
      <Link 
        href="https://t.me/onlinedaku" 
        target="_blank" 
        rel="noopener noreferrer"
        className="inline-flex items-center hover:text-blue-100 transition-colors"
      >
        <FaTelegram className="mr-2 text-lg" />
        Join our Telegram channel for latest deals!
      </Link>
    </div>
  );
};

export default TelegramBanner;