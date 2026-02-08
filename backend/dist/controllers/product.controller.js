"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedProducts = exports.createProduct = exports.getProductById = exports.getProducts = void 0;
const Product_1 = __importDefault(require("../models/Product"));
const getProducts = async (req, res) => {
    try {
        const products = await Product_1.default.find();
        res.json(products);
    }
    catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Error fetching products' });
    }
};
exports.getProducts = getProducts;
const getProductById = async (req, res) => {
    try {
        const product = await Product_1.default.findOne({ id: req.params.id });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    }
    catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: 'Error fetching product' });
    }
};
exports.getProductById = getProductById;
const createProduct = async (req, res) => {
    try {
        const { name, price, description, category, image } = req.body;
        // Validate required fields
        if (!name || !price || !description || !category) {
            return res.status(400).json({
                message: 'Please provide all required fields: name, price, description, category'
            });
        }
        // Create new product with all required fields
        const newProduct = new Product_1.default({
            id: name.toLowerCase().replace(/\s+/g, '-'), // Generate ID from name
            name,
            type: 'powder', // Default type
            price: parseFloat(price),
            description,
            fullDescription: description, // Use description as full description
            composition: [], // Empty array for now
            benefits: [], // Empty array for now
            usage: 'Usage instructions to be added', // Default usage
            image: image || '/products/placeholder.jpg'
        });
        const savedProduct = await newProduct.save();
        res.status(201).json({
            message: 'Product created successfully',
            product: savedProduct
        });
    }
    catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({
            message: 'Error creating product',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.createProduct = createProduct;
const seedProducts = async (req, res) => {
    try {
        // Clear existing products
        await Product_1.default.deleteMany({});
        // Sample products data
        const sampleProducts = [
            {
                id: 'SolVital',
                name: 'SolVital',
                type: 'powder',
                price: 2.9,
                description: 'Stimulant de croissance biologique naturel mélangé au sol',
                fullDescription: 'La Poudre Agrobloom est un stimulant de croissance biologique premium conçu pour améliorer la vitalité des plantes et la qualité du sol. Fabriquée à partir d\'ingrédients naturels soigneusement sélectionnés, elle travaille synergiquement avec votre sol pour favoriser un développement racinaire robuste et une croissance végétale accélérée.',
                composition: ['Déchets de café', 'Feuilles d\'olivier', 'Enveloppe de maïs', 'Peau d\'ail'],
                benefits: [
                    'Accélère naturellement la croissance des plantes',
                    'Enrichit le sol en matière organique',
                    'Améliore la structure du sol et la rétention d\'eau',
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
                price: 19.9,
                description: 'Engrais liquide naturel mélangé avec de l\'eau',
                fullDescription: 'Le Liquide BioNectar est un engrais liquide puissant fabriqué à partir d\'ingrédients naturels riches en nutriments. Mélangé directement avec l\'eau, il offre une absorption rapide des nutriments et favorise le feuillage sain, les fleurs éclatantes et la fructification forte dans toutes les variétés de plantes.',
                composition: ['Extrait de canne à sucre', 'Mélasse', 'Minéraux marins', 'Extrait de café'],
                benefits: [
                    'Absorption rapide des nutriments',
                    'Favorise une croissance vigoureuse du feuillage',
                    'Améliore la production de fleurs et de fruits',
                    'Améliore l\'immunité des plantes',
                    'Contenu minéral équilibré pour une croissance optimale',
                    'Complètement biologique et durable'
                ],
                usage: 'Mélanger 1 partie de BioNectar avec 10 parties d\'eau. Appliquer tous les 7-10 jours. Peut être utilisé comme pulvérisation foliaire ou trempage du sol.',
                image: '/products/1234.jpeg'
            }
        ];
        // Insert sample products
        const createdProducts = await Product_1.default.insertMany(sampleProducts);
        res.status(201).json({
            message: 'Products seeded successfully',
            count: createdProducts.length,
            products: createdProducts
        });
    }
    catch (error) {
        console.error('Error seeding products:', error);
        res.status(500).json({ message: 'Error seeding products' });
    }
};
exports.seedProducts = seedProducts;
