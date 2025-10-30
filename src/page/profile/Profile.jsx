import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  useMediaQuery, 
  Button, 
  Divider, 
  IconButton, 
  Tooltip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import axios from '../../system/axios';
import userService from '../../system/userService';
import PostPhoto from '../main/post/PostPhoto';
import PostHeaderAcc from '../main/post/PostHeadeAcc';
import PostText from '../main/post/PostText';
import '../../fonts/stylesheet.css';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

function formatDateRu(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date)) return dateString;
  return date.toLocaleDateString('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

const VerifiedBadgeSVG = ({ size = 22 }) => (
  <span style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: 4 }}>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width={size} height={size} style={{ display: 'inline' }}>
      <polygon fill="#42a5f5" points="29.62,3 33.053,8.308 39.367,8.624 39.686,14.937 44.997,18.367 42.116,23.995 45,29.62 39.692,33.053 39.376,39.367 33.063,39.686 29.633,44.997 24.005,42.116 18.38,45 14.947,39.692 8.633,39.376 8.314,33.063 3.003,29.633 5.884,24.005 3,18.38 8.308,14.947 8.624,8.633 14.937,8.314 18.367,3.003 23.995,5.884"/>
      <polygon fill="#fff" points="21.396,31.255 14.899,24.76 17.021,22.639 21.428,27.046 30.996,17.772 33.084,19.926"/>
    </svg>
  </span>
);

const AdminBadgeSVG = ({ size = 22 }) => (<>
  <span style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: 4 }}>
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline' }}>
      <circle cx="20" cy="20" r="20" fill="url(#paint0_linear_25_31)"/>
      <line x1="18" y1="7" x2="18" y2="19" stroke="#FFCC00" strokeWidth="2"/>
      <line x1="23" y1="21" x2="23" y2="33" stroke="#FFE100" strokeWidth="2"/>
      <line x1="34" y1="18" x2="22" y2="18" stroke="#FFCC00" strokeWidth="2"/>
      <line x1="19" y1="22" x2="7" y2="22" stroke="#FFCC00" strokeWidth="2"/>
      <defs>
        <linearGradient id="paint0_linear_25_31" x1="26" y1="1.5" x2="10" y2="37.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F6A800"/>
          <stop offset="1" stopColor="#CC9910"/>
        </linearGradient>
      </defs>
    </svg>
  </span>
</>);

const StatusBadge = ({ profile, size = 22 }) => {
  if (profile.accountType === 'admin') return <><VerifiedBadgeSVG size={size} /><AdminBadgeSVG size={size} /></>;
  if (profile.accountType === 'verified_user' || profile.verified === 'verified') return <VerifiedBadgeSVG size={size} />;
  return null;
};


