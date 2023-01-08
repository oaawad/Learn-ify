import PropTypes from 'prop-types';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Dashboard from './pages/admin/Dashboard';
import Login from './pages/Login';
import Home from './pages/Home';
import Register from './pages/Register';
import CountrySetter from './components/CountrySetter';
import InstructorProfile from './pages/InstructorProfile';
import Courses from './pages/Courses';
import Learning from './pages/Learning';
import ViewCourse from './pages/ViewCourse';
import OpenCourse from './pages/OpenCourse';
import CreateCourse from './pages/CreateCourse';
import ChangePassword from './pages/ChangePassword';
import ForgotPass from './pages/ForgotPass';
import ResetPassword from './pages/ResetPassword';
import CheckoutSuccess from './pages/CheckoutSuccess';
import PopularCourses from './pages/PopularCourses';
import Support from './pages/Support';
import Report from './pages/Report';
import PaymentsHistory from './pages/PaymentsHistory';
import NotFound from './pages/NotFound';

import * as React from 'react';
import { Link as RouterLink, MemoryRouter } from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server';
import Box from '@mui/material/Box';
import { useSelector } from 'react-redux';
const LinkBehavior = React.forwardRef((props, ref) => {
  const { href, ...other } = props;
  // Map href (MUI) -> to (react-router)
  return <RouterLink data-testid="custom-link" ref={ref} to={href} {...other} />;
});

LinkBehavior.propTypes = {
  href: PropTypes.oneOfType([
    PropTypes.shape({
      hash: PropTypes.string,
      pathname: PropTypes.string,
      search: PropTypes.string,
    }),
    PropTypes.string,
  ]).isRequired,
};

function Router(props) {
  const { children } = props;
  if (typeof window === 'undefined') {
    return <StaticRouter location="/">{children}</StaticRouter>;
  }

  return <MemoryRouter>{children}</MemoryRouter>;
}

Router.propTypes = {
  children: PropTypes.node,
};

const theme = createTheme({
  components: {
    MuiLink: {
      defaultProps: {
        component: LinkBehavior,
      },
    },
    MuiButtonBase: {
      defaultProps: {
        LinkComponent: LinkBehavior,
      },
    },
  },
  palette: {
    primary: {
      main: '#3145FB',
    },
    secondary: {
      main: '#181945',
    },
    info: {
      main: '#3145FB',
    },
    success: {
      main: '#27AE60',
    },
    warning: {
      main: '#E2B93B',
    },
    error: {
      main: '#EB5757',
    },
    grey: {
      800: '#333333',
      700: '#4F4F4F',
      600: '#828282',
      500: '#BDBDBD',
      400: '#eaeaea',
      300: '#F7F7F7',
    },
  },
  typography: {
    fontFamily: 'Public Sans',
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightSemiBold: 600,
    fontWeightBold: 700,
  },
});

function App() {
  let { user } = useSelector((state) => state.user);
  typeof user === 'string' && (user = JSON.parse(user));
  return (
    <>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <CountrySetter />
          <Box minHeight="100vh" display="flex" flexDirection="column">
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              {/*TODO <Route path="/contact" element={<Contact />} /> */}
              {/*TODO <Route path="/about" element={<About />} /> */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/complete-registration/:token" element={<Register comp={true} />} />
              <Route path="/corporate/register/:token" element={<Register corp={true} />} />
              <Route path="/forgot-password" element={<ForgotPass />} />
              <Route path="/ResetPassword/:token/:email" element={<ResetPassword />} />

              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/trending" element={<PopularCourses trending={true} />} />
              <Route path="/courses/toprated" element={<PopularCourses trending={false} />} />
              <Route path="/courses/create" element={<CreateCourse />} />
              <Route path="/courses/:id" element={<ViewCourse />} />
              <Route path="/courses/:id/learn" element={<OpenCourse />} />

              <Route path="/Support" element={<Support />} />
              <Route path="/Support/Report/:id" element={<Report />} />

              <Route path="/checkout-success" element={<CheckoutSuccess />} />
              {/*TODO <Route path="/instructors" element={<Instructors />} />  */}
              <Route path="/instructors/:id" element={<InstructorProfile />} />
              <Route path="/learning" element={<Learning />} />

              <Route path="/dashboard" element={<Dashboard tab={'Dashboard'} />} />
              <Route path="/dashboard/promotions" element={<Dashboard tab={'Promotions'} />} />
              <Route path="/dashboard/corporates" element={<Dashboard tab={'Corporates'} />} />
              <Route path="/dashboard/problems" element={<Dashboard tab={'Problems'} />} />
              <Route
                path="/dashboard/refund-requests"
                element={<Dashboard tab={'Refund Requests'} />}
              />
              <Route
                path="/dashboard/course-requests"
                element={<Dashboard tab={'Course Requests'} />}
              />

              {(user && user.type === 'instructor' && (
                <Route path="/profile" element={<InstructorProfile me={true} />} />
              )) ||
                (user && user.type === 'individual' && (
                  <Route path="/payments" element={<PaymentsHistory />} />
                ))}

              <Route path="/profile/draft/:id" element={<ViewCourse draft={true} />} />
              <Route path="/profile/draft/:id/edit" element={<CreateCourse edit={true} />} />
              <Route path="/profile/edit" element={<ChangePassword />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Box>
          <Footer />
        </BrowserRouter>
        <ToastContainer />
      </ThemeProvider>
    </>
  );
}

export default App;
