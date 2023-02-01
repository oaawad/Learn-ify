import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Grid, Typography, Box, Rating, Stack, Pagination, Avatar, Button } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { toast } from 'react-toastify';
function Reviews(props) {
  const { rating, user, reviews, setReviews, instructor } = props;
  const { id } = useParams();

  const reviewsWithBody = reviews?.filter((review) => review.body) || [];
  const count = Math.ceil(reviewsWithBody.length / 5);
  const [page, setPage] = useState(1);
  const currentPage = reviewsWithBody.slice((page - 1) * 5, page * 5);

  const deleteReview = (id) => {
    axios
      .delete(`/api/reviews/${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setReviews(reviews.filter((review) => review._id !== id));
      });
  };
  const handlePageChange = (event, value) => {
    setPage(value);
  };
  const stars = [
    (reviews?.filter((review) => review.rating === 5).length / reviews?.length) * 100,
    (reviews?.filter((review) => review.rating === 4).length / reviews?.length) * 100,
    (reviews?.filter((review) => review.rating === 3).length / reviews?.length) * 100,
    (reviews?.filter((review) => review.rating === 2).length / reviews?.length) * 100,
    (reviews?.filter((review) => review.rating === 1).length / reviews?.length) * 100,
  ];

  useEffect(() => {
    if (instructor) {
      axios
        .get(`/api/instructors/${instructor}/reviews`)
        .then((res) => {
          setReviews(res.data);
        })
        .catch((err) => {
          toast.error(err.response.data.message);
        });
    } else {
      axios
        .get(`/api/courses/${id}/reviews`)
        .then((res) => {
          setReviews(res.data);
        })
        .catch((err) => {
          toast.error(err.response.data.message);
        });
    }
  }, []);
  return (
    <Grid container>
      <Grid item xs={12} sm={3}>
        <Box>
          <Typography variant="h3">{rating}</Typography>
          <Typography variant="body1" fontWeight="bold">
            Base on {reviews?.length} ratings
          </Typography>
          <Rating readOnly value={rating} precision={0.5} sx={{ mt: '0.5rem', mb: '2rem' }} />
        </Box>
        <Box>
          <Grid container>
            <Grid item xs={3} minWidth="fit-content">
              <Typography variant="body2" color="grey.800">
                5 stars
              </Typography>
            </Grid>
            <Grid item xs={9} sx={{ display: 'flex', paddingLeft: '0.25rem' }}>
              <Box
                sx={{
                  width: '100%',
                  height: '10px',

                  backgroundColor: 'grey.400',
                  marginY: 'auto',
                }}
              >
                <Box
                  sx={{
                    width: stars[0] + '%',
                    height: '100%',

                    backgroundColor: 'grey.600',
                  }}
                />
              </Box>
            </Grid>
          </Grid>
          <Grid container sx={{ mt: '0.25rem' }}>
            <Grid item xs={3} minWidth="fit-content">
              <Typography variant="body2" color="grey.800">
                4 stars
              </Typography>
            </Grid>
            <Grid item xs={9} sx={{ display: 'flex', paddingLeft: '0.25rem' }}>
              <Box
                sx={{
                  width: '100%',
                  height: '10px',
                  backgroundColor: 'grey.300',
                  marginY: 'auto',
                }}
              >
                <Box
                  sx={{
                    width: stars[1] + '%',
                    height: '100%',
                    backgroundColor: 'grey.600',
                  }}
                />
              </Box>
            </Grid>
          </Grid>
          <Grid container sx={{ mt: '0.25rem' }}>
            <Grid item xs={3} minWidth="fit-content">
              <Typography variant="body2" color="grey.800">
                3 stars
              </Typography>
            </Grid>
            <Grid item xs={9} sx={{ display: 'flex', paddingLeft: '0.25rem' }}>
              <Box
                sx={{
                  width: '100%',
                  height: '10px',
                  backgroundColor: 'grey.300',
                  marginY: 'auto',
                }}
              >
                <Box
                  sx={{
                    width: stars[2] + '%',
                    height: '100%',
                    backgroundColor: 'grey.600',
                  }}
                />
              </Box>
            </Grid>
          </Grid>
          <Grid container sx={{ mt: '0.25rem' }}>
            <Grid item xs={3} minWidth="fit-content">
              <Typography variant="body2" color="grey.800">
                2 stars
              </Typography>
            </Grid>
            <Grid item xs={9} sx={{ display: 'flex', paddingLeft: '0.25rem' }}>
              <Box
                sx={{
                  width: '100%',
                  height: '10px',

                  backgroundColor: 'grey.300',
                  marginY: 'auto',
                }}
              >
                <Box
                  sx={{
                    width: stars[3] + '%',
                    height: '100%',

                    backgroundColor: 'grey.600',
                  }}
                />
              </Box>
            </Grid>
          </Grid>
          <Grid container sx={{ mt: '0.25rem' }}>
            <Grid item xs={3} minWidth="fit-content">
              <Typography variant="body2" color="grey.800">
                1 stars
              </Typography>
            </Grid>
            <Grid item xs={9} sx={{ display: 'flex', paddingLeft: '0.25rem' }}>
              <Box
                sx={{
                  width: '100%',
                  height: '10px',

                  backgroundColor: 'grey.300',
                  marginY: 'auto',
                }}
              >
                <Box
                  sx={{
                    width: stars[4] + '%',
                    height: '100%',

                    backgroundColor: 'grey.600',
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Grid>
      <Grid
        item
        xs={12}
        sm={9}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingLeft: { xs: '0', sm: '1rem' },
        }}
      >
        <Typography variant="h6">{reviewsWithBody.length} Review</Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          {currentPage.map((review) => (
            <Box
              key={review._id}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                padding: '1rem',
                marginTop: '1rem',
                width: '100%',
              }}
            >
              <Stack direction="row" alignItems="center">
                <Rating readOnly value={review.rating} />
                {user?._id === review.user._id && (
                  <Button onClick={() => deleteReview(review._id)} sx={{ ml: 'auto' }}>
                    <DeleteForeverIcon color="error" />
                  </Button>
                )}
              </Stack>
              <Typography variant="body2" textAlign="justify" mt={1}>
                {review.body}
              </Typography>
              <Stack mt={1} direction="row">
                <Avatar sx={{ width: '3rem', height: '3rem' }} />
                <Stack ml={2} justifyContent="center">
                  <Typography variant="subtitle1" lineHeight={1}>
                    {review.user.firstName} {review.user.lastName}
                  </Typography>
                  <Typography variant="body2" color="grey.600">
                    {review.createdAt}
                  </Typography>
                </Stack>
              </Stack>
            </Box>
          ))}
          <Pagination
            count={count}
            shape="rounded"
            sx={{ mt: '1rem' }}
            page={page}
            onChange={handlePageChange}
          />
        </Box>
      </Grid>
    </Grid>
  );
}

export default Reviews;
