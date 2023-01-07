import React, { useState, useEffect } from 'react';
import CourseCard from './CourseCard';
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Grid,
  Paper,
  Box,
  Typography,
  Stack,
  Select,
  MenuItem,
  IconButton,
  InputBase,
  Button,
  Chip,
} from '@mui/material';

function CourseGallery(props) {
  const [courses, setCourses] = useState(props.courses);
  const [sort, setSort] = useState('0');
  const [subject, setSubject] = useState('all courses');
  const [subjects, setSubjects] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const changeSort = (event) => {
    setCourses((prev) => {
      let newCourses = [...prev];
      if (event.target.value === 2) {
        newCourses.sort((a, b) => a.price - b.price);
      } else if (event.target.value === 3) {
        newCourses.sort((a, b) => b.price - a.price);
      } else if (event.target.value === 1) {
        newCourses.sort((a, b) => b.rating - a.rating);
      }
      return newCourses;
    });
    setSort(event.target.value);
  };
  const search = (event) => {
    setCourses((prev) => {
      let newCourses = [...prev];
      newCourses =
        event.target.value === ''
          ? props.courses
          : props.courses.filter(
              (course) =>
                course.title.toLowerCase().includes(event.target.value.toLowerCase()) ||
                course.subject.name.toLowerCase().includes(event.target.value.toLowerCase()) ||
                course.instructor.firstName
                  .toLowerCase()
                  .includes(event.target.value.toLowerCase()) ||
                course.instructor.lastName.toLowerCase().includes(event.target.value.toLowerCase())
            );
      return newCourses;
    });
  };
  const filter = (event) => {
    setSubject(event.target.textContent.toLowerCase());
    setCourses((prev) => {
      let newCourses = [...prev];
      newCourses = props.courses.filter((course) => {
        if (event.target.textContent.toLowerCase() === 'all courses') {
          return true;
        }

        return course.subject.name.toLowerCase() === event.target.textContent.toLowerCase();
      });
      return newCourses;
    });
  };
  const getSubjects = async () => {
    await axios.get('/api/courses/subjects').then((res) => {
      setSubjects(res.data);
    });
  };
  useEffect(() => {
    getSubjects();
  }, []);

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper
            elevation={0}
            sx={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'white',
              borderRadius: '0.5rem',
              border: '1px solid #e0e0e0',

              width: '100%',
            }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search Courses..."
              inputProps={{ 'aria-label': 'search google maps' }}
              onChange={search}
            />
            <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
              <SearchIcon />
            </IconButton>
          </Paper>
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            display: 'flex',
            alignItems: { xs: 'flex-start', sm: 'center' },
            flexDirection: { xs: 'column', sm: 'row' },
            paddingTop: '0.2rem !important',
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            // sx={{ ml: { sm: '0', md: 'auto' }, mr: { xs: '0', sm: 'auto' } }}
          >
            <Typography variant="subtitle1" mr={1}>
              Subject Filter
            </Typography>
            <Button
              sx={{ color: 'grey.600' }}
              onClick={() => {
                setIsFilterOpen(!isFilterOpen);
              }}
            >
              Select Subjects{' '}
              <ExpandMoreIcon
                sx={{
                  transform: isFilterOpen ? 'rotate(-180deg)' : 'none',
                  transition: 'transform 0.25s ease-in-out',
                  ml: '1.5rem',
                }}
              />
            </Button>
          </Stack>

          <Stack direction="row" sx={{ ml: 'auto' }} alignItems="center">
            <Typography variant="subtitle1">Sort By</Typography>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={sort}
              onChange={changeSort}
              sx={{
                height: '2rem',
                width: '10rem',
                boxShadow: 'none',
                color: 'grey.600',
                '.MuiOutlinedInput-notchedOutline': {
                  border: 0,
                  borderWidth: '0 !important',
                },
                ' .MuiSelect-select': {
                  paddingRight: '0 !important',
                },
              }}
              IconComponent={() => <ExpandMoreIcon />}
            >
              <MenuItem value={0}>Most Recent</MenuItem>
              <MenuItem value={1}>Popular</MenuItem>
              <MenuItem value={2}>Price Low</MenuItem>
              <MenuItem value={3}>Price High</MenuItem>
              <MenuItem value={4}>On Sale</MenuItem>
            </Select>
          </Stack>
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            visibility: isFilterOpen ? 'visible' : 'hidden',
            opacity: isFilterOpen ? 1 : 0,
            transition: 'all 0.3s ease-in-out',
            height: isFilterOpen ? 'auto' : 0,
            paddingTop: isFilterOpen ? '0.5rem !important' : '0 !important',
            overflow: 'hidden',
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            sx={{
              transition: 'all 0.3s ease-in-out',
              flexWrap: 'wrap',
            }}
            gap={2}
          >
            <Chip
              variant="outlined"
              label="All Courses"
              size="small"
              sx={{
                p: '0.2rem',
                borderColor: subject === 'all courses' ? 'primary.main' : 'grey.600',
                color: subject === 'all courses' ? 'primary.main' : 'grey.600',
                transition: 'all 0.3s ease-in-out',
              }}
              onClick={filter}
            />

            {subjects.map((s, i) => (
              <Chip
                label={s.name}
                variant="outlined"
                size="small"
                onClick={filter}
                key={i}
                sx={{
                  p: '0.2rem',
                  color: subject === s.name.toLowerCase() ? 'primary.main' : 'grey.600',
                  borderColor: subject === s.name.toLowerCase() ? 'primary.main' : 'grey.600',
                  transition: 'all 0.3s ease-in-out',
                }}
              />
            ))}
          </Stack>
        </Grid>

        {courses.map((course, i) => {
          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
              <CourseCard course={course} />
            </Grid>
          );
        })}
      </Grid>
    </>
  );
}

export default CourseGallery;
