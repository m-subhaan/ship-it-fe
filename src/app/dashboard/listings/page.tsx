// page.tsx
'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { fetchProducts } from '@/services/products';
import { Box, Button } from '@mui/material';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { toast, ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import { config } from '@/config';
import { ProdcutsFilters } from '@/components/dashboard/products/products-filters';
import { ProductsTable } from '@/components/dashboard/products/products-table';
import ProductModal from '@/components/modals/product';
import VariantModal from '@/components/modals/variant';

interface Filters {
  text?: string;
  productId?: string;
  status?: string;
  isPromotion?: string;
  isPublish?: string;
  categoryId?: string;
  subCategoryId?: string;
}

export default function Page(): React.JSX.Element {
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showAddVariantModal, setShowAddVariantModal] = useState(false);
  const [newProduct, setNewProduct] = useState({});
  const [paginationInfo, setPaginationInfo] = useState({
    currentPage: 1,
    perPage: 10,
    totalItems: 0,
    totalPages: 1,
  });

  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState<Filters>({});

  const fetchData = async (filters: Filters = {}, page = 1, perPage = 10) => {
    try {
      const response = await fetchProducts({ ...filters, currentPage: page, perPage });
      // if (response.status == 'error') toast.error(response.message, { autoClose: 3000 });
      setProducts(response.rows || []);
      setPaginationInfo({
        currentPage: response.paginationInfo?.currentPage,
        perPage: response.paginationInfo?.perPage,
        totalItems: response.paginationInfo?.totalItems,
        totalPages: response.paginationInfo?.totalPages,
      });
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  useEffect(() => {
    fetchData(filters, paginationInfo.currentPage, paginationInfo.perPage);
  }, [filters, paginationInfo?.currentPage, paginationInfo?.perPage]);

  const handlePageChange = (event: unknown, newPage: number) => {
    setPaginationInfo((prev) => ({ ...prev, currentPage: newPage + 1 }));
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPaginationInfo({
      currentPage: 1,
      perPage: parseInt(event.target.value, 10),
      totalItems: paginationInfo.totalItems,
      totalPages: paginationInfo.totalPages,
    });
  };

  const handleFiltersChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  return (
    <Grid container spacing={3}>
      <Grid lg={12} md={12} xs={12}>
        <ProdcutsFilters onFiltersChange={handleFiltersChange} />
        <Stack direction="row-reverse" spacing={2} sx={{ mt: 2 }}>
          <Button
            startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />}
            color="primary"
            size="small"
            variant="contained"
            onClick={() => {
              setShowAddProductModal(true);
            }}
          >
            Add Product
          </Button>
        </Stack>

        <ProductsTable
          rows={products}
          count={paginationInfo.totalItems}
          page={paginationInfo.currentPage - 1}
          rowsPerPage={paginationInfo.perPage}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />

        <ProductModal
          createdProduct={setNewProduct}
          open={showAddProductModal}
          onClose={() => { setShowAddProductModal(false); }}
          operation="add"
          addMoreVariants={() => { setShowAddVariantModal(true); }}
        />
        <VariantModal
          product={newProduct}
          open={showAddVariantModal}
          onClose={() => { setShowAddVariantModal(false); }}
          operation="add"
        />
      </Grid>
      <ToastContainer />
    </Grid>
  );
}
