import { Router } from 'express'
import cartManager from '../dao/mongo/CartsManager.js'

const router = Router()

router.get('/', async (req, res) => {
	try {		
		const carts = await cartManager.getCarts()
		res.status(200).json({ status: 'Success', payload: carts })
	} catch (error) {
		console.error(error)
		res.status(500).json({ status: 'Error', payload: error }) 
	}
})

router.get('/:cid', async (req, res) => {
	if (!req.params.cid) {
		throw new Error('Missing required arguments.')
	}
	
	try {
		const cartId = req.params.cid

		const currentCart = await cartManager.getCartById(cartId)	
		
		res.status(200).json({ status: 'Success', payload: currentCart })
	} catch (error) {
		if(error == 'Missing required arguments.'){
			console.error(error)
			res.status(400).json({ status: 'Error', payload: error }) 
		} else {
			console.error(error)
			res.status(500).send({ status: 'Error', payload: error }) 
		}
	}
})

router.post('/', async (req, res) => {
	try {
		const currentCart = await cartManager.createEmptyCart()

		res.status(201).json({ status: 'Success', payload: currentCart })
	} catch (error) {
		if(error == 'Missing required arguments.'){
			console.error(error)
			res.status(400).json({ status: 'Error', payload: error }) 
		} else {
			console.error(error)
			res.status(500).json({ status: 'Error', payload: error }) 
		}
	}
})

router.post('/:cid/product/:pid', async (req, res) => {
	if (!req.params.cid || !req.params.pid || !req.body) {
		throw new Error('Missing required arguments.')
	}
	
	try {
		const cartId = req.params.cid
		const productId = req.params.pid
		const productQuantity = req.body.quantity

		const data = await cartManager.addProductToCart(cartId, productId, productQuantity)

		res.status(201).send({ status: 'Success', payload: data })
	} catch (error) {
		if(error == 'Missing required arguments.'){
			console.error(error)
			res.status(400).json({ status: 'Error', payload: error }) 
		} else {
			console.error(error)
			res.status(500).json({ status: 'Error', payload: error }) 
		}
	}
})

router.put('/:cid', async (req, res) => {
	if(!req.params.cid || !req.body) {
		res.status(400).send({ status: 'Error', payload: 'Missing required arguments: cart id or products to add' })
	}
	
	try{
		const cartId = req.params.cid
		const newProducts = req.body
		let products = []

		products = products.forEach((product) => {
			const newProduct = {
				product: product._id,
				price: product.price,
				quantity: product.quantity
			}

			products.push(newProduct)
		})

		const updateCart = await cartManager.updateAllProducts(cartId, newProducts)

		if(!updateCart) return
		
		res.status(200).send({ status: 'Success', payload: updateCart})
	} catch(error) {
		console.error(error)
		res.status(500).send({ status: 'Error', payload: `${error}`})
	}
})

router.put('/:cid/product/:pid', async (req, res) => {
	if(!req.params.cid || !req.params.pid ||!req.body) {
		res.status(400).send({ status: 'Error', payload: 'Missing required arguments: cart id product id or quantity' })
	}
	
	try{
		const cartId = req.params.cid
		const productId = req.params.pid
		const quantity = req.body.quantity

		const updateCart = await cartManager.updateQuantity(cartId, productId, quantity)

		if(!updateCart) return
		
		res.status(200).send({ status: 'Success', payload: updateCart})
	} catch(error) {
		console.error(error)
		res.status(500).send({ status: 'Error', payload: `${error}`})
	}
})

router.delete('/:cid/product/:pid', async (req, res) => {	
	if (!req.params.cid || !req.params.pid) {
		res.status(400).send({ status: 'Error', payload: 'Missing required arguments: cart id or product id' })
	}
	
	try{
		const cartId = req.params.cid
		const productId = req.params.pid

		const data = await cartManager.deleteProductOfCart(cartId, productId)

		res.status(200).send({ status: 'Success', payload: data})
	} catch(error){
		console.error(error)
		res.status(500).send({ status: 'Error', payload: `${error}`})
	}
})

router.delete('/:cid', async (req, res) => {
	if (!req.params.cid) {
		res.status(400).send({ status: 'Error', payload: 'Missing required arguments: cart id' })
	}

	try{
		const cartId = req.params.cid

		const data = await cartManager.deleteAllProductsOfCart(cartId)

		res.status(200).send({ status: 'Success', payload: data})
	} catch (error) {
		console.error(error)
		res.status(500).send({ status: 'Error', payload: `${error}`})
	}
})

export default router