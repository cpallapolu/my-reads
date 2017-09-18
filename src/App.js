import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import * as BooksAPI from './BooksAPI'
import './App.css'

import HomePage from './components/HomePage';
import SearchBooks from './components/SearchBooks';

import * as _ from 'lodash';

class App extends Component {
  state = {
    books: [],
    searchedBooks: []
  }

  // calls the BooksAPI.getAll to get all the books for this user,
  // on successfull response, updates the books state
  // on error response, sets the books to empty array
  componentDidMount() {
    BooksAPI.getAll()
      .catch((err) => {
        this.setState({ books: [] });
      })
      .then((books) => {
        books = (!books || !!books.error) ? [] : this.formatBooks(books);

        this.setState({ books });
      });
  }

  // makes sure that all the required information to build a Book is present
  // if any of the value is not present it is defaulted to appropriate value
  formatBooks = (books) => {
    const unformattedBooks = _.clone(books);
    const minBookKeys = {
      title: '',
      imageLinks: {
        thumbnail: ''
      },
      authors: [],
      shelf: 'none'
    };

    const formattedBooks = unformattedBooks.map((unformattedBook) => {
      const formattedBook = _.defaultsDeep(unformattedBook, minBookKeys);

      return formattedBook;
    });

    return formattedBooks;
  }

  // changes the shelf of any book.
  // calls the BooksAPI to update the shelf
  // on successfull update book, loops thru the current state books and updates
  // shelf of the book of interest
  changeShelf = (book, newShelf) => {
    BooksAPI.update(book, newShelf)
      .catch((err) => {
        // no-op
      })
      .then(() => {
        this.setState((currState) => {
          const currBooks = currState.books.map((currBook) => {
            if (book.id === currBook.id) {
              book.shelf = newShelf;
            }

            return book;
          });

          return {
            books: currBooks
          }
        });
      });
  }

  // calls BooksAPI update for the book, on successfull call adds a book to given
  // shelf from the search page. loops thru the searchedBooks state and updates
  // the state of the selected book and the selected book to the current books state
  addBookToShelf = (newBook, newShelf) => {
    BooksAPI.update(newBook, newShelf)
      .catch((err) => {
        // no-op
      })
      .then((books) => {
        this.setState((currState) => {
          const currSearchedBooks = currState.searchedBooks.map((searchBook) => {
            if (searchBook.id === newBook.id) {
              searchBook.shelf = newShelf;
            }

            return searchBook;
          });

          newBook.shelf = newShelf;

          return {
            books: currState.books.concat([ newBook ]),
            searchedBooks: currSearchedBooks
          }
        });
      });
  }

  // searches the books by the query by calling BooksAPI search method.
  // on successfull response, it formats the books so that every book has
  // required fields and loop thur the searchedBooks and update the shelf
  // to match if that book is already selected.
  searchForBooks = (query) => {
    BooksAPI.search(query)
      .catch(() => this.setState({ searchedBooks: [] }))
      .then((searchedBooks) => {
        searchedBooks = (!searchedBooks || !!searchedBooks.error) ? [] : this.formatBooks(searchedBooks);

        this.setState((currState) => {
          const updatedSearchedBooks = searchedBooks.map((searchedBook) => {
            const bookAlreadySelected = _.find(currState.books, { id: searchedBook.id });

            if (bookAlreadySelected) {
              searchedBook.shelf = bookAlreadySelected.shelf;
            }

            return searchedBook;
          });

          return {
            searchedBooks: updatedSearchedBooks
          }
        });
      });
  }

  render() {
    return (
      <div className="app">
        {/*
          home page: displays three shelves with the books assigned to them
        */}
        <Route exact path='/' render={() => (
          <HomePage
            books={this.state.books}
            changeShelf={this.changeShelf}
          />
        )} />

        {/*
          search page: displays any books mathcing the search query.
        */}
        <Route path='/search' render={() => (
          <SearchBooks
            books={this.state.searchedBooks}
            searchForBooks={this.searchForBooks}
            addBookToShelf={this.addBookToShelf}
          />
        )} />
      </div>
    )
  }
}

export default App;
