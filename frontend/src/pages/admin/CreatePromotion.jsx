import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import { Box, Button, Stack, TextField, Typography, Modal, Radio } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

function CreatePromotion(props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm();
  const [courses, setCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [selectedValue, setSelectedValue] = useState('all');
  const [open, setOpen] = useState(false);

  const submitCreatePromotion = (data) => {
    if (selectedValue === 'specific' && selectedCourses.length === 0) {
      setError('courses', {
        type: 'manual',
        message: 'Please select at least one Course',
      });
      return;
    }
    data.courses = selectedValue === 'specific' ? selectedCourses : courses;
    axios
      .post('/api/courses/promotion', data, {
        headers: {
          Authorization: `Bearer ${props.token}`,
        },
      })
      .then((res) => {
        setOpen(false);
        props.setCreated(!props.created);
      });
  };

  useEffect(() => {
    axios.get('/api/courses/names').then((res) => {
      setCourses(res.data);
    });
  }, []);

  return (
    <>
      <Button
        startIcon={<AddCircleOutlineIcon />}
        variant="contained"
        sx={{ bgcolor: 'grey.800', fontWeight: 'semiBold' }}
        onClick={() => setOpen(true)}
      >
        Create Promotion
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { sm: '80%', md: '30%' },
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 2,
          }}
        >
          <Box
            id="modal-modal-title"
            sx={{
              display: 'flex',
              flexDirection: 'row',
              width: '100%',
            }}
          >
            <Typography variant="h6" component="h2">
              Create Promotion
            </Typography>
            <Button
              onClick={() => setOpen(false)}
              sx={{
                ml: 'auto',
                minWidth: 0,
                p: 0,
              }}
            >
              <CloseIcon sx={{ color: 'grey.700' }} />
            </Button>
          </Box>
          <Box id="modal-modal-description" sx={{ mt: 1 }}>
            <form onSubmit={handleSubmit(submitCreatePromotion)}>
              <Stack direction="column" spacing={2}>
                <TextField
                  label="Promotion Amount"
                  variant="outlined"
                  size="small"
                  type="number"
                  fullWidth
                  {...register('amount', {
                    required: {
                      value: true,
                      message: 'Amount is required',
                    },
                  })}
                  error={errors.amount}
                  helperText={errors.amount && errors.amount.message}
                />
                <TextField
                  id="outlined-basic"
                  label="Duration"
                  variant="outlined"
                  size="small"
                  type="datetime-local"
                  sx={{ width: '100%' }}
                  {...register('expireDate', {
                    required: true,

                    validate: (value) => {
                      const today = new Date();
                      const startDate = new Date(value);
                      return startDate > today;
                    },
                  })}
                  error={errors.expireDate}
                  helperText={errors.expireDate && 'Expire date must in the future'}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <Stack direction="row " sx={{ alignItems: 'center' }}>
                  <Radio
                    checked={selectedValue === 'all'}
                    onChange={() => {
                      setSelectedValue('all');
                    }}
                    value="all"
                    name="radio-buttons"
                  />
                  <Typography variant="subtitle1">All Courses</Typography>
                </Stack>
                <Stack direction="row">
                  <Radio
                    checked={selectedValue === 'specific'}
                    onChange={() => {
                      setSelectedValue('specific');
                    }}
                    value="specific"
                    name="radio-buttons"
                  />
                  <Select
                    options={courses}
                    value={selectedCourses}
                    onChange={(e) => {
                      setSelectedCourses(e), clearErrors('courses');
                    }}
                    isDisabled={selectedValue === 'all'}
                    placeholder="Select Course(s)"
                    isMulti
                    styles={{
                      container: (provided) => ({
                        ...provided,
                        width: '100%',
                      }),
                    }}
                  />
                </Stack>
                {errors.courses && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'error.main',
                      fontWeight: 'semiBold',
                      fontSize: '0.8rem',
                    }}
                  >
                    {errors.courses.message}
                  </Typography>
                )}
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: 'grey.800',
                    color: 'white',
                    fontWeight: 'semiBold',
                  }}
                  type="submit"
                >
                  Create
                </Button>
              </Stack>
            </form>
          </Box>
        </Box>
      </Modal>
    </>
  );
}

export default CreatePromotion;
