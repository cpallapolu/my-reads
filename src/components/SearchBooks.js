import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import Book from './Book';

// search page to display books for the searched query
class SearchBooks extends Component {

  static propTypes = {
    books: PropTypes.array.isRequired,
    searchForBooks: PropTypes.func.isRequired,
    addBookToShelf: PropTypes.func.isRequired
  }

  // storing the query
  state = {
    query: ''
  }

  // updates the query state and calls the searchForBooks prop method to
  // get the books for the given search query
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
              onChange={(e) => this.updateQuery(e.target.value)} />
          </div>
        </div>

        {/*
          display the results if the length of the query is greater than 0
        */}
        {
          query.length && (
            <div className="search-books-results">
              <ol className="books-grid">
                {/*
                  loop thru the books and will call the Book component with the required values.
                */}
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