const Profile = () => {
  const isMobile = useMediaQuery('(max-width:900px)');
  const { id } = useParams();
  const navigate = useNavigate();
  const [state, setState] = useState({
    user: null,
    posts: [],
    isSubscribed: false,
    followersCount: 0,
    subscriptionsCount: 0,
    isLoading: true,
    error: null,
    loadingPosts: true,
    purchases: [],
    pinnedNfts: [],
    hiddenNfts: []  
  });
  const [copied, setCopied] = useState({ username: false, regdate: false, id: false, about: false });
  const [isSubscribing, setIsSubscribing] = useState(false);


  const [selectedNft, setSelectedNft] = useState(null);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [transferData, setTransferData] = useState({ userId: '', price: '' });

  const [myId, setMyId] = useState(null);

  
useEffect(() => {
  const fetchMe = async () => {
    const token = localStorage.getItem("token");
    console.log("DEBUG token:", token); 
    if (!token) return;

    try {
      const res = await fetch("https://atomglidedev.ru/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("DEBUG res.status:", res.status); 

      if (!res.ok) {
        const text = await res.text();
        console.warn("DEBUG response text:", text); 
        return;
      }

      const data = await res.json();
      console.log("DEBUG /auth/me response:", data); 

      setMyId(data._id || data.id);
    } catch (err) {
      console.error("Ошибка получения /auth/me:", err);
    }
  };

  fetchMe();
}, []);

useEffect(() => {
  const fetchData = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const [profileData, postsRes, purchasesRes] = await Promise.all([
        userService.getUserById(id),
        axios.get(`/posts/user/${id}`),
        axios.get(`/${id}/purchases`)
      ]);

      const userData = profileData;


let pinnedNftsData = [];
if (Array.isArray(userData.pinnedNfts) && userData.pinnedNfts.length > 0) {
  pinnedNftsData = await Promise.all(
    userData.pinnedNfts.map(id => 
      axios.get(`/nft/${id}`).then(res => res.data).catch(() => null)
    )
  );
  pinnedNftsData = pinnedNftsData.filter(nft => nft !== null);
}


      setState(prev => ({
        ...prev,
        user: userData,
        posts: postsRes.data || [],
        purchases: purchasesRes.data || [],
          pinnedNfts: pinnedNftsData, 

        hiddenNfts: userData.hiddenNfts || [],
        isLoading: false,
        loadingPosts: false
      }));
    } catch (err) {
      console.error('Ошибка загрузки профиля:', err);
      setState(prev => ({
        ...prev,
        isLoading: false,
        loadingPosts: false,
        error: err.response?.data?.message || err.message || 'Ошибка загрузки данных'
      }));
    }
  };

  if (id) fetchData();
}, [id]);

  const handleSubscribe = async () => {
    try {
      setIsSubscribing(true);
      const token = userService.getToken();
      if (!token) return navigate('/login');
      
      const method = state.isSubscribed ? 'delete' : 'post';
      await axios[method](`/auth/${state.isSubscribed ? 'unsubscribe' : 'subscribe'}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setState(prev => ({
        ...prev,
        isSubscribed: !prev.isSubscribed,
        followersCount: prev.isSubscribed 
          ? prev.followersCount - 1 
          : prev.followersCount + 1
      }));
    } catch (err) {
      console.error('Ошибка подписки:', err);
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleCopy = (key, value) => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(prev => ({ ...prev, [key]: true }));
      setTimeout(() => setCopied(prev => ({ ...prev, [key]: false })), 1500);
    });
  };

  const handlePinNft = async (nft) => {
    if (state.pinnedNfts.length >= 5) return alert("Можно закрепить максимум 5 NFT");
    try {
      const token = userService.getToken();
      await axios.post(`/nft/${nft._id}/pin`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setState(prev => ({ ...prev, pinnedNfts: [...prev.pinnedNfts, nft] }));
      alert("NFT закреплён!");
    } catch (err) {
      console.error(err);
      alert("Ошибка при закреплении NFT");
    }
  };

  const handleUnpinNft = async (nft) => {
    try {
      const token = userService.getToken();
      await axios.delete(`/nft/${nft._id}/pin`, { headers: { Authorization: `Bearer ${token}` } });
      setState(prev => ({ ...prev, pinnedNfts: prev.pinnedNfts.filter(p => p._id !== nft._id) }));
      alert("NFT убран из закреплённых");
    } catch (err) {
      console.error(err);
      alert("Ошибка при снятии NFT");
    }
  };

  const handleTransferSubmit = async () => {
    try {
      const token = userService.getToken();
   

   await axios.post(
  "/transfer",
  { nftId: selectedNft._id, buyerUsername: transferData.userId },
  { headers: { Authorization: `Bearer ${token}` } }
);

      alert("NFT успешно передан!");
      setIsTransferOpen(false);
      setSelectedNft(null);
      setTransferData({ userId: "" });
          window.location.reload();

    } catch (err) {

      alert("Ошибка передачи NFT. Внимание данная функция в долгом бета тестировании и может работать некорректно, войдите заново в аккаунт и попробуйте ещё раз. Или просто перезагрузите страницу. ИЛИ ПРОВЕРЬТЕ ПРАВИЛЬНОСТЬ ВВЕДЁННЫХ ДАННЫХ.");
    }
  };

  if (!id) return <Navigate to="/" replace />;
  
  if (state.isLoading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress color="primary" />
    </Box>
  );
  
  if (state.error || !state.user) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: 2, color: 'white' }}>
      <Typography variant="h6">Ошибка: {state.error || 'Пользователь не найден'}</Typography>
      <Button 
        variant="contained" 
        onClick={() => navigate(-1)}
        sx={{
          backgroundColor: 'rgba(56, 64, 73, 1)',
          '&:hover': { backgroundColor: 'rgba(56, 64, 73, 0.8)' }
        }}
      >
        Назад
      </Button>
    </Box>
  );
  if (!id) return <Navigate to="/" replace />;
  
  if (state.isLoading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress color="primary" />
    </Box>
  );
  
  if (state.error || !state.user) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: 2, color: 'white' }}>
      <Typography variant="h6">Ошибка: {state.error || 'Пользователь не найден'}</Typography>
      <Button 
        variant="contained" 
        onClick={() => navigate(-1)}
        sx={{
          backgroundColor: 'rgba(56, 64, 73, 1)',
          '&:hover': { backgroundColor: 'rgba(56, 64, 73, 0.8)' }
        }}
      >
        Назад
      </Button>
    </Box>
  );



  if (!id) return <Navigate to="/" replace />;
  if (state.isLoading) return <Spinner />;
  if (state.error || !state.user) return <ErrorScreen />;

  const profile = state.user;
  const userId = profile?._id || profile?.id || "";

  const isCurrentUser = myId && userId && myId === userId;



    console.log("DEBUG => myId:", myId, "userId:", userId, "isCurrentUser:", isCurrentUser);




  
  const username = profile.username || profile.login || '';
  const regdate = profile.regdate || profile.createdAt || '';
  const about = profile.about || '';
  const avatarUrl = profile.avatarUrl ? `https://atomglidedev.ru${profile.avatarUrl}` : '';
  const coverUrl = profile.coverUrl ? `https://atomglidedev.ru${profile.coverUrl}` : '';
  const awards = profile.awards || [];
  const postsCount = state.posts.length;
  const followersCount = Array.isArray(profile.followers) ? profile.followers.length : state.followersCount;
  const subscriptionsCount = Array.isArray(profile.subscriptions) ? profile.subscriptions.length : state.subscriptionsCount;
  const balance = typeof profile.balance === 'number' ? profile.balance : 0;
  return (
    <Box
      sx={{
        maxWidth: isMobile ? '100vw' : '700px',
        width: isMobile ? '100vw' : '700px',
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
        px: isMobile ? 2 : 0,
        pt: isMobile ? 0 : 0,
        mt: isMobile ? 0 : 0,
      }}
    >
      <Box sx={{ 
        width: '100%', 
        height: '205px', 
        position: 'relative', 
        overflow: 'hidden', 
        
        background: coverUrl ? undefined : 'linear-gradient(120deg, #b2c2e0 0%, #e0e0e0 100%)'
      }}>
        {coverUrl && (
          <img
            src={coverUrl}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            alt="cover"
          />
        )}
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            background: 'linear-gradient(0deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0) 100%)',
            transition: 'background 0.5s'
          }}
        />
        <Box
          component="span"
          sx={{
            position: 'absolute',
            left: '50%',
            top: '48%',
            transform: 'translate(-50%, -50%)',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            boxShadow: 2,
            background: avatarUrl ? 'white' : 'linear-gradient(135deg, #b2c2e0 0%, #e0e0e0 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            fontSize: 38,
            color: '#fff',
            fontWeight: 700,
            fontFamily: 'Inter, Arial, sans-serif',
            userSelect: 'none',
            p: 0
          }}
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="avatar"
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
            />
          ) : (
            <svg width="76" height="76" viewBox="0 0 48 48" fill="none" style={{display:'block'}} xmlns="http://www.w3.org/2000/svg">
              <circle cx="24" cy="24" r="24" fill="#b2c2e0" />
              <path d="M24 14c-4.418 0-8 3.134-8 7s3.582 7 8 7 8-3.134 8-7-3.582-7-8-7zm0 2c3.314 0 6 2.239 6 5s-2.686 5-6 5-6-2.239-6-5 2.686-5 6-5zm0 14c-5.33 0-16 2.686-16 8v2a2 2 0 002 2h28a2 2 0 002-2v-2c0-5.314-10.67-8-16-8zm-14 8c0-3.314 8.954-6 14-6s14 2.686 14 6v2H10v-2z" fill="#fff"/>
            </svg>
          )}
        </Box>
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: '100%',
            height: '30%',
            background: 'linear-gradient(0deg, rgba(0, 0, 0, 0.13) 70%, rgba(0, 0, 0, 0) 100%)',
            borderRadius: '10px',
            zIndex: 0,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            left: '50%',
            top: '165px',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'nowrap',
            color: 'white',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 700,
            letterSpacing: '0.5px',
            fontSize: '25px',
            zIndex: 2
          }}
        >
          <span style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 220, display: 'inline-block'}}>
            {profile.fullName || profile.name || username}
          </span>
          <StatusBadge profile={profile} size={22} />
        </Box>
      </Box>
{state.pinnedNfts.length > 0 && (
  <Box sx={{ mt: 2, mb: 1, display: 'flex', justifyContent: 'center', gap: 1 }}>
    {state.pinnedNfts.slice(0, 5).map((nft) => (
      <Box 
        key={nft._id} 
        sx={{ cursor: 'pointer' }} 
        onClick={() => setSelectedNft(nft)}
      >
        <img 
          src={nft.imageUrl || nft.image || 'https://via.placeholder.com/50'} 
          alt={nft.title || nft.name || 'NFT'} 
          style={{ width: 50, height: 50, borderRadius: 8 }} 
        />
      </Box>
    ))}
  </Box>
)}


      <Box
        sx={{
          width: '100%',
          height: '70px',
          marginTop: isMobile ? '10px' : '10px',
          position: 'relative',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: isMobile ? 2 : 0,
        }}
      >
        <Box sx={{ flex: 1, textAlign: 'center', zIndex: 1 }}>
          <Typography variant="caption" color="rgba(255, 255, 255, 1)">Постов</Typography>
          <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: 'Inter, sans-serif' ,color:"rgba(200, 200, 200, 1)"}}>{postsCount}</Typography>
        </Box>
        <Box sx={{ flex: 1, textAlign: 'center', zIndex: 1 }}>
          <Typography variant="caption" color="rgba(255, 255, 255, 1)">Подписчики</Typography>
          <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: 'Inter, sans-serif',color:"rgba(200, 200, 200, 1)" }}>{followersCount}</Typography>
        </Box>
        <Box sx={{ flex: 1, textAlign: 'center', zIndex: 1 }}>
          <Typography variant="caption" color="rgba(255, 255, 255, 1)">Награды</Typography>
          <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: 'Inter, sans-serif',color:"rgba(200, 200, 200, 1)" }}>{awards.length}</Typography>
        </Box>
        <Box sx={{ flex: 1, textAlign: 'center', zIndex: 1 }}>
          <Typography variant="caption" color="rgba(255, 255, 255, 1)">Подписок</Typography>
          <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: 'Inter, sans-serif',color:"rgba(200, 200, 200, 1)" }}>{Math.max(0, subscriptionsCount)}</Typography>
        </Box>
      </Box>

      {!isCurrentUser && (
        <Button
          sx={{ 
            width: '100%',
            backgroundColor: state.isSubscribed ? 'rgba(194, 194, 194, 1)' : 'white',
            color: 'black',
            borderRadius: '50px',
            marginTop: '10px',
            fontWeight: 'Bold',
            fontSize: '11px',
            '&:hover': {
              backgroundColor: state.isSubscribed ? 'rgba(0,0,0,0.8)' : 'primary.dark'
            }
          }}
          disabled={isSubscribing}
          onClick={handleSubscribe}
        >
          {state.isSubscribed ? 'Отписаться' : 'Подписаться'}
          {isSubscribing && <CircularProgress size={20} color="inherit" sx={{ ml: 1 }} />}
        </Button>
      )}

      <Box sx={{ px: isMobile ? 2 : 0, mt: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography sx={{ fontWeight: 'Bold', paddingLeft: '20px', marginBottom: 0, paddingBottom: 0 ,color:'rgba(196, 196, 196, 1)'}}>Юзернейм</Typography>
          <Tooltip title={copied.username ? 'Скопировано!' : 'Скопировать'}>
            <IconButton size="small" onClick={() => handleCopy('username', username)}>
              {copied.username ? <CheckIcon color="success" fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
        </Box>
        <Typography sx={{ fontFamily: 'Yandex Sans', paddingTop: '0px', paddingLeft: '20px', color: 'rgba(153, 152, 169, 1)' }}>
          {username}
        </Typography>
        <Divider sx={{ my: 1.5 , bgcolor:'rgba(47, 47, 47, 1)' , pl:1,pr:1,borderRadius:'10px'}} />

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography sx={{ fontWeight: 'Bold', paddingLeft: '20px', marginBottom: 0, paddingBottom: 0 , color:'rgba(196, 196, 196, 1)'}}>Дата регистрации</Typography>
          <Tooltip title={copied.regdate ? 'Скопировано!' : 'Скопировать'}>
            <IconButton size="small" onClick={() => handleCopy('regdate', regdate)}>
              {copied.regdate ? <CheckIcon color="success" fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
        </Box>
        <Typography sx={{ fontFamily: 'Yandex Sans', paddingTop: '0px', paddingLeft: '20px', color: 'rgb(96, 93, 125)' }}>
          {formatDateRu(regdate)}
        </Typography>
        <Divider sx={{ my: 1.5 , bgcolor:'rgba(47, 47, 47, 1)' , pl:1,pr:1,borderRadius:'10px'}} />

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography sx={{ fontWeight: 'Bold', paddingLeft: '20px', marginBottom: 0, paddingBottom: 0 , color:'rgba(196, 196, 196, 1)'}}>ID</Typography>
          <Tooltip title={copied.id ? 'Скопировано!' : 'Скопировать'}>
            <IconButton size="small" onClick={() => handleCopy('id', userId)}>
              {copied.id ? <CheckIcon color="success" fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
        </Box>
        <Typography sx={{ fontFamily: 'Yandex Sans', paddingTop: '0px', paddingLeft: '20px', color: 'rgb(96, 93, 125)' }}>
          {userId}
        </Typography>
        <Divider sx={{ my: 1.5 , bgcolor:'rgba(47, 47, 47, 1)' , pl:1,pr:1,borderRadius:'10px'}} />

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography sx={{ fontWeight: 'Bold', paddingLeft: '20px', marginBottom: 0, paddingBottom: 0, color:'rgba(196, 196, 196, 1)'}}>О себе</Typography>
          <Tooltip title={copied.about ? 'Скопировано!' : 'Скопировать'}>
            <IconButton size="small" onClick={() => handleCopy('about', about)}>
              {copied.about ? <CheckIcon color="success" fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
        </Box>
        <Typography sx={{ 
          fontFamily: 'Yandex Sans', 
          paddingTop: '0px', 
          paddingLeft: '20px', 
          color:'rgba(196, 196, 196, 1)',
          fontWeight:800
        }}>
          {about || 'Нет информации'}
        </Typography>
      
        <Divider sx={{ my: 1.5 , bgcolor:'rgba(47, 47, 47, 1)' , pl:1,pr:1,borderRadius:'10px'}} />
   {isCurrentUser && state.hiddenNfts.length > 0 && (
        <Box sx={{ mt: 3, px: 2 }}>
          <Typography sx={{ fontWeight: 'Bold', color: 'rgba(196,196,196,0.7)' }}>Скрытые NFT</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 1 }}>
            {state.hiddenNfts.map((nft) => (
              <Box key={nft._id} sx={{ m: 1, opacity: 0.4, cursor: 'pointer' }} onClick={() => setSelectedNft(nft)}>
                <img src={nft.imageUrl} alt={nft.title} style={{ width: 60, height: 60, borderRadius: 8 }} />
              </Box>
            ))}
          </Box>
        </Box>
      )}
        {isCurrentUser && (
          <>
            <Typography sx={{ fontWeight: 'Bold', paddingLeft: '20px', marginBottom: 0, paddingBottom: 0  , color:'rgba(196, 196, 196, 1)'}}>
              Баланс
            </Typography>
            <Typography sx={{ fontFamily: 'Yandex Sans', paddingTop: '0px', paddingLeft: '20px', color: 'rgb(96, 93, 125)' }}>
              {balance} ATM
            </Typography>
        <Divider sx={{ my: 1.5 , bgcolor:'rgba(47, 47, 47, 1)' , pl:1,pr:1,borderRadius:'10px'}} />
          </>
        )}
    
      <Box sx={{ mt: 2, px: 2 }}>
        <Typography sx={{ fontWeight: 'Bold', color: 'rgba(196,196,196,1)' }}>Купленные NFT</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 1 }}>
          {state.purchases && state.purchases.length > 0 ? state.purchases.map((item, idx) => (
            <Box 
              key={idx} 
              sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', m: 1, cursor:'pointer' }}
              onClick={() => setSelectedNft(item)}
            >
              <img 
                src={item.imageUrl || 'https://via.placeholder.com/60'} 
                alt={item.title || 'gift'} 
                style={{ width: '60px', height: '60px', borderRadius: '8px' }} 
              />
              <Typography sx={{ fontSize: '12px', color:'rgba(196, 196, 196, 1)', mt: 0}}>
                {item.title}
              </Typography>
            </Box>
          )) : <Typography sx={{ color: 'rgba(196,196,196,0.7)' }}>Нет купленных nft </Typography>}
        </Box>
      </Box>
        <Divider sx={{ my: 1.5 , bgcolor:'rgba(47, 47, 47, 1)' , pl:1,pr:1,borderRadius:'10px'}} />
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography sx={{ fontWeight: 'Bold', paddingLeft: '20px', marginBottom: 0, paddingBottom: 0, color:'rgba(196, 196, 196, 1)'}}>Проекты пользователя</Typography>
          <Tooltip title={copied.about ? 'Скопировано!' : 'Скопировать'}>
            <IconButton size="small" onClick={() => handleCopy('about', about)}>
              {copied.about ? <CheckIcon color="success" fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
        </Box>
        <Typography sx={{ 
          fontFamily: 'Yandex Sans', 
          paddingTop: '0px', 
          paddingLeft: '20px', 
          color:'rgba(196, 196, 196, 1)',
          fontWeight:800
        }}>
          {about || 'Нет'}
        </Typography>
                <Divider sx={{ my: 1.5 , bgcolor:'rgba(47, 47, 47, 1)' , pl:1,pr:1,borderRadius:'10px'}} />

        <Dialog
  open={!!selectedNft && !isTransferOpen}
  onClose={() => setSelectedNft(null)}
  maxWidth="sm"
  fullWidth
  PaperProps={{
    sx: {
      bgcolor: 'rgba(28,28,28,1)',
      color: 'white',
      borderRadius: 3,
      textAlign: 'center',
      width: isMobile ? '90%' : 400,
      p: 4,
    },
  }}
>
  <DialogContent>
    <center>
      <img
        src={selectedNft?.imageUrl}
        style={{ width: '120px', height: '120px', borderRadius: 8, marginBottom: '10px' }}
        alt={selectedNft?.title}
      />
    </center>
    <Typography sx={{ color: 'white', fontWeight: '600', fontSize: 18 }}>
      {selectedNft?.title}
    </Typography>
    <Typography sx={{ color: 'gray', fontSize: 14, mb: 1 }}>
      {selectedNft?.description}
    </Typography>

    <Table sx={{ color: 'white', mb: 2 }}>
      <TableBody>
        <TableRow>
          <TableCell sx={{ color: 'white', fontSize: 15 }}>Цена:</TableCell>
          <TableCell sx={{ color: 'gold', fontSize: 16 }}>{selectedNft?.price} atm</TableCell>
        </TableRow>
        <TableRow>
          <TableCell sx={{ color: 'white', fontSize: 15 }}>Владелец:</TableCell>
          <TableCell sx={{ color: 'gray', fontSize: 15 }}>{selectedNft?.owner}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell sx={{ color: 'white', fontSize: 15 }}>Налог:</TableCell>
          <TableCell sx={{ color: 'gray', fontSize: 15 }}>0 atm</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </DialogContent>

  {isCurrentUser && (
    <DialogActions>
      <Button onClick={() => handlePinNft(selectedNft)} sx={{ color: '#be8221ff' }}>
        Закрепить
      </Button>
      <Button onClick={() => handleUnpinNft(selectedNft)} sx={{ color: '#8b611dff' }}>
        Убрать
      </Button>
      <Button variant="contained" onClick={() => setIsTransferOpen(true)} sx={{ background: '#be8221ff' }}>
        Передать
      </Button>
    </DialogActions>
  )}
</Dialog>

<Dialog
  open={isTransferOpen}
  onClose={() => setIsTransferOpen(false)}
  maxWidth="sm"
  fullWidth
  PaperProps={{
    sx: {
      bgcolor: 'rgba(28,28,28,1)', 
      color: 'white',              
    },
  }}
>
  <DialogTitle>Передача NFT</DialogTitle>
  <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
    <TextField
      label="Ник пользователя"
      value={transferData.userId}
      onChange={(e) => setTransferData({ ...transferData, userId: e.target.value })}
      fullWidth
     
    />
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setIsTransferOpen(false)} sx={{color:"#be8221ff"}}>Отмена</Button>
    <Button
      variant="contained"
      onClick={handleTransferSubmit}
      sx={{ background: '#be8221ff' }}
    >
      Отправить
    </Button>
  </DialogActions>
</Dialog>

        <Typography sx={{ fontWeight: 'Bold', paddingLeft: '20px', marginBottom: 0, paddingBottom: 0 , color:'rgba(196, 196, 196, 1)'}}>Награды</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 1 }}>
          {awards.length > 0 ? awards.map((award, idx) => (
            <Box key={idx} sx={{ display: 'flex', alignItems: 'center', m: 1 }}>
              <img 
                src={award.image || 'https://www.pngarts.com/files/12/Award-PNG-Pic.png'} 
                style={{ width: '60px', height: '60px', marginRight: '10px' }} 
                alt={award.title || 'award'} 
              />
              <Box>
                <Typography sx={{ fontFamily: 'Yandex Sans', fontSize: '16px', color:'rgba(196, 196, 196, 1)',fontWeight:'Bold'}}>{award.title}</Typography>
                <Typography sx={{ fontFamily: 'Yandex Sans', fontWeight: 'Light', color: 'rgb(126, 126, 126)', fontSize: '12px' }}>
                  {award.description}
                </Typography>
              </Box>
            </Box>
          )) : <Typography sx={{ ml: 2 }}>Нет наград</Typography>}
        </Box>
      </Box>

      <Box sx={{ mt: 3, px: isMobile ? 2 : 0 }}>
        <Typography variant="h6" sx={{ 
          fontWeight: 'bold', 
          mb: 2, 
          px: 2,
          display: 'flex',
          alignItems: 'center',
          color:'rgba(255, 255, 255, 1)'
        }}>
          Посты пользователя
          {state.loadingPosts && (
            <CircularProgress size={20} sx={{ ml: 1 }} />
          )}
        </Typography>

        {state.posts.length === 0 && !state.loadingPosts ? (
          <Typography sx={{ textAlign: 'center', color: 'text.secondary', py: 3 }}>
            Пользователь еще не создал ни одного поста
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {state.posts.map((post) => (
              <Box 
                key={post._id} 
                sx={{ 
                        backgroundColor: 'rgba(17, 17, 17, 0)',
      borderTop: "solid rgba(54, 54, 54, 1) 1px",
      borderRadius: 1,
                  borderRadius: 2,
                  boxShadow: 1,
                  p: 2
                }}
              >
                <PostHeaderAcc post={post} />
                    {post.imageUrl && (
                  <PostPhoto post={post} />
                )}
               <PostText>
            <span style={{ fontSize: '1rem', fontWeight: 200 }}>
              {post.title || 'Этот пост не имеет текст :/'}
            </span>
          </PostText>
                
                
            
                
             
              </Box>
            ))}
          </Box>
        )}
      </Box>

      <Typography
        sx={{
          fontSize: '10px',
          color: 'rgb(120,120,120)',
          marginTop: '10px',
          marginBottom: '30px',
          marginLeft: '1px',
          fontFamily: "'JetBrains Mono', monospace",
          width: '100%',
          textAlign: 'center'
        }}
      >
        Данные от AtomGlide Network
      </Typography>
    </Box>
  );
};

export default Profile;