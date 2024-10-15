const API_URL = 'https://gutendex.com/books/';
let currentPage = 1;
const booksPerPage = 12; // Number of books per page
let totalBooks = 0;
let books = [];
let genres = []; // Store all genres

// DOM Elements
let bookList, wishlistBooks, bookDetails, searchBar, genreFilter, pagination, backBtn, loadingIndicator;

// Initialize DOM elements
function initializeElements() {
    bookList = document.getElementById('book-list');
    wishlistBooks = document.getElementById('wishlist-books');
    bookDetails = document.getElementById('book-details');
    searchBar = document.getElementById('search-bar');
    genreFilter = document.getElementById('genre-filter');
    pagination = document.getElementById('pagination');
    backBtn = document.getElementById('back-to-list');
    loadingIndicator = document.getElementById('loading');
}

// Show/hide loading indicator
function showLoading(show) {
    if (loadingIndicator) {
        loadingIndicator.classList.toggle('hidden', !show);
    }
}

// Fetch books from API
async function fetchBooks(page = 1, search = '', genre = '') {
    showLoading(true);
    const offset = (page - 1) * booksPerPage;
    const url = `${API_URL}?page=${page}&search=${search}&topic=${genre}&offset=${offset}&limit=${booksPerPage}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        totalBooks = data.count;
        books = data.results;
        showLoading(false);
        return data;
    } catch (error) {
        console.error('Error fetching books:', error);
        showLoading(false);
    }
}

// Fetch genres from API
async function fetchGenres() {
    showLoading(true);
    try {
        const response = await fetch(`${API_URL}?topic`);
        const data = await response.json();

        // Get all unique genres from books
        genres = [...new Set(data.results.flatMap(book => book.subjects))];

        populateGenreFilter();
        showLoading(false);
    } catch (error) {
        console.error('Error fetching genres:', error);
        showLoading(false);
    }
}

// Populate genre filter dropdown
function populateGenreFilter() {
    if (genreFilter) {
        genreFilter.innerHTML = `<option value="">All Genres</option>`; // Default option
        genres.forEach(genre => {
            const option = document.createElement('option');
            option.value = genre;
            option.textContent = genre;
            genreFilter.appendChild(option);
        });
    }
}

// Display books
function displayBooks(books) {
    if (bookList) {
        bookList.innerHTML = '';
        books.slice(0, booksPerPage).forEach(book => {
            const bookCard = createBookCard(book);
            bookList.appendChild(bookCard);
        });
    }
}

// Create book card
function createBookCard(book) {
    const card = document.createElement('div');
    card.className = 'book-card';
    card.style.cursor = 'pointer';
    card.innerHTML = `
        <img src="${book.formats['image/jpeg']}" alt="${book.title}" loading="lazy">
        <div class="book-info">
            <h3>${book.title}</h3>
            <p>${book.authors[0]?.name || 'Unknown Author'}</p>
            <button class="wishlist-btn" data-id="${book.id}">
                ${isInWishlist(book.id) ? '❤️' : '🤍'}
            </button>
        </div>
    `;

    card.querySelector('.wishlist-btn').addEventListener('click', toggleWishlist);
    card.addEventListener('click', (e) => {
        if (!e.target.classList.contains('wishlist-btn')) {
            showBookDetails(book);
        }
    });

    return card;
}

// Show book details
function showBookDetails(book) {
    if (bookDetails) {
        bookDetails.innerHTML = `
            <h2>${book.title}</h2>
            <img src="${book.formats['image/jpeg']}" alt="${book.title}" loading="lazy">
            <p><strong>Author:</strong> ${book.authors[0]?.name || 'Unknown Author'}</p>
            <p><strong>Languages:</strong> ${book.languages.join(', ')}</p>
            <p><strong>Download Count:</strong> ${book.download_count}</p>
            <h3>Subjects:</h3>
            <ul>${book.subjects.map(subject => `<li>${subject}</li>`).join('')}</ul>
        `;
        showPage('book-details-page');
    }
}

// Show specific page
function showPage(pageId) {
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('hidden');
    });
    const pageElement = document.getElementById(pageId);
    if (pageElement) {
        pageElement.classList.remove('hidden');
    }

    // Show pagination only on home page
    if (pagination) {
        pagination.classList.toggle('hidden', pageId !== 'home-page');
    }
}

// Toggle wishlist
function toggleWishlist(e) {
    e.stopPropagation();
    const bookId = e.target.dataset.id;
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    if (isInWishlist(bookId)) {
        wishlist = wishlist.filter(id => id !== bookId);
        e.target.textContent = '🤍';
    } else {
        wishlist.push(bookId);
        e.target.textContent = '❤️';
    }
    localStorage.setItem('wishlist', JSON.stringify(wishlist));

    if (window.location.pathname.endsWith('wishlist.html')) {
        displayWishlist(); // Refresh wishlist display when on wishlist page
    }
}

// Check if book is in wishlist
function isInWishlist(bookId) {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    return wishlist.includes(bookId);
}

// Display wishlist
async function displayWishlist() {
    if (!wishlistBooks) return;

    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    wishlistBooks.innerHTML = '';
    showLoading(true);

    // Fetch all wishlist books
    const wishlistBooksData = await Promise.all(
        wishlist.map(async (bookId) => {
            const response = await fetch(`${API_URL}${bookId}`);
            return response.json();
        })
    );

    // If there are no wishlist items
    if (wishlistBooksData.length === 0) {
        wishlistBooks.innerHTML = '<p>Your wishlist is empty.</p>';
    }

    wishlistBooksData.forEach(book => {
        const bookCard = createBookCard(book);
        wishlistBooks.appendChild(bookCard);
    });

    showLoading(false);
}

// Update pagination
function updatePagination(totalBooks) {
    if (!pagination) return;

    const pageCount = Math.ceil(totalBooks / booksPerPage);
    pagination.innerHTML = '';

    // Previous button
    const prevButton = document.createElement('button');
    prevButton.textContent = 'Previous';
    prevButton.classList.add('page-btn');
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => changePage(currentPage - 1));
    pagination.appendChild(prevButton);

    // Page numbers
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(pageCount, startPage + 4);
    for (let i = startPage; i <= endPage; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.classList.add('page-btn');
        if (i === currentPage) button.classList.add('active');
        button.addEventListener('click', () => changePage(i));
        pagination.appendChild(button);
    }

    // Next button
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.classList.add('page-btn');
    nextButton.disabled = currentPage === pageCount;
    nextButton.addEventListener('click', () => changePage(currentPage + 1));
    pagination.appendChild(nextButton);
}

// Change page
async function changePage(page) {
    currentPage = page;
    const data = await fetchBooks(currentPage, searchBar?.value, genreFilter?.value);
    displayBooks(data.results);
    updatePagination(totalBooks);
}

// Handle search
async function handleSearch() {
    currentPage = 1;
    const data = await fetchBooks(currentPage, searchBar.value, genreFilter?.value);
    displayBooks(data.results);
    updatePagination(totalBooks);
}

// Handle genre filter
async function handleGenreFilter() {
    currentPage = 1;
    const data = await fetchBooks(currentPage, searchBar?.value, genreFilter.value);
    displayBooks(data.results);
    updatePagination(totalBooks);
}

// Initialize event listeners
function initializeEventListeners() {
    if (searchBar) {
        searchBar.addEventListener('input', handleSearch);
    }
    if (genreFilter) {
        genreFilter.addEventListener('change', handleGenreFilter);
    }
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            showPage('home-page');
        });
    }
}

// Load initial data
function loadInitialData() {
    const currentPath = window.location.pathname;
    if (currentPath.endsWith('index.html') || currentPath === '/') {
        fetchGenres(); // Fetch genres when the home page loads
        fetchBooks(1).then(data => {
            displayBooks(data.results);
            updatePagination(totalBooks);
        });
    } else if (currentPath.endsWith('wishlist.html')) {
        displayWishlist();
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initializeElements();
    initializeEventListeners();
    loadInitialData();
});
