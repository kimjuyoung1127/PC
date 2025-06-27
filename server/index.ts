import 'dotenv/config';
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import serverless from 'serverless-http';

// Express 앱을 생성하고 설정하는 비동기 함수
async function createApp() {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // 로깅 미들웨어
  app.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => {
      const duration = Date.now() - start;
      if (req.path.startsWith("/api")) {
        log(`${req.method} ${req.path} ${res.statusCode} in ${duration}ms`);
      }
    });
    next();
  });

  // 라우트 등록
  const server = await registerRoutes(app);

  // 오류 처리 미들웨어
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
  });

  // 개발 환경과 프로덕션 환경 분기 처리
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
    const port = 5000;
    server.listen(port, "0.0.0.0", () => {
      log(`serving on port ${port}`);
    });
  } else {
    serveStatic(app);
  }

  return app;
}

// 개발 환경에서는 즉시 앱을 생성하고 서버를 시작합니다.
if (process.env.NODE_ENV === 'development') {
  createApp();
}

// Netlify 함수를 위한 핸들러 내보내기
// serverless-http는 요청이 있을 때마다 createApp을 호출하여 앱을 초기화합니다.
export const handler = serverless(createApp());
