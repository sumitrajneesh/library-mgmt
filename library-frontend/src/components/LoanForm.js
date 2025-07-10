import React, { useState } from 'react';
import './LoanForm.css';

function LoanForm({ books, users, loans, onLoanAction }) {
  const [selectedBookId, setSelectedBookId] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');

  const handleBorrow = async () => {
    if (!selectedBookId || !selectedUserId) {
      alert('Please select a book and a user to borrow.');
      return;
    }
    await onLoanAction({ bookId: selectedBookId, userId: selectedUserId, type: 'borrow' });
    setSelectedBookId('');
    setSelectedUserId('');
  };

  const handleReturn = async (loanId) => {
    await onLoanAction({ loanId: loanId, type: 'return' });
  };

  const availableBooks = books.filter(book => book.availableQuantity > 0);
  const activeLoans = loans.filter(loan => loan.status === 'BORROWED');

  return (
    <div className="section">
      <h2>Loans</h2>

      <h3>Borrow Book</h3>
      <div className="loan-form">
        <select value={selectedBookId} onChange={(e) => setSelectedBookId(e.target.value)}>
          <option value="">Select a Book</option>
          {availableBooks.map(book => (
            <option key={book.id} value={book.id}>{book.title} ({book.availableQuantity} available)</option>
          ))}
        </select>
        <select value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)}>
          <option value="">Select a User</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>{user.name}</option>
          ))}
        </select>
        <button onClick={handleBorrow}>Borrow</button>
      </div>

      <h3>Active Loans</h3>
      <ul className="list">
        {activeLoans.length === 0 ? <p>No active loans.</p> :
          activeLoans.map(loan => {
            const book = books.find(b => b.id === loan.bookId);
            const user = users.find(u => u.id === loan.userId);
            return (
              <li key={loan.id} className="item">
                <span>
                  {book ? book.title : 'Unknown Book'} by {user ? user.name : 'Unknown User'}
                  (Loan Date: {new Date(loan.loanDate).toLocaleDateString()})
                </span>
                <button onClick={() => handleReturn(loan.id)}>Return</button>
              </li>
            );
          })
        }
      </ul>

      <h3>Loan History</h3>
      <ul className="list">
        {loans.length === 0 ? <p>No loan history.</p> :
          loans.map(loan => {
            const book = books.find(b => b.id === loan.bookId);
            const user = users.find(u => u.id === loan.userId);
            return (
              <li key={loan.id} className="item loan-history-item">
                <span>
                  {book ? book.title : 'Unknown Book'} by {user ? user.name : 'Unknown User'}
                  (Status: {loan.status}, Loan Date: {new Date(loan.loanDate).toLocaleDateString()}
                  {loan.returnDate && `, Return Date: ${new Date(loan.returnDate).toLocaleDateString()}`})
                </span>
              </li>
            );
          })
        }
      </ul>
    </div>
  );
}

export default LoanForm;