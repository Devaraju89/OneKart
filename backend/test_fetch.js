// Node 22 has global fetch
fetch('https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=10')
    .then(r => {
        console.log('Status:', r.status);
        process.exit();
    })
    .catch(e => {
        console.log('Error:', e.message);
        process.exit(1);
    });
