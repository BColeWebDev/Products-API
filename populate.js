require('dotenv').config()

const connectDB = require('./db/connect')
const Product = require('./models/product')

const jsonProducts = require('./products.json')

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        //remove all products on the DB
        await Product.deleteMany()
        // dynamically creating products
        await Product.create(jsonProducts)
        // terminates process
        process.exit(1)

    } catch (error) {
        console.log(error)
    }
}
start()