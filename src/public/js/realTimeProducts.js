const socket = io()

// Mostrar los productos en pantalla
document.addEventListener('DOMContentLoaded', () => {
	socket.on('products', (data) => {
		const productsContainer = document.getElementById('products-container')
		productsContainer.innerHTML = ''
		
		const products = data.payload
	
		products.forEach((product) => {
			const productCard = `
			<div class="card" style="width: 18rem;">

				<img src="${product.thumbnails[0]}" class="card-img-top" alt="${product.description}">

				<div class="card-img-overlay">
					<a href="/product/${product._id}" class="btn btn-primary viewMore">Ver más</a>	
					<button type="button" class="btn btn-danger deleteBtn" data-id="${product._id}">Eliminar</button>
				</div>

				<div class="card-body">
					<h5 class="card-title">${product.title}</h5>
					<p class="card-text">${product.description}</p>
					<h5 class="card-title">$${product.price}</h5>
					<p class="card-text">Categoria: ${product.category}</p>
					<p class="card-text">Stock: ${product.stock}</p>
					<p class="card-text">ID: ${product._id}</p>
				</div>
			</div>
			`
			productsContainer.innerHTML += productCard
		})

		const deleteBtns = document.querySelectorAll('.deleteBtn')
		for (const button of deleteBtns) {
			button.addEventListener('click', ()=> {
				const productId = button.getAttribute('data-id')
				socket.emit('deleteProduct', productId)
			})
		}

		const editForms = document.querySelectorAll('.form-edit')
		for (const form of editForms) {
			form.addEventListener('submit', ()=> {

				const fieldToEdit = form.querySelector('.fieldToEdit').value
				const fieldEdited = form.querySelector('.fieldEdited').value

				const product = {
					pid: form.getAttribute('data-id'),
					field: fieldToEdit,
					data: fieldEdited
				}
				
				socket.emit('updateProduct', product)
			})
		}

	})
})

// Crear un producto
const form = document.getElementById('form')
form.addEventListener('submit', async (e) => {
	e.preventDefault()
    
	const title = document.getElementById('title').value
	const description = document.getElementById('description').value
	const code = document.getElementById('code').value
	const price = document.getElementById('price').value
	const stock = document.getElementById('stock').value
	const category = document.getElementById('category').value
	const statusCheck = document.getElementById('status').checked
	
	const thumbnails = document.getElementById('thumbnails').value
	const thumbnailURLs = thumbnails.split(';')
	const cleanedURLs = thumbnailURLs.map(url => url.trim()).filter(url => url !== '')

	const newProduct = {
		title: title,
		description: description,
		code: code,
		price: price,
		status: statusCheck,
		stock: stock,
		category: category,
		thumbnails: cleanedURLs
	}

	socket.emit('addProduct', newProduct)
	form.reset()
})


