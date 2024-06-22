import React, { useEffect, useState } from 'react';
import { PhotoCamera, Publish } from '@mui/icons-material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Box, Button, Grid, ImageList, ImageListItem, styled } from '@mui/material';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export default function ImageUpload({ isMultiple, width, setImageHandle, reset, preselectedImage }: any) {
  const [selectedImage, setSelectedImage] = useState<any>([]);
  useEffect(() => {
    if (!!preselectedImage?.length) {
      console.log('ASDASD');
      console.log(preselectedImage?.map((x: any) => ({ url: x })));
      setSelectedImage(preselectedImage?.map((x: any) => ({ url: x })));
    }
  }, [preselectedImage]);

  useEffect(() => {
    console.log('#'.repeat(1000));
    console.log(selectedImage);
    setImageHandle(selectedImage);
  }, [selectedImage]);

  useEffect(() => {
    setImageHandle([]);
    setSelectedImage([]);
  }, [reset]);

  async function convertToBase64(file: any) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  const StyledImageListItem = styled(ImageListItem)(({ theme }) => ({
    '& img': {
      maxWidth: '100%',
      height: 'auto',
      objectFit: 'cover',
      borderRadius: theme.shape.borderRadius,
      transition: 'opacity 0.3s ease-in-out', // Smooth transition for opacity changes
    },
    '&:hover img': {
      opacity: 0.7, // Reduce opacity on hover
    },
  }));

  const handleImageChange = async (event: any) => {
    const images = [];
    for (const image of event.target?.files) {
      const base64 = await convertToBase64(image);
      const imageUrl = URL.createObjectURL(image);
      images.push({ base64, url: imageUrl, name: image.name, type: image.type });
    }
    if (isMultiple) setSelectedImage([...selectedImage, ...images]);
    else setSelectedImage([...images]);
  };

  const deleteImageHandle = (e: any) => {
    const url = e.target.id;
    setSelectedImage(selectedImage.filter((x: any) => x.url !== url));
  };

  return (
    <>
      <Grid container spacing={2} sx={{ marginTop: '10px' }}>
        {selectedImage.length ? (
          <ImageList sx={{ width, height: 200 }} cols={isMultiple ? 4 : 1} rowHeight={164}>
            {selectedImage?.length &&
              selectedImage.map((item: any) => (
                <StyledImageListItem key={item.name || item.url}>
                  <img id={item.url} src={item.url} alt={item.name} loading="lazy" onClick={deleteImageHandle} />
                </StyledImageListItem>
              ))}
          </ImageList>
        ) : (
          <Box sx={{ height: 232, width }}></Box>
        )}
      </Grid>
      <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />}>
        Upload Image{isMultiple && 's'}
        {isMultiple && <VisuallyHiddenInput type="file" accept="image/*" multiple onChange={handleImageChange} />}
        {!isMultiple && <VisuallyHiddenInput type="file" accept="image/*" onChange={handleImageChange} />}
      </Button>
    </>
  );
}
