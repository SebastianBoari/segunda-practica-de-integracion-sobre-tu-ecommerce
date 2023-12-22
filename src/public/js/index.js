document.addEventListener('DOMContentLoaded', () => {
	
	if(document.getElementById('logOut')){
		
		const logOut = document.getElementById('logOut')
		
		logOut.addEventListener('click', () => {
			fetch('http://localhost:8080/api/session/logout', {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				}
			})
				.then((res) => {
					if (res.ok) {
						location.reload()
					} 
				})
				.catch((error) => {
					alert(`Ha ocurrido un error al intentar registrar su usuario: ${error}`)
				})
		})

	}
})