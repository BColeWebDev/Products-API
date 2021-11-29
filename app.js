require('dotenv').config()
require('express-async-errors')
const express = require('express')
const cors = require('cors')
const app = express();
const notFoundMiddlware = require('./middleware/not-found')
const errorMiddleware = require('./middleware/error-handler')
const connectDB = require('./db/connect')
const productsRotuer = require('./routes/products')

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('<h1>Store API </h1> <a href="/api/v1/products">products route</a>')
})
// products route
app.use('/api/v1/products', productsRotuer)
app.use(notFoundMiddlware)
app.use(errorMiddleware)

const port = process.env.PORT || 3000

const start = async () => {
    try {
        // connectDB
        await connectDB(process.env.MONGO_URI)
        app.listen(port, console.log(`http://localhost:${port}/`))
    } catch (error) {
        console.log(error)
    }
}
start()