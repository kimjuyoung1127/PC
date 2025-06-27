import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const quizResults = pgTable("quiz_results", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  answers: jsonb("answers").notNull(),
  demographics: jsonb("demographics"),
  politicalScore: integer("political_score").notNull(),
  politicalLabel: text("political_label").notNull(),  
  aiAnalysis: text("ai_analysis").notNull(),
  categoryScores: jsonb("category_scores").notNull(),
  createdAt: text("created_at").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertQuizResultSchema = createInsertSchema(quizResults).omit({
  id: true,
});

export const demographicsSchema = z.object({
  age: z.string().optional(),
  gender: z.string().optional(),
  region: z.string().optional(),
});

export const quizAnswerSchema = z.object({
  questionId: z.number(),
  choice: z.enum(["left", "right"]),
  leftScore: z.number(),
  rightScore: z.number(),
});

export const analyzeRequestSchema = z.object({
  answers: z.array(quizAnswerSchema),
  demographics: demographicsSchema.optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type QuizResult = typeof quizResults.$inferSelect;
export type InsertQuizResult = z.infer<typeof insertQuizResultSchema>;
export type Demographics = z.infer<typeof demographicsSchema>;
export type QuizAnswer = z.infer<typeof quizAnswerSchema>;
export type AnalyzeRequest = z.infer<typeof analyzeRequestSchema>;
