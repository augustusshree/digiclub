import {
  mysqlTable, varchar, text, int, boolean, datetime, index, uniqueIndex,
  primaryKey, unique,
} from 'drizzle-orm/mysql-core'
import { relations } from 'drizzle-orm'

export const users = mysqlTable('users', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  username: varchar('username', { length: 50 }).unique().notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  fullName: varchar('full_name', { length: 100 }).notNull(),
  profileImage: varchar('profile_image', { length: 500 }),
  bio: text('bio'),
  schoolId: varchar('school_id', { length: 36 }),
  role: varchar('role', { length: 20 }).$type<'STUDENT' | 'ADMIN' | 'SUPER_ADMIN'>().default('STUDENT').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  points: int('points').default(0).notNull(),
  rank: varchar('rank', { length: 20 }).default('NEWBIE').notNull(),
  createdAt: datetime('created_at').$defaultFn(() => new Date()).notNull(),
  updatedAt: datetime('updated_at').$defaultFn(() => new Date()).$onUpdateFn(() => new Date()).notNull(),
}, (table) => [
  index('idx_users_email').on(table.email),
  index('idx_users_school_id').on(table.schoolId),
  index('idx_users_points').on(table.points),
  index('idx_users_rank').on(table.rank),
])

export const schools = mysqlTable('schools', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: varchar('name', { length: 200 }).unique().notNull(),
  code: varchar('code', { length: 20 }).unique().notNull(),
  logo: varchar('logo', { length: 500 }),
  city: varchar('city', { length: 100 }),
  state: varchar('state', { length: 100 }),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: datetime('created_at').$defaultFn(() => new Date()).notNull(),
  updatedAt: datetime('updated_at').$defaultFn(() => new Date()).$onUpdateFn(() => new Date()).notNull(),
}, (table) => [
  index('idx_schools_name').on(table.name),
  index('idx_schools_code').on(table.code),
])

export const posts = mysqlTable('posts', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  content: text('content'),
  mediaUrl: varchar('media_url', { length: 500 }),
  mediaType: varchar('media_type', { length: 20 }),
  type: varchar('type', { length: 20 }).$type<'TEXT' | 'IMAGE' | 'VIDEO' | 'TASK'>().default('TEXT').notNull(),
  status: varchar('status', { length: 20 }).$type<'PENDING' | 'APPROVED' | 'REJECTED'>().default('PENDING').notNull(),
  pointsAwarded: int('points_awarded').default(0).notNull(),
  reviewedById: varchar('reviewed_by_id', { length: 36 }),
  authorId: varchar('author_id', { length: 36 }).notNull(),
  schoolId: varchar('school_id', { length: 36 }),
  createdAt: datetime('created_at').$defaultFn(() => new Date()).notNull(),
  updatedAt: datetime('updated_at').$defaultFn(() => new Date()).$onUpdateFn(() => new Date()).notNull(),
}, (table) => [
  index('idx_posts_author_id').on(table.authorId),
  index('idx_posts_school_id').on(table.schoolId),
  index('idx_posts_status').on(table.status),
  index('idx_posts_created_at').on(table.createdAt),
  index('idx_posts_type').on(table.type),
])

export const comments = mysqlTable('comments', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  content: text('content').notNull(),
  authorId: varchar('author_id', { length: 36 }).notNull(),
  postId: varchar('post_id', { length: 36 }).notNull(),
  createdAt: datetime('created_at').$defaultFn(() => new Date()).notNull(),
  updatedAt: datetime('updated_at').$defaultFn(() => new Date()).$onUpdateFn(() => new Date()).notNull(),
}, (table) => [
  index('idx_comments_post_id').on(table.postId),
  index('idx_comments_author_id').on(table.authorId),
])

export const likes = mysqlTable('likes', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  authorId: varchar('author_id', { length: 36 }).notNull(),
  postId: varchar('post_id', { length: 36 }).notNull(),
  createdAt: datetime('created_at').$defaultFn(() => new Date()).notNull(),
}, (table) => [
  uniqueIndex('idx_likes_author_post').on(table.authorId, table.postId),
  index('idx_likes_post_id').on(table.postId),
])

