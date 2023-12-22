import chatModel from '../models/chat.model.js'

class ChatManager {
	#messages

	getMessages = async () => {
		try{
			const data = await chatModel.find().lean().exec()
			this.#messages = data
			return this.#messages
		} catch(error) {
			throw new Error(`Error trying to bring messages: ${error}`)
		}
	}

	#addMessage = async (message) => {
		try{
			const newMessage = {
				user: message.user,
				message: message.message
			}

			const addMessage = await chatModel.create(newMessage)

			return addMessage
		} catch(error){
			throw new Error(`Error trying to create  message: ${error}`)
		}
	}

	#validateMessage(msg){
		const formattedMsg = msg.trim()
		if(formattedMsg.length > 144){
			return false
		} else if(formattedMsg.length <= 0){
			return false
		} else {
			return formattedMsg
		}
	}

	createMessage = async (user, msg) => {
		if (this.#validateMessage(msg)) {
			const newMessage = {
				user: user,
				message: this.#validateMessage(msg)
			}
			const current = await this.#addMessage(newMessage)
			return current 
		}
	}
}

const chatManager = new ChatManager()

export default chatManager