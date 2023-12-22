import fs from 'fs'

class CartManager {
	#carts
	#path

	constructor(path) {
		this.#path = path

		const mock = [{
			id: 0,
			products: [
				{
					product: 0,
					quantity: 0 
				}
			],
		}]

		if (!fs.existsSync(this.#path)) {
			fs.writeFileSync(path, JSON.stringify(mock, null, '\t'))
		}
	}

	getCarts = async () => {
		try {
			const data = await fs.promises.readFile(this.#path, 'utf-8')

			this.#carts = JSON.parse(data, null, '\t')

			return this.#carts
		} catch (error) {
			throw new Error(error)
		}
	}

	getCartById = async (id) => {
		try{
			if(!id) throw new Error('Missing required arguments')

			const carts = await this.getCarts()
			const cartIndex = carts.findIndex((cart) => cart.id === id)

			return carts[cartIndex].products
		} catch(error) {
			throw new Error(`Error trying to get product by Id ${error}`)
		}
	}

	#idGenerator = async () => {
		try {
			const carts = await this.getProducts()

			if (carts.length === 0) {
				return 1
			} else {
				return carts[carts.length - 1].id + 1
			}
		} catch (error) {
			throw new Error(`Error trying to generate a new ID: ${error}`)
		}
	}

	addProductToCart = async (cartId, productId) => {
		try{
			if(!cartId || !productId) throw new Error('Missing required arguments')

			const carts = await this.getCarts()
			const cartIndex = carts.findIndex((cart) => cart.id === cartId)
			
			if(cartIndex < 0) {
				throw new Error('Cart not exists. Please check cart ID.')
			}

			const cartProducts = carts[cartIndex].products 
			const productIndex = cartProducts.findIndex((product) => product.product === productId)
			
			if(productIndex === 0){
				cartProducts[productIndex].quantity += 1
				
				await fs.promises.writeFile(this.#path, JSON.stringify(carts, null, '\t'))

				return carts[cartIndex].products
			} 

			const newProduct = {
				product: productId,
				quantity: 1
			}

			cartProducts.push(newProduct)

			await fs.promises.writeFile(this.#path, JSON.stringify(carts, null, '\t'))

			return carts[cartIndex].products
		}catch(error){
			throw new Error(`Error trying to add a new product to cart: ${error}`)
		}
	}
}

const cartManager = new CartManager('./data/carts.json')

export default cartManager
