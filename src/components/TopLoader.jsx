import { useEffect } from 'react';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { useLoading } from '../contexts/LoadingContext';

NProgress.configure({ showSpinner: false, trickleSpeed: 200 });

const TopLoader = () => {
  const { loading } = useLoading();

  useEffect(() => {
    if (loading) {
      NProgress.start();
    } else {
      NProgress.done();
    }
  }, [loading]);

  return null;
};

export default TopLoader; 