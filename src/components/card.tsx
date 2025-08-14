// src/components/Card.tsx
"use client";
import Image from "next/image";

interface CardProps {
  title: string;
  description: string;
  imageUrl: string;
}

const Card = ({ title, description, imageUrl }: CardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
      <div className="relative h-48 w-full overflow-hidden flex items-center justify-center">
        <Image 
          src={imageUrl} 
          alt={title} 
          fill 
          className="object-cover object-center"
          style={{ objectPosition: 'center center' }} 
        />
      </div>
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        <p className="mt-2 text-gray-600 text-sm">{description}</p>
      </div>
    </div>
  );
};

export default Card;
