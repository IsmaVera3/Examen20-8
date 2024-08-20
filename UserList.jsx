import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  //2 mosgrtar usuarios
  useEffect(() => {
    axios.get('http://localhost:3001/users')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('Hubo un error al obtener los usuarios:', error);
      });
  }, []);

  const handleAddUser = (e) => {
    e.preventDefault();

    const newUser = { name, email };
    //3 postear usuarios
    axios.post('http://localhost:3001/users', newUser)
      .then(response => {
        setUsers([...users, response.data]);
        setName('');
        setEmail('');
      })
      .catch(error => {
        console.error('Hubo un error al agregar el usuario:', error);
      });
  };

  const handleEditUser = (user) => {
    setEditingUserId(user.id);
    setName(user.name);
    setEmail(user.email);
  };

  const handleUpdateUser = (e) => {
    e.preventDefault();

    const updatedUser = { name, email };
    //4 Actualizar usuarios
    axios.put(`http://localhost:3001/users/${editingUserId}`, updatedUser)
      .then(response => {
        const updatedUsers = users.map(user => {
          if (user.id === editingUserId) {
            return { ...user, ...response.data };
          } else {
            return user;
          }
        });

        setUsers(updatedUsers);
        setEditingUserId(null);
        setName('');
        setEmail('');
      })
      .catch(error => {
        console.error('Hubo un error al actualizar el usuario:', error);
      });
  };
  //5 Eliminar usuario
  const handleDeleteUser = (userId) => {
    axios.delete(`http://localhost:3001/users/${userId}`)
      .then(() => {
        const updatedUsers = users.filter(user => user.id !== userId);
        setUsers(updatedUsers);
      })
      .catch(error => {
        console.error('Hubo un error al eliminar el usuario:', error);
      });
  };

  
  //6  Paginacion y filtro
  //const handlePag = {name};
  //axios.filter('http://localhost:3001/users')



  return (
    <div>
      <h2>Lista de Usuarios</h2>

      <form onSubmit={(e) => {
        if (editingUserId) {
          handleUpdateUser(e);
        } else {
          handleAddUser(e);
        }
      }}>
        <div>
          <label>Nombre:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit">
          {(() => {
            if (editingUserId) {
              return 'Actualizar Usuario';
            } else {
              return 'Agregar Usuario';
            }
          })()}
        </button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <button onClick={() => handleEditUser(user)}>Editar</button>
                <button onClick={() => handleDeleteUser(user.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
