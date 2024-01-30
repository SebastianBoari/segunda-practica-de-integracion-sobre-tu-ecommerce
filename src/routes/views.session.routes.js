import { Router } from 'express'

const router = Router()

const auth = async (req, res, next) => {
	if(req.session.user){
		next()
	} else {
		res.redirect('/session/login')
	}
}

const auth2 = async (req, res, next) => {
	if(req.session.user){
		res.redirect('/session/profile')
	} else {
		next()
	}
}

router.get('/register', auth2, async (req, res) => {
	try{
		res.render('session/register', { style: 'register' })
	} catch(error){
		res.render('errors/error', { error: error })
	}
})

router.get('/login', auth2, async (req, res) => {
	try{
		res.render('session/login', { style: 'login' })
	} catch(error){
		res.render('errors/error', { error: error })
	}
})

router.get('/profile', auth, async (req, res) => {
	try{
		const user = req.session.user
		res.render('session/profile', { style: 'profile', user})
	} catch(error){
		res.render('errors/error', { error: error })
	}
})

export default router