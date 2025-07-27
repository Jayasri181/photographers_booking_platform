import { Configuration, OpenAIApi } from 'openai';
import config from '../config/config.js';
import { sequelize } from '../config/database.js';
import { Op } from 'sequelize';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export class AIService {
  // Analyze image style and return characteristics
  static async analyzeImageStyle(imageUrl) {
    try {
      const response = await openai.createImageAnalysis({
        model: "gpt-4-vision-preview",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: "Analyze this photography style and describe key characteristics like color tone, composition, lighting, and overall aesthetic." },
              { type: "image_url", url: imageUrl }
            ],
          },
        ],
      });

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Error analyzing image style:', error);
      throw new Error('Failed to analyze image style');
    }
  }

  // Match photographers based on style preferences
  static async matchPhotographers(stylePreferences, location = null) {
    try {
      let query = `
        SELECT p.*, 
               u.name,
               u.email,
               SIMILARITY(p.style_tags::text, :stylePreferences) as style_match_score
        FROM photographers p
        JOIN users u ON p.user_id = u.id
        WHERE p.is_active = true
      `;

      if (location) {
        query += ` AND ST_DWithin(
          p.location_geom,
          ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326),
          :radius
        )`;
      }

      query += ` ORDER BY style_match_score DESC LIMIT 10`;

      const photographers = await sequelize.query(query, {
        replacements: {
          stylePreferences: JSON.stringify(stylePreferences),
          ...(location && {
            longitude: location.longitude,
            latitude: location.latitude,
            radius: 50000 // 50km radius
          })
        },
        type: sequelize.QueryTypes.SELECT
      });

      return photographers;
    } catch (error) {
      console.error('Error matching photographers:', error);
      throw new Error('Failed to match photographers');
    }
  }

  // Generate personalized shoot recommendations
  static async generateShootRecommendations(userId) {
    try {
      // Get user's previous bookings and preferences
      const userHistory = await sequelize.query(`
        SELECT 
          b.event_type,
          b.requirements,
          r.rating,
          r.review_text
        FROM bookings b
        LEFT JOIN reviews r ON b.id = r.booking_id
        WHERE b.client_id = :userId
        ORDER BY b.created_at DESC
        LIMIT 5
      `, {
        replacements: { userId },
        type: sequelize.QueryTypes.SELECT
      });

      // Use GPT to analyze preferences and generate recommendations
      const prompt = `Based on the user's booking history and preferences: ${JSON.stringify(userHistory)}, 
                     suggest personalized photography shoot ideas and styles.`;

      const completion = await openai.createChatCompletion({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
      });

      return completion.data.choices[0].message.content;
    } catch (error) {
      console.error('Error generating recommendations:', error);
      throw new Error('Failed to generate recommendations');
    }
  }

  // AI-powered photo editing suggestions
  static async generateEditingSuggestions(imageUrl) {
    try {
      const response = await openai.createImageAnalysis({
        model: "gpt-4-vision-preview",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: "Analyze this photo and suggest professional editing improvements for lighting, color, composition, and overall enhancement." },
              { type: "image_url", url: imageUrl }
            ],
          },
        ],
      });

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Error generating editing suggestions:', error);
      throw new Error('Failed to generate editing suggestions');
    }
  }
}
