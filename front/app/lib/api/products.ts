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
    const response = await fetchFromApi('/products');
    return response; // ✅ NOT response.data
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const response = await fetchFromApi(`/products/${id}`);
    return response;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    return null;
  }
};

