import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button } from '@mui/material';

function PaymentButton(props) {
  let user = useSelector((state) => state.user);
  user = typeof user.user === 'string' ? JSON.parse(user.user) : user.user;

  const navigate = useNavigate();
  const handlePayment = () => {
    if (!user) {
      navigate('/login');
    } else {
      axios({
        method: 'post',
        url: '/api/payment/create-checkout-session',
        data: {
          course: props.course,
          currency: {
            currency: props.currency?.code.toLowerCase() || 'usd',
            rate: props.currency?.rate || 1,
          },
        },
        headers: { Authorization: `Bearer ${user.token}` },
      }).then((res) => {
        if (res.data) {
          window.location.href = res.data.url;
        }
      });
    }
  };

  return (
    <Button variant={props.variant} size="small" sx={props.sx} onClick={handlePayment}>
      Enroll Now
    </Button>
  );
}

export default PaymentButton;
