async function seedProducts() {
  try {
    const response = await fetch('http://localhost:5000/api/products/seed', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const result = await response.json();
    console.log('Seed response:', result);
    
    if (result.message === 'Products seeded successfully') {
      console.log('✅ Products seeded!');
    } else {
      console.log('❌ Seed failed:', result);
    }
  } catch (error) {
    console.error('Error seeding:', error);
  }
}

seedProducts();
