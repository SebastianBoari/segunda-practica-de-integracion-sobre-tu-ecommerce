import fs from 'fs'

class ProductManager {
	#products
	#path

	constructor(path) {
		this.#path = path

		const mock = [{
			id: 0,
			title: 'Example product',
			description: 'This is an example product',
			code: 'ACB132',
			price: 17,
			status: true,
			stock: 100,
			category: 'example',
			thumbnails: ['www.imgur.com/imagen1.jpg', 'www.imgur.com/imagen2.jpg', 'www.imgur.com/imagen3.jpg']
		}]

		if (!fs.existsSync(this.#path)) {
			fs.writeFileSync(path, JSON.stringify(mock, null, '\t'))
		}
	}

	getProducts = async () => {
		try {
			const data = await fs.promises.readFile(this.#path, 'utf-8')

			this.#products = JSON.parse(data, null, '\t')

			return this.#products
		} catch (error) {
			throw new Error(error)
		}
	}

	#idGenerator = async () => {
		try {
			const products = await this.getProducts()

			if (products.length === 0) {
				return 1
			} else {
				return products[products.length - 1].id + 1
			}
		} catch (error) {
			throw new Error(`Error trying to generate a new ID: ${error}`)
		}
	}

	addProduct = async (title, description, price, thumbnail, code, stock, category) => {
		try {
			if (!title || !description || !price || !code || !stock || !category) throw new Error('Missing required arguments')

			const products = await this.getProducts()

			if (products.find(item => item.code === code)) {
				throw new Error('Product code already exists')
			}

			const newProduct = {
				id: await this.#idGenerator(),
				title: title.trim(),
				description: description.trim(),
				code: code.trim(),
				price: Number(price),
				status: true,
				stock: Number(stock),
				category: category.trim(),
				thumbnails: thumbnail || []
			}

			products.push(newProduct)

			await fs.promises.writeFile(this.#path, JSON.stringify(products, null, '\t'))

			return newProduct
		} catch (error) {
			throw new Error(`Error trying to add a product: ${error}`)
		}
	}

	getProductById = async (pid) => {
		try {
			if (!pid) throw new Error('Plese, enter a product id')

			const products = await this.getProducts()

			return products.find(item => item.id === pid)
		} catch (error) {
			throw new Error(`Error trying to get a product by Id: ${error}`)
		}
	}

	updateProduct = async (pid, field, data) => {
		try {
			if (!pid || !field || !data) throw new Error('Missing required arguments')
			if (field === 'id') throw new Error('Cannot modified field id')

			const products = await this.getProducts()
			const productIndex = products.findIndex(item => item.id === pid)

			if (productIndex === -1) throw new Error('Product not found')

			products[productIndex][field] = data

			await fs.promises.writeFile(this.#path, JSON.stringify(products, null, '\t'))

			return products[productIndex]
		} catch (error) {
			throw new Error(error)
		}
	}

	deleteProduct = async (pid) => {
		try {
			if (!pid) throw new Error('Missing required arguments')

			const products = await this.getProducts()
			const productIndex = products.findIndex(item => item.id === pid)

			products.splice(productIndex, 1)

			await fs.promises.writeFile(this.#path, JSON.stringify(products, null, '\t'))

			return products
		} catch (error) {
			throw new Error(error)
		}
	}
}

const productManager = new ProductManager('./data/products.json')

export default productManager