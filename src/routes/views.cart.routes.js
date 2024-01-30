import { Router } from 'express'
import cartManager from '../dao/mongo/CartsManager.js'

const router = Router()

const auth = async (req, res, next) => {
	if(req.session.user){
		next()
	} else {
		res.redirect('/session/login')
	}
}

router.get('/:cid', auth, async (req, res) => {
	if(!req.params.cid) return 

	try{
		const cartId = req.params.cid

		const currentCart = await cartManager.getCartById(cartId)
		
		let user = false
		if(req.session.user){
			user = req.session.user
		}

		res.render('products/cart', { data: currentCart, style: 'cart', user})
	}catch(error){
		res.render('errors/error', { error: error })
	}
})

export default router