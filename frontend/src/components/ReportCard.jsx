import React from 'react';
import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import { Divider, Box, Button, Backdrop, CircularProgress } from '@mui/material';
import axios from 'axios';
import moment from 'moment';

import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';

function ReportCard(props) {
  const user = props.user;
  const report = props.report;

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const onSubmitBasic = (data) => {
    handleSend(data);
  };

  const handleSend = async (data) => {
    const content = { id: report._id, message: data.message };
    await axios
      .patch(`/api/ticket/sendMessage`, content, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        toast.success('Message Sent Successfully');
      });

    handleClose();
  };

  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <div>
        <Accordion
          sx={{
            mt: '0.5rem',
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <Typography sx={{ width: '83%', flexShrink: 0 }}>{report.subject}</Typography>
            <Typography
              sx={{
                color: 'text.secondary',
              }}
            >
              {report.status}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box
              sx={{
                justifyContent: 'flex-end',
              }}
            >
              <Typography>Course: {report.course.title}</Typography>
              <Typography>Type: {report.type}</Typography>
              {report.messages.map((message) => {
                if (message.user.type !== 'administrator') {
                  return (
                    <Paper
                      sx={{
                        p: '0.5rem',
                        width: '50%',
                        bgcolor: 'grey.300',
                        mt: '1rem',
                      }}
                    >
                      <Typography variant="title1">{message.message}</Typography>
                      <Typography variant="body2">
                        {message.user.firstName + ' ' + message.user.lastName}
                      </Typography>
                      <Typography variant="body2">
                        {moment(message.date).format('dddd, MMMM Do YYYY, h:mm:ss a')}
                      </Typography>
                    </Paper>
                  );
                } else {
                  return (
                    <Paper
                      sx={{
                        p: '0.5rem',
                        width: '50%',
                        bgcolor: 'grey.300',
                        ml: 'auto',
                        mt: '1rem',
                      }}
                    >
                      <Typography variant="title1">{message.message}</Typography>
                      <Typography variant="body2">Admin</Typography>
                      <Typography variant="body2">
                        {moment(message.date).format('dddd, MMMM Do YYYY, h:mm:ss a')}
                      </Typography>
                    </Paper>
                  );
                }
              })}

              <div>
                <Button onClick={handleClickOpen} sx={{ mt: '0.5rem', ml: '85%' }}>
                  Send Message
                </Button>

                <Dialog open={open} onClose={handleClose}>
                  <DialogTitle>Send Message</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      Please send us a message if you need further help with your report.
                    </DialogContentText>
                    <form
                      style={{ flexGrow: '1', display: 'flex', flexDirection: 'column' }}
                      onSubmit={handleSubmit(onSubmitBasic)}
                    >
                      <TextField
                        autoFocus
                        margin="dense"
                        id="outlined-basic"
                        label="Message"
                        type="text"
                        fullWidth
                        variant="standard"
                        error={errors?.description ? true : false}
                        {...register('message', { required: true })}
                      />
                      <Button type="submit">Send</Button>
                      <Button onClick={handleClose}>Cancel</Button>
                    </form>
                  </DialogContent>
                  {/* <DialogActions> */}

                  {/* </DialogActions> */}
                </Dialog>
              </div>

              {/* <Button
                                variant="contained"
                                sx={{ mt: '0.5rem', ml: '85%' }}
                            >
                                Send Message
                            </Button> */}
              {/* <div>
                                <Button onClick={handleToggle} sx={{ mt: '0.5rem', ml: '85%' }}>Send Message</Button>
                                <Backdrop
                                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                                    open={open}
                                    onClick={handleClose}
                                >
                                    <Box sx={{
                                        width: '60%',
                                        height: '60%',
                                        backgroundColor: 'primary.dark',
                                        '&:hover': {
                                            backgroundColor: 'primary.main',
                                            opacity: [0.9, 0.8, 0.7],
                                        },
                                    }}>
                                        <Typography>
                                            MY NAME IS HERE BITCHES
                                        </Typography>
                                    </Box>
                                </Backdrop>
                            </div> */}
            </Box>
          </AccordionDetails>
        </Accordion>
        <Divider sx={{ mt: '0.5rem' }} variant="middle" />
      </div>
    </>
  );
}

export default ReportCard;
