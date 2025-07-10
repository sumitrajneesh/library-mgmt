import React, { useState, useEffect } from 'react';
import BookList from './components/BookList';
import UserList from './components/UserList';
import LoanForm from './components/LoanForm';
import './App.css';

// Define API base URLs using environment variables for flexibility
const BOOK_API_URL = process.env.REACT_APP_BOOK_API_URL || '/api/books';
const USER_API_URL = process.env.REACT_APP_USER_API_URL || '/api/users';
const LOAN_API_URL = process.env.REACT_APP_LOAN_API_URL || '/api/loans';

function App() {
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loans, setLoans] = useState([]);
  const [activeTab, setActiveTab] = useState('books'); // 'books', 'users', 'loans'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [booksRes, usersRes, loansRes] = await Promise.all([
        fetch(BOOK_API_URL),
        fetch(USER_API_URL),
        fetch(LOAN_API_URL)
      ]);

      if (!booksRes.ok || !usersRes.ok || !loansRes.ok) {
        throw new Error('Failed to fetch one or more resources');
      }

      const booksData = await booksRes.json();
      const usersData = await usersRes.json();
      const loansData = await loansRes.json();

      setBooks(booksData);
      setUsers(usersData);
      setLoans(loansData);

    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data. Please check backend services.");
    } finally {
      setLoading(false);
    }
  };

  // --- Book Management ---
  const addBook = async (bookData) => {
    try {
      const response = await fetch(BOOK_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData),
      });
      if (!response.ok) throw new Error('Failed to add book');
      const newBook = await response.json();
      setBooks([...books, newBook]);
      return true;
    } catch (err) {
      setError("Error adding book: " + err.message);
      return false;
    }
  };

  const deleteBook = async (id) => {
    try {
      const response = await fetch(`${BOOK_API_URL}/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete book');
      setBooks(books.filter(book => book.id !== id));
    } catch (err) {
      setError("Error deleting book: " + err.message);
    }
  };

  // --- User Management ---
  const addUser = async (userData) => {
    try {
      const response = await fetch(USER_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      if (!response.ok) throw new Error('Failed to add user');
      const newUser = await response.json();
      setUsers([...users, newUser]);
      return true;
    } catch (err) {
      setError("Error adding user: " + err.message);
      return false;
    }
  };

  const deleteUser = async (id) => {
    try {
      const response = await fetch(`${USER_API_URL}/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete user');
      setUsers(users.filter(user => user.id !== id));
    } catch (err) {
      setError("Error deleting user: " + err.message);
    }
  };

  // --- Loan Management ---
  const handleLoanAction = async (loanData) => {
    try {
      const response = await fetch(LOAN_API_URL, {
        method: 'POST', // Or PUT for return, depending on backend design
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loanData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Loan action failed');
      }
      // Re-fetch all data to update book availability and loan list
      await fetchAllData();
      alert('Loan action successful!');
      return true;
    } catch (err) {
      setError("Loan action error: " + err.message);
      alert("Loan action failed: " + err.message); // User-friendly alert
      return false;
    }
  };


  return (
    <div className="App">
      <header className="App-header">
        <h1>Library Management System</h1>
      </header>
      <nav className="App-nav">
        <button onClick={() => setActiveTab('books')} className={activeTab === 'books' ? 'active' : ''}>Books</button>
        <button onClick={() => setActiveTab('users')} className={activeTab === 'users' ? 'active' : ''}>Users</button>
        <button onClick={() => setActiveTab('loans')} className={activeTab === 'loans' ? 'active' : ''}>Loans</button>
      </nav>
      <main>
        {loading && <p>Loading data...</p>}
        {error && <p className="error-message">{error}</p>}

        {!loading && !error && (
          <>
            {activeTab === 'books' && (
              <BookList
                books={books}
                addBook={addBook}
                deleteBook={deleteBook}
              />
            )}
            {activeTab === 'users' && (
              <UserList
                users={users}
                addUser={addUser}
                deleteUser={deleteUser}
              />
            )}
            {activeTab === 'loans' && (
              <LoanForm
                books={books}
                users={users}
                loans={loans}
                onLoanAction={handleLoanAction}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;