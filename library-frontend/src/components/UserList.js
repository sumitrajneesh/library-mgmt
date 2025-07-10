import React, { useState } from 'react';
import './UserList.css';

function UserList({ users, addUser, deleteUser }) {
  const [newUser, setNewUser] = useState({ name: '', email: '' });

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email) {
      alert('Please fill all user details.');
      return;
    }
    const success = await addUser(newUser);
    if (success) {
      setNewUser({ name: '', email: '' });
    }
  };

  return (
    <div className="section">
      <h2>Users</h2>
      <div className="add-form">
        <input
          type="text"
          placeholder="Name"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        />
        <button onClick={handleAddUser}>Add User</button>
      </div>
      <ul className="list">
        {users.length === 0 ? <p>No users registered.</p> :
          users.map(user => (
            <li key={user.id} className="item">
              <span>{user.name} ({user.email})</span>
              <button onClick={() => deleteUser(user.id)}>Delete</button>
            </li>
          ))
        }
      </ul>
    </div>
  );
}

export default UserList;