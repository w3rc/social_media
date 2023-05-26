import express from 'express'

const router = express.Router();

// Ping
router.get('/', (_, res) => res.send('API is up and running!'))

// Login/Signup
router.post('/login');
router.post('/register');

// Posts
router.post('/post');
router.get('/post');
router.get('/post/:id/comments');

// Comments in post
router.post('/comment/:id/upvote');
router.post('/comment/:id/downvote');
router.post('/comment');

export default router;