export const badges = mysqlTable('badges', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: varchar('name', { length: 100 }).unique().notNull(),
  description: text('description').notNull(),
  imageUrl: varchar('image_url', { length: 500 }),
  icon: varchar('icon', { length: 50 }).notNull(),
  category: varchar('category', { length: 20 }).$type<'ACHIEVEMENT' | 'MILESTONE' | 'SPECIAL' | 'SCHOOL'>().default('ACHIEVEMENT').notNull(),
  pointsRequired: int('points_required'),
  criteria: text('criteria'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: datetime('created_at').$defaultFn(() => new Date()).notNull(),
})

export const badgeProgress = mysqlTable('badge_progress', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: varchar('user_id', { length: 36 }).notNull(),
  badgeId: varchar('badge_id', { length: 36 }).notNull(),
  progress: int('progress').default(0).notNull(),
  target: int('target').notNull(),
  completed: boolean('completed').default(false).notNull(),
  createdAt: datetime('created_at').$defaultFn(() => new Date()).notNull(),
  updatedAt: datetime('updated_at').$defaultFn(() => new Date()).$onUpdateFn(() => new Date()).notNull(),
}, (table) => [
  uniqueIndex('idx_badge_progress_user_badge').on(table.userId, table.badgeId),
])

export const userBadges = mysqlTable('user_badges', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: varchar('user_id', { length: 36 }).notNull(),
  badgeId: varchar('badge_id', { length: 36 }).notNull(),
  earnedAt: datetime('earned_at').$defaultFn(() => new Date()).notNull(),
}, (table) => [
  uniqueIndex('idx_user_badges_user_badge').on(table.userId, table.badgeId),
])

export const userAchievements = mysqlTable('user_achievements', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: varchar('user_id', { length: 36 }).notNull(),
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description').notNull(),
  pointsAwarded: int('points_awarded').default(0).notNull(),
  earnedAt: datetime('earned_at').$defaultFn(() => new Date()).notNull(),
}, (table) => [
  index('idx_user_achievements_user_id').on(table.userId),
])

export const challenges = mysqlTable('challenges', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description').notNull(),
  type: varchar('type', { length: 20 }).$type<'WEEKLY' | 'MONTHLY' | 'SPECIAL'>().default('WEEKLY').notNull(),
  status: varchar('status', { length: 20 }).$type<'ACTIVE' | 'COMPLETED' | 'CANCELLED'>().default('ACTIVE').notNull(),
  pointsReward: int('points_reward').notNull(),
  badgeRewardId: varchar('badge_reward_id', { length: 36 }),
  startDate: datetime('start_date').notNull(),
  endDate: datetime('end_date').notNull(),
  criteria: text('criteria'),
  createdById: varchar('created_by_id', { length: 36 }).notNull(),
  createdAt: datetime('created_at').$defaultFn(() => new Date()).notNull(),
  updatedAt: datetime('updated_at').$defaultFn(() => new Date()).$onUpdateFn(() => new Date()).notNull(),
}, (table) => [
  index('idx_challenges_type').on(table.type),
  index('idx_challenges_status').on(table.status),
  index('idx_challenges_dates').on(table.startDate, table.endDate),
])

export const challengeParticipants = mysqlTable('challenge_participants', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: varchar('user_id', { length: 36 }).notNull(),
  challengeId: varchar('challenge_id', { length: 36 }).notNull(),
  progress: int('progress').default(0).notNull(),
  completed: boolean('completed').default(false).notNull(),
  joinedAt: datetime('joined_at').$defaultFn(() => new Date()).notNull(),
  completedAt: datetime('completed_at'),
}, (table) => [
  uniqueIndex('idx_challenge_participants_user_challenge').on(table.userId, table.challengeId),
])

export const seasons = mysqlTable('seasons', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: varchar('name', { length: 100 }).notNull(),
  startDate: datetime('start_date').notNull(),
  endDate: datetime('end_date').notNull(),
  isActive: boolean('is_active').default(false).notNull(),
  createdAt: datetime('created_at').$defaultFn(() => new Date()).notNull(),
}, (table) => [
  index('idx_seasons_active').on(table.isActive),
])

export const notifications = mysqlTable('notifications', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: varchar('user_id', { length: 36 }).notNull(),
  type: varchar('type', { length: 50 }).notNull(),
  title: varchar('title', { length: 200 }).notNull(),
  message: text('message').notNull(),
  link: varchar('link', { length: 500 }),
  read: boolean('read').default(false).notNull(),
  createdAt: datetime('created_at').$defaultFn(() => new Date()).notNull(),
}, (table) => [
  index('idx_notifications_user_read').on(table.userId, table.read),
])

