import React, { useEffect, useState } from 'react';
import { Box, Typography, useMediaQuery, Avatar, IconButton } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

const DateTimeNow = () => {
  const [now, setNow] = useState(new Date());

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

  return (
    <Typography sx={{ 
      fontFamily: "'JetBrains Mono', monospace",
      fontWeight: "Light",
      marginRight:"20px",
      color:"rgb(5, 5, 5)" }}>
      {`${day}, ${date} ${month} ${hours}:${minutes}`}
    </Typography>
  );
};

const Post = ({ author, text, likes, isLiked, onLike, music }) => {
  return (
    <Box sx={{
      backgroundColor: 'rgb(255, 255, 255)',
      borderRadius: '15px',
      padding: '15px',
      marginTop: '20px',
      boxShadow: '0px 2px 5px rgba(0,0,0,0.05)'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Avatar sx={{ width: 40, height: 40, mr: 2 }}>{author[0]}</Avatar>
        <Typography sx={{ fontWeight: 'bold', flexGrow: 1 }}>{author}</Typography>
        <IconButton>
          <MoreHorizIcon />
        </IconButton>
      </Box>
      
      <Typography sx={{ mb: 2 }}>{text}</Typography>
      
      {music && (
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'rgb(245, 245, 245)',
          borderRadius: '10px',
          padding: '10px',
          mb: 2
        }}>
          <HeadphonesIcon sx={{ mr: 1, color: 'rgb(100, 100, 100)' }} />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{music.title}</Typography>
            <Typography variant="caption">{music.artist}</Typography>
          </Box>
          <Typography variant="caption">0:45 / 3:22</Typography>
        </Box>
      )}
      
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={onLike} sx={{ mr: 1 }}>
          {isLiked ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
        </IconButton>
        <Typography>{likes}</Typography>
      </Box>
    </Box>
  );
};

const Group = () => {
  const isMobile = useMediaQuery('(max-width:900px)');
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: "Аня Домтпкуны",
      text: "В данной версии добавлены новые фичи! Проверьте обновления!",
      likes: 24,
      isLiked: false,
      music: {
        title: "My Favorite Song",
        artist: "Unknown Artist"
      }
    },
    {
      id: 2,
      author: "Спикод",
      text: "Новый релиз уже на всех платформах! Спасибо за поддержку!",
      likes: 56,
      isLiked: true
    }
  ]);

  const handleLike = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    }));
  };

  return (
    <Box
      sx={{
        maxWidth: isMobile ? '100vw' : '450px',
        width: isMobile ? '100vw' : '450px',
        minWidth: isMobile ? '0' : '200px',
        height: isMobile ? 'calc(100vh - 60px)' : '100vh',
        flex: 1,
        overflowY: 'auto',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        '&::-webkit-scrollbar': {
          width: '0px',
          background: 'transparent',
        },
        paddingBottom: isMobile ? '70px' : 0,
        px: isMobile ? 2 : 3,
        pt: isMobile ? 1 : 2,
        mt: isMobile ? 2 : 0,
        backgroundColor: 'rgb(245, 245, 245)'
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: '50px',
          marginTop: isMobile ? '10px' : '20px',
          borderRadius: '100px',
          backgroundColor: 'rgb(255, 255, 255)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: isMobile ? 2 : 3,
          position: 'sticky',
          top: 0,
          zIndex: 1
        }}
      >
        <Typography sx={{
          fontFamily: "'JetBrains Mono', monospace",
          fontWeight: "Bold",
          marginLeft: "20px",
          color: "rgb(36, 36, 36)"
        }}>AtomGlide</Typography>
        <DateTimeNow />
      </Box>
      
      <Box sx={{ 
        display: 'flex', 
        overflowX: 'auto', 
        mt: 3, 
        pb: 1,
        '&::-webkit-scrollbar': {
          display: 'none'
        }
      }}>
        {['Основной', 'Музыка', 'Игры', 'Искусство', 'Технологии'].map((channel, index) => (
          <Box key={index} sx={{
            backgroundColor: index === 0 ? 'rgb(36, 36, 36)' : 'rgb(230, 230, 230)',
            color: index === 0 ? 'white' : 'rgb(36, 36, 36)',
            borderRadius: '20px',
            px: 2,
            py: 1,
            mr: 1,
            fontSize: '0.9rem',
            whiteSpace: 'nowrap'
          }}>
            {channel}
          </Box>
        ))}
      </Box>
      
      <Box sx={{ mt: 2 }}>
        {posts.map(post => (
          <Post
            key={post.id}
            author={post.author}
            text={post.text}
            likes={post.likes}
            isLiked={post.isLiked}
            onLike={() => handleLike(post.id)}
            music={post.music}
          />
        ))}
      </Box>
      
      <Box sx={{
        backgroundColor: 'rgb(255, 255, 255)',
        borderRadius: '15px',
        padding: '15px',
        marginTop: '20px'
      }}>
        <Typography sx={{ fontWeight: 'bold', mb: 1 }}>Статистика группы</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="body2">Участники</Typography>
            <Typography variant="h6">1,245</Typography>
          </Box>
          <Box>
            <Typography variant="body2">Онлайн</Typography>
            <Typography variant="h6">87</Typography>
          </Box>
          <Box>
            <Typography variant="body2">Посты</Typography>
            <Typography variant="h6">356</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Group;