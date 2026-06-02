import { z } from 'zod'
import type { InferSelectModel } from 'drizzle-orm'
import * as schema from '../db/schema'

export type User = InferSelectModel<typeof schema.users>
export type School = InferSelectModel<typeof schema.schools>
export type Post = InferSelectModel<typeof schema.posts>
export type Comment = InferSelectModel<typeof schema.comments>
export type Like = InferSelectModel<typeof schema.likes>
export type Badge = InferSelectModel<typeof schema.badges>
export type BadgeProgress = InferSelectModel<typeof schema.badgeProgress>
export type UserBadge = InferSelectModel<typeof schema.userBadges>
export type UserAchievement = InferSelectModel<typeof schema.userAchievements>
export type Challenge = InferSelectModel<typeof schema.challenges>
export type ChallengeParticipant = InferSelectModel<typeof schema.challengeParticipants>
export type Season = InferSelectModel<typeof schema.seasons>
export type Notification = InferSelectModel<typeof schema.notifications>
export type ActivityLog = InferSelectModel<typeof schema.activityLogs>

export const RANK_THRESHOLDS = [
  { name: 'NEWBIE', min: 0, max: 49 },
  { name: 'INITIATOR', min: 50, max: 124 },
  { name: 'CREATOR', min: 125, max: 224 },
  { name: 'KNIGHT', min: 225, max: 399 },
  { name: 'GUARDIAN', min: 400, max: 599 },
  { name: 'APEX', min: 600, max: Infinity },
] as const

export type RankName = (typeof RANK_THRESHOLDS)[number]['name']

export function calculateRank(points: number): RankName {
  for (let i = RANK_THRESHOLDS.length - 1; i >= 0; i--) {
    if (points >= RANK_THRESHOLDS[i].min) return RANK_THRESHOLDS[i].name
  }
  return 'NEWBIE'
}

export const loginSchema = z.object({
  username: z.string().min(1, 'Username or email is required'),
  password: z.string().min(1, 'Password is required'),
})

export const registerSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  fullName: z.string().min(1, 'Full name is required'),
  schoolId: z.string().optional(),
})

export const createPostSchema = z.object({
  content: z.string().min(1, 'Content is required'),
  mediaUrl: z.string().optional(),
  mediaType: z.enum(['TEXT', 'IMAGE', 'VIDEO', 'TASK']).optional(),
})

export const createCommentSchema = z.object({
  content: z.string().min(1, 'Comment is required'),
  postId: z.string(),
})

export const createChallengeSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  type: z.enum(['WEEKLY', 'MONTHLY', 'SPECIAL']),
  pointsReward: z.number().int().positive(),
  badgeRewardId: z.string().optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  criteria: z.string().optional(),
})

export interface AuthPayload {
  user: User
  token: string
  refreshToken?: string
}

export interface LeaderboardEntry {
  id: string
  fullName: string
  profileImage: string | null
  points: number
  rank: string
  schoolName: string | null
}

export interface PostWithDetails extends Post {
  author: Pick<User, 'id' | 'fullName' | 'profileImage' | 'role'>
  school: Pick<School, 'name'> | null
  commentCount: number
  likeCount: number
  isLiked: boolean
  comments?: CommentWithAuthor[]
}

export interface CommentWithAuthor extends Comment {
  author: Pick<User, 'id' | 'fullName' | 'profileImage'>
}

export interface DashboardStats {
  totalUsers: number
  totalPosts: number
  totalSchools: number
  totalChallenges: number
  postsByStatus: { status: string; count: number }[]
  usersByRole: { role: string; count: number }[]
  topSchools: { name: string; points: number }[]
  recentActivity: ActivityLog[]
}
