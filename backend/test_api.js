fetch('http://localhost:5000/api/products')
    .then(r => r.json())
    .then(data => {
        const product = data.data[0];
        console.log('Name:', product.name);
        console.log('Image URL:', product.image_url);
        process.exit();
    })
    .catch(e => {
        console.log('Error:', e.message);
        process.exit(1);
    });
