import React from 'react';
import { 
  Container, 
  Box, 
  TextField, 
  Button, 
  Typography, 
  createTheme, 
  ThemeProvider, 
  GlobalStyles 
} from '@mui/material';
import { keyframes } from '@mui/system'; // Утилита для keyframes

const dark1 = 'rgb(27, 27, 27)'; // #1B1B1B
const dark2 = 'rgb(32, 32, 32)'; // #202020
const dark3 = 'rgb(38, 38, 38)'; // #262626
const primaryOrange = 'rgb(237, 89, 26)'; // #ED591A
const primaryOrangeHover = 'rgb(215, 79, 20)'; // Чуть темнее для :hover

const animatedItBackground = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const darkTheme = createTheme({
  palette: {
    mode: 'dark', // Включаем темный режим
    primary: {
      main: primaryOrange, // Наш оранжевый цвет кнопки
    },
    background: {
      default: dark2, // Фон всей страницы
      paper: dark1,   // Фон карточки логина
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B0B0B0',
    }
  },
  typography: {
    // Используем "SF" (San Francisco) и системные шрифты
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif'
    ].join(','),
    h4: {
      fontWeight: 700, // Делаем заголовок жирным
      textAlign: 'center',
    }
  },
  components: {
    // Стилизуем все текстовые поля
    MuiTextField: {
      styleOverrides: {
        root: {
          // Фон инпута
          '& .MuiOutlinedInput-root': {
            backgroundColor: dark3,
          },
        },
      },
    },
  },
});

// --- 4. Компонент LoginPage ---
const LoginPagePro = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      {/* GlobalStyles применяет стили ко всему документу,
        идеально для анимированного фона.
      */}
      <GlobalStyles 
        styles={{
          body: {
            margin: 0,
            padding: 0,
            height: '100vh',
            width: '100vw',
            // Плавный градиент из твоих темных цветов
            background: `linear-gradient(135deg, ${dark1}, ${dark2}, ${dark3})`,
            backgroundSize: '400% 400%',
            // Применяем анимацию
            animation: `${animatedItBackground} 15s ease infinite`,
          }
        }}
      />
      
      {/* Container центрирует наш контент по горизонтали */}
      <Container 
        component="main" 
        maxWidth="xs" // Задает фиксированную узкую ширину (Extra Small)
        sx={{
          // Используем flex, чтобы идеально отцентрировать по вертикали
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Box - это "карточка" нашей формы */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: 'background.paper', // Берет цвет (dark1) из темы
            padding: { xs: 3, md: 5 }, // Адаптивный padding
            borderRadius: 3, // Более мягкие углы
            boxShadow: '0 15px 40px rgba(0, 0, 0, 0.7)', // Глубокая тень
            border: `1px solid ${dark3}` // Еле заметная рамка
          }}
        >
          {/* 5. Заголовок */}
          <Typography component="h4" variant="h4" sx={{ mb: 3 }}>
            Professional Picasso
          </Typography>
          
          {/* 6. Форма */}
          <Box component="form" noValidate sx={{ width: '100%', mt: 1 }}>
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Логин"
              name="username"
              autoComplete="username"
              autoFocus
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Пароль"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            
            {/* 7. Кнопка "Войти" */}
            <Button
              type="submit"
              fullWidth
              variant="contained" // "Залитая" кнопка
              color="primary"      // Использует наш оранжевый
              sx={{
                mt: 3, // margin-top
                mb: 2, // margin-bottom
                padding: '12px',
                fontSize: '1.1rem',
                borderRadius: 50,
                fontWeight: 'bold',
                // Кастомный hover-эффект
                '&:hover': {
                  backgroundColor: primaryOrangeHover,
                }
              }}
            >
              begin
            </Button>
            
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default LoginPagePro;