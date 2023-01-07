import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addCourse } from '../features/user/userSlice';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Typography, Stack, Button } from '@mui/material';
import Spinner from '../components/Spinner';

function CheckoutSuccess() {
  const [course, setCourse] = React.useState(null);
  let user = useSelector((state) => state.user);
  user = typeof user.user === 'string' ? JSON.parse(user.user) : user.user;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const goToCourse = () => {
    navigate(`/courses/${course}/learn`);
  };

  React.useEffect(() => {
    dispatch(addCourse(user)).then((res) => {
      setCourse(res.payload.courses[res.payload.courses.length - 1]._id);
    });
  }, []);

  return (
    <Stack sx={{ justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
      {course ? (
        <>
          <CheckCircleOutlineIcon sx={{ fontSize: '10rem', color: 'success.main' }} />
          <Typography variant="h4" sx={{ textAlign: 'center', color: 'grey.800' }}>
            Payment Successful
          </Typography>
          <Typography variant="h6" sx={{ textAlign: 'center', color: 'grey.800' }}>
            You can now access the course
          </Typography>
          <Button
            variant="outlined"
            sx={{
              mt: '1rem',
              color: 'grey.800',
              borderColor: 'grey.800',
              ':hover': { borderColor: 'grey.800' },
            }}
            onClick={goToCourse}
          >
            Start Learning
          </Button>
        </>
      ) : (
        <Spinner />
      )}
    </Stack>
  );
}

export default CheckoutSuccess;
