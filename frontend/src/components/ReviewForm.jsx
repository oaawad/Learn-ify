import { useState } from 'react';
import { toast } from 'react-toastify';
import { Stack, Typography, Box, Rating, Tab, TextField, Button } from '@mui/material';

import axios from 'axios';
function ReviewForm(props) {
  const { course, setReviews, instructor } = props;
  const [value, setValue] = useState(0);
  const [review, setReview] = useState('');

  const onSubmit = (e) => {
    if (value === 0) {
      toast.error('Please select a rating');
    }

    if (instructor) {
      data = {
        instructor: instructor,
        rating: value,
        body: review === '' ? null : review,
      };
    } else {
      data = {
        course: course,
        rating: value,
        body: review === '' ? null : review,
      };
    }
    axios
      .post(`/api/reviews`, data, {
        headers: {
          Authorization: `Bearer ${props.token}`,
        },
      })
      .then((res) => {
        setReviews((prev) => [...prev, res.data.reviewPopulated]);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
    setReview('');
    setValue('-');
  };
  return (
    <Box
      sx={{
        backgroundColor: 'white',
        border: '1px solid ',
        borderColor: 'divider',
        padding: '1rem',
        marginTop: '1rem',
      }}
    >
      <Typography variant="h6" textAlign="center">
        Write a review
      </Typography>
      <Stack
        direction="row"
        sx={{
          mt: '1rem',
        }}
      >
        <Typography variant="h6" fontWeight="regular" ml={0.5}>
          Rating
        </Typography>
        <Stack direction="row" sx={{ ml: 'auto' }}>
          <Typography>({value}/5)</Typography>
          <Rating
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
          />
        </Stack>
      </Stack>
      <TextField
        id="outlined-multiline-flexible"
        label="Review"
        sx={{
          width: '100%',
          marginTop: '1rem',
        }}
        multiline
        minRows={4}
        value={review}
        onChange={(event) => setReview(event.target.value)}
      />
      <Button
        variant="contained"
        sx={{
          width: '100%',
          marginTop: '1rem',
        }}
        onClick={onSubmit}
      >
        Submit
      </Button>
    </Box>
  );
}

export default ReviewForm;
