import * as React from 'react';
import { fetchCategories } from '@/services/categories';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';

import { Category, SubCategory } from '@/types/category';

interface ProductsFiltersProps {
  onFiltersChange: (filters: any) => void;
}

const statuses = ['ACTIVE', 'DRAFT']; // Example statuses, adjust as needed
const booleanOptions = [
  { value: 'true', label: 'Yes' },
  { value: 'false', label: 'No' },
];

export function ProdcutsFilters({ onFiltersChange }: ProductsFiltersProps): React.JSX.Element {
  const initialFilters = {
    text: '',
    productId: '',
    status: '',
    isPromotion: '',
    isPublish: '',
    categoryId: '',
    subCategoryId: '',
  };

  const [filters, setFilters] = React.useState(initialFilters);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [subCategories, setSubCategories] = React.useState<SubCategory[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories', error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const handleFilterChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleCategoryChange = (event: React.ChangeEvent<{}>, value: any) => {
    const newFilters = { ...filters, categoryId: value?.categoryId || '', subCategoryId: '' };
    setFilters(newFilters);
    setSubCategories(value?.subCategory || []);
    onFiltersChange(newFilters);
  };

  const handleSubCategoryChange = (event: React.ChangeEvent<{}>, value: any) => {
    const newFilters = { ...filters, subCategoryId: value?.subCategoryId || '' };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleClearFilters = () => {
    setFilters(initialFilters);
    onFiltersChange(initialFilters);
  };

  return (
    <Card sx={{ p: 2 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid xs={9}>
          <OutlinedInput
            value={filters.text}
            onChange={handleFilterChange('text')}
            size="small"
            placeholder="Search Products with SKU, Brand, Title, Vendor"
            startAdornment={
              <InputAdornment position="start">
                <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
              </InputAdornment>
            }
            fullWidth
          />
        </Grid>
        <Grid xs={3} style={{ textAlign: 'right' }}>
          <Button variant="contained" color="secondary" onClick={handleClearFilters}>
            Clear Filters
          </Button>
        </Grid>
        <Grid xs={4}>
          <TextField
            size="small"
            label="Product ID"
            value={filters.productId}
            onChange={handleFilterChange('productId')}
            fullWidth
          />
        </Grid>
        <Grid xs={4}>
          <TextField
            label="Status"
            select
            value={filters.status}
            onChange={handleFilterChange('status')}
            size="small"
            fullWidth
          >
            {statuses.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid xs={4}>
          <TextField
            label="Is Promotion"
            select
            value={filters.isPromotion}
            onChange={handleFilterChange('isPromotion')}
            size="small"
            fullWidth
          >
            {booleanOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid xs={4}>
          <TextField
            label="Is Publish"
            select
            value={filters.isPublish}
            onChange={handleFilterChange('isPublish')}
            size="small"
            fullWidth
          >
            {booleanOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid xs={4}>
          <Autocomplete
            options={categories}
            getOptionLabel={(option) => option.categoryName}
            onChange={handleCategoryChange}
            loading={loading}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Category"
                size="small"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        </Grid>
        <Grid xs={4}>
          <Autocomplete
            options={subCategories}
            getOptionLabel={(option) => option.subCategoryName}
            onChange={handleSubCategoryChange}
            renderInput={(params) => <TextField {...params} label="SubCategory" fullWidth size="small" />}
          />
        </Grid>
      </Grid>
    </Card>
  );
}
