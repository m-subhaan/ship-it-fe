import * as React from 'react';
import Link from 'next/link';
import { deleteProduct, fetchProducts } from '@/services/products';
import { USERS } from '@/utils/constants';
import {
  Cancel as CancelIcon,
  ConstructionOutlined,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
// import Link from '@mui/material/Link';
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import { toast, ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import type { Product } from '@/types/products';
import { useSelection } from '@/hooks/use-selection';
import ConfirmationModal from '@/components/modals/confirmation';

interface ProductsTableProps {
  count?: number;
  page?: number;
  rows?: Product[];
  rowsPerPage?: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
export function ProductsTable({
  count = 0,
  rows = [],
  page = 0,
  rowsPerPage = 0,
  onPageChange,
  onRowsPerPageChange,
}: ProductsTableProps): React.JSX.Element {
  const rowIds = React.useMemo(() => {
    return rows.map((product) => product.productId);
  }, [rows]);
  const theme = useTheme();

  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);

  const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < rows.length;
  const selectedAll = rows.length > 0 && selected?.size === rows.length;

  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<any>();

  const handleLargeString = (str: any, n: number): string => {
    if (!str?.length) return 'N/A';
    if (str?.length < n) return str;
    return `${str.substring(0, n)}...`;
  };

  const onConfirmDelete = async () => {
    const response = await deleteProduct(selectedProduct.productId);
    if (response) toast.success('Product Deleted Successfully', { autoClose: 3000 });
    else toast.error('Error Deleting Product', { autoClose: 3000 });
    setIsConfirmationModalOpen(false);
  };

  const handleSaveEdit = () => {
    // Implement save edit action here
    setEditModalOpen(false);
  };

  const handleCloseModal = () => {
    setEditModalOpen(false);
  };

  return (
    <Card sx={{ mt: 5 }}>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '800px' }}>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Subcategory</TableCell>
              <TableCell>Brand</TableCell>
              <TableCell>Vendor</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow hover key={row.productId}>
                <TableCell>
                  <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
                    <Avatar src={row.imageUrl} />
                    <Link href={`/dashboard/listing/${row.productId}`}>
                      <Typography fontWeight={500}>{handleLargeString(row.title, 20)}</Typography>
                    </Link>
                  </Stack>
                </TableCell>
                <TableCell>{row.category?.categoryName}</TableCell>
                <TableCell>{row.subCategory?.subCategoryName}</TableCell>
                <TableCell>{handleLargeString(row.brand, 14)}</TableCell>
                <TableCell>{handleLargeString(row.vendor, 14)}</TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Link href={`/dashboard/listing/${row.productId}`}>
                      <EditIcon style={{ cursor: 'pointer', color: theme.palette.primary.main }} />
                    </Link>
                    <DeleteIcon
                      onClick={() => {
                        setSelectedProduct(row);
                        setIsConfirmationModalOpen(true);
                      }}
                      style={{ cursor: 'pointer', color: theme.palette.primary.main }}
                    />
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <TablePagination
        component="div"
        count={count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
      {/* Edit Modal */}
      <Modal open={editModalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'white',
            p: 4,
          }}
        >
          {/* Content of the edit modal */}
          {/* {selectedProduct && ( */}
          {false ? <>
              {/* Display admin details here */}
              <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSaveEdit}>
                Save
              </Button>
              <Button variant="outlined" startIcon={<CancelIcon />} onClick={handleCloseModal}>
                Cancel
              </Button>
            </> : null}
        </Box>
      </Modal>

      <ConfirmationModal
        open={isConfirmationModalOpen}
        onClose={() => { setIsConfirmationModalOpen(false); }}
        onConfirm={onConfirmDelete}
        message={`Are you sure you want to delete ${selectedProduct?.title}? \n Its variants will also get deleted!!`}
      />
      <ToastContainer />
    </Card>
  );
}
