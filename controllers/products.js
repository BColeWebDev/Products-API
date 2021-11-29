const Product = require('../models/product')

const getAllProductsStatic = async (req, res) => {
    const products = await Product.find({ price: { $gt: 30 } })
        .sort('price')
        .select('name price')

    res.status(200).json({ products, nbHits: products.length })
}
const getAllProducts = async (req, res) => {
    // all possible queries 
    const { featured, company, name, sort, fields, numericFilters } = req.query
    const queryObject = {}

    // sets query object properties based on selection 
    if (featured) {
        queryObject.featured = featured === 'true' ? true : false
    }
    if (company) {
        queryObject.company = company
    }
    if (name) {
        // $redex -monogodb query selectors - selects documents where values match a specified regular expression 
        queryObject.name = { $regex: name, $options: 'i' }
    }
    if (numericFilters) {
        // all possible operators
        const operatorMap = {
            '>': '$gt',
            '>=': '$gte',
            '=': '$eq',
            '<': '$lt',
            '<=': '$lte',
        }

        // regular expression 
        const regEx = /\b(<|>|>=|=|<|<=)\b/g

        let filters = numericFilters.replace(
            regEx,
            (match) => `-${operatorMap[match]}-`
        )
        // options that can be filtered by 
        const options = ['price', 'rating']
        filters = filters.split(',').forEach((item) => {
            const [field, operator, value] = item.split('-')
            if (options.includes(field)) {
                queryObject[field] = { [operator]: Number(value) }
            }
        })
    }

    let result = Product.find(queryObject)
    // Sorting - sort= 
    // name A-Z, -name Z-A
    // price price high and -price price low 

    if (sort) {
        //split on a common and join back together with empty spaces
        const sortList = sort.split(',').join(' ')
        result = result.sort(sortList)
    } else {
        // sort based on the time when the item were created. 
        result = result.sort('createAt')
    }

    // sorts through and displays fields entered in query
    if (fields) {
        const fieldsList = fields.split(',').join(' ')
        result = result.select(fieldsList)
    }
    // which page the user is on and 
    // sets a limit on how many pages that can view at a time
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    // takes the current page and skips the first item
    const skip = (page - 1) * limit

    result = result.skip(skip).limit(limit)


    // sets products results 
    const products = await result
    res.status(200).json({ products, nbHits: products.length })
}

module.exports = {
    getAllProducts,
    getAllProductsStatic,
}
