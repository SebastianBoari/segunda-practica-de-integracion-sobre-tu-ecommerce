import { Router } from 'express'
import chatSocket from '../config/chat.socket.js'

const router = Router()

const chatRouter = (io) => {
	chatSocket(io)
	
	router.get('/', (req, res) => {
		try {
			res.render('chat/chat')
		} catch (error) {
			res.render({error})
		}
	})
	
	return router
}

export default chatRouter