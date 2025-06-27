import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzeRequestSchema, type AnalyzeRequest } from "@shared/schema";
import { analyzePoliticalOrientation } from "./services/gemini";
import { calculatePoliticalScore, getPoliticalLabel, calculateCategoryScores } from "../client/src/lib/scoring";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Analyze political orientation
  app.post("/api/analyze", async (req, res) => {
    try {
      const validatedData = analyzeRequestSchema.parse(req.body);
      const { answers, demographics } = validatedData;

      // Calculate political score and label
      const politicalScore = calculatePoliticalScore(answers);
      const politicalLabel = getPoliticalLabel(politicalScore);
      const categoryScores = calculateCategoryScores(answers);

      // Generate AI analysis
      const aiAnalysis = await analyzePoliticalOrientation(answers, demographics, politicalScore, politicalLabel, categoryScores);

      // Create session ID
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Store result
      const result = await storage.createQuizResult({
        sessionId,
        answers: answers as any,
        demographics: demographics as any,
        politicalScore,
        politicalLabel,
        aiAnalysis,
        categoryScores: categoryScores as any,
        createdAt: new Date().toISOString(),
      });

      res.json({
        sessionId: result.sessionId,
        politicalScore: result.politicalScore,
        politicalLabel: result.politicalLabel,
        aiAnalysis: result.aiAnalysis,
        categoryScores: result.categoryScores,
      });

    } catch (error) {
      console.error("Analysis error:", error);
      res.status(500).json({ 
        message: "정치 성향 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get quiz result by session ID
  app.get("/api/result/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const result = await storage.getQuizResult(sessionId);
      
      if (!result) {
        return res.status(404).json({ message: "결과를 찾을 수 없습니다." });
      }

      res.json({
        sessionId: result.sessionId,
        politicalScore: result.politicalScore,
        politicalLabel: result.politicalLabel,
        aiAnalysis: result.aiAnalysis,
        categoryScores: result.categoryScores,
      });

    } catch (error) {
      console.error("Get result error:", error);
      res.status(500).json({ message: "결과를 불러오는 중 오류가 발생했습니다." });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
