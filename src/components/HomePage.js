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

export default HomePage;
