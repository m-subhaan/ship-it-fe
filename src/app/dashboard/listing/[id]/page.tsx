'use client';

import { useCallback, useEffect, useState } from 'react';
import { fetchCategories } from '@/services/categories';
import { delVariant, fetchProductById, updateProduct, updateVariant } from '@/services/products';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { toast, ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Checkbox,
  CircularProgress,
  Collapse,
  FormControlLabel,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { type Product, type Variant } from '@/types/products';
import ImageUpload from '@/components/common/ImageUpload';
import ConfirmationModal from '@/components/modals/confirmation';
import VariantModal from '@/components/modals/variant';

interface PageProps {
  params: {
    id: string;
  };
}

interface Category {
  label: string;
  value: string;
  subCategory: SubCategory[];
}

interface SubCategory {
  label: string;
  value: string;
}

function ListingPage({ params }: PageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [expandedVariant, setExpandedVariant] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [resetImage, setResetImage] = useState(false);
  const [variantImages, setVariantImages] = useState<any>([]);
  const [showAddVariantModal, setShowAddVariantModal] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [deleteVariant, setDeleteVariant] = useState('');

  const onConfirmDelete = async () => {
    let response: any;
    if (deleteVariant.length) response = await delVariant(deleteVariant);
    if (response) toast.success('Variant Deleted Successfully', { autoClose: 3000 });
    setIsConfirmationModalOpen(false);

    setProduct((prevProduct) => {
      if (!prevProduct) return null;
      const updatedVariants = prevProduct?.variant?.filter((variant) => variant?.variantId !== deleteVariant);
      return { ...prevProduct, variant: updatedVariants };
    });
  };

  const fetchCategoriesCallback = useCallback(async () => {
    const response = await fetchCategories();
    setCategories(
      response.map((x: any) => ({
        label: x.categoryName,
        value: x.categoryId,
        subCategory: x.subCategory.map((sub: any) => ({
          label: sub.subCategoryName,
          value: sub.subCategoryId,
        })),
      }))
    );
  }, []);

  const getProduct = async () => {
    try {
      const response = await fetchProductById(params?.id);
      if (response.rows?.length > 0) {
        setProduct(response.rows[0] || []);
      }
    } catch (error) {
      console.error('Failed to fetch product:', error);
    }
  };
  useEffect(() => {
    getProduct();
  }, [params?.id]);

  useEffect(() => {
    console.log('*'.repeat(1000));
    console.log(product);
  }, [product]);

  useEffect(() => {
    if (product && categories.length) {
      const selectedCategory = categories.find((cat) => cat.value === product.categoryId);
      if (selectedCategory) {
        setSubCategories(selectedCategory.subCategory);
      }
    }
  }, [product, categories]);

  useEffect(() => {
    if (!categories.length) fetchCategoriesCallback();
  }, [fetchCategoriesCallback, categories.length]);

  const handleChange = (field: keyof Product, value: any) => {
    setProduct((prevProduct) => (prevProduct ? { ...prevProduct, [field]: value } : null));
  };

  const handleVariantChange = (variantId: string, field: keyof Variant, value: any) => {
    setProduct((prevProduct) => {
      if (!prevProduct) return null;
      const updatedVariants = prevProduct.variant.map((variant) =>
        variant.variantId === variantId ? { ...variant, [field]: value } : variant
      );
      return { ...prevProduct, variant: updatedVariants };
    });
  };

  const handleDeleteVariant = (variantId: string) => {
    setIsConfirmationModalOpen(true);
    console.log('variantId==>>> ', variantId);
    setDeleteVariant(variantId);
  };

  const handleSave = async () => {
    if (!product) return;
    setIsSaving(true);
    try {
      const { variant, imageUrl, ...productPayload } = product;
      await updateProduct(product.productId, productPayload);
      await Promise.all(
        variant.map((variant) => {
          const { imageUrls, ...variantBody } = variant;
          return updateVariant(variant.variantId, variantBody);
        })
      );
    } catch (error) {
      console.error('Failed to update product:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  const toggleVariant = (variantId: string) => {
    setExpandedVariant(expandedVariant === variantId ? null : variantId);
  };

  return (
    <Box p={4}>
      <Typography variant="h4" component="h1" gutterBottom>
        Edit Product
      </Typography>
      <Typography variant="body1" gutterBottom>
        Product ID: {product.productId}
      </Typography>
      <Stack spacing={3}>
        <Stack direction="row" spacing={3}>
          <TextField
            label="Product Title"
            value={product.title}
            onChange={(e) => { handleChange('title', e.target.value); }}
            fullWidth
            size="small"
            margin="normal"
          />
          <TextField
            label="Brand"
            value={product.brand}
            onChange={(e) => { handleChange('brand', e.target.value); }}
            fullWidth
            size="small"
            margin="normal"
          />
          <Autocomplete
            options={['ACTIVE', 'DRAFT']}
            fullWidth
            value={product.status}
            onChange={(e, newValue) => { handleChange('status', newValue); }}
            renderInput={(params) => <TextField {...params} label="Status" fullWidth size="small" margin="normal" />}
          />
        </Stack>
        <Stack direction="row" spacing={3}>
          <TextField
            label="Vendor"
            value={product.vendor}
            onChange={(e) => { handleChange('vendor', e.target.value); }}
            fullWidth
            size="small"
            margin="normal"
          />
          <Autocomplete
            size="small"
            fullWidth
            options={categories}
            getOptionLabel={(option) => option.label}
            value={categories.find((cat) => cat.value === product.categoryId) || null}
            onChange={(event: any, newValue: Category | null) => {
              handleChange('categoryId', newValue?.value || '');
              setSubCategories(newValue?.subCategory || []);
              handleChange('subCategoryId', '');
            }}
            renderInput={(params) => <TextField {...params} label="Category" margin="normal" />}
          />
          <Autocomplete
            size="small"
            fullWidth
            options={subCategories}
            getOptionLabel={(option) => option.label}
            value={subCategories.find((sub) => sub.value === product.subCategoryId) || null}
            onChange={(event: any, newValue: SubCategory | null) =>
              { handleChange('subCategoryId', newValue?.value || ''); }
            }
            renderInput={(params) => <TextField {...params} label="Sub Category" margin="normal" />}
          />
        </Stack>

        <Stack direction="row" spacing={4} useFlexGap>
          <TextField
            label="Product Description"
            value={product.description}
            sx={{ width: '800px' }}
            onChange={(e) => { handleChange('description', e.target.value); }}
            fullWidth
            multiline
            minRows={12}
            maxRows={12}
            size="small"
            margin="normal"
          />
          <Stack direction="column" spacing={4} useFlexGap>
            <ImageUpload
              isMultiple={false}
              width={200}
              setImageHandle={(images: any) => { handleChange('imageUrl', images?.[0]?.base64 || ''); }}
              reset={resetImage}
              preselectedImage={product?.imageUrl?.length ? [product.imageUrl] : []}
            />
          </Stack>
        </Stack>
        <Stack direction="row" spacing={4} useFlexGap sx={{ mt: 3 }} justifyContent="space-between">
          <Typography variant="h5" component="h2">
            Variants
          </Typography>
          <Button variant="outlined" color="primary" size="small" onClick={() => { setShowAddVariantModal(true); }}>
            Add New Variant
          </Button>
        </Stack>

        {product.variant.map((variant) => (
          <Card key={variant.variantId} sx={{ p: 1 }}>
            <CardActions disableSpacing>
              <Box display="flex" justifyContent="space-between" width="100%">
                <Typography variant="body1" onClick={() => { toggleVariant(variant.variantId); }}>
                  {`${variant.title  }-${  variant.variantId}`}
                </Typography>
                <Box>
                  <IconButton onClick={() => { toggleVariant(variant.variantId); }}>
                    {expandedVariant === variant.variantId ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                  <IconButton onClick={() => { handleDeleteVariant(variant.variantId); }} color="error">
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            </CardActions>
            <Collapse in={expandedVariant === variant.variantId} timeout="auto" unmountOnExit>
              <CardContent>
                <Stack spacing={3}>
                  <Stack direction="row" spacing={3} useFlexGap>
                    <TextField
                      label="Variant Title"
                      value={variant.title}
                      onChange={(e) => { handleVariantChange(variant.variantId, 'title', e.target.value); }}
                      size="small"
                      fullWidth
                      margin="normal"
                    />
                    <TextField
                      label="SKU"
                      value={variant.sku}
                      onChange={(e) => { handleVariantChange(variant.variantId, 'sku', e.target.value); }}
                      fullWidth
                      size="small"
                      margin="normal"
                    />
                  </Stack>
                  <Stack direction="row" spacing={3}>
                    <TextField
                      label="Quantity"
                      value={variant.quantity}
                      onChange={(e) => { handleVariantChange(variant.variantId, 'quantity', e.target.value); }}
                      fullWidth
                      size="small"
                      type="number"
                      margin="normal"
                    />
                    <TextField
                      label="Price"
                      value={variant.price}
                      onChange={(e) => { handleVariantChange(variant.variantId, 'price', e.target.value); }}
                      fullWidth
                      size="small"
                      type="number"
                      margin="normal"
                    />
                  </Stack>

                  <Stack direction="row" spacing={4} useFlexGap>
                    <TextField
                      label="Variant Description"
                      value={variant.description}
                      sx={{ width: '500px' }}
                      onChange={(e) => { handleVariantChange(variant.variantId, 'description', e.target.value); }}
                      fullWidth
                      multiline
                      minRows={12}
                      maxRows={12}
                      size="small"
                      margin="normal"
                    />
                    <Stack direction="column" marginTop={2}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            value={variant.isPublish}
                            checked={variant.isPublish}
                            onChange={(e) => { handleVariantChange(variant.variantId, 'isPublish', e.target.checked); }}
                          />
                        }
                        label="Publish Variant"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            value={variant.isPromotion}
                            checked={variant.isPromotion}
                            onChange={(e) => { handleVariantChange(variant.variantId, 'isPromotion', e.target.checked); }}
                          />
                        }
                        label="Add Discount"
                      />
                      <TextField
                        size="small"
                        label="Discount %"
                        margin="normal"
                        type="number"
                        sx={{ width: 150 }}
                        value={variant.promotionValue}
                        onChange={(e) => { handleVariantChange(variant.variantId, 'promotionValue', Number(e.target.value)); }}

                        // onChange={(e: any) => setVariant({ ...variant, promotionValue: +e.target.value })}
                      />
                    </Stack>
                    <Stack direction="column" spacing={4} useFlexGap>
                      <ImageUpload
                        isMultiple
                        width={500}
                        setImageHandle={setVariantImages}
                        reset={resetImage}
                        preselectedImage={variant?.imageUrls}
                      />
                    </Stack>
                  </Stack>
                  <Stack direction="row" spacing={3}>
                    <TextField
                      label="Option Name 1"
                      value={variant.optionName1}
                      onChange={(e) => { handleVariantChange(variant.variantId, 'optionName1', e.target.value); }}
                      fullWidth
                      size="small"
                      margin="normal"
                    />
                    <TextField
                      label="Option Name 2"
                      value={variant.optionName2}
                      onChange={(e) => { handleVariantChange(variant.variantId, 'optionName2', e.target.value); }}
                      fullWidth
                      size="small"
                      margin="normal"
                    />
                    <TextField
                      label="Option Name 3"
                      value={variant.optionName3}
                      onChange={(e) => { handleVariantChange(variant.variantId, 'optionName3', e.target.value); }}
                      fullWidth
                      size="small"
                      margin="normal"
                    />
                  </Stack>
                  <Stack direction="row" spacing={3}>
                    <TextField
                      label="Option Value 1"
                      value={variant.optionValue1}
                      onChange={(e) => { handleVariantChange(variant.variantId, 'optionValue1', e.target.value); }}
                      fullWidth
                      size="small"
                      margin="normal"
                    />
                    <TextField
                      label="Option Value 2"
                      value={variant.optionValue2}
                      onChange={(e) => { handleVariantChange(variant.variantId, 'optionValue2', e.target.value); }}
                      fullWidth
                      size="small"
                      margin="normal"
                    />
                    <TextField
                      label="Option Value 3"
                      value={variant.optionValue3}
                      onChange={(e) => { handleVariantChange(variant.variantId, 'optionValue3', e.target.value); }}
                      fullWidth
                      size="small"
                      margin="normal"
                    />
                  </Stack>
                </Stack>
              </CardContent>
            </Collapse>
          </Card>
        ))}
        <Box textAlign="right">
          <Button variant="contained" color="primary" onClick={handleSave} disabled={isSaving}>
            {isSaving ? <CircularProgress size={24} /> : 'Save'}
          </Button>
        </Box>
      </Stack>
      <VariantModal
        product={product}
        open={showAddVariantModal}
        onClose={() => { setShowAddVariantModal(false); }}
        operation="add"
      />
      <ConfirmationModal
        open={isConfirmationModalOpen}
        onClose={() => { setIsConfirmationModalOpen(false); }}
        onConfirm={onConfirmDelete}
        message="Are you sure you want to delete the variant?"
      />
      <ToastContainer />
    </Box>
  );
}

export default ListingPage;
