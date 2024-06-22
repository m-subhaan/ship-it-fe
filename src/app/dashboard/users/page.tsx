'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import type { Metadata } from 'next';
import { deleteUser, fetchAdmins } from '@/services/admin';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import dayjs from 'dayjs';

import type { Admin } from '@/types/admin';
import { config } from '@/config';
import { UsersFilters } from '@/components/dashboard/user/users-filters';
import { UsersTable } from '@/components/dashboard/user/users-table';
import UserModal from '@/components/modals/users-modal';

export default function Page(): React.JSX.Element {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [modalOperation, setModalOperation] = useState<'add' | 'edit'>('add');
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = React.useState(false);


  const handleAddUserClick = () => {
    setModalOperation('add');
    setIsModalOpen(true);
  };

  const handleEditUserClick = (admin: Admin) => {
    setSelectedAdmin(admin);
    setModalOperation('edit');
    setIsModalOpen(true);
  };

  const onConfirmDelete = async () => {
    const token = localStorage.getItem('jwt');
    if (token && selectedAdmin?.adminId) {
      await deleteUser(token, selectedAdmin?.adminId);
      setIsConfirmationModalOpen(false);
    }
  };

  const handleDeleteClick = (admin: any) => {
    setSelectedAdmin(admin);
    setIsConfirmationModalOpen(true);
  };

  useEffect(() => {
    // Fetch admins when the component mounts

    if (!isModalOpen || !isConfirmationModalOpen) {
      const token = localStorage.getItem('jwt');
      if (token) {
        fetchAdmins(token)
          .then((data) => setAdmins(data))
          .catch((error) => console.error('Error fetching admins:', error));
      }
    }
  }, [isModalOpen, isConfirmationModalOpen]);
  const page = 0;
  const rowsPerPage = 5;

  const paginatedCustomers = applyPagination(admins, page, rowsPerPage);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Users</Typography>
          {/* <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Button color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}>
              Import
            </Button>
            <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}>
              Export
            </Button>
          </Stack> */}
        </Stack>
        <div>
          <Button
            startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />}
            variant="contained"
            onClick={handleAddUserClick}
          >
            Add
          </Button>
        </div>
      </Stack>
      {/* <CustomersFilters /> */}
      <UsersTable
        count={paginatedCustomers.length}
        page={page}
        rows={paginatedCustomers}
        rowsPerPage={rowsPerPage}
        onEditUserClick={handleEditUserClick}
        handleDeleteClick={handleDeleteClick}
        onConfirmDelete={onConfirmDelete}
        isConfirmationModalOpen={isConfirmationModalOpen}
        setIsConfirmationModalOpen={setIsConfirmationModalOpen}
        selectedAdmin={selectedAdmin}
      />
      <UserModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        operation={modalOperation}
        admin={selectedAdmin}
      />
    </Stack>
  );
}

function applyPagination(rows: Admin[], page: number, rowsPerPage: number): Admin[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
