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

  componentDidMount() {
    BooksAPI.getAll()
      .then((books) => {
        this.setState({ books: this.formatBooks(books) });
      });
  }

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

  changeShelf = (book, newShelf) => {
    BooksAPI.update(book, newShelf)
      .then((books) => {
        return BooksAPI.get(book.id);
      })
      .then((updatedBook) => {
        updatedBook.shelf = newShelf;

        this.setState((currState) => {
          const currBooks = currState.books.map((book) => {
            if (book.id === updatedBook.id) {
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

  addBookToShelf = (newBook, newShelf) => {
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
  }

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
        <Route exact path='/' render={() => (
          <HomePage
            books={this.state.books}
            changeShelf={this.changeShelf}
          />
        )} />

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
