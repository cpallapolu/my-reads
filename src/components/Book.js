
import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * @namespace Book
 * common class to display the book icon as well as selecting shelf options.
 */
export default class Book extends Component {
  static propTypes = {
    coverURL: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    authors: PropTypes.array.isRequired,
    shelf: PropTypes.string.isRequired,
    changeShelf: PropTypes.func.isRequired
  };

  // storing all the shelf options here so we can change them quickly
  // and easily if any more options are required to add.
  state = {
    shelfOptions: [
      { id: 0, value: 'moveTo', name: 'Move to...'},
      { id: 1, value: 'currentlyReading', name: 'Currently Reading'},
      { id: 2, value: 'wantToRead', name: 'Want to Read'},
      { id: 3, value: 'read', name: 'Read'},
      { id: 4, value: 'none', name: 'None'}
    ]
  }

  render() {
    const { coverURL, shelf, title, authors, changeShelf } = this.props;

    return (
      <div className="book">
        <div className="book-top">
          <div className="book-cover book-cover-image" style={{
            backgroundImage: `url(${coverURL})` }}>
          </div>

          {/*
            loops thru the shelf options and and builds a dropdown menu.
            on change of option value, props changeShelf is called whcih will
            change the shelf of this book
          */}
          <div className="book-shelf-changer">
            <select value={ shelf } onChange={ (e) => changeShelf(e.target.value) }>
						  {
                this.state.shelfOptions.map((shelfOption) =>
                  <option value={ shelfOption.value } key={ shelfOption.id } disabled={shelfOption.id === 0}>{shelfOption.name}</option>)
              }
					  </select>
          </div>
        </div>

        <div className="book-title">{title}</div>
        <div className="book-authors">{authors.join(', ')}</div>
      </div>
    );
  }

}
