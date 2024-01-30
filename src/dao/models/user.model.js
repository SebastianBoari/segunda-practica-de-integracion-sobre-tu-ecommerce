import mongoose from 'mongoose'

const usersCollection = 'users'

const userSchema = new mongoose.Schema({
	first_name: String,
	last_name: String,
	age: Number,
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: String,
	role: {
		type: String,
		required: true
	},
	cart: String
}, {timestamps: true})

mongoose.set('strictQuery', false)

const userModel = mongoose.model(usersCollection, userSchema)

export default userModel
