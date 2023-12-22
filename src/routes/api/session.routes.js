import CustomRouter from '../CustomRouter.js'
import passport from 'passport'
import { cookieName } from '../../../env.js'
import { generateToken, passportCall } from '../../utils.js'

export default class SessionRouter extends CustomRouter {
	init(){
		this.post('/register', passportCall('register'), async (req, res) => {
			res.sendSuccess(201, 'User created successfully.')
		})
		
		this.post('/login', passportCall('login'), async (req, res) => {	
			const token = generateToken(req.user)
			res.cookie(cookieName, token).sendSuccess(201, 'User logged in.')
		})
		
		this.get('/current', passportCall('jwt'), async (req, res) => {	
			res.sendSuccess(200, req.user)
		})
		
		this.get('/register/github', passport.authenticate('github', { scope: ['user:email']}), (req, res) => {
			const token = generateToken(req.user)
			res.cookie(cookieName, token).sendSuccess(201, 'User logged in.')
		})
		
		this.get('/githubcallback', passport.authenticate('github', { 
			failureRedirect: '/register'
		}), async (req, res) => {
			const token = generateToken(req.user)
			res.cookie(cookieName, token).redirect('/products')
		})
		
		this.post('/logout', async function(req, res, next) {
			req.logout(function(error) {
				if (error) { 
					res.sendError(500, 'An error occurred while trying to log out.')
				}
				res.clearCookie(cookieName)
				res.sendSuccess(200, 'Logged out successfully.')
			})
		})
	}
}
