import { useState, useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { requestCourse } from '../features/user/userSlice';
import PaymentButton from '../components/PaymentButton';
import img from '../../public/assets/programmer.png';
import {
  Box,
  Divider,
  Button,
  Rating,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Stack,
  Avatar,
  Link,
  Typography,
  CardActionArea,
} from '@mui/material';

const useStyles = makeStyles({
  customBox: {
    display: '-webkit-box',
    boxOrient: 'vertical',
    lineClamp: 2,
    overflow: 'hidden',
    hyphens: 'auto',
    WebkitHyphens: 'auto',
  },
});

function CourseCard(props) {
  const course = props.course;
  const { country, user } = useSelector((state) => state.user);
  const cntryObj = typeof country === 'string' ? JSON.parse(country) : country;
  const userObj = typeof user === 'string' ? JSON.parse(user) : user;
  const [currency, setCurrency] = useState(null);
  const [requests, setRequests] = useState([]);
  const classes = useStyles();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onRequestCourse = (id) => {
    const data = { course: id, user: userObj };
    dispatch(requestCourse(data)).then((res) => {
      setRequests(res.payload.requests);
    });
  };

  useEffect(() => {
    if (cntryObj) {
      setCurrency(cntryObj.currency);
    }
    if (user) {
      if (userObj.type === 'corporate') {
        setRequests(userObj.requests);
      }
    }
  }, [country, user]);

  return (
    <Card>
      <CardActionArea
        component={Link}
        href={props.draft ? `/profile/draft/${course._id}` : `/courses/${course._id}`}
        sx={{
          '&:hover': {
            transition: 'all 0.3s ease-in-out',
            backgroundColor: 'grey.300',
          },
        }}
      >
        <CardMedia
          component="img"
          height="140"
          image={`https://img.youtube.com/vi/${course.preview}/hqdefault.jpg`}
        ></CardMedia>
        <CardContent sx={{ pb: '0' }}>
          <Stack direction="row" alignItems="center">
            <Chip
              label={course.subject.name}
              variant="outlined"
              size="small"
              sx={{
                color: `${course.subject.color}`,
                borderColor: `${course.subject.color}`,
                bgcolor: `${course.subject.color}33`,
              }}
            />
            <Box
              sx={{
                ml: 'auto',
                display: 'flex',
                flexDirection: 'row',
              }}
            >
              <Rating value={4.0} readOnly precision={0.5} size="small" />
            </Box>
          </Stack>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              minHeight: '4rem',
            }}
            lang="en"
          >
            <Typography
              variant="subtitle1"
              textAlign="left"
              lineHeight={1.3}
              my={0.2}
              fontWeight="semiBold"
              color="secondary.main"
              classes={{ root: classes.customBox }}
            >
              {course.title}
            </Typography>
          </Box>

          <Stack direction="row" alignItems="center">
            <Avatar
              sx={{
                width: 24,
                height: 24,
              }}
              src={img}
            />
            <Stack direction="column">
              <Typography
                variant="body1"
                ml={1}
                textAlign="left"
                fontWeight="medium"
                color="grey.700"
              >
                {course.instructor.firstName} {course.instructor.lastName}
              </Typography>
            </Stack>
          </Stack>
          <Divider sx={{ mt: '0.7rem', mb: '0.5rem' }} />
        </CardContent>
      </CardActionArea>
      <Box>
        <Stack direction="row" alignItems="center" sx={{ mb: '0.5rem', px: '1rem' }}>
          {userObj?.type !== 'corporate' && (
            <>
              <Typography
                variant="body2"
                color={course?.promotion ? 'grey.600' : 'secondary.main'}
                sx={{
                  textDecoration: course?.promotion ? 'line-through' : 'none',
                  mr: '0.5rem',
                }}
              >
                {course?.price === 0
                  ? 'Free'
                  : currency
                  ? `${Math.round(course?.price * currency.rate * 100) / 100}${currency.symbol}`
                  : `${course?.price}.00 USD`}
              </Typography>
              {course?.promotion ? (
                <Typography variant="body2" color="secondary.main" mr={1}>
                  {course?.price === 0
                    ? 'Free'
                    : currency
                    ? `${
                        Math.round(
                          course?.price * currency.rate * (100 - course.promotion.amount)
                        ) / 100
                      }${currency.symbol}`
                    : `${(course?.price * (100 - course.promotion.amount)) / 100} USD`}
                </Typography>
              ) : null}
            </>
          )}

          {props.draft ? (
            <Button
              variant="outlined"
              size="small"
              color="error"
              sx={{ ml: 'auto' }}
              href={`/profile/draft/${course._id}/edit`}
            >
              Edit
            </Button>
          ) : userObj?.type === 'individual' ? (
            <PaymentButton
              course={course}
              currency={currency}
              sx={{
                ml: 'auto',
                visibility: !userObj?.courses.map((course) => course._id).includes(course._id)
                  ? 'visible'
                  : 'hidden',
              }}
              variant="outlined"
            />
          ) : userObj?.type === 'corporate' ? (
            requests.length > 0 &&
            requests.map((request) => request.course).includes(course._id) ? (
              requests.filter(
                (request) => request.course === course._id && request.status === 'pending'
              ).length > 0 ? (
                <Typography
                  variant="body1"
                  color="secondary.main"
                  sx={{ ml: 'auto', my: '0.2rem' }}
                >
                  Request Pending
                </Typography>
              ) : requests.filter(
                  (request) => request.course === course._id && request.status === 'rejected'
                ).length > 0 ? (
                <Typography variant="body1" color="error.main" sx={{ ml: 'auto', my: '0.2rem' }}>
                  Request Denied
                </Typography>
              ) : (
                <Button
                  variant="outlined"
                  color="secondary"
                  size="small"
                  sx={{ ml: 'auto' }}
                  href={`/courses/${course._id}/learn`}
                >
                  Start Learning
                </Button>
              )
            ) : (
              <Button
                variant="outlined"
                size="small"
                sx={{ ml: 'auto' }}
                onClick={() => onRequestCourse(course._id)}
              >
                Request Course
              </Button>
            )
          ) : null}
        </Stack>
      </Box>
    </Card>
  );
}

export default CourseCard;
