# BookWorm - Your Literary Adventure

**BookWorm** is a simple and interactive book search application built with **HTML**, **CSS**, and **JavaScript**, using the (https://gutendex.com/books/). This application allows users to search for books, filter by genre, view detailed book information, and manage a wishlist.

## Table of Contents

- [Demo](#demo)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Known Issues](#known-issues)

## Demo

[Live Demo](#) (Add your link here)

## Features

- Search books by title
- Filter books by genre
- View detailed book information (author, genres, languages, download count, etc.)
- Add/remove books to/from a wishlist (stored in browser’s local storage)
- Responsive and user-friendly interface
- Animated loading spinner while fetching data

## Technologies Used

- **HTML**: Structure of the website
- **CSS**: Styling the website and making it responsive
- **JavaScript**: Handling the dynamic behavior of the app
- **Gutendex API**: Source of book data from the Gutenberg Project

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Shazzadhossensunny/book-listing

   ```

2. cd bookworm

3. Open index.html in your browser: Simply double-click the index.html file, or serve it via a local server like Live Server.

## Usage

Homepage:

    . Search for books by typing in the search bar.
    . Filter books by selecting a genre from the dropdown.
    . View book details by clicking on any book in the grid.
    . Navigate through the book list using pagination.

Wishlist Page:

    . Add books to the wishlist by clicking the ❤️ button on any book card.
    . View your saved books on the Wishlist page (wishlist.html).
    . Remove books from the wishlist by clicking the ❤️ button again.

Known Issues

    . API Loading Time: The data comes from the Gutenberg Project API, which might cause delays while loading books, depending on the network speed and the API's response time. A loading spinner is provided to enhance user experience during these moments.

    . Limited Genre Filtering: The genres available in the filter are based on the book data returned by the API. Some books may not have associated genres
