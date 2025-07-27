import { sequelize } from '../config/database.js';
import { Op } from 'sequelize';

export class GamificationService {
  // Award points for user actions
  static async awardPoints(userId, action) {
    try {
      const pointsMap = {
        booking_completed: 100,
        review_submitted: 50,
        photo_shared: 25,
        contest_participation: 75,
        referral_success: 150
      };

      const points = pointsMap[action] || 0;
      
      await sequelize.transaction(async (t) => {
        // Add points to user's account
        await sequelize.query(`
          INSERT INTO user_points (user_id, points, action, created_at)
          VALUES (:userId, :points, :action, CURRENT_TIMESTAMP)
        `, {
          replacements: { userId, points, action },
          transaction: t
        });

        // Update total points
        await sequelize.query(`
          UPDATE users
          SET total_points = total_points + :points
          WHERE id = :userId
        `, {
          replacements: { userId, points },
          transaction: t
        });

        // Check and award achievements
        await this.checkAchievements(userId, t);
      });

      return points;
    } catch (error) {
      console.error('Error awarding points:', error);
      throw new Error('Failed to award points');
    }
  }

  // Create a new photo contest
  static async createContest(data) {
    try {
      const {
        title,
        description,
        startDate,
        endDate,
        categories,
        prizes,
        rules
      } = data;

      const contest = await sequelize.query(`
        INSERT INTO photo_contests (
          title, description, start_date, end_date,
          categories, prizes, rules, status
        )
        VALUES (
          :title, :description, :startDate, :endDate,
          :categories, :prizes, :rules, 'active'
        )
        RETURNING id
      `, {
        replacements: {
          title,
          description,
          startDate,
          endDate,
          categories: JSON.stringify(categories),
          prizes: JSON.stringify(prizes),
          rules: JSON.stringify(rules)
        },
        type: sequelize.QueryTypes.INSERT
      });

      return contest[0][0];
    } catch (error) {
      console.error('Error creating contest:', error);
      throw new Error('Failed to create contest');
    }
  }

  // Submit entry to a contest
  static async submitContestEntry(userId, contestId, data) {
    try {
      const { photoUrl, category, description } = data;

      const entry = await sequelize.query(`
        INSERT INTO contest_entries (
          user_id, contest_id, photo_url,
          category, description, submission_date
        )
        VALUES (
          :userId, :contestId, :photoUrl,
          :category, :description, CURRENT_TIMESTAMP
        )
        RETURNING id
      `, {
        replacements: {
          userId,
          contestId,
          photoUrl,
          category,
          description
        },
        type: sequelize.QueryTypes.INSERT
      });

      // Award points for participation
      await this.awardPoints(userId, 'contest_participation');

      return entry[0][0];
    } catch (error) {
      console.error('Error submitting contest entry:', error);
      throw new Error('Failed to submit contest entry');
    }
  }

  // Get user rewards and achievements
  static async getUserRewards(userId) {
    try {
      const rewards = await sequelize.query(`
        SELECT 
          u.total_points,
          json_agg(DISTINCT a.*) as achievements,
          json_agg(DISTINCT b.*) as badges,
          (
            SELECT json_agg(r.*)
            FROM available_rewards r
            WHERE r.required_points <= u.total_points
            AND r.id NOT IN (
              SELECT reward_id 
              FROM redeemed_rewards 
              WHERE user_id = :userId
            )
          ) as available_rewards,
          (
            SELECT json_agg(h.*)
            FROM points_history h
            WHERE h.user_id = :userId
            ORDER BY h.created_at DESC
            LIMIT 10
          ) as recent_points_history
        FROM users u
        LEFT JOIN user_achievements ua ON u.id = ua.user_id
        LEFT JOIN achievements a ON ua.achievement_id = a.id
        LEFT JOIN user_badges ub ON u.id = ub.user_id
        LEFT JOIN badges b ON ub.badge_id = b.id
        WHERE u.id = :userId
        GROUP BY u.id, u.total_points
      `, {
        replacements: { userId },
        type: sequelize.QueryTypes.SELECT
      });

      return rewards[0];
    } catch (error) {
      console.error('Error getting user rewards:', error);
      throw new Error('Failed to get user rewards');
    }
  }

  // Check and award achievements
  static async checkAchievements(userId, transaction) {
    try {
      // Get user's current stats
      const stats = await sequelize.query(`
        SELECT 
          COUNT(DISTINCT b.id) as total_bookings,
          COUNT(DISTINCT r.id) as total_reviews,
          u.total_points
        FROM users u
        LEFT JOIN bookings b ON u.id = b.client_id
        LEFT JOIN reviews r ON u.id = r.user_id
        WHERE u.id = :userId
        GROUP BY u.id, u.total_points
      `, {
        replacements: { userId },
        type: sequelize.QueryTypes.SELECT,
        transaction
      });

      // Define achievement criteria
      const achievements = [
        {
          id: 'first_booking',
          condition: stats[0].total_bookings >= 1,
          points: 200
        },
        {
          id: 'power_user',
          condition: stats[0].total_bookings >= 10,
          points: 1000
        },
        {
          id: 'top_reviewer',
          condition: stats[0].total_reviews >= 5,
          points: 500
        }
      ];

      // Award achievements
      for (const achievement of achievements) {
        if (achievement.condition) {
          await sequelize.query(`
            INSERT INTO user_achievements (user_id, achievement_id, awarded_at)
            VALUES (:userId, :achievementId, CURRENT_TIMESTAMP)
            ON CONFLICT (user_id, achievement_id) DO NOTHING
          `, {
            replacements: {
              userId,
              achievementId: achievement.id
            },
            transaction
          });
        }
      }
    } catch (error) {
      console.error('Error checking achievements:', error);
      throw new Error('Failed to check achievements');
    }
  }
}
