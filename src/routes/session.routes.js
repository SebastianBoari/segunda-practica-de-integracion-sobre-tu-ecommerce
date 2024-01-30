import { Router } from 'express'
import passport from 'passport'

const router = Router()

router.post('/register', passport.authenticate('register', {
	failureRedirect: '/api/session/failRegister',
	failureMessage: true
}), async (req, res) => {
	res.status(200).json({ 'status': 'success', 'payload': 'User created successfully.'})
})

router.get('/failRegister', (req, res) => {
	const errorMessages = req.session.messages
	const currentError = errorMessages.length - 1
	
	if ( errorMessages[currentError] == 'User already exists.') {
		res.status(401).json({ 'status': 'error', 'message':  errorMessages[currentError] })
	} else {
		res.status(500).json({ 'status': 'error', 'payload': 'An error occurred while trying to register a new user.' })
	}
})

router.post('/login', passport.authenticate('login', {
	failureRedirect: '/api/session/failLogin',
	failureMessage: true
}),async (req, res) => {	
	req.session.user = {
		first_name: req.user.first_name,
		last_name: req.user.last_name,
		age: req.user.age,
		email: req.user.email,
		role: req.user.role,
		cart: req.user.cart
	}
	
	if(req.user.role === 'admin'){
		req.session.user.isAdmin = true
	}

	res.status(200).json({ 'status': 'success', 'payload': 'User logged in'})
})

router.get('/failLogin', (req, res) => {
	const errorMessages = req.session.messages
	const currentError = errorMessages.length - 1

	if ( errorMessages[currentError] == 'Invalid password.' || errorMessages[currentError] == 'User does not exist.') {
		res.status(401).json({ 'status': 'error', 'message':  errorMessages[currentError] })
	} else {
		res.status(500).json({ 'status': 'error', 'message': 'Internal fatal error.' })
	}
})

router.get('/register/github', passport.authenticate('github', { scope: ['user:email']}), (req, res) => {})

router.get('/githubcallback', passport.authenticate('github', { 
	failureRedirect: '/register'
}), async (req, res) => {
	req.session.user = req.user
	res.redirect('/products')
})

router.delete('/logout', async (req, res) => {
	req.session.destroy((error) => {
		if (error) {
			res.status(500).send({ 'status': 'error', 'message': 'An error occurred while trying to log out.' })
		} else {
			res.clearCookie('connect.sid')
			res.status(200).json({ 'status': 'success', 'message': 'Logged out successfully.' })
		}
	})
})

export default router
