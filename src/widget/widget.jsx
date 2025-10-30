import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Avatar,
  Divider,
} from '@mui/material';
import axios from '../system/axios';
import { useSelector } from 'react-redux';
import { selectUser } from '../system/redux/slices/getme';

const WidgetMain = React.memo(() => {
  const navigate = useNavigate();
  const user = useSelector(selectUser);

  const [channels, setChannels] = useState([]);
  const [loadingChannels, setLoadingChannels] = useState(true);
  const [errorChannels, setErrorChannels] = useState('');

  // Загружаем каналы
  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const res = await axios.get('/channels');
        setChannels(res.data);
        setLoadingChannels(false);
      } catch (err) {
        setErrorChannels('Не удалось загрузить каналы');
        setLoadingChannels(false);
      }
    };
    fetchChannels();
  }, []);

  // Если юзер не залогинен
  if (!user) {
    return (
      <Box sx={{ width: 280, color: 'white', p: 2 }}>
        <Typography>Вы не авторизованы</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: '280px',
        minWidth: '280px',
        height: '100vh',
        overflowY: 'auto',
        position: 'relative',
        ml:1,
        mt:-1.2,
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      {/* Панель профиля */}
      <Box
        sx={{
          width: '100%',
        
          bgcolor: 'rgba(35,35,35,1)',
          borderRadius: 4,
          p: 2,
          color: 'white',
          mt: 2,
        }}
      >
        {/* Верхняя часть */}
        <Box display="flex" alignItems="center" gap={1} sx={{mt:-0.1}}>
          <Avatar
            src={user.avatarUrl ? `https://atomglidedev.ru${user.avatarUrl}` : ''}
            sx={{ width: 65, height: 65, border: '2px solid #333' }}
          />
          <Box>
            <Typography sx={{ fontWeight: 'bold',fontSize:'20px' ,mb:0,fontFamily:'sf',fontWeight:'bold'}}>{user.fullName || user.username}</Typography>
            <Typography sx={{ color: 'gray', fontSize: 14 ,mt:-0.6}}>
              {user.username}
            </Typography>
          </Box>
        </Box>

    


        {/* Кнопка */}
    <Button
  fullWidth
  onClick={() => navigate(`/account/${user.id || user._id}`)}
  sx={{
    background: 'rgb(237,93,25)',
    color: 'white',
    pt: 0.5,
    pb: 0.7,
    fontFamily: "sf",
    fontWeight: 'bold',
    mt: 2,
    fontSize:'20px',
    textTransform: 'none', 
    borderRadius: 50,
    '&:hover': {
      background: 'rgb(237,93,25)',
    },
  }}
>
  Открыть профиль
</Button>
      </Box>

      {/* Панель топ каналов */}
      <Box
        sx={{
          width: '100%',
          bgcolor: 'rgba(35,35,35,1)',
          borderRadius: 4,
          p: 2,
          color: 'white',
          mt: 1,
        }}
      >
        <Typography sx={{ fontWeight: 'bold', mb: 1 ,fontFamily:'sf'}}>Топ каналов</Typography>

        {loadingChannels ? (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <CircularProgress size={24} sx={{ color: 'white' }} />
          </Box>
        ) : errorChannels ? (
          <Typography sx={{ color: 'red', fontSize: 13 }}>{errorChannels}</Typography>
        ) : channels.length === 0 ? (
          <Typography sx={{ color: 'gray', fontSize: 14 }}>Каналов пока нет…</Typography>
        ) : (
          <Box display="flex" flexDirection="column" gap={1}>
            {channels.slice(0, 8).map((ch) => (
              <Box
                key={ch._id}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                sx={{
                  bgcolor: 'rgba(217, 217, 217, 0.18)',
                  p: 1,
                  borderRadius: 50,
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'rgba(40,40,40,1)' },
                }}
                onClick={() => navigate(`/channel/${ch._id}`)}
              >
                <Box display="flex" alignItems="center" gap={1.2} >
                  <Avatar src={ch.avatarUrl} sx={{ width: 40, height: 40 }} />
                  <Box>
                    <Typography sx={{ fontSize: 14, fontWeight: 'bold' }}>
                      {ch.name}
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: 'gray' }}>
                      {ch.nick}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
});

export default WidgetMain;
