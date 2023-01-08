import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  Container,
  Box,
  Avatar,
  Stack,
  Typography,
  Button,
  Grid,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import { useSelector, useDispatch } from 'react-redux';
import countries from '../app/flags';
import { toast } from 'react-toastify';
import { setCountry } from '../features/user/userSlice';
import 'reactjs-popup/dist/index.css';
import '../styles/countrySetter.css';
function CountrySetter() {
  const [selected, setSelected] = useState('');
  let { user, isLoading, isError, isSuccess, message, country } = useSelector(
    (state) => state.user
  );
  if (typeof user === 'string') {
    user = JSON.parse(user);
  }
  const navigate = useNavigate();
  const options = countries;
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(true);

  useEffect(() => {
    if (user) {
      if (country || user.type === 'administrator' || user.type === 'corporate') {
        setShowMenu(false);
      } else {
        setShowMenu(true);
      }
    } else {
      setShowMenu(false);
    }
  }, []);

  const onSelectFlag = async (e) => {
    setSelected(e.target.value);
    const data = { country: options[e.target.value], token: user.token };
    dispatch(setCountry(data));
    setShowMenu(false);
  };

  return (
    <>
      {showMenu ? (
        <AppBar position="sticky" sx={{ backgroundColor: 'grey.400', boxShadow: 'none' }}>
          <Container maxWidth="lg">
            <Grid container>
              <Grid
                item
                sm={5.5}
                display={{ xs: 'none', sm: 'flex' }}
                sx={{ flexDirection: 'column' }}
                justifyContent="center"
                alignItems="center"
              >
                <Typography variant="subtitle1" sx={{ lineHeight: '1rem' }} color="grey.700">
                  Please select your country
                </Typography>
                <Typography variant="subtitle2" fontWeight="regular" color="grey.700">
                  you can change it later in edit profile
                </Typography>
              </Grid>
              <Grid
                item
                xs={11}
                sm={5.5}
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <FormControl sx={{ margin: '0.5rem 1rem', width: '70%' }}>
                  <InputLabel id="demo-simple-select-label" size="small">
                    Select your country
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selected}
                    label="Select your country"
                    onChange={onSelectFlag}
                    sx={{
                      '& .MuiSelect-select': { backgroundColor: 'grey.300' },
                    }}
                    size="small"
                  >
                    {options.map((option, i) => (
                      <MenuItem key={i} value={i}>
                        <Stack direction="row">
                          <Avatar
                            src={`data:image/png;base64, ${option.flag}`}
                            sx={{ width: 20, height: 20, marginRight: '1rem' }}
                          />
                          <Typography variant="body2">{option.name}</Typography>
                        </Stack>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item sm={1} display="flex" justifyContent="center" alignItems="center">
                <Button
                  variant="text"
                  onClick={() => {
                    setShowMenu(false);
                  }}
                >
                  <CloseIcon sx={{ color: 'grey.700' }} />
                </Button>
              </Grid>
            </Grid>
          </Container>
        </AppBar>
      ) : null}
    </>
  );
}

export default CountrySetter;
