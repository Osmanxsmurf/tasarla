import React from "react";
import { cn } from "@/lib/utils";

interface GenreCardProps {
  name: string;
  image: string;
  onClick: () => void;
  className?: string;
}

export function GenreCard({ name, image, onClick, className }: GenreCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-lg overflow-hidden group cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/40 opacity-60 group-hover:opacity-80 transition-opacity"></div>
      <img
        src={image}
        alt={`${name} music`}
        className="w-full h-32 object-cover"
      />
      <div className="absolute bottom-0 left-0 p-4">
        <h3 className="text-white font-bold">{name}</h3>
      </div>
    </div>
  );
}

// Predefined genre images
export const genreImages = {
  "Elektronik": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200",
  "Hip-Hop": "https://pixabay.com/get/g0361314a09b7e90efefb865efd2a028ce893fd022aab307e13342b571ca60512c6e00a8c4bf61538ddad49ca4a444e1d1b578e5418dba63a8d8088fafb8e9531_1280.jpg",
  "Rock": "https://images.unsplash.com/photo-1598387993211-5c4c0fda4248?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200",
  "Jazz": "https://images.unsplash.com/photo-1511192336575-5a79af67a629?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200",
  "Klasik": "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200",
  "Pop": "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200",
  "Indie": "https://images.unsplash.com/photo-1501612780327-45045538702b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200",
  "R&B": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200",
  "Metal": "https://images.unsplash.com/photo-1508252592163-5d3c3c559404?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200",
  "Halk Müziği": "https://images.unsplash.com/photo-1515552726023-7125c8d07fb1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200",
  "Arabesk": "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200",
  "Türk Sanat": "https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200",
  "Rap": "https://images.unsplash.com/photo-1546528778-d1084653494e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200",
  "Electronic": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200",
  "Classical": "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200"
};

// Default image if genre not found
export const defaultGenreImage = "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200";

// Get image for genre
export function getGenreImage(genre: string): string {
  const normalizedGenre = genre.toLowerCase();
  
  // Check for partial matches
  for (const [key, value] of Object.entries(genreImages)) {
    if (normalizedGenre.includes(key.toLowerCase()) || key.toLowerCase().includes(normalizedGenre)) {
      return value;
    }
  }
  
  return defaultGenreImage;
}
