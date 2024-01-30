import { fileURLToPath } from 'url'
import { dirname } from 'path'
import bcrypt from 'bcrypt'

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
