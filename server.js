const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

mongoose.connect('mongodb://localhost/sandbox1');
const db = mongoose.connection;
db.on( 'error', error => console.log('Mongoose connection error: ', error) );
db.on('open', () => console.log('Mongoose connection successful') );

let inventorySchema = new mongoose.Schema({ item: String, qty: Number, status: String, tags: Array }, {collection: 'inventory'});
let Inventory = mongoose.model( 'Inventory', inventorySchema );

app.use( express.static(__dirname) );
app.use( bodyParser.json() );
app.get( '/', (req, res) => res.sendFile('index.html') );

app.get('/test', (req, res) => {
    Inventory.find({}, (err, products) => {
        if ( err ) return res.status(500).json( err );

        console.log('products: ', products);
        res.status(200).json( {products: products} );
    });
});

app.post('/test', (req, res) => {
    console.log('Test endpoint hit: ', req.body );
    let newProduct = new Inventory({
        item: req.body.item,
        qty: +req.body.qty,
        status: req.body.status,
        tags: req.body.tags.split(', ')
    });
    newProduct.save( err => {
        if ( err ) return res.status(500).json({ saveError: err });
        
        Inventory.find({}, (err, products) => {
            if ( err ) return res.status(500).json({ findErr: err });
            res.status(200).json({ products: products });
        });
    });
});

app.put('/test/:id', (req, res) => {
    console.log('update endpoint hit: ', req.body );

    Inventory.updateOne({qty: +req.body.qty}, {_id: req.params.id}, err => {
        if (err) return res.status(500).json(err);
        
        console.log('product updated');
        res.status(200).json({message: 'product updated successfully', qty: 10});
    });
});

app.delete('/test/:id', (req, res) => {
    console.log('Delete endpoint hit: ', req.params.id);
    Inventory.deleteOne({_id: req.params.id}, err => {
        if ( err ) return res.status(500).json( err );
        
        console.log( 'product deleted' );
        res.status(200).json({message: 'Product deleted successfully'});
    });
});


app.listen(4000, () => console.log('Server running on port 4000') );


/*
{ 
    "item" : "journal", 
    "qty" : 25, 
    "status" : "A", 
    "size" : { "h" : 14, "w" : 21, "uom" : "cm" }, 
    "tags" : [ "blank", "red" ] 
}
*/