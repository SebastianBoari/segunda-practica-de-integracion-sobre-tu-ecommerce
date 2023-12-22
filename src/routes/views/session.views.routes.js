import CustomRouter from '../CustomRouter.js'

export default class ViewsSessionRouter extends CustomRouter{
	init(){
		this.get('/register', ['PUBLIC'], async (req, res) => {
			try{
				if(req.user){
					const user = req.user
					res.render('session/profile', { style: 'profile', user})
				} else {
					res.render('session/register', { style: 'register' })
				}
			} catch(error){
				res.render('errors/error', { error: error })
			}
		})
		
		this.get('/login', ['PUBLIC'], async (req, res) => {
			try{
				if(req.user){
					const user = req.user
					res.render('session/profile', { style: 'profile', user})
				} else{
					res.render('session/login', { style: 'login' })
				}
			} catch(error){
				res.render('errors/error', { error: error })
			}
		})
		
		this.get('/profile', ['USER'], async (req, res) => {
			try{
				const user = req.user
				res.render('session/profile', { style: 'profile', user})
			} catch(error){
				res.render('errors/error', { error: error })
			}
		})
		
	}
}
