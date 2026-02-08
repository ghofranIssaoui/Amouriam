import { de, et } from "date-fns/locale";

export interface Product {
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

export const products: Product[] = [
  {
    id: 'SolVital',
    name: 'SolVital',
    type: 'powder',
    price: 2.9, // DT
    description: 'Stimulant de croissance biologique naturel mélangé au sol',
    fullDescription: 'Une poudre nutritive pour le sol, composée de pelures d\'ail, de marc de café et de feuilles d\'olivier sénescentes. Cette poudre améliore la structure du sol, enrichit sa fertilité et renforce la santé des plantes de manière durable.',
    composition: ['Déchets de café', 'Feuilles d\'olivier', 'Enveloppe de maïs', 'Peau d\'ail'],
    benefits: [
      'Améliore la structure du sol',
      'Active la vie microbienne',
      'Limite les pathogènes du sol.',
      'Améliore la disponibilité des nutriments',
      'Sans danger pour tous les types de plantes',
      'Complètement biodégradable et écologique'
    ],
    usage: 'Mélanger 2-3 cuillères à soupe par litre de sol. Appliquer uniformément et arroser abondamment. Utiliser tous les 2-3 semaines pendant la saison de croissance.',
    image: '/products/123.jpeg'
  },
  {
    id: 'Jasmora',
    name: 'Jasmora',
    type: 'liquid',
    price: 19.9, // DT
    description: 'Engrais liquide naturel mélangé avec de l\'eau',
    fullDescription: 'Un engrais liquide naturel, fabriqué à partir de mélasse et de café, deux ressources souvent considerees comme des déchets, mais qui sont en réalité riches en nutriments essentiels pour le sol et les plantes.',
    composition: ['Extrait de canne à sucre', 'Mélasse', 'Minéraux marins', 'Extrait de café'],
    benefits: [
      'Stimule la floraison',
      'Améliore la croissance végétative',
      'Améliore la production de fleurs et de fruits',
      'Renforcement de la vie du sol',
      'Contenu minéral équilibré pour une croissance optimale',
      'Complètement biologique et durable'
    ],
    usage: 'Mélanger 1 partie de BioNectar avec 10 parties d\'eau. Appliquer tous les 7-10 jours. Peut être utilisé comme pulvérisation foliaire ou trempage du sol.',
    image: '/products/1234.jpeg'
  }
];

export const getProductById = (id: string | undefined): Product | undefined => {
  if (!id) return undefined;
  return products.find(p => p.id.toLowerCase() === id.toLowerCase());
};
