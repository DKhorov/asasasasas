
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
        width: isMobile ? '100vw' : '650px',
        maxWidth: isMobile ? '100vw' : '650px',
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
        
      }}
    >
   
      <Box >
     
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
