import { sequelize } from '../config/database.js';
import { RealtimeService } from './realtime.service.js';

export class VirtualService {
  constructor(realtimeService) {
    this.realtime = realtimeService;
  }

  // Create a virtual photoshoot session
  async createVirtualSession(photographerId, clientId, sessionData) {
    try {
      const session = await sequelize.query(`
        INSERT INTO virtual_sessions (
          photographer_id,
          client_id,
          scheduled_time,
          duration_minutes,
          session_type,
          virtual_background_urls,
          props_enabled,
          status
        )
        VALUES (
          :photographerId,
          :clientId,
          :scheduledTime,
          :duration,
          :sessionType,
          :backgroundUrls,
          :propsEnabled,
          'scheduled'
        )
        RETURNING id
      `, {
        replacements: {
          photographerId,
          clientId,
          scheduledTime: sessionData.scheduledTime,
          duration: sessionData.duration || 30,
          sessionType: sessionData.sessionType,
          backgroundUrls: JSON.stringify(sessionData.backgroundUrls || []),
          propsEnabled: sessionData.propsEnabled || false
        },
        type: sequelize.QueryTypes.INSERT
      });

      return session[0][0];
    } catch (error) {
      console.error('Error creating virtual session:', error);
      throw new Error('Failed to create virtual session');
    }
  }

  // Start a virtual photoshoot session
  async startSession(sessionId) {
    try {
      await sequelize.query(`
        UPDATE virtual_sessions
        SET 
          status = 'active',
          started_at = CURRENT_TIMESTAMP
        WHERE id = :sessionId
      `, {
        replacements: { sessionId }
      });

      // Notify participants
      const sessionDetails = await this.getSessionDetails(sessionId);
      this.realtime.io.to(`session:${sessionId}`).emit('session_started', sessionDetails);

      return sessionDetails;
    } catch (error) {
      console.error('Error starting virtual session:', error);
      throw new Error('Failed to start virtual session');
    }
  }

  // Handle AR pose suggestions
  async suggestPose(sessionId, pose) {
    try {
      const poseData = await sequelize.query(`
        INSERT INTO virtual_poses (
          session_id,
          pose_data,
          timestamp
        )
        VALUES (
          :sessionId,
          :poseData,
          CURRENT_TIMESTAMP
        )
        RETURNING id
      `, {
        replacements: {
          sessionId,
          poseData: JSON.stringify(pose)
        },
        type: sequelize.QueryTypes.INSERT
      });

      // Notify session participants
      this.realtime.io.to(`session:${sessionId}`).emit('pose_suggestion', {
        poseId: poseData[0][0].id,
        pose
      });

      return poseData[0][0];
    } catch (error) {
      console.error('Error suggesting pose:', error);
      throw new Error('Failed to suggest pose');
    }
  }

  // Update virtual background
  async updateBackground(sessionId, backgroundUrl) {
    try {
      await sequelize.query(`
        UPDATE virtual_sessions
        SET 
          current_background = :backgroundUrl,
          background_updated_at = CURRENT_TIMESTAMP
        WHERE id = :sessionId
      `, {
        replacements: {
          sessionId,
          backgroundUrl
        }
      });

      // Notify session participants
      this.realtime.io.to(`session:${sessionId}`).emit('background_updated', {
        backgroundUrl
      });

      return { success: true, backgroundUrl };
    } catch (error) {
      console.error('Error updating background:', error);
      throw new Error('Failed to update background');
    }
  }

  // Capture virtual photo
  async capturePhoto(sessionId, photoData) {
    try {
      const photo = await sequelize.query(`
        INSERT INTO virtual_photos (
          session_id,
          photo_url,
          pose_data,
          background_url,
          props_used,
          captured_at
        )
        VALUES (
          :sessionId,
          :photoUrl,
          :poseData,
          :backgroundUrl,
          :propsUsed,
          CURRENT_TIMESTAMP
        )
        RETURNING id
      `, {
        replacements: {
          sessionId,
          photoUrl: photoData.photoUrl,
          poseData: JSON.stringify(photoData.poseData || {}),
          backgroundUrl: photoData.backgroundUrl,
          propsUsed: JSON.stringify(photoData.propsUsed || [])
        },
        type: sequelize.QueryTypes.INSERT
      });

      // Notify session participants
      this.realtime.io.to(`session:${sessionId}`).emit('photo_captured', {
        photoId: photo[0][0].id,
        photoData
      });

      return photo[0][0];
    } catch (error) {
      console.error('Error capturing photo:', error);
      throw new Error('Failed to capture photo');
    }
  }

  // Get session details
  async getSessionDetails(sessionId) {
    try {
      const session = await sequelize.query(`
        SELECT 
          vs.*,
          p.name as photographer_name,
          c.name as client_name,
          json_agg(DISTINCT vp.*) as photos,
          json_agg(DISTINCT vpo.*) as poses
        FROM virtual_sessions vs
        JOIN users p ON vs.photographer_id = p.id
        JOIN users c ON vs.client_id = c.id
        LEFT JOIN virtual_photos vp ON vs.id = vp.session_id
        LEFT JOIN virtual_poses vpo ON vs.id = vpo.session_id
        WHERE vs.id = :sessionId
        GROUP BY vs.id, p.name, c.name
      `, {
        replacements: { sessionId },
        type: sequelize.QueryTypes.SELECT
      });

      return session[0];
    } catch (error) {
      console.error('Error getting session details:', error);
      throw new Error('Failed to get session details');
    }
  }
}
