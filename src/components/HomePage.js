import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import * as _ from 'lodash';

import Book from './Book';

class HomePage extends Component {

  static propTypes = {
    books: PropTypes.array.isRequired,
    changeShelf: PropTypes.func.isRequired
  };

  handleChangeShelf = (book, shelf) => {
    this.props.changeShelf(book, shelf);
  }


  render() {
    const { books } = this.props;

    const groupedBooks = _.groupBy(books, 'shelf');

    return (
      <div className="list-books">
        <div className="list-books-title">
          <h1>MyReads</h1>
        </div>

        <div className="list-books-content">
          <div className="bookshelf">
            <h2 className="bookshelf-title">Currently Reading</h2>
            <ol className="books-grid">
              {
                (
                  groupedBooks.currentlyReading &&
                  groupedBooks.currentlyReading.map((book, index) => (
                    <li key={book.id}>
                      <Book
                        key={book.id}
                        coverURL={book.imageLinks.thumbnail}
                        title={book.title}
                        authors={book.authors}
                        shelf={book.shelf}
                        changeShelf={this.handleChangeShelf.bind(this, book)}/>
                    </li>
                  ))
                )
              }
            </ol>
          </div>

          <div className="bookshelf">
            <h2 className="bookshelf-title">Want To Read</h2>
            <ol className="books-grid">
              {
                (
                  groupedBooks.wantToRead &&
                  groupedBooks.wantToRead.map((book, index) => (
                    <li key={book.id}>
                      <Book
                        key={book.id}
                        coverURL={book.imageLinks.thumbnail}
                        title={book.title}
                        authors={book.authors}
                        shelf={book.shelf}
                        changeShelf={this.handleChangeShelf.bind(this, book)}/>
                    </li>
                  ))
                )
              }
            </ol>
          </div>

          <div className="bookshelf">
            <h2 className="bookshelf-title">Read</h2>
            <ol className="books-grid">
              {
                (
                  groupedBooks.read &&
                  groupedBooks.read.map((book, index) => (
                    <li key={book.id}>
                      <Book
                        key={book.id}
                        coverURL={book.imageLinks.thumbnail}
                        title={book.title}
                        authors={book.authors}
                        shelf={book.shelf}
                        changeShelf={this.handleChangeShelf.bind(this, book)}/>
                    </li>
                  ))
                )
              }
            </ol>
          </div>
        </div>

        <div className="open-search">
          <Link to='/search' >Add a book</Link>
        </div>
      </div>
    );
  }
}

export default HomePage;
