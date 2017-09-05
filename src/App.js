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
        thumbnail: 'https://books.google.ca/googlebooks/images/no_cover_thumb.gif'
      },
      authors: [],
      shelf: 'none'
    };

    const formattedBooks = unformattedBooks.map((unformattedBook) => {
      const formattedBook = _.defaults(unformattedBook, minBookKeys);

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
          const currBooks = _.clone(currState.books);

          let currBook = _.find(currBooks, { id: updatedBook.id });

          if (!currBook) {
            currBook = updatedBook;

            currBooks.push(updatedBook);
          }

          currBook.shelf = newShelf;

          return {
            books: currBooks
          }
        });
      });
  }

  addBookToShelf = (book, newShelf) => {
    this.changeShelf(book, newShelf)

    this.setState((currState) => {
      const currSearchedBooks = _.clone(currState.searchedBooks);

      const currSearchedBook = _.find(currSearchedBooks, { id: book.id });

      currSearchedBook.shelf = newShelf;

      return {
        searchedBooks: currSearchedBooks
      }
    });
  }

  searchForBooks = (query) => {
    BooksAPI.search(query)
      .then((searchedBooks) => {
        if (!searchedBooks && searchedBooks.error) {
          searchedBooks = [];
        } else {
          const currBooks = this.state.books;

          currBooks.map((currBook) => {
            const bookInSearch = _.find(searchedBooks, { id: currBook.id });

            if (bookInSearch) {
              bookInSearch.shelf = currBook.shelf;
            }
          });
        }

        this.setState({ searchedBooks: this.formatBooks(searchedBooks) });
      })
      .catch(() => this.setState({ searchedBooks: [] }));
  }

  render() {
    console.log('this.state: ', this.state);
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
// https://books.google.ca/googlebooks/images/no_cover_thumb.gif
