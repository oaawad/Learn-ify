import React from 'react';
import { makeStyles } from '@mui/styles';
import ReactHookFormSelect from './ReactHookFormSelect';
import { useForm } from 'react-hook-form';

import { Box, Typography, TextField, Stack, MenuItem, Button } from '@mui/material';
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

function ReportCategory(props) {
  const classes = useStyles();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm();

  const onSubmitBasic = (data) => {
    props.setReportInfo(data);
    props.setActiveStep(1);
  };

  useEffect(() => {
    reset(props.reportInfo);
  }, [props.reportInfo]);
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
      <Typography variant="h5" sx={{ fontWeight: 'medium', display: 'flex' }}>
        <InfoOutlinedIcon sx={{ mr: '1rem', alignSelf: 'center' }} fontSize="small" /> Report Info
      </Typography>
      <form
        style={{ flexGrow: '1', display: 'flex', flexDirection: 'column' }}
        onSubmit={handleSubmit(onSubmitBasic)}
      >
        <Box sx={{ my: '2rem' }}>
          <Stack direction="row" sx={{ mt: '1rem', ml: '-7.5px', width: '101%' }}>
            <ReactHookFormSelect
              id="category"
              name="category"
              label="category"
              className={classes.selectR}
              control={control}
              error={errors?.category ? true : false}
              variant="outlined"
              margin="normal"
            >
              <MenuItem value="technical">Technical</MenuItem>
              <MenuItem value="financial">Financial</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </ReactHookFormSelect>
          </Stack>
          <TextField
            id="outlined-basic"
            label="Subject"
            variant="outlined"
            helperText={errors?.subject ? 'Title is required' : ''}
            error={errors?.subject ? true : false}
            {...register('subject', { required: true })}
            sx={{ mt: '1rem' }}
            fullWidth
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

export default ReportCategory;
