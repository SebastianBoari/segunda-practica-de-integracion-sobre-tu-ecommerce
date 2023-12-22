import mongoose from 'mongoose'

const cartsCollection = 'carts'

const cartsSchema = new mongoose.Schema({
	products: [
		{
			product: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'products',            
			},
			quantity: {
				type: Number,
			}
		},
	]
}, {timestamps: true })

cartsSchema.pre('find', function (next) {
	this.populate('products.product')
	next()
})

cartsSchema.pre('findOne', function (next) {
	this.populate('products.product')
	next()
})

mongoose.set('strictQuery', false)

const cartsModel = mongoose.model(cartsCollection, cartsSchema)

export default cartsModel