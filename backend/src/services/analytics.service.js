import { sequelize } from '../config/database.js';
import { Op } from 'sequelize';

export class AnalyticsService {
  // Get photographer performance metrics
  static async getPhotographerMetrics(photographerId, timeRange = '30d') {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(timeRange));

      const metrics = await sequelize.query(`
        SELECT 
          COUNT(DISTINCT b.id) as total_bookings,
          AVG(r.rating) as average_rating,
          COUNT(DISTINCT b.client_id) as unique_clients,
          SUM(b.price) as total_revenue,
          AVG(b.price) as average_booking_price,
          COUNT(DISTINCT CASE WHEN b.status = 'completed' THEN b.id END) as completed_bookings,
          COUNT(DISTINCT CASE WHEN b.status = 'cancelled' THEN b.id END) as cancelled_bookings,
          JSONB_AGG(DISTINCT b.event_type) as popular_event_types
        FROM photographers p
        LEFT JOIN bookings b ON p.id = b.photographer_id
        LEFT JOIN reviews r ON b.id = r.booking_id
        WHERE p.id = :photographerId
        AND b.created_at BETWEEN :startDate AND :endDate
      `, {
        replacements: { photographerId, startDate, endDate },
        type: sequelize.QueryTypes.SELECT
      });

      // Get profile view statistics
      const viewStats = await sequelize.query(`
        SELECT 
          COUNT(*) as total_views,
          COUNT(DISTINCT viewer_id) as unique_viewers
        FROM profile_views
        WHERE photographer_id = :photographerId
        AND created_at BETWEEN :startDate AND :endDate
      `, {
        replacements: { photographerId, startDate, endDate },
        type: sequelize.QueryTypes.SELECT
      });

      return {
        ...metrics[0],
        ...viewStats[0],
        timeRange
      };
    } catch (error) {
      console.error('Error getting photographer metrics:', error);
      throw new Error('Failed to get photographer metrics');
    }
  }

  // Get customer behavior analytics
  static async getCustomerAnalytics(userId) {
    try {
      const bookingHistory = await sequelize.query(`
        SELECT 
          b.*,
          p.specialties,
          r.rating,
          r.review_text
        FROM bookings b
        JOIN photographers p ON b.photographer_id = p.id
        LEFT JOIN reviews r ON b.id = r.booking_id
        WHERE b.client_id = :userId
        ORDER BY b.created_at DESC
      `, {
        replacements: { userId },
        type: sequelize.QueryTypes.SELECT
      });

      // Analyze preferences
      const preferences = await this.analyzeUserPreferences(bookingHistory);

      return {
        bookingHistory,
        preferences,
        totalBookings: bookingHistory.length,
        averageRating: this.calculateAverageRating(bookingHistory)
      };
    } catch (error) {
      console.error('Error getting customer analytics:', error);
      throw new Error('Failed to get customer analytics');
    }
  }

  // Get market trends and insights
  static async getMarketTrends(timeRange = '30d') {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(timeRange));

      const trends = await sequelize.query(`
        SELECT 
          event_type,
          COUNT(*) as booking_count,
          AVG(price) as average_price,
          MODE() WITHIN GROUP (ORDER BY location) as popular_locations,
          PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY price) as median_price
        FROM bookings
        WHERE created_at BETWEEN :startDate AND :endDate
        GROUP BY event_type
        ORDER BY booking_count DESC
      `, {
        replacements: { startDate, endDate },
        type: sequelize.QueryTypes.SELECT
      });

      return {
        trends,
        timeRange,
        totalBookings: trends.reduce((acc, curr) => acc + parseInt(curr.booking_count), 0)
      };
    } catch (error) {
      console.error('Error getting market trends:', error);
      throw new Error('Failed to get market trends');
    }
  }

  // Private helper methods
  static async analyzeUserPreferences(bookingHistory) {
    const preferences = {
      favoriteEventTypes: {},
      preferredPriceRange: {
        min: Infinity,
        max: -Infinity,
        avg: 0
      },
      preferredPhotographers: new Set(),
      preferredLocations: {}
    };

    bookingHistory.forEach(booking => {
      // Analyze event types
      preferences.favoriteEventTypes[booking.event_type] = 
        (preferences.favoriteEventTypes[booking.event_type] || 0) + 1;

      // Analyze price range
      preferences.preferredPriceRange.min = Math.min(preferences.preferredPriceRange.min, booking.price);
      preferences.preferredPriceRange.max = Math.max(preferences.preferredPriceRange.max, booking.price);
      preferences.preferredPriceRange.avg += booking.price;

      // Track preferred photographers
      preferences.preferredPhotographers.add(booking.photographer_id);

      // Track locations
      preferences.preferredLocations[booking.location] = 
        (preferences.preferredLocations[booking.location] || 0) + 1;
    });

    // Calculate average price
    preferences.preferredPriceRange.avg /= bookingHistory.length || 1;

    // Convert Set to Array for JSON serialization
    preferences.preferredPhotographers = Array.from(preferences.preferredPhotographers);

    return preferences;
  }

  static calculateAverageRating(bookingHistory) {
    const ratings = bookingHistory
      .filter(booking => booking.rating)
      .map(booking => booking.rating);
    
    return ratings.length ? 
      ratings.reduce((acc, curr) => acc + curr, 0) / ratings.length : 
      0;
  }
}
