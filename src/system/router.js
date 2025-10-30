import React, { Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Box, useMediaQuery, CircularProgress } from '@mui/material';
import { useSelector } from 'react-redux';
import { selectUser } from '../system/redux/slices/getme';
import { useUser } from '../components/UserProvider';
import { useState } from 'react';
import { useEffect } from "react";

import Sitebar from '../sitebar';
import Apps from '../page/apps';
import Store from '../page/apps/store.jsx';
import AtomsClicker from '../page/apps/game.jsx';
import Chat from '../page/apps/chat.jsx';
import RequestsPage from "../page/profile/RequestsPage.jsx";
import MobileSettings from '../widget/setting.jsx';
import WidgetMain from '../widget/widget';
import Main from '../page/main/main';
import Reting from '../page/reting/index.jsx';
import ChannelsList from "../page/channel/ChannelsList";
import ChannelPage from "../page/channel/ChannelPage";
import Wallet from '../page/wallet';
import Profile from '../page/profile/Profile';
import Fullpost from '../page/fullPost/fullpost.jsx';
import ChannelCreatePage from "../page/channel/CreateChannelPage";

const Channel = React.lazy(() => import('../page/channel/channel.jsx'));
const LoginPage = React.lazy(() => import('../page/login'));
const RegistrationPage = React.lazy(() => import('../page/registration'));
const NotFound = React.lazy(() => import('../page/profile/NotFound'));
const CommentsStreamPage = React.lazy(() => import('../page/comments-stream'));
import Moda from '../page/apps/mod.jsx';
import axios from "./axios.js";

const GamePage = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token"); 
        const res = await axios.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Ошибка получения данных пользователя:", err);
        setError("Не удалось получить данные пользователя");
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen text-gray-900">
      <h1 className="text-3xl font-bold mb-6">DEBUG</h1>

      <div className="bg-white rounded-2xl shadow p-4 mb-8">
        <h3 className="text-lg font-semibold mb-3">
         
        </h3>
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-3 py-2 text-left">
                Название параметра
              </th>
              <th className="border border-gray-300 px-3 py-2 text-left">
                Значение
              </th>
            </tr>
          </thead>
          <tbody>
            <tr  className="hover:bg-gray-50">
                <td className="border border-gray-300 px-3 py-1">Product Name</td>
                <td className="border border-gray-300 px-3 py-1">AtomGlide</td>
              </tr>
               <tr  className="hover:bg-gray-50">
                <td className="border border-gray-300 px-3 py-1">Product Version</td>
                <td className="border border-gray-300 px-3 py-1">11.9.5</td>
              </tr> <tr  className="hover:bg-gray-50">
                <td className="border border-gray-300 px-3 py-1">Product ID</td>
                <td className="border border-gray-300 px-3 py-1">36478293747</td>
              </tr> <tr  className="hover:bg-gray-50">
                <td className="border border-gray-300 px-3 py-1">Owner</td>
                <td className="border border-gray-300 px-3 py-1">DK Studio</td>
              </tr> <tr  className="hover:bg-gray-50">
                <td className="border border-gray-300 px-3 py-1">API </td>
                <td className="border border-gray-300 px-3 py-1">AtomGlide API 11</td>
              </tr> <tr  className="hover:bg-gray-50">
                <td className="border border-gray-300 px-3 py-1">API Version</td>
                <td className="border border-gray-300 px-3 py-1">11</td>
              </tr> <tr  className="hover:bg-gray-50">
                <td className="border border-gray-300 px-3 py-1">Hoster</td>
                <td className="border border-gray-300 px-3 py-1">Amazon</td>
              </tr> <tr  className="hover:bg-gray-50">
                <td className="border border-gray-300 px-3 py-1">Beta Version</td>
                <td className="border border-gray-300 px-3 py-1">1</td>
              </tr> <tr  className="hover:bg-gray-50">
                <td className="border border-gray-300 px-3 py-1">IN</td>
                <td className="border border-gray-300 px-3 py-1">30.10.2025 23:00:00</td>
              </tr> <tr  className="hover:bg-gray-50">
                <td className="border border-gray-300 px-3 py-1">OUT</td>
                <td className="border border-gray-300 px-3 py-1">31.10.2025 23:00:00</td>
              </tr> 
          </tbody>
        </table>
      </div>

      <div className="bg-white rounded-2xl shadow p-4">
        <h3 className="text-lg font-semibold mb-3">
          Данные пользователя (из /auth/me)
        </h3>

        {error && <p className="text-red-500">{error}</p>}

        {!user && !error && <p>Загрузка данных...</p>}

        {user && (
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <tbody>
              <tr>
                <td className="border border-gray-300 px-3 py-2 font-semibold">
                  Полное имя
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  {user.fullName}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2 font-semibold">
                  Username
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  {user.username}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2 font-semibold">
                  Баланс
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  {user.balance}₽
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2 font-semibold">
                  Тип аккаунта
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  {user.accountType}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2 font-semibold">
                  Подписчики
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  {user.followers?.length || 0}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2 font-semibold">
                  Подписки
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  {user.subscriptions?.length || 0}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2 font-semibold">
                  Создан
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  {new Date(user.createdAt).toLocaleString()}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2 font-semibold">
                  Последнее обновление
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  {new Date(user.updatedAt).toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};


const LoadingFallback = () => (
  <Box sx={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    color: 'white'
  }}>
    <CircularProgress color="primary" />
  </Box>
);

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <Box sx={{ color: 'red', padding: 4 }}>Ошибка загрузки компонента</Box>;
    }
    return this.props.children;
  }
}

