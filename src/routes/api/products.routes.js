import CustomRouter from '../CustomRouter.js'
import productManager from '../../dao/mongo/ProductsManager.js'

export default class ProductsRoutes extends CustomRouter {
	init(){
		this.get('/', ['ADMIN'], async (req, res) => {
			try{
				const products = await productManager.getProducts()

				res.sendSuccess(200, products)
			} catch(error){
				res.sendError(500, error)
			}
		})

		this.get('/:pid', async (req, res) => {
			try {
				if(!req.params.pid) return
		
				const product = await productManager.getProductById(req.params.pid)
		
				res.sendSuccess(200, product)
			} catch (error) {
				res.sendError(500, error)
			}
		})
		
		this.post('/', async (req, res) => {
			try {
				const newProduct = {
					title: req.body.title,
					description: req.body.description,
					code: req.body.code,
					price: Number(req.body.price),
					status: req.body.status ?? true,
					stock: Number(req.body.stock),
					category: req.body.category,
					thumbnails: req.body.thumbnails || []
				}
		
				const addedProduct = await productManager.addProduct(newProduct.title, newProduct.description, newProduct.code, newProduct.price, newProduct.status, newProduct.stock, newProduct.category, newProduct.thumbnails)
				
				res.sendSuccess(201, addedProduct)
			} catch (error) {
				res.sendError(500, error)
			}
		})

		this.delete('/:pid', async (req, res) => {
			try{
				if(!req.params.pid){
					res.sendError(400, 'Missing required arguments')
				}
				
				const productId = req.params.pid
		
				const deletedProduct = await productManager.deleteProduct(productId)
				
				res.sendSuccess(201, deletedProduct)
			} catch(error){
				res.sendError(500, error)
			}
		})
	}
}
