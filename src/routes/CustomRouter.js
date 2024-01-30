import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { jwtKey } from '../../env.js'

export default class CustomRouter {

	constructor(){
		this.router = Router()
		this.init()
	}

	init(){}
    
	getRouter(){
		return this.router
	}

	applyCallbacks(callbacks){
		return callbacks.map(callback => async (...params) => {
			try{
				await callback.apply(this, params)
			} catch(error) {
				params[1].status(500).json({ 'status': 'error', 'info': error })
			}
		})
	}
    
	generateCustomResponses(req, res, next){
		res.sendSuccess = (status, payload) => {
			res.status(status).json({ 'status': 'success', 'payload': payload })
		}
        
		res.sendError = (status, info) => {
			res.status(status).json({ 'status': 'error', 'info': info })
		}

		res.sendNotAuthenticatedError = (info) => {
			res.status(401).json({ 'status': 'error', 'info': info })
		}

		res.sendNotAuthorizedError = (info) => {
			res.status(403).json({ 'status': 'error', 'info': info })
		}

		next()
	}

	handlePolicies = policies => (req, res, next) => {
		

		if(policies.includes('PUBLIC')){
			return next()
		}

		if(policies.length > 0){
			const authHeaders = req.headers.authorization
			
			if(!authHeaders){
				return res.sendNotAuthenticatedError('Unauthenticated.')
			}

			const tokenArray = authHeaders.split(' ')
			const token = (tokenArray.length > 1) ? tokenArray[1] : tokenArray[0]

			const user = jwt.verify(token, jwtKey)

			if(!policies.includes(user.role.toUpperCase())){
				return res.sendNotAuthorizedError('Unauthorizated.')
			}
		}

		next()
	}

	get(path, policies, ...callbacks){
		console.log('AQUI POLICIES: ' + policies)
		
		this.router.get(path, this.generateCustomResponses, this.handlePolicies(policies) ,this.applyCallbacks(callbacks))
	}

	post(path, policies, ...callbacks){
		this.router.post(path, this.generateCustomResponses, this.handlePolicies(policies) ,this.applyCallbacks(callbacks))
	}

	put(path, policies, ...callbacks){
		this.router.put(path, this.generateCustomResponses, this.handlePolicies(policies) ,this.applyCallbacks(callbacks))
	}

	delete(path, policies, ...callbacks){
		this.router.delete(path, this.generateCustomResponses, this.handlePolicies(policies) ,this.applyCallbacks(callbacks))
	}
}
