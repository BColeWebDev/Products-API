const mongoose = require('mongoose')
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, 'product name must be provided']
    },
    price: {
        type: String,
        require: [true, 'product name must be provided']
    },
    featured: {
        type: Boolean,
        default: false
    },
    rating: {
        type: Number,
        default: 4.5
    },
    createAt: {
        type: Date,
        default: Date.now()
    },
    company: {
        type: String,
        enum: {
            values: ['ikea', 'liddy', 'caressa', 'marcos'],
            // value is client side input
            message: `{VALUE} is not supported`
        },
        // can be used in a drop down menu for the values
        // enum:['ikea','liddy','caressa','marcos']
    }


})

module.exports = mongoose.model('Products', productSchema)