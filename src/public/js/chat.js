let user = ''

Swal.fire({
	title: 'Chat',
	input: 'email',
	text: 'Ingrese su mail',
	inputValidator: value => {
		return !value.trim() && 'Por favor, ingrese su email'
	},
	allowOutsideClick: false
})
	.then(result => {
		user = result.value
		document.getElementById('user-email').innerHTML = user
		
		const socket = io()

		const chatHistory = document.getElementById('chat-history')
		socket.on('history', (history) => {
			chatHistory.innerHTML = ''
	
			for (const message of history) {
				const current = `
        <div>
            <h5>${message.user}</h5>
            <p>${message.message}</p>
        </div>
        `
				chatHistory.innerHTML += current
			}
		})

		const chatForm = document.getElementById('chat-form')
		chatForm.addEventListener('submit', (e) => {
			e.preventDefault()
			const chatInput = document.getElementById('chat-input')
			const chatInputValue = chatInput.value
    
			if(!chatInputValue.trim()) return 

			const message = {
				user: user,
				message: chatInputValue.trim()
			}

			socket.emit('message', message)
			chatForm.reset()
		})
	})
	.catch(err => {
		alert(`${err}`)
	})
	