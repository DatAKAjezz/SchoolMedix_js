import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import helmet from "helmet";
import morgan from "morgan";
import routes from "./routes/index.js";

const app = express();
const PORT = 3000;

app.use(cors()); // Cho phép mọi origin (hoặc cấu hình cụ thể)
app.use(bodyParser.json()); // Đọc body JSON
app.use(helmet()); // Bảo mật
app.use(morgan("dev")); // Log ra console theo format "dev"
app.use(express.json()); // Đọc body JSON
app.use("/api", routes); // Mount tất cả routes con vào đường dẫn /api

// Route mặc định
app.get("/", (req, res) => {
  res.send("API is running!");
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
