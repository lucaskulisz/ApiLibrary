// Declaraciones iniciales
const booksSection = document.querySelector('.books');
const cartItemsList = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const payButton = document.querySelector('#pay-button');
payButton.addEventListener('click', pay);
let cart = [];

// Función para cargar libros desde la API de Google Books
async function loadBooks() {
    try {
        const searchQuery = 'search+terms'; // Reemplaza 'search+terms' con tus términos de búsqueda
        const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${searchQuery}`;

        const response = await fetch(apiUrl);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(`Error al cargar libros: ${data.error.message}`);
        }

        const books = data.items;

        // Muestra los libros en booksSection
        booksSection.innerHTML = '';

        books.forEach((book) => {
            const bookItem = document.createElement('div');
          bookItem.classList.add('book-item');
            book.precio = (Math.random() * 50).toFixed(2);
            const imageUrl = book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : 'imagen_por_defecto.jpg';

            bookItem.innerHTML = `
                <h3>${book.volumeInfo.title}</h3>
                <img src="${imageUrl}" alt=""> <!-- Agregar imagen de portada -->
                <p>Autor: ${book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Desconocido'}</p>
                <p>Precio: $${book.precio}</p>
                <button class="add-to-cart" data-book-id="${book.id}">Agregar al Carrito</button>
            `;

            const addToCartButton = bookItem.querySelector('.add-to-cart');
            addToCartButton.addEventListener('click', () => {
                const bookId = addToCartButton.getAttribute('data-book-id');
                const selectedBook = books.find((book) => book.id === bookId);
                addToCart(selectedBook);
            });

            booksSection.appendChild(bookItem);
        });
    } catch (error) {
        console.error(error);
    }
}

// Función para agregar un libro al carrito
function addToCart(book) {
    // Genera un precio aleatorio para el libro y guárdalo en el objeto del libro
   
    cart.push(book);
    updateCart();
}

// Función para actualizar el carrito y calcular el total
function updateCart() {
    cartItemsList.innerHTML = '';
    let total = 0;

    cart.forEach((book) => {
        const listItem = document.createElement('li');
        listItem.innerText = book.volumeInfo.title;
        const removeButton = document.createElement('button');
        removeButton.innerText = 'Eliminar';
        removeButton.addEventListener('click', () => removeFromCart(book));
        listItem.appendChild(removeButton);
        cartItemsList.appendChild(listItem);

        total += parseFloat(book.precio);
    });

    cartTotal.innerText = `$${total.toFixed(2)}`;
}
// Función para eliminar un libro del carrito
function removeFromCart(book) {
    cart = cart.filter((item) => item !== book);
    updateCart();
}

// Cargar libros cuando la página se cargue
window.addEventListener('load', () => {
    loadBooks();
});

function pay() {
    // Genera un token aleatorio de 32 caracteres
    const token = Math.random().toString(36).substring(2, 36);

    // Crea un objeto con los datos del pago
    const paymentData = {
        token,
        amount: cart.reduce((total, book) => total + parseFloat(book.precio), 0),
    };

    // Realiza una solicitud HTTP a la pasarela de pago ficticia
    axios.post('https://api.mocki.io/v1/b0435d6e', paymentData)
        .then((response) => {
            // Si la respuesta es exitosa, muestra un mensaje de confirmación
            if (response.status === 200) {
                alert('Pago realizado con éxito');
            }
        })
        .catch((error) => {
            // Si la respuesta no es exitosa, muestra un mensaje de error
            alert('Error al realizar el pago:', error);
        });
}
