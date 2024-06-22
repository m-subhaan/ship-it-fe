'use client';

import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { deleteCategory, fetchCategories } from '@/services/categories';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { toast, ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import type { Category } from '@/types/category';
import { CategoriesTable } from '@/components/dashboard/category/category-table';
import CategoriesModal from '@/components/modals/categories-modal';

// const hardcodedCategories: Category[] = [
//     { id: 1, name: "TV", subCategories: [{name: 'Samsung'}, {name: 'LG'}] },
//     { id: 2, name: "Mobile", subCategories: [{name: ''}] },
//     { id: 3, name: "T Shirts", subCategories: [{name: ''}] }
//   ];

export default function Page(): React.JSX.Element {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [delCategory, setDelCategory] = useState();

  const [modalOperation, setModalOperation] = useState<'add' | 'edit'>('add');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = React.useState(false);

  const handleAddCategoryClick = () => {
    setModalOperation('add');
    setIsModalOpen(true);
  };

  const fetchCategoriesCallback = useCallback(async () => {
    let response = await fetchCategories();
    setCategories(response);
  }, []);

  const handleEditCategoryClick = (category: Category) => {
    setSelectedCategory(category);
    setModalOperation('edit');
    setIsModalOpen(true);
  };

  const onConfirmDelete = async () => {
    try {
      if (delCategory) await deleteCategory(delCategory);
      setIsConfirmationModalOpen(false);
      toast.success("Category Deleted Successfully", { autoClose: 3000 });
      fetchCategoriesCallback();
    } catch (e:any) {
      toast.error(e.message, { autoClose: 3000 });
    }
  };

  const handleDeleteClick = (category: any) => {
    setDelCategory(category?.categoryId);
    setIsConfirmationModalOpen(true);
  };

  useEffect(() => {
    // Fetch admins when the component mounts
    const token = localStorage.getItem('jwt');
    if (!categories.length) fetchCategoriesCallback();

    if (!isModalOpen || !isConfirmationModalOpen) {
      if (token) {
        // fetchAdmins(token)
        //   .then((data) => setAdmins(data))
        //   .catch((error) => console.error('Error fetching admins:', error));
        // setCategories(hardcodedCategories);
      }
    }
  }, [isModalOpen, isConfirmationModalOpen]);

  const page = 0;
  const rowsPerPage = 5;

  // const paginatedCategories = applyPagination(categories, page, rowsPerPage);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Categories & Subcategories</Typography>
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
            onClick={handleAddCategoryClick}
          >
            Add
          </Button>
        </div>
      </Stack>
      {/* <CustomersFilters /> */}
      <CategoriesTable
        // count={paginatedCategories.length}
        // page={page}
        rows={categories}
        // rowsPerPage={rowsPerPage}
        onEditCategoryClick={handleEditCategoryClick}
        handleDeleteClick={handleDeleteClick}
        onConfirmDelete={onConfirmDelete}
        isConfirmationModalOpen={isConfirmationModalOpen}
        setIsConfirmationModalOpen={setIsConfirmationModalOpen}
        selectedCategory={selectedCategory}
      />
      <CategoriesModal
        open={isModalOpen}
        onClose={() => {
          fetchCategoriesCallback();
          setIsModalOpen(false);
        }}
        operation={modalOperation}
        category={selectedCategory}
      />
      <ToastContainer />
    </Stack>
  );
}

function applyPagination(rows: Category[], page: number, rowsPerPage: number): Category[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
