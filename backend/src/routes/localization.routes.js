import express from 'express';
import { LocalizationService } from '../services/localization.service.js';
import { asyncHandler } from '../middleware/error.middleware.js';

const router = express.Router();
const localizationService = new LocalizationService();

// Get translations for a specific language
router.get('/translations/:language', asyncHandler(async (req, res) => {
  const translations = await localizationService.loadTranslations(req.params.language);
  res.json({ success: true, translations });
}));

// Get cultural events for a location
router.get('/cultural-events', asyncHandler(async (req, res) => {
  const { location, language = 'en' } = req.query;
  const events = await localizationService.getCulturalEvents(location, language);
  res.json({ success: true, events });
}));

// Get localized photography packages
router.get('/packages', asyncHandler(async (req, res) => {
  const { location, language = 'en' } = req.query;
  const packages = await localizationService.getLocalizedPackages(location, language);
  res.json({ success: true, packages });
}));

// Get location-specific photography styles
router.get('/styles', asyncHandler(async (req, res) => {
  const { location, language = 'en' } = req.query;
  const styles = await localizationService.getLocalStyles(location, language);
  res.json({ success: true, styles });
}));

// Translate text
router.post('/translate', asyncHandler(async (req, res) => {
  const { text, targetLanguage } = req.body;
  const translatedText = await localizationService.translateText(text, targetLanguage);
  res.json({ success: true, translatedText });
}));

export default router;
