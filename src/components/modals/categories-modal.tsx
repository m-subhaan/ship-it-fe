import { isGeneratorFunction } from 'util/types';

import * as React from 'react';
import { useEffect, useState } from 'react';
import {
  bulkUpsertSubCategories,
  createNewCategory,
  deleteSubCategories,
  updateCategoryName,
} from '@/services/categories';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { toast, ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import type { Category, SubCategory } from '@/types/category';

interface CategoryModalProps {
  open: boolean;
  onClose: () => void;
  operation: 'add' | 'edit';
  category?: Category | null;
}

const CategoriesModal: React.FC<CategoryModalProps> = ({ open, onClose, operation, category }) => {
  const [categoryName, setCategoryName] = useState('');
  const [subCategories, setSubCategories] = useState<SubCategory[]>([{ subCategoryName: '' }]);
  const [delSubCategories, setDelSubCategories] = useState<string[]>([]);

  useEffect(() => {
    if (operation === 'edit' && category) {
      setCategoryName(category.categoryName);
      // Load existing subcategories if any
      setSubCategories(category.subCategory || ['']);
    } else {
      setCategoryName('');
      setSubCategories([{ subCategoryName: '' }]);
    }
  }, [open]);

  const handleSave = async () => {
    const newCategory: Category = {
      categoryName: categoryName,
      categoryId: category?.categoryId,
      subCategory: subCategories.filter((subCat) => subCat.subCategoryName.trim() !== ''), // Filter out empty subcategories
    };
    try {
      
      if (operation === 'add') await createNewCategory(newCategory);
      if (operation === 'edit' && subCategories.length) await bulkUpsertSubCategories(newCategory);
      if (categoryName !== category?.categoryName) await updateCategoryName(category?.categoryId, categoryName);
      if (delSubCategories.length) await Promise.all(delSubCategories.map((x) => deleteSubCategories(x)));
      setDelSubCategories([]);
      onClose();
    } catch (e:any) {
      toast.error(e.message, { autoClose: 3000 });
    }
  };

  const handleAddSubCategory = () => {
    setSubCategories([...subCategories, { subCategoryName: '' }]); // Add a new empty subcategory
  };

  const handleSubCategoryChange = (index: number, value: string) => {
    const updatedSubCategories = [...subCategories];
    updatedSubCategories[index].subCategoryName = value;
    setSubCategories(updatedSubCategories);
  };

  const handleDeleteSubcategory = (index: number) => {
    const temp = subCategories;
    if (temp[index]?.subCategoryId) setDelSubCategories([...delSubCategories, temp[index]?.subCategoryId as string]);
    delete temp[index];
    setSubCategories(temp.filter((x) => x));
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
          width: 800,
          maxWidth: '90%',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <Typography variant="h5" gutterBottom>
          {operation === 'add' ? 'Add new Category' : 'Edit Category'}
        </Typography>
        <TextField
          label="Category Name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          fullWidth
          margin="normal"
        />
        {subCategories.map((subCat, index) => (
          <Stack key={index} sx={{ alignItems: 'center' }} direction="row" spacing={2}>
            <TextField
              key={index}
              label={`Subcategory ${index + 1}`}
              value={subCat.subCategoryName}
              onChange={(e) => handleSubCategoryChange(index, e.target.value)}
              fullWidth
              margin="normal"
            />
            <Button color="error" key={index + 1} onClick={(e) => handleDeleteSubcategory(index)}>
              Delete
            </Button>
          </Stack>
        ))}
        <Button variant="outlined" onClick={handleAddSubCategory}>
          Add Subcategory
        </Button>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSave}>
            {operation === 'add' ? 'Add' : 'Save'}
          </Button>
        </Box>
        <ToastContainer />
      </Box>
    </Modal>
  );
};

export default CategoriesModal;
