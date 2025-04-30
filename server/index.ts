import express from 'express';
import cors from 'cors';
import userRoutes from './routes/users';
import storyRoutes from './routes/stories';
import profileRoutes from './routes/profiles';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/profiles', profileRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});