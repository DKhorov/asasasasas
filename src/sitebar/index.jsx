import React, { useState } from 'react';
import { Box, IconButton } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { motion, AnimatePresence } from 'framer-motion';
import { ReactComponent as StoreIcon } from './14.svg';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../system/redux/slices/getme';

const Sitebar = () => {
  const isMobile = useMediaQuery('(max-width:900px)');
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const user = useSelector(selectUser);

  const toggleMenu = () => setIsOpen(!isOpen);

  const menuItems = [
    { label: 'Главная', href: '/' },
    { label: 'Магазин', href: '/store' },
    { label: 'DEBUG', href: '/game' },
    { label: 'Каналы', href: '/channel' },
    { label: 'Поток', href: '/comments' },
    { label: 'Рейтинг', href: '/forbes' },
    { label: 'Кошелёк', href: '/wallet' },
        { label: 'Сообщения', href: '/message' },

    { label: 'Профиль', href: user ? `/account/${user.id || user._id}` : '/' },
    { label: 'Настройки', href: '/setting' },
  ];

  const menuItems2 = [
    { label: 'Главная', href: '/' },
    { label: 'Магазин AtomStore', href: '/store' },
    { label: 'Каналы', href: '/channel' },
    { label: 'Рейтинг', href: '/forbes' },
    { label: 'Кошелёк', href: '/wallet' },
    { label: 'Создать канал', href: '/create-channel' },
    { label: 'Настройки профиля', href: '/setting' },
    { label: 'Поток комментариев', href: '/comments' },
    { label: 'Войти в другой акк', href: '/login' },
    { label: 'Профиль', href: user ? `/account/${user.id || user._id}` : '/' },
  ];

  const handleNavigation = (href, label) => {
    if (label === 'Профиль') {
      if (user && (user.id || user._id)) {
        navigate(`/account/${user.id || user._id}`);
      } else {
        alert('Перезагрузи сайт два раза сначала');
      }
    } else {
      navigate(href);
    }
    setIsOpen(false); 
  };

  return (
    <>
     
      <Box className="nav">
        <div style={{ display: 'flex', alignItems: 'center', padding: '0 16px', backgroundColor:'rgb(21, 20, 20)', borderRadius:'100px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <StoreIcon style={{ width: 22, height: 22,mr:4 }} />
          </span>

          {!isMobile &&
            menuItems.map((item) => (
              <a
                key={item.label}
                onClick={() => handleNavigation(item.href, item.label)}
                className="nav-itemsр"
                style={{ cursor: 'pointer' }}
              >
                {item.label}
              </a>
            ))}

          {isMobile && (
            <IconButton onClick={toggleMenu} sx={{ color: '#fff', marginLeft: 'auto' }}>
              {isOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
          )}
        </div>
      </Box>

    
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: '100vh' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            style={{
              overflow: 'hidden',
              backgroundColor: 'rgba(49, 56, 64, 0)',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 1200,
            }}
          >
            {menuItems2.map((item2, index) => (
              <motion.a
                key={item2.label}
                onClick={() => handleNavigation(item2.href, item2.label)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.2 + index * 0.05, duration: 0.3 }}
                style={{
                  paddingLeft: '35px',
                  paddingTop: '15px',
                  color: '#fff',
                  fontWeight: 'bold',
                  textDecoration: 'none',
                  fontSize: '30px',
                  fontFamily: 'SF', 
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
              >
                {item2.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

     
    
    </>
  );
};

export default Sitebar;
