import * as React from 'react';
import { useEffect } from 'react';
import { addUser, editUser } from '@/services/admin';
import { USERS } from '@/utils/constants';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import type { Admin, AdminTypes } from '@/types/admin';

interface UserModalProps {
  open: boolean;
  onClose: () => void;
  operation: 'add' | 'edit';
  admin?: Admin | null;
}

const UserModal: React.FC<UserModalProps> = ({ open, onClose, operation, admin }) => {
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [adminType, setAdminType] = React.useState<AdminTypes>('SUPER_ADMIN');

  useEffect(() => {
    if (operation === 'edit' && admin) {
      setFirstName(admin.firstName);
      setLastName(admin.lastName);
      setEmail(admin.email);
      setAdminType(admin.adminType);
    } else {
      // Reset fields for adding new user
      setFirstName('');
      setLastName('');
      setEmail('');
      setAdminType('SUPER_ADMIN');
    }
  }, [open]);

  const handleSave = async () => {
    const newAdmin: Admin = {
      firstName,
      lastName,
      email,
      adminType,
    };
    const token = localStorage.getItem('jwt');

    if (operation == 'add' && token) await addUser(token, newAdmin);
    if (operation == 'edit' && token) await editUser(token, newAdmin, admin?.adminId as string);

    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'white',
          p: 4,
          width: 400,
          maxWidth: '90%',
        }}
      >
        <Typography variant="h5" gutterBottom>
          {operation === 'add' ? 'Add new User' : 'Edit User'}
        </Typography>
        <TextField
          label="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth margin="normal" />
        <TextField
          select
          label="Admin Type"
          value={adminType}
          onChange={(e) => setAdminType(e.target.value as AdminTypes)}
          fullWidth
          margin="normal"
        >
          {USERS.map(({ label, value }) => (
            <MenuItem key={value} value={value}>
              {label}
            </MenuItem>
          ))}
        </TextField>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSave}>
            {operation === 'add' ? 'Add' : 'Save'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default UserModal;
