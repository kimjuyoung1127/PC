import { users, quizResults, type User, type InsertUser, type QuizResult, type InsertQuizResult } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createQuizResult(result: InsertQuizResult): Promise<QuizResult>;
  getQuizResult(sessionId: string): Promise<QuizResult | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createQuizResult(insertResult: InsertQuizResult): Promise<QuizResult> {
    const [result] = await db
      .insert(quizResults)
      .values({
        ...insertResult,
        demographics: insertResult.demographics || null,
      })
      .returning();
    return result;
  }

  async getQuizResult(sessionId: string): Promise<QuizResult | undefined> {
    const [result] = await db.select().from(quizResults).where(eq(quizResults.sessionId, sessionId));
    return result || undefined;
  }
}

export const storage = new DatabaseStorage();
