// Dependencies
import fs from 'fs'
import express from 'express'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import mongoose from 'mongoose'
import cors from 'cors'
import passport from 'passport'
import cookieParser from 'cookie-parser'

// Config/Utils
import { uri, port } from '../env.js'
import initializePassport from './config/passport.config.js'

// Routes
import SessionRouter from './routes/api/session.routes.js'
const sessionRouter = new SessionRouter()

import ProductsRouter from './routes/api/products.routes.js'
const productsRouter = new ProductsRouter()

import CartsRouter from './routes/api/carts.routes.js'
const cartsRouter = new CartsRouter()

import viewsChatRouter from './routes/views/chat.views.routes.js'

import viewsProductsRouter from './routes/views/products.views.routes.js'

import ViewsCartRouter from './routes/views/cart.views.routes.js'
const viewsCartRouter = new ViewsCartRouter()

import ViewsSessionRouter from './routes/views/session.views.routes.js'
const viewsSessionRouter = new ViewsSessionRouter()

// Configs
// Express config
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('./src/public'))
app.use(cors())
app.use(cookieParser())

// Handlebars config
app.engine('handlebars', handlebars.engine())
app.set('views', './src/views')
app.set('view engine', 'handlebars')

// Passport config
initializePassport()
app.use(passport.initialize())

// Initialize script
const run = async () => {
	try{
		// DB Connection
		await mongoose.connect(uri)

		// HTTP Server Up
		const httpServer = app.listen(port, () => console.log(`Server up on port ${port}`))
		// Websocket Server Up
		const io = new Server(httpServer)

		// Routes
		app.use('/api/products', productsRouter.getRouter())
		app.use('/api/carts', cartsRouter.getRouter())
		app.use('/api/session', sessionRouter.getRouter())

		app.use('/session', viewsSessionRouter.getRouter())
		app.use('/chat', viewsChatRouter(io))
		app.use('/cart', viewsCartRouter.getRouter())
		app.use('/', viewsProductsRouter(io))

	} catch (error) {
		fs.writeFileSync('./error-logs.json', JSON.stringify(error, null, '\t'))
	}
}

await run()