export const refreshTokens = mysqlTable('refresh_tokens', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  token: varchar('token', { length: 500 }).unique().notNull(),
  userId: varchar('user_id', { length: 36 }).notNull(),
  expiresAt: datetime('expires_at').notNull(),
  createdAt: datetime('created_at').$defaultFn(() => new Date()).notNull(),
}, (table) => [
  index('idx_refresh_tokens_token').on(table.token),
  index('idx_refresh_tokens_user_id').on(table.userId),
])

export const activityLogs = mysqlTable('activity_logs', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: varchar('user_id', { length: 36 }),
  action: varchar('action', { length: 50 }).notNull(),
  entity: varchar('entity', { length: 50 }).notNull(),
  entityId: varchar('entity_id', { length: 36 }),
  details: text('details'),
  ipAddress: varchar('ip_address', { length: 50 }),
  createdAt: datetime('created_at').$defaultFn(() => new Date()).notNull(),
}, (table) => [
  index('idx_activity_logs_user_id').on(table.userId),
  index('idx_activity_logs_action').on(table.action),
  index('idx_activity_logs_created_at').on(table.createdAt),
])

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  school: one(schools, { fields: [users.schoolId], references: [schools.id] }),
  posts: many(posts),
  reviewedPosts: many(posts, { relationName: 'reviewedPosts' }),
  comments: many(comments),
  likes: many(likes),
  badgeProgress: many(badgeProgress),
  userBadges: many(userBadges),
  achievements: many(userAchievements),
  challengeParticipants: many(challengeParticipants),
  createdChallenges: many(challenges, { relationName: 'createdChallenges' }),
  notifications: many(notifications),
  refreshTokens: many(refreshTokens),
  activityLogs: many(activityLogs),
}))

export const schoolsRelations = relations(schools, ({ many }) => ({
  users: many(users),
  posts: many(posts),
}))

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, { fields: [posts.authorId], references: [users.id] }),
  reviewer: one(users, { fields: [posts.reviewedById], references: [users.id], relationName: 'reviewedPosts' }),
  school: one(schools, { fields: [posts.schoolId], references: [schools.id] }),
  comments: many(comments),
  likes: many(likes),
}))

export const commentsRelations = relations(comments, ({ one }) => ({
  author: one(users, { fields: [comments.authorId], references: [users.id] }),
  post: one(posts, { fields: [comments.postId], references: [posts.id] }),
}))

export const likesRelations = relations(likes, ({ one }) => ({
  author: one(users, { fields: [likes.authorId], references: [users.id] }),
  post: one(posts, { fields: [likes.postId], references: [posts.id] }),
}))

export const badgesRelations = relations(badges, ({ many }) => ({
  badgeProgress: many(badgeProgress),
  userBadges: many(userBadges),
  challengeRewards: many(challenges, { relationName: 'challengeBadgeReward' }),
}))

export const badgeProgressRelations = relations(badgeProgress, ({ one }) => ({
  user: one(users, { fields: [badgeProgress.userId], references: [users.id] }),
  badge: one(badges, { fields: [badgeProgress.badgeId], references: [badges.id] }),
}))

export const userBadgesRelations = relations(userBadges, ({ one }) => ({
  user: one(users, { fields: [userBadges.userId], references: [users.id] }),
  badge: one(badges, { fields: [userBadges.badgeId], references: [badges.id] }),
}))

export const userAchievementsRelations = relations(userAchievements, ({ one }) => ({
  user: one(users, { fields: [userAchievements.userId], references: [users.id] }),
}))

export const challengesRelations = relations(challenges, ({ one, many }) => ({
  badgeReward: one(badges, { fields: [challenges.badgeRewardId], references: [badges.id], relationName: 'challengeBadgeReward' }),
  createdBy: one(users, { fields: [challenges.createdById], references: [users.id], relationName: 'createdChallenges' }),
  participants: many(challengeParticipants),
}))

export const challengeParticipantsRelations = relations(challengeParticipants, ({ one }) => ({
  user: one(users, { fields: [challengeParticipants.userId], references: [users.id] }),
  challenge: one(challenges, { fields: [challengeParticipants.challengeId], references: [challenges.id] }),
}))

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, { fields: [notifications.userId], references: [users.id] }),
}))

export const refreshTokensRelations = relations(refreshTokens, ({ one }) => ({
  user: one(users, { fields: [refreshTokens.userId], references: [users.id] }),
}))
