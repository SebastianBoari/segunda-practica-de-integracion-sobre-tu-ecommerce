import CustomRouter from '../CustomRouter.js'
import cartManager from '../../dao/mongo/CartsManager.js'

export default class CartsRouter extends CustomRouter {
	init(){
		this.get('/', async (req, res) => {
			try {		
				const carts = await cartManager.getCarts()
				res.sendSuccess(200, carts)
			} catch (error) {
				res.sendError(500, error)
			}
		})

		this.get('/:cid', async (req, res) => {
			if (!req.params.cid) {
				res.sendError(400, 'Missing required arguments.')
			}
			try {
				const cartId = req.params.cid
				const currentCart = await cartManager.getCartById(cartId)	
				res.sendSuccess(200, currentCart)
			} catch (error) {
				res.sendError(500, error)
			}
		})

		this.post('/', async (req, res) => {
			try {
				const currentCart = await cartManager.createEmptyCart()
				res.sendSuccess(201, currentCart)
			} catch (error) {
				res.sendError(500, error)
			}
		})

		this.post('/:cid/product/:pid', async (req, res) => {
			if (!req.params.cid || !req.params.pid || !req.body) {
				res.sendError(400, 'Missing required arguments.')
			}
			
			try {
				const cartId = req.params.cid
				const productId = req.params.pid
				const productQuantity = req.body.quantity
		
				const currentCart = await cartManager.addProductToCart(cartId, productId, productQuantity)
		
				res.sendSuccess(201, currentCart)
			} catch (error) {
				res.sendError(500, error)
			}
		})

		this.put('/:cid', async (req, res) => {
			if(!req.params.cid || !req.body) {
				res.sendError(400, 'Missing required arguments.')
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
				
				res.sendSuccess(200, updateCart)
			} catch(error) {
				res.sendError(500, error)
			}
		})
		
		this.put('/:cid/product/:pid', async (req, res) => {
			if(!req.params.cid || !req.params.pid ||!req.body) {
				res.sendError(400, 'Missing required arguments.')
			}
			
			try{
				const cartId = req.params.cid
				const productId = req.params.pid
				const quantity = req.body.quantity
		
				const updateCart = await cartManager.updateQuantity(cartId, productId, quantity)
		
				if(!updateCart) return
				
				res.sendSuccess(200, updateCart)
			} catch(error) {
				res.sendError(500, error)
			}
		})
		
		this.delete('/:cid/product/:pid', async (req, res) => {	
			if (!req.params.cid || !req.params.pid) {
				res.sendError(400, 'Missing required arguments.')
			}
			
			try{
				const cartId = req.params.cid
				const productId = req.params.pid
		
				const currentCart = await cartManager.deleteProductOfCart(cartId, productId)
		
				res.sendSuccess(200, currentCart)
			} catch(error){
				res.sendError(500, error)
			}
		})
		
		this.delete('/:cid', async (req, res) => {
			if (!req.params.cid) {
				res.sendError(400, 'Missing required arguments.')
			}
		
			try{
				const cartId = req.params.cid
		
				const currentCart = await cartManager.deleteAllProductsOfCart(cartId)
		
				res.sendSuccess(200, currentCart)
			} catch (error) {
				res.sendError(500, error)
			}
		})
	}
}
