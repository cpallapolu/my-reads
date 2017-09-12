import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import Book from './Book';

class SearchBooks extends Component {

  static propTypes = {
    books: PropTypes.array.isRequired,
    searchForBooks: PropTypes.func.isRequired,
    addBookToShelf: PropTypes.func.isRequired
  }

  state = {
    query: ''
  }

  updateQuery = (newQuery) => {
    this.setState({ query: newQuery.trim() })

    this.props.searchForBooks(newQuery.trim())
  }

  render() {
    const { books } = this.props;
    const { query } = this.state;

    return (
      <div className="search-books">
        <div className="search-books-bar">
          <Link to='/' className='close-search'>Close</Link>
          <div className="search-books-input-wrapper">
            <input
              type="text"
              placeholder="Search by title or author"
              onChange={(event) => this.updateQuery(event.target.value)} />
          </div>
        </div>
        {
          query.length && (
            <div className="search-books-results">
              <ol className="books-grid">
                {
                  books.map((book) => (
                    <li key={ book.id }>
                      <Book
                        key={ book.id }
                        coverURL={ book.imageLinks.thumbnail }
                        title={ book.title }
                        authors={ book.authors }
                        shelf={ book.shelf }
                        changeShelf={ this.props.addBookToShelf.bind(this, book) }
                      />
                    </li>
                  ))
                }
              </ol>
            </div>
          )
        }
      </div>
    );
  }

}

export default SearchBooks;
