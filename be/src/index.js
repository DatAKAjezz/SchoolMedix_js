import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes/index.js';

import userRoutes from './routes/users.routes.js';
import sendDrugRequestRoutes from './routes/sendDrugRequest.routes.js';

const app = express();

app.use(cors());               // Cho phép mọi origin (hoặc cấu hình cụ thể)
app.use(helmet());             // Bảo mật
app.use(morgan('dev'));        // Log ra console theo format "dev"
app.use(express.json());       // Đọc body JSON

app.use('/api', routes);       // Mount tất cả routes con vào đường dẫn /api



logEndpoints(app);


// Hàm log endpoints với prefix mount path
function logEndpoints(app) {
      console.log('--- List of registered API endpoints ---');
      app._router.stack.forEach((middleware) => {
            if (middleware.route) {
                  // Route trực tiếp trên app
                  const route = middleware.route;
                  const methods = Object.keys(route.methods).map(m => m.toUpperCase()).join(', ');
                  console.log(`${methods} ${route.path}`);
            } else if (middleware.name === 'router') {
                  // Route được mount qua router, lấy prefix từ regexp
                  // Lấy prefix mount path như /api, /api/users, /api/send-drug-requests
                  const prefix = middleware.regexp
                        .toString()
                        .replace('/^\\', '')      // loại bỏ ký tự regex thừa
                        .replace('\\/?(?=\\/|$)/i', '')  // loại bỏ phần cuối
                        .replace(/\\\//g, '/')   // thay \\/ thành /
                        .replace(/\\\./g, '.')   // thay \\. thành .
                        .replace(/\$$/, '');     // bỏ ký tự $ ở cuối

                  middleware.handle.stack.forEach((handler) => {
                        const route = handler.route;
                        if (route) {
                              const methods = Object.keys(route.methods).map(m => m.toUpperCase()).join(', ');
                              console.log(`${methods} ${prefix}${route.path}`);
                        }
                  });
            }
      });
}


export default app;