const AppRouter = () => {
  const isMobile = useMediaQuery('(max-width:900px)');
  const location = useLocation();
  const user = useSelector(selectUser);
  const { isLoading } = useUser();

  const isAuthPage = ['/login', '/registration', '/propicasso/login'].includes(location.pathname);

  if (isLoading) {
    return <LoadingFallback />;
  }

  return (
    <>
      {!isAuthPage && <Sitebar />}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'nowrap',
          justifyContent: 'center',
          alignItems: isMobile ? 'stretch' : 'flex-start',
          alignContent: 'flex-start',
          width: '100%',
          minHeight: isMobile ? '100dvh' : '100vh',
          overflow: 'auto',
          flexDirection: isMobile ? 'column' : 'row',
          position: 'relative',
        }}
      >
        <ErrorBoundary>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
             
              <Route path="/login" element={
                <Box sx={{
                  width: '100%',
                  height: '100vh',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'rgba(14, 17, 22, 1)',
                }}>
                  <LoginPage />
                </Box>
              } />
              <Route path="/registration" element={
                <Box sx={{
                  width: '100%',
                  height: '100vh',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'rgba(14, 17, 22, 1)',
                }}>
                  <RegistrationPage />
                </Box>
              } />

              {!isAuthPage && (
                <>
                  <Route path="/" element={<div style={{ display: 'flex' }}><Main />{!isMobile && <WidgetMain />}</div>} />
                  <Route path="/post/:id" element={<div style={{ display: 'flex' }}><Fullpost />{!isMobile && <WidgetMain />}</div>} />
                  <Route path="/setting" element={<div style={{ display: 'flex' }}><MobileSettings />{!isMobile && <WidgetMain />}</div>} />
                  <Route path="/channel" element={<div style={{ display: 'flex' }}><Channel />{!isMobile && <WidgetMain />}</div>} />
                  <Route path="/forbes" element={<div style={{ display: 'flex' }}><Reting />{!isMobile && <WidgetMain />}</div>} />
                  <Route path="/create-channel" element={<div style={{ display: 'flex' }}><ChannelCreatePage />{!isMobile && <WidgetMain />}</div>} />
                  <Route path="/store" element={<div style={{ display: 'flex' }}><Store />{!isMobile && <WidgetMain />}</div>} />
                  <Route path="/channels" element={<div style={{ display: 'flex' }}><ChannelsList />{!isMobile && <WidgetMain />}</div>} />
                  <Route path="/channel/:id" element={<div style={{ display: 'flex' }}><ChannelPage />{!isMobile && <WidgetMain />}</div>} />
                  <Route path="/miniApps" element={<div style={{ display: 'flex' }}><Apps />{!isMobile && <WidgetMain />}</div>} />
                  <Route path="/comments" element={<div style={{ display: 'flex' }}><CommentsStreamPage />{!isMobile && <WidgetMain />}</div>} />
                  <Route path="/wallet" element={<div style={{ display: 'flex' }}><Wallet />{!isMobile && <WidgetMain />}</div>} />
                  <Route path="/account/:id" element={<div style={{ display: 'flex' }}><Profile /></div>} />
                  <Route path="/message" element={<AtomsClicker />} />
                  <Route path="/requests" element={<div style={{ display: 'flex' }}><RequestsPage />{!isMobile && <WidgetMain />}</div>} />
                  <Route path="*" element={<NotFound />} />
                          <Route path="/game" element={<GamePage />} />
                </>
              )}
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </Box>
    </>
  );
};

export default AppRouter;
