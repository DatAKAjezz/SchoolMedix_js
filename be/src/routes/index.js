// index.js
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import postRoutes from './post.routes.js';
import userRoutes from './users.routes.js'
import sendDrugRequestRoutes from './sendDrugRequest.routes.js';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/post', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/send-drug-requests', sendDrugRequestRoutes);

app.listen(PORT, () => {
      console.log(`🚀 Server is running at http://localhost:${PORT}`);
});

export default app;     