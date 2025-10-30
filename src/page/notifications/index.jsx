import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  IconButton,
  Divider,
  Paper,
  Button,
  useMediaQuery
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  MarkEmailRead as MarkReadIcon,
  Delete as DeleteIcon,
  Message as MessageIcon,
  PersonAdd as PersonAddIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import axios from '../../system/axios';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useMediaQuery('(max-width:900px)');

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const response = await axios.get('/notifications');
      setNotifications(response.data);
    } catch (error) {
      console.error('Ошибка загрузки уведомлений:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationIds) => {
    try {
      await axios.post('/notifications/read', { notificationIds });
      setNotifications(prev => 
        prev.map(notif => 
          notificationIds.includes(notif._id) 
            ? { ...notif, isRead: true, readAt: new Date() }
            : notif
        )
      );
    } catch (error) {
      console.error('Ошибка отметки уведомлений:', error);
    }
  };

  const markAllAsRead = async () => {
    const unreadIds = notifications
      .filter(notif => !notif.isRead)
      .map(notif => notif._id);
    
    if (unreadIds.length > 0) {
      await markAsRead(unreadIds);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'message':
        return <MessageIcon sx={{ color: 'rgb(237,89,26)' }} />;
      case 'chat_invite':
        return <PersonAddIcon sx={{ color: '#4CAF50' }} />;
      case 'system':
        return <SettingsIcon sx={{ color: '#2196F3' }} />;
      case 'mention':
        return <NotificationsIcon sx={{ color: '#FF9800' }} />;
      default:
        return <NotificationsIcon sx={{ color: '#666' }} />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'message':
        return 'rgb(237,89,26)';
      case 'chat_invite':
        return '#4CAF50';
      case 'system':
        return '#2196F3';
      case 'mention':
        return '#FF9800';
      default:
        return '#666';
    }
  };

  const formatDate = (date) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffInHours = (now - notificationDate) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Только что';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} ч. назад`;
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)} дн. назад`;
    } else {
      return notificationDate.toLocaleDateString('ru-RU');
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh' 
      }}>
        <Typography>Загрузка уведомлений...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{
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
      px: 1,
    }}>
      {/* Заголовок */}
      <Paper sx={{
        p: 2,
        mb: 2,
        bgcolor: 'rgb(37,37,37)',
        borderRadius: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="h5" sx={{ color: '#fff', fontWeight: 'bold' }}>
          Уведомления
        </Typography>
        <Button
          variant="contained"
          startIcon={<MarkReadIcon />}
          onClick={markAllAsRead}
          disabled={notifications.every(notif => notif.isRead)}
          sx={{
            bgcolor: 'rgb(237,89,26)',
            '&:hover': { bgcolor: 'rgb(215,79,20)' },
            '&:disabled': { bgcolor: '#666' }
          }}
        >
          Отметить все как прочитанные
        </Button>
      </Paper>

      {/* Список уведомлений */}
      {notifications.length === 0 ? (
        <Paper sx={{
          p: 4,
          textAlign: 'center',
          bgcolor: 'rgb(37,37,37)',
          borderRadius: 2
        }}>
          <NotificationsIcon sx={{ fontSize: 64, color: '#666', mb: 2 }} />
          <Typography variant="h6" sx={{ color: '#666' }}>
            Нет уведомлений
          </Typography>
          <Typography sx={{ color: '#888', mt: 1 }}>
            Здесь будут появляться уведомления о новых сообщениях и событиях
          </Typography>
        </Paper>
      ) : (
        <List sx={{ bgcolor: 'transparent' }}>
          {notifications.map((notification, index) => (
            <React.Fragment key={notification._id}>
              <ListItem
                sx={{
                  bgcolor: notification.isRead ? 'transparent' : 'rgb(37,37,37)',
                  borderRadius: 2,
                  mb: 1,
                  border: notification.isRead ? 'none' : '1px solid rgb(237,89,26)',
                  '&:hover': { bgcolor: 'rgb(45,45,45)' }
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ 
                    bgcolor: getNotificationColor(notification.type),
                    width: 48,
                    height: 48
                  }}>
                    {getNotificationIcon(notification.type)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Typography sx={{ 
                        color: '#fff', 
                        fontWeight: notification.isRead ? 'normal' : 'bold',
                        fontSize: '1rem'
                      }}>
                        {notification.title}
                      </Typography>
                      {!notification.isRead && (
                        <Chip 
                          label="Новое" 
                          size="small" 
                          sx={{ 
                            bgcolor: 'rgb(237,89,26)', 
                            color: 'white',
                            fontSize: '0.7rem',
                            height: 20
                          }} 
                        />
                      )}
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography sx={{ 
                        color: '#B0B0B0', 
                        fontSize: '0.9rem',
                        mb: 1
                      }}>
                        {notification.content}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography sx={{ 
                          color: '#666', 
                          fontSize: '0.8rem' 
                        }}>
                          {formatDate(notification.createdAt)}
                        </Typography>
                        {!notification.isRead && (
                          <IconButton
                            size="small"
                            onClick={() => markAsRead([notification._id])}
                            sx={{ color: 'rgb(237,89,26)' }}
                          >
                            <MarkReadIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                    </Box>
                  }
                />
              </ListItem>
              {index < notifications.length - 1 && (
                <Divider sx={{ borderColor: '#1f1f1f', my: 1 }} />
              )}
            </React.Fragment>
          ))}
        </List>
      )}
    </Box>
  );
};

export default NotificationsPage;


