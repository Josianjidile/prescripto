import React from "react";
import { assets } from "../assets/assets";

const Contact = () => {
  return (
    <div className="p-6 sm:p-10">
      {/* Contact Us Heading */}
      <div className="text-center mb-10">
        <p className="text-3xl sm:text-4xl font-bold text-gray-800">
          CONTACT <span className="text-primary">US</span>
        </p>
      </div>

      {/* Contact Content */}
      <div className="flex flex-col sm:flex-row items-center gap-8">
        {/* Contact Image */}
        <div className="w-full sm:w-1/2">
          <img
            src={assets.contact_image}
            alt="Contact Us"
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>

        {/* Contact Information */}
        <div className="w-full sm:w-1/2">
          <p className="text-xl font-semibold text-gray-800 mb-4">Our Office</p>
          <p className="text-gray-600 mb-2">76535 Posta Street</p>
          <p className="text-gray-600 mb-2">Dar es Salaam, Tanzania</p>
          <p className="text-gray-600 mb-4">
            Tel: 0710227324 <br />
            Email: Josia Njidile
          </p>

          {/* Careers Section */}
          <div className="mt-6">
            <p className="text-xl font-semibold text-gray-800 mb-2">
              Careers at PRESCRIPTO
            </p>
            <p className="text-gray-600 mb-4">
              Learn more about our teams and job openings.
            </p>
            {/* Explore Jobs Button */}
            <a
              href="https://job-portal-project-mu.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-2 bg-primary text-white rounded-lg shadow-md hover:bg-primary-dark transition-colors duration-300"
            >
              Explore Jobs
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;