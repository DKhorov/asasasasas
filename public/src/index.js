import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { createTheme, ThemeProvider, CssBaseline, Typography } from '@mui/material';
import { createNormalizedTheme } from './system/normalize';
import AppRouter from './system/router';
import './fonts/stylesheet.css';
import './style/global.scss';
import { Provider } from 'react-redux';
import store from './system/store';
import { LoadingProvider, useLoading } from './contexts/LoadingContext';
import { setGlobalLoadingSetter } from './system/axios';
import logo from './image/1.webp';
import NewsPage from './page/news/index.jsx';

const EpicLoader = () => {
  const { loading, initialLoading } = useLoading();
  if (!initialLoading && !loading) return null;
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      backgroundColor: 'rgb(239, 237, 243)',
      zIndex: 9999, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      transition: 'background 0.5s',
    }}>
      <div style={{ width: "400px", height: "350px", backgroundColor: 'white', position: 'relative'  , borderRadius:"10px" , marginTop: "-60px"}}>
        <div style={{ position: 'absolute', top: 18, right: 20, display: 'flex', gap: 8 }}>
          <div style={{ width: 15, height: 15, borderRadius: 100, background: 'rgb(222, 221, 221)', boxShadow: '0 1px 4px #ffbd2e33' }} />
          <div style={{ width: 15, height: 15, borderRadius: 100, background: 'rgb(222, 221, 221)', boxShadow: '0 1px 4px #ff5f5633' }} />
        </div>


        <center>
        <img src={logo} alt='logo' style={{width:"120px", height:'120px' , marginTop: "60px"}}></img>
        </center>
        <h2 style={{textAlign:'center', fontFamily:'Yandex Sans', marginTop:'5px'}}>AtomGlide</h2>
        <Typography sx={{
                        fontFamily: "'Yandex Sans', Arial, Helvetica, sans-serif",
                        textAlign:'center',
                        fontSize:'16px',
                        marginTop:"0px",
                        color:"rgb(120, 120, 120)",
                        mb: 2
          }}>Сервис для общения, работы</Typography>
        <center><span class="loader"></span></center>
        <Typography sx={{
                        fontFamily: "'Yandex Sans', Arial, Helvetica, sans-serif",
                        textAlign:'center',
                        fontSize:'12px',
                        marginTop:"0px",
                        color:"rgb(205, 205, 205)",
                        mb: 2
          }}>Подключение к серверу</Typography>
  


      </div>
      <Typography
        variant="body2"
        sx={{
          position: 'absolute',
          bottom: 16,
          right: 25,
          zIndex: 1000,
          color: 'text.secondary',
          fontFamily: "'Yandex Sans', Arial, Helvetica, sans-serif",
          fontSize: '14px',
          userSelect: 'none',
        }}
      >
       RU{' '}
       <span
         style={{
           color: '#1976d2',
           cursor: 'pointer',
           textDecoration: 'underline',
           transition: 'color 0.2s',
           margin: '0 3px',

         }}
         onClick={() => window.open('https://yoursupport.example.com', '_blank')}
         onMouseOver={e => e.target.style.color = '#125ea2'}
         onMouseOut={e => e.target.style.color = '#1976d2'}
       >
         Информациный центр
       </span>{' '}
       © 2025, DK Studio
      </Typography>
   
    </div>
  );
};

const EpicLoaderInit = ({ children }) => {
  const { setLoading } = useLoading();
  useEffect(() => {
    setGlobalLoadingSetter(setLoading);
  }, [setLoading]);
  return <>{children}</>;
};

if (!localStorage.getItem('token') && window.location.pathname !== '/login' && window.location.pathname !== '/registration') {
  window.location.replace('/login');
}

const theme = createNormalizedTheme(createTheme());

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <LoadingProvider>
    <React.StrictMode>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <EpicLoader />
          <EpicLoaderInit>
            <BrowserRouter>
              <AppRouter />
            </BrowserRouter>
          </EpicLoaderInit>
        </ThemeProvider>
      </Provider>
    </React.StrictMode>
  </LoadingProvider>
);
