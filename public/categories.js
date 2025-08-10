function showCategories() {
    const categoryGrid = document.getElementById('categoryGrid');
    categoryGrid.innerHTML = ""; // Clear old categories

    // Get unique categories
    const categories = [...new Set(books.map(book => book.category))];

    categories.forEach(cat => {
        const catDiv = document.createElement('div');
        catDiv.classList.add('category-item');
        catDiv.textContent = cat;

        // When category is clicked → show books in that category
        catDiv.addEventListener('click', () => showBooksByCategory(cat));

        categoryGrid.appendChild(catDiv);
    });
}

function showBooksByCategory(category) {
    const categoryGrid = document.getElementById('categoryGrid');
    categoryGrid.innerHTML = `<h3>${category}</h3>`;

    const filteredBooks = books.filter(book => book.category === category);

    filteredBooks.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.classList.add('book-card');

        bookCard.innerHTML = `
            <img src="${book.image}" alt="${book.title}">
            <h4>${book.title}</h4>
            <p>${book.author}</p>
        `;

        categoryGrid.appendChild(bookCard);
    });
}

// Load categories on page load
document.addEventListener('DOMContentLoaded', showCategories);
