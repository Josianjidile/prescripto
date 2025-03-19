import React from 'react';
import { assets } from '../assets/assets';

const Footer = () => (
  <div className="md:mx-10">
    <div className="flex flex-col sm:grid sm:grid-cols-[3fr_1fr_1fr] gap-14 my-10 text-sm">
      {/* Left - Logo and Description */}
      <div className="flex flex-col items-center sm:items-start">
        <img
          src={assets.logo}
          alt="Logo"
          className="mb-5 w-40"
        />
        <p className="w-full sm:w-2/3 text-gray-500 leading-6">
          We are committed to delivering the best services to our customers. Stay connected with us for the latest updates.
        </p>
      </div>

      {/* Center - Company Links */}
      <div>
        <p className="text-lg font-semibold mb-4 text-gray-600">COMPANY</p>
        <ul className="space-y-2">
          <li>
            <a href="/" className="text-gray-600 hover:text-primary transition-all">
              Home
            </a>
          </li>
          <li>
            <a href="/about" className="text-gray-600 hover:text-primary transition-all">
              About Us
            </a>
          </li>
          <li>
            <a href="/contact" className="text-gray-600 hover:text-primary transition-all">
              Contact Us
            </a>
          </li>
          <li>
            <a href="/privacy-policy" className="text-gray-600 hover:text-primary transition-all">
              Privacy Policy
            </a>
          </li>
        </ul>
      </div>

      {/* Right - Contact Info */}
      <div>
        <p className="text-lg font-semibold mb-4 text-gray-600">GET IN TOUCH</p>
        <ul className="space-y-2">
          <li>
            <a href="tel:0971007363" className="text-gray-600 hover:text-primary transition-all">
              0971007363
            </a>
          </li>
          <li>
            <a href="mailto:josianjidile@gmail.com" className="text-gray-600 hover:text-primary transition-all">
              josianjidile@gmail.com
            </a>
          </li>
        </ul>
      </div>
    </div>

    {/* Copyright */}
    <div>
      <hr />
      <p className="py-5 text-sm text-gray-600 text-center">
        &copy; 2025 Prescripto. All Rights Reserved.
      </p>
    </div>
  </div>
);

export default Footer;