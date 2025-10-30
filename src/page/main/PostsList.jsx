import React, { memo, useState } from 'react';
import { Box, Button } from '@mui/material';
import PostWithComments from './post/PostWithComments';
import PostSkeleton from './post/PostSkeleton';

const POSTS_PER_PAGE = 15;
const TABS = ['Все', 'Рекомендации', 'Репозитория'];

const PostsList = memo(({ posts, loading, onDelete, onPostUpdate }) => {
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);
  const [activeTab, setActiveTab] = useState(0);

  const handleLoadMore = () => setVisibleCount((prev) => prev + POSTS_PER_PAGE);

  if (loading) {
    return (
      <Box>
        {[1, 2, 3].map((i) => (
          <PostSkeleton key={i} />
        ))}
      </Box>
    );
  }

  const visiblePosts = posts.slice(0, visibleCount);

  return (
    <Box>
      

      {/* ---------- Posts ---------- */}
      {visiblePosts.map((post, index) => (
        <Box
          key={`${post._id}-${index}`}
          sx={{
            opacity: 0,
            transform: 'translateY(30px) scale(0.95)',
            animation: `slideInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s forwards`,
            '@keyframes slideInUp': {
              '0%': { opacity: 0, transform: 'translateY(30px) scale(0.95)' },
              '100%': { opacity: 1, transform: 'translateY(0) scale(1)' },
            },
            position: 'relative',
            mb: 1,
          }}
        >
          <PostWithComments
            post={post}
            onDelete={onDelete}
            onPostUpdate={onPostUpdate}
          />

          {post.pending && (
            <Box
              sx={{
                position: 'absolute',
                top: 10,
                right: 20,
                color: 'orange',
                fontSize: 13,
                animation: 'pulse 1.5s ease-in-out infinite',
                '@keyframes pulse': {
                  '0%, 100%': { opacity: 1 },
                  '50%': { opacity: 0.5 },
                },
              }}
            >
              Отправляется...
            </Box>
          )}
        </Box>
      ))}

      {/* ---------- Load More ---------- */}
      {visibleCount < posts.length && (
        <Box sx={{ textAlign: 'center', mt: 3, mb: 5 }}>
          <Button
            variant="contained"
            onClick={handleLoadMore}
            sx={{
              borderRadius: '25px',
              px: 4,
              py: 1,
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              background: 'linear-gradient(135deg, #1e88e5, #42a5f5)',
            }}
          >
            Загрузить ещё
          </Button>
        </Box>
      )}
    </Box>
  );
});

export default PostsList;
