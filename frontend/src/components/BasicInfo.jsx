import React from 'react';
import { makeStyles } from '@mui/styles';
import ReactHookFormSelect from './ReactHookFormSelect';
import { useForm } from 'react-hook-form';

import { Box, Typography, TextField, Stack, MenuItem, Button, InputAdornment } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useEffect } from 'react';

const useStyles = makeStyles((theme) => ({
  selectL: {
    width: '100%',
    marginRight: '0.5rem',
  },
  selectR: {
    width: '100%',
    marginLeft: '0.5rem',
  },
}));

function BasicInfo(props) {
  const classes = useStyles();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm();

  const onSubmitBasic = (data) => {
    props.setBasicInfo(data);
    props.setActiveStep(1);
  };

  useEffect(() => {
    reset(props.basicInfo);
  }, [props.basicInfo]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <Box
      sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        mt: '2rem',
        ml: '1rem',
      }}
    >
      <Typography variant="subtitle1" sx={{ fontWeight: 'medium', display: 'flex' }}>
        <InfoOutlinedIcon sx={{ mr: '1rem', alignSelf: 'center' }} fontSize="small" /> Basic
        Information
      </Typography>
      <form
        style={{ flexGrow: '1', display: 'flex', flexDirection: 'column' }}
        onSubmit={handleSubmit(onSubmitBasic)}
      >
        <Box sx={{ my: '2rem' }}>
          <TextField
            id="outlined-basic"
            label="Course Title"
            variant="outlined"
            helperText={
              errors?.title
                ? 'Title is required'
                : '(Please make this a maximum of 100 characters and unique.)'
            }
            fullWidth
            {...register('title', { required: true })}
            error={errors?.title ? true : false}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            id="outlined-basic"
            label="Description"
            variant="outlined"
            multiline
            rows={4}
            helperText={
              errors?.description
                ? 'Description is required'
                : '(Please make this a maximum of 500 characters.)'
            }
            error={errors?.description ? true : false}
            {...register('description', { required: true })}
            sx={{ mt: '1rem' }}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
          />
          <Stack direction="row" sx={{ mt: '1rem' }}>
            <ReactHookFormSelect
              id="subject"
              name="subject"
              label="Course Subject"
              className={classes.selectL}
              control={control}
              error={errors?.subject ? true : false}
              variant="outlined"
              margin="normal"
            >
              {props.subjects.map((subject, i) => (
                <MenuItem key={subject.id} value={i + 1}>
                  {subject.name}
                </MenuItem>
              ))}
            </ReactHookFormSelect>
            <ReactHookFormSelect
              id="level"
              name="level"
              label="Course Level"
              className={classes.selectR}
              control={control}
              error={errors?.level ? true : false}
              variant="outlined"
              margin="normal"
            >
              <MenuItem value="1">Beginner</MenuItem>
              <MenuItem value="2">Intermedite</MenuItem>
              <MenuItem value="3">Advanced</MenuItem>
            </ReactHookFormSelect>
          </Stack>
          <TextField
            id="outlined-basic"
            label="Price"
            variant="outlined"
            helperText={
              errors?.price
                ? 'Price is required'
                : '(Please choose the price between 0 and 999.99 USD.)'
            }
            {...register('price', { required: true })}
            error={errors?.price ? true : false}
            sx={{ mt: '2rem' }}
            type="number"
            fullWidth
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
          />
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            pb: 2,
            mt: 'auto',
          }}
        >
          <Button color="inherit" disabled sx={{ mr: 1 }}>
            Back
          </Button>
          <Button type="submit" sx={{ ml: 'auto' }}>
            Next
          </Button>
        </Box>
      </form>
    </Box>
  );
}

export default BasicInfo;
