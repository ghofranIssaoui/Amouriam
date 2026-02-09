// app/lib/api/products.ts
import { fetchFromApi } from '../api';

export interface Product {
  _id: string;
  id: string;
  name: string;
  type: 'powder' | 'liquid';
  price: number;
  description: string;
  fullDescription: string;
  composition: string[];
  benefits: string[];
  usage: string;
  image: string;
}

export const getProducts = async (): Promise<Product[]> => {
  try {
    console.log('Fetching products from API...');
    const response = await fetchFromApi('/api/products'); // <-- add /api
    console.log('API response:', response);
    return response || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export const getProductById = async (id: string): Promise<Product | null> => {
  if (!id) {
    console.error('No ID provided to getProductById');
  }

  try {
    console.log('Making API call to:', `/api/products/${id}`); // <-- add /api
    const response = await fetchFromApi(`/api/products/${id}`);
    console.log('API Response:', response);
    return response || null;
  } catch (error) {
    console.error('Error in getProductById:', error);
    return null;
  }
};
