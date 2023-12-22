import { Command } from 'commander'
import dotenv from 'dotenv'

const program = new Command()

program
	.option('--mode <mode>', 'execution mode', 'development')
program.parse()

const enviroment = program.opts().mode

dotenv.config({
	path: `./.env.${enviroment}`
})

export const port = process.env.PORT
export const uri = process.env.MONGO_URI
export const saltWord = process.env.SALT_WORD

export const clientID = process.env.CLIENT_ID
export const clientSecret = process.env.CLIENT_SECRET
export const callbackURL = process.env.GITHUB_CALLBACK_URL

export const jwtKey = process.env.JWT_KEY
export const cookieName = process.env.COOKIE_NAME