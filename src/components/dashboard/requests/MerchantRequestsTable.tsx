'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import {
  Box,
  Button,
  ButtonGroup,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import { fetchMerchantRequests, updateMerchantStatus } from '@/services/merchant';

import { Merchant } from '@/types/merhcant';

export const MerchantRequestsTable: React.FC = () => {
  const [filter, setFilter] = useState<string>('PENDING');
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchMerchantRequests(filter);
        setMerchants(data);
      } catch (error: any) {
        if (error.message !== 'No data') {
          toast.error(`Error fetching merchant requests: ${error.message}`, { autoClose: 3000 });
        }
        setMerchants([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filter]);

  const handleUpdateStatus = async (merchantId: string, status: string) => {
    setLoading(true);
    try {
      await updateMerchantStatus(merchantId, status);
      setMerchants((prevMerchants) =>
        prevMerchants.map((merchant) => (merchant.merchantId === merchantId ? { ...merchant, status } : merchant))
      );
      toast.success(`Successfully ${status.toLowerCase()} merchant!`, { autoClose: 3000 });
    } catch (error: any) {
      toast.error(`Error updating merchant status: ${error.message}`, { autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  };

  const buttonStyles = (isActive: boolean) => ({
    backgroundColor: isActive ? 'var(--mui-palette-primary-main)' : 'default',
    color: isActive ? 'white' : 'default',
    '&:hover': {
      backgroundColor: isActive ? 'var(--mui-palette-primary-dark)' : 'default',
    },
  });

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Merchant Requests</Typography>
        <ButtonGroup>
          <Button sx={buttonStyles(filter === '')} onClick={() => setFilter('')}>
            All
          </Button>
          <Button sx={buttonStyles(filter === 'ACCEPTED')} onClick={() => setFilter('ACCEPTED')}>
            Accepted
          </Button>
          <Button sx={buttonStyles(filter === 'REJECTED')} onClick={() => setFilter('REJECTED')}>
            Rejected
          </Button>
          <Button sx={buttonStyles(filter === 'REVOKED')} onClick={() => setFilter('REVOKED')}>
            Revoked
          </Button>
          <Button sx={buttonStyles(filter === 'PENDING')} onClick={() => setFilter('PENDING')}>
            Pending
          </Button>
        </ButtonGroup>
      </Stack>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Full Name</TableCell>
              <TableCell>Mobile Number</TableCell>
              <TableCell>Email Address</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {merchants.length > 0 ? (
              merchants.map((merchant) => (
                <TableRow key={merchant.merchantId}>
                  <TableCell>{merchant.name}</TableCell>
                  <TableCell>{merchant.mobileNumber}</TableCell>
                  <TableCell>{merchant.email}</TableCell>
                  <TableCell>{merchant.address}</TableCell>
                  <TableCell>{merchant.status}</TableCell>
                  <TableCell>
                    {merchant.status === 'PENDING' ? (
                      <Stack direction="row" spacing={1}>
                        <Button
                          variant="contained"
                          color="success"
                          startIcon={<CheckIcon />}
                          onClick={() => handleUpdateStatus(merchant.merchantId!, 'ACCEPTED')}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          startIcon={<ClearIcon />}
                          onClick={() => handleUpdateStatus(merchant.merchantId!, 'REJECTED')}
                        >
                          Reject
                        </Button>
                      </Stack>
                    ) : null}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No merchant requests found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <ToastContainer />
    </Box>
  );
};
