import React, { useState } from 'react';
import './BookList.css';

function BookList({ books, addBook, deleteBook }) {
  const [newBook, setNewBook] = useState({ title: '', author: '', isbn: '', quantity: 1 });

  const handleAddBook = async () => {
    if (!newBook.title || !newBook.author || !newBook.isbn || newBook.quantity <= 0) {
      alert('Please fill all book details correctly.');
      return;
    }
    const success = await addBook(newBook);
    if (success) {
      setNewBook({ title: '', author: '', isbn: '', quantity: 1 });
    }
  };

  return (
    <div className="section">
      <h2>Books</h2>
      <div className="add-form">
        <input
          type="text"
          placeholder="Title"
          value={newBook.title}
          onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Author"
          value={newBook.author}
          onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
        />
        <input
          type="text"
          placeholder="ISBN"
          value={newBook.isbn}
          onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
        />
        <input
          type="number"
          placeholder="Quantity"
          value={newBook.quantity}
          onChange={(e) => setNewBook({ ...newBook, quantity: parseInt(e.target.value) || 1 })}
          min="1"
        />
        <button onClick={handleAddBook}>Add Book</button>
      </div>
      <ul className="list">
        {books.length === 0 ? <p>No books in the catalog.</p> :
          books.map(book => (
            <li key={book.id} className="item">
              <span>{book.title} by {book.author} (ISBN: {book.isbn}) - Available: {book.availableQuantity}/{book.quantity}</span>
              <button onClick={() => deleteBook(book.id)}>Delete</button>
            </li>
          ))
        }
      </ul>
    </div>
  );
}

export default BookList;