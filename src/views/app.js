// Dependencies
import fs from 'fs'
import express from 'express'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import mongoose from 'mongoose'
import cors from 'cors'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import passport from 'passport'
import initializePassport from './config/passport.config.js'
// Config/Utils
import { uri, saltWord } from '../env.js'
// Routes
import chatRouter from './routes/chat.routes.js'
import productsRouter from './routes/products.routes.js'
import viewsProductsRouter from './routes/views.products.routes.js'
import cartsRouter from './routes/carts.routes.js'
import viewsCartRouter from './routes/views.cart.routes.js'
import sessionRouter from './routes/session.routes.js'
import viewsSessionRouter from './routes/views.session.routes.js'

// Config
// Express config
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('./src/public'))
app.use(cors())

// Handlebars config
app.engine('handlebars', handlebars.engine())
app.set('views', './src/views')
app.set('view engine', 'handlebars')
// Session config
app.use(session({
	store: MongoStore.create({
		mongoUrl: uri,
		mongoOptions: {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		}
	}),
	secret: saltWord,
	resave: false,
	saveUninitialized: false
}))
// Passport config
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

// Initialize script
const run = async () => {
	try{
		// DB Connection
		await mongoose.connect(uri)

		// HTTP Server Up
		const httpServer = app.listen(8080, () => console.log('Server up'))
		// Websocket Server Up
		const io = new Server(httpServer)

		// Routes
		app.use('/api/products', productsRouter)
		app.use('/api/carts', cartsRouter)
		app.use('/api/session', sessionRouter)
		app.use('/session', viewsSessionRouter)
		app.use('/chat', chatRouter(io))
		app.use('/cart', viewsCartRouter)
		app.use('/', viewsProductsRouter(io))

	} catch (error) {
		fs.writeFileSync('./server-errors.json', JSON.stringify(error, null, '\t'))
	}
}

run()