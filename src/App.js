
import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

Modal.setAppElement('#root');

function App() {

  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const createUser = async () => {
    try {
      const response = await axios.post('http://localhost:3000/users', {
        name,
        email,
        username,
      });
      if (response.status === 201) {
        setModalMessage('Пользователь успешно создан');
        setModalIsOpen(true);
        getUsers();
      }
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const deleteUser = async (userId) => {
    try {
      const response = await axios.delete(`http://localhost:3000/users/${userId}`);
      if (response.status === 200) {
        setModalMessage('Пользователь удален');
        setModalIsOpen(true);
        getUsers();
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setModalMessage('');
  };


  return (
    <div className="App">
      <h1>User Management</h1>
      <div className="input-section">
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
        <button onClick={createUser}>Create User</button>
      </div>
      <div className="user-table">
        {users.length === 0 ? (
            <p>Список пуст</p>
        ) : (
            <table>
              <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Username</th>
                <th>Actions</th>
              </tr>
              </thead>
              <tbody>
              {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.username}</td>
                    <td>
                      <button onClick={() => deleteUser(user.id)}>Delete</button>
                    </td>
                  </tr>
              ))}
              </tbody>
            </table>
        )}
      </div>
      <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          className="modal"
          overlayClassName="overlay"
      >
        <h2>{modalMessage}</h2>
        <button onClick={closeModal}>OK</button>
      </Modal>

    </div>
  );
}

export default App;
