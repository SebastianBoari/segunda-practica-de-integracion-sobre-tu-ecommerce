import cartsModel from '../models/carts.model.js'

class CartManager {

	createEmptyCart = async () => {
		try{
			const newCart = {
				products: [],
			} 
			const createdCart = await cartsModel.create(newCart)
			if(!createdCart){
				throw new Error('Cart creation failed.')
			}
			return createdCart
		} catch(error){
			if(error == 'Cart creation failed.'){
				throw error
			} else {
				throw new Error(error)
			}
		}
	}

	createCart = async (productId, quantity) => {
		if(!productId){
			throw new Error('Missing required arguments.')
		}

		try{
			const newCart = {
				products: [
					{ 
						product: productId,
						quantity: quantity || 1
					}
				],
			} 
			const createdCart = await cartsModel.create(newCart)
			if(!createdCart){
				throw new Error('Cart creation failed.')
			}
			return createdCart
		} catch(error){
			if(error == 'Missing required arguments.' || error == 'Cart creation failed.'){
				throw error
			} else {
				throw new Error(error)
			}
		}
	}
	
	getCarts = async () => {
		try {
			const data = await cartsModel.find().lean().exec()
			return data
		} catch (error) {
			throw new Error(error)
		}
	}

	getCartById = async (cartId) => {
		if (!cartId){
			throw new Error('Missing required arguments.')
		} 
		
		const formattedCartId = cartId.trim()
		if(!formattedCartId){
			throw new Error('Missing required arguments.')
		}

		try {
			const currentCart = await cartsModel.findById(formattedCartId).lean().exec()
	
			if (!currentCart) {
				throw new Error('Cart does not exist.')
			}
			
			// Crear descripcion corta
			for (const item of currentCart.products) {
				const descrip = item.product.description
				if (descrip.length > 90) {
					const shorterDescription = descrip.slice(0, 90)
					const formatedShorterDescription = shorterDescription.trim()
					item.product.shortDescription = formatedShorterDescription
				}
			}

			// Crear sub-total
			for (const item of currentCart.products) {
				if(item.quantity > 1){
					const subTotal = item.product.price * item.quantity
					item.isMoreThanOne = true
					item.subTotal = subTotal
				} else {
					item.isMoreThanOne = false
				}
			}

			// Crear precio total
			let total = 0 
			for (const item of currentCart.products) {
				if(item.quantity > 1){
					const subTotal = item.product.price * item.quantity
					total += subTotal
					currentCart.totalPrice = total
				} else {
					const subTotal = item.product.price
					total += subTotal
					currentCart.totalPrice = total
				}
			}

			return currentCart
		} catch (error) {
			if(error == 'Cart does not exist.' || error == 'Missing required arguments.'){
				throw error
			} else {
				throw new Error(error)
			}
		}
	}
	
	addProductToCart = async (cartId, productId, productQuantity) => {
		if(!productId || !cartId){
			throw new Error('Missing required arguments.')
		}
		
		const formattedProductId = productId.trim()
		const formattedCartId = cartId.trim()
		
		if(!formattedProductId || !formattedCartId){
			throw new Error('Missing required arguments.')
		}

		try{
			const currentCart = await cartsModel.findById(formattedCartId)
			
			if(!currentCart){
				throw new Error('Cart does not exist.')
			}
			const indexProduct = currentCart.products.findIndex((item) => item.product._id == formattedProductId)
				
			if(indexProduct < 0){
				const quantity = productQuantity || 1
				const newProduct = {
					product: formattedProductId,
					quantity: quantity
				}
				currentCart.products.push(newProduct)
				await currentCart.save()
				return currentCart
			} else {
				const quantity = productQuantity || 1
				const currentProduct = currentCart.products[indexProduct]
				currentProduct.quantity += quantity
				await currentCart.save()
				return currentCart
			}
		}catch(error){
			if( error == 'Missing required arguments.'){
				throw error
			} else {
				throw new Error(error)
			}
		}
	}

	deleteProductOfCart = async (cartId, productId) => {
		if(!cartId || !productId) throw new Error('Missing required arguments: cart ID or product ID')
		
		try{
			const updatedCart = await cartsModel.findOneAndUpdate(
				{ _id: cartId },
				{ $pull: { products: { product: productId } } },
				{ new: true }
			)
	
			if (updatedCart) {
				return updatedCart
			} else {
				throw new Error('Product not found in the cart.')
			}
		} catch(error) {
			throw new Error(`Error trying to delete a product of cart: ${error}`)
		}
	}

	deleteAllProductsOfCart = async (cartId) => {
		if(!cartId) throw new Error('Cart ID is required')

		try {
			const updatedCart = await cartsModel.findByIdAndUpdate(cartId, { products: [] }, { new: true }).lean().exec()

			if (!updatedCart) {
				throw new Error(`Cart with ID: ${cartId} not found`)
			}
	
			return updatedCart
		} catch (error) {
			throw new Error(`Error trying to delete all products from the cart: ${error}`)
		}
	}

	updateAllProducts = async (cartId, products) => {
		if(!cartId || !products) throw new Error('Missing required arguments: cart ID or products')
		
		try {
			await this.deleteAllProductsOfCart(cartId)

			const updatedCart = await cartsModel.findOneAndUpdate(
				{ _id: cartId },
				{ $set: { products: products } },
				{ new: true }
			)

			return updatedCart
		} catch (error) {
			throw new Error(`Error trying to update all products from the cart: ${error}`)
		}
	}
	
	updateQuantity = async (cartId, productId, updatedQuantity) => {
		if(!cartId || !productId || !updatedQuantity) throw new Error('Missing required arguments: cart ID product ID or new quantity')

		try {
			const updatedCart = await cartsModel.findOneAndUpdate(
				{
					_id: cartId,
					'products.product': productId 
				},
				{
					$set: { 'products.$.quantity': updatedQuantity }
				},
				{ new: true }
			)

			return updatedCart
		} catch (error) {
			throw new Error(`Error trying to update product quantity: ${error}`)
		}
	}
}

const cartManager = new CartManager()

export default cartManager
