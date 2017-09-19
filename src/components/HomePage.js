import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import * as _ from 'lodash';

import Book from './Book';

/**
 * @namespace HomePage
 * home page to display book separated into their shelves.
 */
export default class HomePage extends Component {

  static propTypes = {
    books: PropTypes.array.isRequired,
    changeShelf: PropTypes.func.isRequired
  };

  // shelves array. used to loop thru the available shelves.
  state = {
    shelves: [
      {id: 'currentlyReading', displayText: 'Currently Reading'},
      {id: 'wantToRead', displayText: 'Want To Read'},
      {id: 'read', displayText: 'Read'}
    ]
  }

  render() {
    const { books } = this.props;
    const { shelves } = this.state;

    // books are grouped by the shelves
    // {
    //    currentlyReading: [{}, {}],
    //    wantToRead: [{}, {}],
    //    read: [{}, {}]
    // }
    const groupedBooks = _.groupBy(books, 'shelf');

    return (
      <div className="list-books">
        <div className="list-books-title">
          <h1>MyReads</h1>
        </div>

        <div className="list-books-content">
          {
            shelves.map((shelf) => (
              <div className="bookshelf" key={shelf.id} >
                <h2 className="bookshelf-title">{shelf.displayText}</h2>
                <ol className="books-grid">
                  {/*
                    for any given shelf if the shelf have any books then it will loop thru the books
                    and will call the Book component with the required values.
                  */}
                  {(groupedBooks[shelf.id] && groupedBooks[shelf.id].map((book, index) => (
                    <li key={book.id}>
                        <Book
                          key={book.id}
                          coverURL={book.imageLinks.thumbnail}
                          title={book.title}
                          authors={book.authors}
                          shelf={book.shelf}
                          changeShelf={this.props.changeShelf.bind(this, book)}/>
                    </li>
                  )))}
                </ol>
              </div>
            ))
          }
        </div>

        <div className="open-search">
          <Link to='/search' >Add a book</Link>
        </div>
      </div>
    );
  }
}
