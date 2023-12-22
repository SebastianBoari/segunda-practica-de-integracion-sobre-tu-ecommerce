import CustomRouter from '../CustomRouter.js'
import cartManager from '../../dao/mongo/CartsManager.js'

export default class ViewsCartRouter extends CustomRouter {
	init(){
		this.get('/:cid', ['USER'], async (req, res) => {
			if(!req.params.cid) return 
		
			try{
				const cartId = req.params.cid
		
				const currentCart = await cartManager.getCartById(cartId)
				
				const user = req.user

				res.render('products/cart', { data: currentCart, style: 'cart', user})
			}catch(error){
				res.render('errors/error', { error: error })
			}
		})
	}
}
