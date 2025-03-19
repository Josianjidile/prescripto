import React from "react";
import { assets } from "../assets/assets";

const About = () => {
  return (
    <div className="p-6 sm:p-10">
      {/* About Us Section */}
      <div className="text-center mb-10">
        <p className="text-3xl sm:text-4xl font-bold text-gray-800">
          ABOUT <span className="text-primary">US</span>
        </p>
      </div>

      {/* Image and Description Section */}
      <div className="flex flex-col sm:flex-row items-center gap-8 mb-10">
        {/* Image */}
        <div className="w-full sm:w-1/2">
          <img
            src={assets.about_image}
            alt="About Us"
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>

        {/* Description */}
        <div className="w-full sm:w-1/2">
          <p className="text-gray-600 mb-4">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus
            vel obcaecati, corporis incidunt et nesciunt, in fuga fugiat atque,
            illum iste cum! Eligendi beatae vel assumenda provident distinctio
            molestias minus?
          </p>
          <p className="text-gray-600 mb-4">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus
            vel obcaecati, corporis incidunt et nesciunt, in fuga fugiat atque,
            illum iste cum! Eligendi beatae vel assumenda provident distinctio
            molestias minus?
          </p>
          <b className="text-lg font-semibold text-gray-800">Our Vision</b>
          <p className="text-gray-600 mt-2">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus
            vel obcaecati, corporis incidunt et nesciunt, in fuga fugiat atque,
            illum iste cum! Eligendi beatae vel assumenda provident distinctio
            molestias minus?
          </p>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="text-center mb-10">
        <p className="text-3xl sm:text-4xl font-bold text-gray-800">
          WHY <span className="text-primary">CHOOSE US</span>
        </p>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Efficiency */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <b className="text-lg font-semibold text-gray-800">Efficiency</b>
          <p className="text-gray-600 mt-2">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo
            dolore eum et placeat at dicta obcaecati beatae sunt? Alias soluta
            quis doloribus nemo quisquam, quibusdam aliquid quas dolorum impedit
            similique.
          </p>
        </div>

        {/* Convenience */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <b className="text-lg font-semibold text-gray-800">Convenience</b>
          <p className="text-gray-600 mt-2">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit,
            aperiam laborum. Perferendis odit obcaecati tenetur, voluptate earum
            temporibus aperiam nemo labore perspiciatis! Suscipit error ut dolores
            explicabo! Iure, minima error!
          </p>
        </div>

        {/* Personalization */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <b className="text-lg font-semibold text-gray-800">Personalization</b>
          <p className="text-gray-600 mt-2">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus
            suscipit a saepe repudiandae rem aliquid dolorum quibusdam, voluptas
            rerum qui cupiditate neque adipisci vero iure. Sed, voluptates?
            Fugiat, tenetur delectus.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;