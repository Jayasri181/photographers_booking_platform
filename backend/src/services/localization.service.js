import i18next from 'i18next';
import { sequelize } from '../config/database.js';

export class LocalizationService {
  constructor() {
    this.supportedLanguages = ['en', 'hi', 'ta', 'te', 'bn', 'mr']; // English, Hindi, Tamil, Telugu, Bengali, Marathi
    this.setupI18n();
  }

  // Initialize i18next
  async setupI18n() {
    try {
      // Load translations from database
      const translations = await this.loadTranslations();
      
      await i18next.init({
        resources: translations,
        fallbackLng: 'en',
        defaultNS: 'common',
        interpolation: {
          escapeValue: false
        }
      });
    } catch (error) {
      console.error('Error setting up i18n:', error);
    }
  }

  // Load translations from database
  async loadTranslations() {
    try {
      const translations = await sequelize.query(`
        SELECT 
          language_code,
          namespace,
          translations
        FROM translations
      `, {
        type: sequelize.QueryTypes.SELECT
      });

      // Format translations for i18next
      return translations.reduce((acc, curr) => {
        if (!acc[curr.language_code]) {
          acc[curr.language_code] = {};
        }
        acc[curr.language_code][curr.namespace] = curr.translations;
        return acc;
      }, {});
    } catch (error) {
      console.error('Error loading translations:', error);
      throw new Error('Failed to load translations');
    }
  }

  // Get cultural events and festivals
  async getCulturalEvents(location, language = 'en') {
    try {
      const events = await sequelize.query(`
        SELECT 
          name,
          description,
          start_date,
          end_date,
          location,
          cultural_significance,
          photography_opportunities,
          translations->:language as localized_content
        FROM cultural_events
        WHERE 
          location = :location
          AND end_date >= CURRENT_DATE
        ORDER BY start_date ASC
      `, {
        replacements: { location, language },
        type: sequelize.QueryTypes.SELECT
      });

      return events;
    } catch (error) {
      console.error('Error getting cultural events:', error);
      throw new Error('Failed to get cultural events');
    }
  }

  // Get localized photography packages
  async getLocalizedPackages(location, language = 'en') {
    try {
      const packages = await sequelize.query(`
        SELECT 
          p.*,
          pt.name->:language as localized_name,
          pt.description->:language as localized_description,
          ce.name as cultural_event_name,
          ce.description as cultural_event_description
        FROM photography_packages p
        LEFT JOIN package_translations pt ON p.id = pt.package_id
        LEFT JOIN cultural_events ce ON p.cultural_event_id = ce.id
        WHERE p.location = :location
        AND p.is_active = true
      `, {
        replacements: { location, language },
        type: sequelize.QueryTypes.SELECT
      });

      return packages;
    } catch (error) {
      console.error('Error getting localized packages:', error);
      throw new Error('Failed to get localized packages');
    }
  }

  // Get location-specific photography styles
  async getLocalStyles(location, language = 'en') {
    try {
      const styles = await sequelize.query(`
        SELECT 
          s.*,
          st.name->:language as localized_name,
          st.description->:language as localized_description,
          array_agg(DISTINCT t.tag_name->:language) as style_tags
        FROM photography_styles s
        LEFT JOIN style_translations st ON s.id = st.style_id
        LEFT JOIN style_tags t ON s.id = t.style_id
        WHERE s.location = :location
        GROUP BY s.id, st.name, st.description
      `, {
        replacements: { location, language },
        type: sequelize.QueryTypes.SELECT
      });

      return styles;
    } catch (error) {
      console.error('Error getting local styles:', error);
      throw new Error('Failed to get local styles');
    }
  }

  // Translate text using external translation API
  async translateText(text, targetLanguage) {
    try {
      // Implement translation logic using a service like Google Translate API
      // This is a placeholder implementation
      return text;
    } catch (error) {
      console.error('Error translating text:', error);
      throw new Error('Failed to translate text');
    }
  }
}
