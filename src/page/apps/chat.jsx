import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Avatar, List, ListItem, ListItemAvatar, ListItemText, Divider, useMediaQuery, Paper, Chip } from '@mui/material';
import { Add as AddIcon, Search as SearchIcon } from '@mui/icons-material';
import axios from '../../system/axios';

const chat = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useMediaQuery('(max-width:900px)');

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    try {
      const response = await axios.get('/chats');
      setChats(response.data);
    } catch (error) {
      console.error('Ошибка загрузки чатов:', error);
    } finally {
      setLoading(false);
    }
  };

  const createNewChat = async () => {
    // Здесь можно добавить логику создания нового чата
    console.log('Создание нового чата');
  };
    
  return (
    <Box     sx={{
        width: isMobile ? '100vw' : '750px',
        maxWidth: isMobile ? '100vw' : '750px',
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
        
      }}>
 

      {loading ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography sx={{ color: '#666' }}>Загрузка чатов...</Typography>
        </Box>
      ) : chats.length === 0 ? (
        <Paper sx={{
          p: 4,
          textAlign: 'center',
          bgcolor: 'rgb(37,37,37)',
          borderRadius: 2
        }}>
          <Typography variant="h6" sx={{ color: '#666', mb: 1 }}>
            Нет чатов
          </Typography>
          <Typography sx={{ color: '#888' }}>
            Начните новый чат, чтобы общаться с другими пользователями
          </Typography>
        </Paper>
      ) : (
        chats.map((chat) => {
          const otherParticipant = chat.participants.find(p => p._id !== chat.participants[0]?._id);
          const unreadCount = chat.unreadCount || 0;
          
          return (
            <Paper 
              key={chat._id}
              sx={{ 
                bgcolor: 'rgb(37,37,37)', 
                borderRadius: 2, 
                mb: 1,
                '&:hover': { bgcolor: 'rgb(45,45,45)' }
              }}
            >
              <ListItem 
                alignItems="flex-start" 
                sx={{ px: 2, py: 1.5 }}
                button
                onClick={() => {
                  // Переход к чату
                  window.location.href = `/game?chat=${chat._id}`;
                }}
              >
                <ListItemAvatar>
                  <Avatar 
                    src={otherParticipant?.avatarUrl || ""}
                    sx={{ bgcolor: 'rgb(237,89,26)' }}
                  >
                    {otherParticipant?.fullName?.charAt(0) || 'U'}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                      <Typography sx={{ color: '#fff', fontWeight: 'bold' }}>
                        {chat.type === 'private' ? otherParticipant?.fullName : chat.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {unreadCount > 0 && (
                          <Chip 
                            label={unreadCount} 
                            size="small" 
                            sx={{ 
                              bgcolor: 'rgb(237,89,26)', 
                              color: 'white',
                              fontSize: '0.7rem',
                              height: 20
                            }} 
                          />
                        )}
                        <Typography sx={{ color: '#666', fontSize: '0.8rem' }}>
                          {new Date(chat.lastMessageTime).toLocaleDateString('ru-RU', {
                            day: '2-digit',
                            month: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </Typography>
                      </Box>
                    </Box>
                  }
                  secondary={
                    <Typography sx={{ color: '#B0B0B0' }} noWrap>
                      {chat.lastMessage?.content || "Нет сообщений"}
                    </Typography>
                  }
                />
              </ListItem>
            </Paper>
          );
        })
      )}
    </Box>
  );
};

export default chat;
