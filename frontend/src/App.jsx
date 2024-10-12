import { useEffect, useState } from 'react'; 
import axios from 'axios';
import './App.css';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Snackbar,
  Alert,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const API_URL = 'https://backend-crud-mern.vercel.app/api/users'; // Backend API URL

function App() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', email: '' });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    const response = await axios.get(API_URL);
    setUsers(response.data.data);
  }

  const handleDialogOpen = (user) => {
    setDialogOpen(true);
    if (user) {
      setEditMode(true);
      setCurrentUserId(user._id); // Using MongoDB's _id field
      setNewUser({ name: user.name, email: user.email });
    } else {
      setEditMode(false);
      setNewUser({ name: '', email: '' });
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setNewUser({ name: '', email: '' });
    setEditMode(false);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleAddUser = async () => {
    try {
      await axios.post(API_URL, newUser);
      fetchUsers();
      handleDialogClose();
      showSnackbar('User added successfully!', 'success');
    } catch (error) {
      showSnackbar(error.response.data.message, 'error');
    }
  };

  const handleUpdateUser = async () => {
    try {
      await axios.put(`${API_URL}/${currentUserId}`, newUser);
      fetchUsers();
      handleDialogClose();
      showSnackbar('User updated successfully!', 'success');
    } catch (error) {
      showSnackbar(error.response.data.message, 'error');
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchUsers();
      showSnackbar('User deleted successfully!', 'success');
    } catch (error) {
      showSnackbar(error.response.data.message, 'error');
    }
  };

  return (
    <div className="app-container">
     <h1 style={{ fontSize: '34px' }}>User Management</h1>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>{editMode ? 'Edit User' : 'Add New User'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={editMode ? handleUpdateUser : handleAddUser}>
            {editMode ? 'Update User' : 'Add User'}
          </Button>
        </DialogActions>
      </Dialog>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}> {/* Using _id as the key */}
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <IconButton
                    style={{ color: 'orange' }}  // Edit icon in orange color
                    onClick={() => handleDialogOpen(user)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    style={{ color: 'red' }}  // Delete icon in red color
                    onClick={() => handleDeleteUser(user._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Button
  variant="contained"
  onClick={() => handleDialogOpen()}
  startIcon={<AddIcon />}
  sx={{ marginTop: '40px', backgroundColor: 'rgb(68, 68, 173)', color: 'white' }} // Match h1 color
>
  Add New User
</Button>

    </div>
  );
}

export default App;
