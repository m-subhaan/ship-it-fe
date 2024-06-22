import * as React from 'react';
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

import type { Admin } from '@/types/admin';
import { type Category } from '@/types/category';
import { useSelection } from '@/hooks/use-selection';
import ConfirmationModal from '@/components/modals/confirmation';

interface CategoriesTableProps {
  count?: number;
  page?: number;
  rows?: Category[];
  rowsPerPage?: number;
  onEditCategoryClick: (category: Category) => void;
  handleDeleteClick: (row: any) => void;
  onConfirmDelete: () => void;
  isConfirmationModalOpen: boolean;
  setIsConfirmationModalOpen: (flag: boolean) => void;
  selectedCategory: any;
}

export function CategoriesTable({
  count = 0,
  rows = [],
  page = 0,
  rowsPerPage = 0,
  onEditCategoryClick,
  handleDeleteClick,
  onConfirmDelete,
  isConfirmationModalOpen,
  setIsConfirmationModalOpen,
  selectedCategory,
}: CategoriesTableProps): React.JSX.Element {
  const rowIds = React.useMemo(() => {
    return rows.map((category) => category.categoryId);
  }, [rows]);
  const theme = useTheme();

  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);

  const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < rows.length;
  const selectedAll = rows.length > 0 && selected?.size === rows.length;

  const [editModalOpen, setEditModalOpen] = React.useState(false);

  const handleSaveEdit = () => {
    setEditModalOpen(false);
  };

  const handleCloseModal = () => {
    setEditModalOpen(false);
  };

  return (
    <Card>
      <Box sx={{ overflowX: 'hidden' }}>
        <Table sx={{ minWidth: '800px' }}>
          <TableHead>
            <TableRow>
              {/* <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedAll}
                  indeterminate={selectedSome}
                  onChange={(event) => {
                    if (event.target.checked) {
                      selectAll();
                    } else {
                      deselectAll();
                    }
                  }}
                />
              </TableCell> */}
              <TableCell>Category Name</TableCell>
              <TableCell>Actions</TableCell>
              {/* <TableCell>Last Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Admin Type</TableCell>
              <TableCell>Actions</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              const isSelected = selected?.has(row.categoryId);

              return (
                <TableRow hover key={row.categoryId} selected={isSelected}>
                  {/* <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      onChange={(event) => {
                        if (event.target.checked) {
                          selectOne(row.categoryId);
                        } else {
                          deselectOne(row.categoryId);
                        }
                      }}
                    />
                  </TableCell> */}
                  <TableCell>
                    <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
                      {/* <Avatar src={'/assets/product-1.png'} /> */}
                      <Typography variant="subtitle2">{row.categoryName}</Typography>
                    </Stack>
                  </TableCell>
                  {/* <TableCell>{row.lastName}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{USERS.find(x=>x.value === row.adminType)?.label}</TableCell> */}
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <EditIcon
                        onClick={() => { onEditCategoryClick(row); }}
                        style={{ cursor: 'pointer', color: theme.palette.primary.main }}
                      />
                      <DeleteIcon
                        onClick={() => { handleDeleteClick(row); }}
                        style={{ cursor: 'pointer', color: theme.palette.primary.main }}
                      />
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      {/* <TablePagination
        component="div"
        count={count}
        onPageChange={() => {}}
        onRowsPerPageChange={() => {}}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      /> */}
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
          {selectedCategory ? <>
              {/* Display admin details here */}
              <Button variant="outlined" startIcon={<CancelIcon />} onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSaveEdit}>
                Save
              </Button>
            </> : null}
        </Box>
      </Modal>
      <ConfirmationModal
        open={isConfirmationModalOpen}
        onClose={() => { setIsConfirmationModalOpen(false); }}
        onConfirm={onConfirmDelete}
        message="Are you sure you want to delete the category ?"
      />
    </Card>
  );
}
