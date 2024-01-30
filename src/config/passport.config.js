import passport from 'passport'
import local from 'passport-local'
import jwt, { ExtractJwt } from 'passport-jwt'
import GitHubStrategy from 'passport-github2'

import { clientID, clientSecret, callbackURL, jwtKey } from '../../env.js'
import { createHash, isValidPassword } from '../utils.js'

import cartManager from '../dao/mongo/CartsManager.js'
import userModel from '../dao/models/user.model.js'

const LocalStrategy = local.Strategy
const JWTStrategy = jwt.Strategy

const initializePassport = () => {
	
	passport.use('register', new LocalStrategy({
		passReqToCallback: true,
		usernameField: 'email'
	}, async (req, username, password, done) => {
		try{
			const { first_name, last_name, email, age } = req.body
			
			const user = await userModel.findOne({ email: username })

			if(user){
				return done(null, false, { message: 'User already exists.'})
			}

			const newCart = await cartManager.createEmptyCart()

			const newUser = {
				first_name: first_name,
				last_name: last_name,
				age: age,
				email: email,
				password: createHash(password),
				role: 'user',
				cart: newCart._id
			}

			if(username === 'adminCoder@coder.com' && password === 'adminCod3r123'){
				newUser.role = 'admin'
			}

			const createdUser = await userModel.create(newUser)

			return done(null, createdUser)
		} catch(error){
			return done(error, false)
		}
	}))

	passport.use('login', new LocalStrategy({
		usernameField: 'email'
	}, async (username, password, done) => {
		try{
			const user = await userModel.findOne({ email: username})
			
			if(!user){
				return done(null, false, { message: 'User does not exist.'})
			}

			if (!isValidPassword(user, password)){
				return done(null, false, { message: 'Invalid password.'})
			}

			return done(null, user)
		} catch(error){
			return done(error, false)
		}
	}))

	passport.use('github', new GitHubStrategy({
		clientID: clientID,
		clientSecret: clientSecret,
		callbackURL: callbackURL
	}, async (accessToken, refreshToken, profile, done) => {
		console.log(profile)
		try{
			const user = await userModel.findOne({ email: profile._json.email })

			if(user){
				return done(null, user)
			}

			const newCart = await cartManager.createEmptyCart()
			
			const newUser = {
				first_name: profile._json.name,
				email: profile._json.email,
				role: 'user',
				cart: newCart._id
			}

			const createdUser = await userModel.create(newUser)

			return done(null, createdUser)
		} catch (error) {
			return done(error, false)
		}
	}))

	const cookieExtractor = (req) => {
		const token = (req && req.cookies) ? req.cookies['spazzio'] : null
		return token
	}

	passport.use('jwt', new JWTStrategy({
		jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
		secretOrKey: jwtKey
	}, async (jwt_payload, done) => {
		try {
			return done(null, jwt_payload)
		} catch(error) {
			return done(error)
		}
	}))

	passport.serializeUser((user, done) => {
		done(null, user._id)
	})

	passport.deserializeUser(async (id, done) => {
		const user = await userModel.findById(id)
		done(null, user)
	})

}

export default initializePassport