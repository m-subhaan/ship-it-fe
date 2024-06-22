import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { styled } from '@mui/system'; // Import the styled function from MUI

// Define a styled ImageListItem component with custom styles
const StyledImageListItem = styled(ImageListItem)(({ theme }) => ({
  '& img': {
    width: '100%', // Make the image take the full width of the container
    height: 'auto', // Maintain aspect ratio
    objectFit: 'cover', // Cover the entire area of the container
    borderRadius: theme.shape.borderRadius, // Optional: Add border radius if needed
  },
}));

export default function StandardImageList({ images }: any = []) {
  return (
    <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
      {console.log(images)}
      {images?.length ? images.map((item: any) => (
          <StyledImageListItem key={item.name}>
            <img id={item.url} src={item.url} alt={item.name} loading="lazy" onClick={(e) => { console.log(e); }} />
          </StyledImageListItem>
        )) : null}
    </ImageList>
  );
}
