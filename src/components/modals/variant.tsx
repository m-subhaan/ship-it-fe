import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { fetchCategories } from '@/services/categories';
import { createProduct, createVariant } from '@/services/products';
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
  product: any;
  onClose: () => void;
  operation: 'add' | 'edit';
}

const VariantModal: React.FC<ProductModalProps> = ({ open, onClose, operation, product }) => {
  const VARIANT = {
    title: '',
    price: 0,
    sku: '',
    description: '',
    isPromotion: false,
    promotionValue: 0,
    isPublish: true,
    quantity: 0,
    optionName1: '',
    optionName2: '',
    optionName3: '',
    optionValue1: '',
    optionValue2: '',
    optionValue3: '',
    imageUrls: [],
  };

  const [isLoading, setIsLoading] = useState(false);

  const [variant, setVariant] = useState(VARIANT);
  const [isDiscount, setIsDicount] = useState(false);
  const [variantImages, setVariantImages] = useState<any>([]);
  const [formReset, setFormReset] = useState<boolean>(false);

  const handleSave = async () => {
    await createVariantCallback(removeEmptyValues({ ...variant, productId: product.productId }));
    onClose();
  };
  const handleSaveAndAddVariants = async () => {
    await createVariantCallback(removeEmptyValues({ ...variant, productId: product.productId }));
    //reset the form here
    setVariant(VARIANT);
    setVariantImages([]);
    setIsDicount(false);
    setFormReset(!formReset);
  };

  const createVariantCallback = useCallback(async (data: any) => {
    setIsLoading(true);
    const response = await createVariant(data);
    if (response.status == 'error') toast.error(response.message, { autoClose: 3000 });
    else toast.success(response.message, { autoClose: 3000 });
    setIsLoading(false);
  }, []);

  useEffect(() => {
    setVariant({ ...variant, imageUrls: variantImages.map((x: any) => x.base64) });
  }, [variantImages]);

  function removeEmptyValues(obj: object) {
    return Object.entries(obj).reduce((acc: any, [key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {});
  }

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
        <Typography variant="h5" marginTop={2}>
          Add Product Variant
        </Typography>
        <Typography>You can add more variants on the next screen</Typography>

        <Stack direction="row" spacing={4}>
          <TextField
            size="small"
            label="Variant Title"
            fullWidth
            margin="normal"
            required={true}
            value={variant.title}
            onChange={(e: any) => setVariant({ ...variant, title: e.target.value })}
          />
          <TextField
            size="small"
            label="SKU"
            margin="normal"
            required={true}
            sx={{ width: 800 }}
            value={variant.sku}
            onChange={(e: any) => setVariant({ ...variant, sku: e.target.value })}
          />
          <TextField
            size="small"
            label="Qty"
            margin="normal"
            type="number"
            sx={{ width: 600 }}
            value={variant.quantity}
            onChange={(e: any) => setVariant({ ...variant, quantity: +e.target.value })}
          />
          <TextField
            size="small"
            label="Price"
            margin="normal"
            type="number"
            required={true}
            value={variant.price}
            sx={{ width: 600 }}
            onChange={(e: any) => setVariant({ ...variant, price: +e.target.value })}
          />
        </Stack>
        <Stack direction="row" spacing={4}>
          <TextField
            sx={{ width: '350px' }}
            label="Variant Description"
            margin="normal"
            multiline={true}
            minRows={11}
            value={variant.description}
            maxRows={11}
            onChange={(e: any) => setVariant({ ...variant, description: e.target.value })}
          />
          <Stack direction="column" marginTop={2}>
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Publish Variant"
              value={variant.isPublish}
              onChange={(e: any) => setVariant({ ...variant, isPublish: e.target?.checked })}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={VARIANT.isPromotion}
                  onChange={(e: any) => {
                    setIsDicount(!isDiscount);
                    setVariant({ ...variant, isPromotion: e.target?.checked });
                  }}
                />
              }
              label="Add Discount"
            />
            {isDiscount && (
              <TextField
                size="small"
                label="Discount %"
                margin="normal"
                type="number"
                value={variant.promotionValue}
                sx={{ width: 150 }}
                // helperText="Incorrect entry."
                onChange={(e: any) => setVariant({ ...variant, promotionValue: +e.target.value })}
              />
            )}
          </Stack>
          <Stack direction="column" spacing={4} useFlexGap={true}>
            <ImageUpload isMultiple={true} width={500} setImageHandle={setVariantImages} reset={formReset} />
          </Stack>
        </Stack>

        <Typography variant="h6" marginTop={2}>
          Add custom Properties (For variants)
        </Typography>

        <Stack direction="row" spacing={4} sx={{}}>
          <TextField
            size="small"
            label="Name 1"
            fullWidth
            margin="normal"
            value={variant.optionName1}
            onChange={(e: any) => setVariant({ ...variant, optionName1: e.target.value })}
          />
          <TextField
            size="small"
            label="Value 1"
            fullWidth
            margin="normal"
            value={variant.optionValue1}
            onChange={(e: any) => setVariant({ ...variant, optionValue1: e.target.value })}
          />
          <TextField
            size="small"
            label="Name 2"
            fullWidth
            value={variant.optionName2}
            margin="normal"
            onChange={(e: any) => setVariant({ ...variant, optionName2: e.target.value })}
          />
          <TextField
            size="small"
            label="Value 2"
            fullWidth
            margin="normal"
            value={variant.optionValue2}
            onChange={(e: any) => setVariant({ ...variant, optionValue2: e.target.value })}
          />
          <TextField
            size="small"
            label="Name 3"
            fullWidth
            margin="normal"
            value={variant.optionName3}
            onChange={(e: any) => setVariant({ ...variant, optionName3: e.target.value })}
          />
          <TextField
            size="small"
            label="Value 3"
            fullWidth
            margin="normal"
            value={variant.optionValue3}
            onChange={(e: any) => setVariant({ ...variant, optionValue3: e.target.value })}
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
              <Button variant="contained" onClick={handleSave}>
                Save
              </Button>
              <Button variant="contained" onClick={handleSaveAndAddVariants}>
                Save & add more Variants
              </Button>
            </Stack>
          )}
        </Box>
        <ToastContainer />
      </Box>
    </Modal>
  );
};

export default VariantModal;
