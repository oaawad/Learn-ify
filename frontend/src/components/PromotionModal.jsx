import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Button,
  Modal,
  Typography,
  Box,
  Stack,
  TextField,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import axios from 'axios';

function PromotionModal(props) {
  const { promotion, setPromotion, token, id } = props;
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const submitPromotion = (data) => {
    const date = new Date(data.duration).toISOString();

    axios
      .post(
        `/api/courses/${id}/promotion`,
        { amount: data.amount, expireAt: date },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setPromotion({
          amount: res.data.amount,
          duration:
            (Date.parse(res.data.expireAt) - Date.now()) /
            (1000 * 60 * 60 * 24),
        });
      });
  };
  const deletePromotion = () => {
    axios
      .delete(`/api/courses/${id}/promotion`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setPromotion(null);
      });
  };
  return (
    <>
      <Button
        variant="contained"
        color="success"
        sx={{ width: '80%' }}
        onClick={() => setOpen(true)}
      >
        <Typography color="grey.300">
          {promotion ? 'EDIT' : 'START'} Promotion
        </Typography>
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
            width: { sm: '80%', md: '52%' },
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
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
              Promtions
            </Typography>
            <Button
              onClick={() => setOpen(false)}
              sx={{
                ml: 'auto',
              }}
            >
              <CloseIcon sx={{ color: 'grey.700' }} />
            </Button>
          </Box>
          <Box id="modal-modal-description" sx={{ mt: 2 }}>
            <Typography
              variant="subtitle1"
              color="grey.800"
              fontWeight="medium"
              display={promotion ? 'block' : 'none'}
            >
              Current Promotion
            </Typography>
            {promotion ? (
              <>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  spacing={2}
                >
                  <Typography
                    variant="body2"
                    color="grey.700"
                    sx={{ pr: 'rem', alignSelf: 'center' }}
                  >
                    Amount:{' '}
                    <Typography
                      variant="overline"
                      color="grey.700"
                      fontWeight="bold"
                    >
                      {promotion.amount}%
                    </Typography>
                  </Typography>
                  <Typography
                    variant="body2"
                    color="grey.700"
                    sx={{
                      pr: 'rem',

                      alignSelf: 'center',
                    }}
                  >
                    Duration:{' '}
                    <Typography
                      variant="overline"
                      color="grey.700"
                      fontWeight="bold"
                      display="inline"
                    >
                      {Math.floor(promotion.duration)} days{' '}
                      {Math.ceil((promotion.duration % 1) * 24)} hour
                    </Typography>
                  </Typography>
                  <Typography
                    variant="body2"
                    color="grey.700"
                    sx={{ alignSelf: 'center' }}
                  >
                    Status:{' '}
                    <Typography
                      variant="overline"
                      color="success.main"
                      fontWeight="bold"
                    >
                      Active
                    </Typography>
                  </Typography>
                  <Button onClick={deletePromotion}>
                    <DeleteForeverIcon color="error" />
                  </Button>
                </Stack>
                <Divider sx={{ my: 2 }} />
              </>
            ) : (
              <Typography
                variant="body2"
                color="grey.700"
                textAlign="center"
                sx={{ alignSelf: 'center' }}
              >
                No Past Promotions
              </Typography>
            )}

            <Typography
              variant="subtitle1"
              color="grey.800"
              fontWeight="medium"
              sx={{ mb: 2 }}
            >
              Start New Promotion
            </Typography>
            <form onSubmit={handleSubmit(submitPromotion)}>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent="space-between"
                spacing={2}
              >
                <TextField
                  id="outlined-basic"
                  label="Amount"
                  variant="outlined"
                  size="small"
                  type="number"
                  sx={{ width: { xs: '100%', sm: '30%' } }}
                  {...register('amount', { required: true, min: 1, max: 100 })}
                  error={errors.amount}
                  helperText={
                    errors.amount && 'Amount must be between 1 and 100'
                  }
                />
                <TextField
                  id="outlined-basic"
                  label="Duration"
                  variant="outlined"
                  size="small"
                  type="datetime-local"
                  sx={{ width: { xs: '100%', sm: '30%' } }}
                  {...register('duration', {
                    required: true,

                    validate: (value) => {
                      const today = new Date();
                      const startDate = new Date(value);
                      return startDate > today;
                    },
                  })}
                  error={errors.duration}
                  helperText={
                    errors.duration && 'Expire date must in the future'
                  }
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <Button
                  variant="contained"
                  color="success"
                  sx={{ width: { xs: '100%', sm: '30%' }, height: '100%' }}
                  type="submit"
                >
                  <Typography color="grey.300">Start</Typography>
                </Button>
              </Stack>
            </form>
          </Box>
        </Box>
      </Modal>
    </>
  );
}

export default PromotionModal;
