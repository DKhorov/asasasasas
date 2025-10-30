
import PostCreator from './PostCreator';
import PostsList from './PostsList';
import Group8 from '../../image/Group8.png';
import axios from '../../system/axios';
import { useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { Box, Typography, useMediaQuery, Avatar ,Divider} from '@mui/material';
import { selectPanelCurve } from '../../system/redux/slices/store';
import { selectUser } from '../../system/redux/slices/getme';
import userService from '../../system/userService';
import { useNavigate } from 'react-router-dom';
import RefreshIcon from '@mui/icons-material/Refresh';
import { IconButton } from '@mui/material';

const DateTimeNow = () => {
  const [now, setNow] = useState(new Date());
  const user = useSelector(selectUser);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  const months = [
    'Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня',
    'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'
  ];

  const day = days[now.getDay()];
  const date = now.getDate();
  const month = months[now.getMonth()];
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  
  const avatarUrl = user?.avatarUrl ? `https://atomglidedev.ru${user.avatarUrl}` : '';
  const userName = user?.fullName || user?.name || user?.username || '';

  const handleAvatarClick = () => {
    if (user?.id || user?._id) {
      navigate(`/account/${user.id || user._id}`);
    }
  };

  return (
    <Box sx={{ 
      fontFamily: "'Yandex Sans'",
      marginRight:"20px",
      display: 'flex',
      alignItems: 'center',
      gap: 1
    }}>
      <Typography sx={{
        fontSize: '12px',
        color: 'rgba(226, 226, 226, 0.8)',
        fontFamily: "'Yandex Sans'",
      }}>
        {hours}:{minutes}
      </Typography>
      <Avatar 
        src={avatarUrl} 
        onClick={handleAvatarClick}
        sx={{
          height: '30px',
          width: '30px',
          bgcolor: avatarUrl ? 'transparent' : 'rgba(226, 226, 226, 0.2)',
          fontSize: '14px',
          fontWeight: 'bold',
          cursor: 'pointer',
          transition: 'transform 0.2s ease',
          '&:hover': {
            transform: 'scale(1.1)',
          }
        }}
      >
        {!avatarUrl && userName ? userName.charAt(0).toUpperCase() : 'U'}
      </Avatar>
    </Box>
  );
};

const Main = () => {
  const isMobile = useMediaQuery('(max-width:900px)');
  const panelCurve = useSelector(selectPanelCurve);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('/posts');
      const newPosts = response.data;
      console.log(`📊 Загружено постов: ${newPosts.length}`);
      setPosts(newPosts);
    } catch (error) {
      console.error('Ошибка загрузки постов:', error);
      setPosts([]);
    }
  };

  useEffect(() => {
    const loadInitialPosts = async () => {
      setLoading(true);
      await fetchPosts();
      setLoading(false);
    };

    loadInitialPosts();
  }, []);

  const handlePostCreated = (postData) => {
  setPosts(prev => [postData, ...prev]);
};


  const handleDeletePost = (postId) => {
    setPosts(prev => prev.filter(p => p._id !== postId));
  };

  const handlePostUpdate = (updatedPost) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post._id === updatedPost._id ? updatedPost : post
      )
    );
  };

  return (
    <Box
      sx={{
        width: isMobile ? '100vw' : '580px',
        maxWidth: isMobile ? '100vw' : '580px',
        minWidth: isMobile ? '0' : '200px',
        height: isMobile ? '100vh' : '100vh',
        flex: isMobile ? 1 : 'none',
        overflowY: 'auto',
      
        scrollbarWidth: 'none', 
        msOverflowStyle: 'none', 
        '&::-webkit-scrollbar': {
          width: '0px', 
          background: 'transparent',
        },
        paddingBottom: isMobile ? '70px' : 0, 
        pl: 0, 
                pr: 0, 
  px:1,
        pt: isMobile ? 1 : 0,
        mt: isMobile ? 2 : 0, 
      }}
    >
      <Box
        sx={{
          width: isMobile ? '100vw' : '550px',
        maxWidth: isMobile ? '100vw' : '550px',
          height: '50px',
          marginTop: isMobile ? '0' : '20px',
        display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: isMobile ? 2 : 0,
          position: 'relative',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          position:'fixed',
          zIndex:1000
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            zIndex: 1,
          }}
        />
        <Typography sx={{
          position: 'relative',
          zIndex: 2,
                fontFamily: "'Arial'",
          fontWeight: "Bold", marginLeft:"20px", color:"rgba(226, 226, 226, 1)"
        }}>
        </Typography>
      </Box>
      <Box
  sx={{
    width: isMobile ? '100vw' : '550px',
    maxWidth: isMobile ? '100vw' : '550px',
    height: '50px',
    marginTop: isMobile ? '0' : '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    px: isMobile ? 2 : 0,
    position: 'fixed',
    zIndex: 1000,
    ml:1,
    backgroundColor: 'rgba(0,0,0,0.2)', // чуть-чуть фона, чтобы кнопка не терялась
    backdropFilter: 'blur(6px)',
  }}
>
  <Typography
    sx={{
      position: 'relative',
      zIndex: 2,
      fontFamily: "'Arial'",
      fontWeight: "Bold",
      marginLeft: "20px",
      color: "rgba(226, 226, 226, 1)"
    }}
  >
    Привет снова в атоме!
  </Typography>

  <IconButton
    onClick={fetchPosts}
    sx={{
      color: "rgba(226,226,226,0.8)",
      transition: "transform 0.2s ease",
      mr:2,
      '&:hover': {
        transform: 'rotate(90deg)',
        color: "white"
      }
    }}
  >
    <RefreshIcon />
  </IconButton>
</Box>
      <Divider sx={{ mt: '70px', mb:1, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
      <Box sx={{mt:"3px"}}>
        <Box sx={{display:'flex'}}>
                  <Box sx={{height:'130px',width:'90px',backgroundColor:"gray",border:'solid rgba(98, 98, 98, 1) 2px',borderRadius:'10px'}}></Box>
                  <Box sx={{height:'130px',width:'90px',backgroundColor:"gray",border:'solid rgba(98, 98, 98, 1) 2px',borderRadius:'10px',ml:1}}></Box>
                  <Box sx={{height:'130px',width:'90px',backgroundColor:"gray",border:'solid rgba(98, 98, 98, 1) 2px',borderRadius:'10px',ml:1}}></Box>
<Box sx={{height:'130px',width:'90px',backgroundColor:"gray",border:'solid rgba(98, 98, 98, 1) 2px',borderRadius:'10px',ml:1}}></Box>
                  <Box sx={{height:'130px',width:'90px',backgroundColor:"gray",border:'solid rgba(98, 98, 98, 1) 2px',borderRadius:'10px',ml:1}}></Box>
        </Box>
        <Box sx={{mb:1}}><PostCreator onPostCreated={handlePostCreated} /></Box> 
      <PostsList 
        posts={posts} 
        loading={loading} 
        onDelete={handleDeletePost}   
        onPostUpdate={handlePostUpdate}
      />
      </Box>
    </Box>
  );
};

export default Main;
