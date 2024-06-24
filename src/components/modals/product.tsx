import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { fetchCategories } from '@/services/categories';
import { createProduct } from '@/services/products';
import { toast, ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import {
  Autocomplete,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Grid,
  Modal,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Box from '@mui/material/Box';

import ImageUpload from '@/components/common/ImageUpload';

interface ProductModalProps {
  open: boolean;
  addMoreVariants: () => void;
  createdProduct: any;
  onClose: () => void;
  operation: 'add' | 'edit';
}

const ProductModal: React.FC<ProductModalProps> = ({ open, onClose, operation, createdProduct, addMoreVariants }) => {
  const REQUIRED = {
    product: ['title', 'categoryId', 'brand', 'status'],
    variant: ['title', 'sku', 'quantity', 'price', 'maxPrice'],
  };

  const [isLoading, setIsLoading] = useState(false);

  const [variant, setVariant] = useState<any>({});
  const [product, setProduct] = useState<any>({ status: 'ACTIVE' });
  const [isDiscount, setIsDicount] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [productImage, setProductImage] = useState<any>([]);
  const [variantImages, setVariantImages] = useState<any>([]);
  const [isSaveDisable, setIsSaveDisable] = useState<boolean>(true);
  const [isSingleVariant, setIsSingleVariant] = useState<boolean>(false);

  const fetchCategoriesCallback = useCallback(async () => {
    const response = await fetchCategories();
    setCategories(
      response.map((x: any) => ({ label: x.categoryName, value: x.categoryId, subCategory: x.subCategory }))
    );
  }, []);

  const handleSave = async () => {
    createproductCallback({ ...product, variant });
  };
  const handleSaveAndAddVariants = async () => {
    await createproductCallback({ ...product, variant });
    addMoreVariants();
  };

  const createproductCallback = useCallback(async (data: any) => {
    setIsLoading(true);
    const response = await createProduct(data);
    if (response.status == 'error') toast.error(response.message, { autoClose: 3000 });

    createdProduct(response);
    setIsLoading(false);
    onClose();
  }, []);

  useEffect(() => {
    if (!categories.length) fetchCategoriesCallback();
  }, []);
  useEffect(() => {
    if (isSingleVariant) setVariant({ ...variant, description: product.description || '', title: product.title || '' });
    if (!isSingleVariant) setVariant({ ...variant, description: '', title: '' });
  }, [isSingleVariant]);

  useEffect(() => {
    if (
      REQUIRED.product.every((key) => product[key] && product[key]?.toString()?.length > 0) &&
      REQUIRED.variant.every((key) => variant[key] && variant[key]?.toString()?.length > 0)
    )
      setIsSaveDisable(false);
    else setIsSaveDisable(true);
  }, [product, variant]);

  useEffect(() => {
    setProduct({
      ...product,
      imageUrl: productImage?.[0]?.base64,
    });
    setVariant({ ...variant, imageUrls: variantImages.map((x: any) => x.base64) });
  }, [productImage, variantImages]);

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
          width: '60%', // Increased width
          maxHeight: '80vh', // Set a maximum height for scrolling
          overflowY: 'auto', // Enable vertical scrolling
          display: 'flex', // Use flexbox for layout
          flexDirection: 'column', // Stack children vertically
          gap: 2, // Space between columns
        }}
      >
        <Typography variant="h5" marginTop={2} fontWeight={700}>
          Add Product
        </Typography>
        <Stack direction="row" spacing={4}>
          <TextField
            label="Product Title"
            size="small"
            fullWidth
            margin="normal"
            required
            onChange={(e: any) => {
              setProduct({ ...product, title: e.target.value });
            }}
          />
          {categories.length ? (
            <Autocomplete
              size="small"
              fullWidth
              options={categories}
              onChange={(event: any, newValue: any) => {
                setProduct({ ...product, categoryId: newValue?.value });
                setSubCategories(
                  newValue?.subCategory?.map((x: any) => ({ label: x.subCategoryName, value: x.subCategoryId })) || []
                );
              }}
              renderInput={(params) => <TextField {...params} label="Category" margin="normal" required />}
            />
          ) : null}
          <Autocomplete
            size="small"
            fullWidth
            onChange={(event: any, newValue: any) => {
              setProduct({ ...product, subCategoryId: newValue?.value });
            }}
            options={subCategories}
            renderInput={(params) => <TextField {...params} label="Sub Category" margin="normal" />}
          />
        </Stack>
        <Stack direction="row" spacing={4} useFlexGap>
          <TextField
            label="Brand"
            margin="normal"
            size="small"
            fullWidth
            required
            onChange={(e: any) => {
              setProduct({ ...product, brand: e.target.value });
            }}
          />
          <TextField
            label="Vendor"
            margin="normal"
            fullWidth
            size="small"
            onChange={(e: any) => {
              setProduct({ ...product, vendor: e.target.value });
            }}
          />

          <Autocomplete
            size="small"
            fullWidth
            options={['ACTIVE', 'DRAFT']}
            defaultValue="ACTIVE"
            onChange={(event: any, newValue: any) => {
              setProduct({ ...product, status: newValue });
            }}
            renderInput={(params) => <TextField {...params} label="Product Status" margin="normal" required />}
          />
        </Stack>

        <FormControlLabel
          control={<Checkbox checked={isSingleVariant} />}
          label="Single Variant Product?"
          onChange={(e: any) => setIsSingleVariant(!isSingleVariant)}
        />

        <Stack direction="row" spacing={4} useFlexGap>
          <TextField
            sx={{ width: '500px' }}
            label="Product Description"
            margin="normal"
            multiline
            minRows={12}
            maxRows={12}
            onChange={(e: any) => {
              setProduct({ ...product, description: e.target.value });
            }}
          />
          <Stack direction="column" spacing={4} useFlexGap>
            <ImageUpload isMultiple={false} width={200} setImageHandle={setProductImage} />
          </Stack>
        </Stack>

        <Typography variant="h5" marginTop={2}>
          Add Product Variant
        </Typography>
        <Typography>You can add more variants on the next screen</Typography>

        <Stack direction="row" spacing={4}>
          {!isSingleVariant && (
            <TextField
              size="small"
              label="Variant Title"
              fullWidth
              margin="normal"
              required
              onChange={(e: any) => {
                setVariant({ ...variant, title: e.target.value });
              }}
            />
          )}
          <TextField
            size="small"
            label="SKU"
            margin="normal"
            required
            sx={{ width: 800 }}
            onChange={(e: any) => {
              setVariant({ ...variant, sku: e.target.value });
            }}
          />
          <TextField
            size="small"
            label="Qty"
            margin="normal"
            type="number"
            sx={{ width: 400 }}
            onChange={(e: any) => {
              setVariant({ ...variant, quantity: Number(e.target.value) });
            }}
          />
          <TextField
            size="small"
            label="Price"
            margin="normal"
            type="number"
            required
            sx={{ width: 400 }}
            onChange={(e: any) => {
              setVariant({ ...variant, price: Number(e.target.value) });
            }}
          />
          <TextField
            size="small"
            label="Max Selling Price"
            margin="normal"
            type="number"
            required
            sx={{ width: 600 }}
            onChange={(e: any) => {
              setVariant({ ...variant, maxPrice: Number(e.target.value) });
            }}
          />
        </Stack>
        <Stack direction="row" spacing={4}>
          {!isSingleVariant && (
            <TextField
              sx={{ width: '350px' }}
              label="Variant Description"
              margin="normal"
              multiline
              minRows={11}
              maxRows={11}
              onChange={(e: any) => {
                setVariant({ ...variant, description: e.target.value });
              }}
            />
          )}
          <Stack direction="column" marginTop={2}>
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Publish Variant"
              onChange={(e: any) => {
                setVariant({ ...variant, isPublish: e.target?.checked });
              }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={isDiscount}
                  onChange={(e: any) => {
                    setIsDicount(!isDiscount);
                    setVariant({ ...variant, isPromotion: e.target?.checked });
                  }}
                />
              }
              label="Add Discount"
            />
            {isDiscount ? (
              <TextField
                size="small"
                label="Discount %"
                margin="normal"
                type="number"
                sx={{ width: 150 }}
                // helperText="Incorrect entry."
                onChange={(e: any) => {
                  setVariant({ ...variant, promotionValue: Number(e.target.value) });
                }}
              />
            ) : null}
          </Stack>
          <Stack direction="column" spacing={4} useFlexGap>
            <ImageUpload isMultiple width={500} setImageHandle={setVariantImages} />
          </Stack>
        </Stack>

        <Typography variant="h6" marginTop={2}>
          Add custom Properties (For variants)
        </Typography>

        <Stack direction="row" spacing={4}>
          <TextField
            size="small"
            label="Name 1"
            fullWidth
            margin="normal"
            onChange={(e: any) => {
              setVariant({ ...variant, optionName1: e.target.value });
            }}
          />
          <TextField
            size="small"
            label="Value 1"
            fullWidth
            margin="normal"
            onChange={(e: any) => {
              setVariant({ ...variant, optionValue1: e.target.value });
            }}
          />
          <TextField
            size="small"
            label="Name 2"
            fullWidth
            margin="normal"
            onChange={(e: any) => {
              setVariant({ ...variant, optionName2: e.target.value });
            }}
          />
          <TextField
            size="small"
            label="Value 2"
            fullWidth
            margin="normal"
            onChange={(e: any) => {
              setVariant({ ...variant, optionValue2: e.target.value });
            }}
          />
          <TextField
            size="small"
            label="Name 3"
            fullWidth
            margin="normal"
            onChange={(e: any) => {
              setVariant({ ...variant, optionName3: e.target.value });
            }}
          />
          <TextField
            size="small"
            label="Value 3"
            fullWidth
            margin="normal"
            onChange={(e: any) => {
              setVariant({ ...variant, optionValue3: e.target.value });
            }}
          />
        </Stack>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          {isLoading ? (
            <CircularProgress /> // Show spinner when loading
          ) : (
            <Stack direction="row" spacing={4}>
              <Button variant="contained" onClick={handleSave} disabled={isSaveDisable}>
                Save
              </Button>
              {!isSingleVariant && (
                <Button variant="contained" onClick={handleSaveAndAddVariants} disabled={isSaveDisable}>
                  Save & add more Variants
                </Button>
              )}
            </Stack>
          )}
        </Box>
        <ToastContainer />
      </Box>
    </Modal>
  );
};

export default ProductModal;
