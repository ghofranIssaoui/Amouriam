const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/amourium')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Product data (copied from lib/products.ts)
const products = [
  {
    id: 'SolVital',
    name: 'SolVital',
    image: '/products/123.jpeg'
  },
  {
    id: 'Jasmora', 
    name: 'Jasmora',
    image: '/products/1234.jpeg'
  }
];

async function updateOrderImages() {
  try {
    console.log('Updating existing orders with product images...');
    
    // Wait for connection
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Get the orders collection directly
    const db = mongoose.connection.db;
    const ordersCollection = db.collection('orders');
    
    // Get all orders
    const orders = await ordersCollection.find({}).toArray();
    
    for (const order of orders) {
      console.log(`Processing order: ${order._id}`);
      
      // Update each item with product image
      const updatedItems = order.items.map(item => {
        const product = products.find(p => p.id === item.product);
        return {
          ...item,
          name: item.name || product?.name || 'Product',
          image: item.image || product?.image || ''
        };
      });
      
      // Update the order
      await ordersCollection.updateOne(
        { _id: order._id }, 
        { $set: { items: updatedItems } }
      );
      
      console.log(`Updated order ${order._id} with ${updatedItems.length} items`);
    }
    
    console.log('All orders updated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error updating orders:', error);
    process.exit(1);
  }
}

// Run after connection is established
mongoose.connection.once('open', updateOrderImages);
