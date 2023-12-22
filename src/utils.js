import { fileURLToPath } from 'url'
import { dirname } from 'path'

import bcrypt from 'bcrypt'

import jwt from 'jsonwebtoken'
import { cookieName, jwtKey } from '../env.js'
import passport from 'passport'

// path
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
export default __dirname

// bcrypt
export const createHash = (password) => {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
} 

export const isValidPassword = (user, password) => {
	return bcrypt.compareSync(password, user.password)
}

// jwt
export const generateToken = (user) => {
	const token = jwt.sign({ user }, jwtKey, { expiresIn: '24h' })
	return token
}

// passport-jwt
export const cookieExtractor = (req) => {
	const token = (req && req.cookies) ? req.cookies[cookieName] : null
	return token
}

export const passportCall = (strategy) => {
	return async (req, res, next) => {
		passport.authenticate(strategy, function(error, user, info) {
			if(error){
				return next(error)
			}

			if(!user){
				console.log(info.message)

				if(info.message === 'User already exists.' || info.message ===  'User does not exist.' || info.message === 'Invalid password.'){
					return res.sendError(400, info.message)
				} else {
					return res.sendError(400, info.toString())
				}
			}

			req.user = user
			next()
		})(req, res, next)
	}
}

export const authorization = (role) => {
	return async (req, res, next) => {
		if(!req.user){
			return res.sendError(401, 'Unauthorized')
		}

		if(req.user.role != role) {
			return res.sendError(403, 'No permission')
		}

		next()
	}
}