const Photographer = require('../models/photographer.model');
const User = require('../models/user.model');
const Review = require('../models/review.model');
// const { uploadToCloudinary } = require('../services/storage.service'); // Uncomment if needed

exports.getAllPhotographers = async (req, res) => {
  try {
    const { page = 1, limit = 10, sortBy = 'rating', sortOrder = 'desc' } = req.query;
    const skip = (page - 1) * limit;
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    const photographers = await Photographer.find({ isActive: true })
      .populate('userId', 'name email profileImage')
      .sort(sortOptions)
      .limit(parseInt(limit))
      .skip(skip);
    const total = await Photographer.countDocuments({ isActive: true });
    res.json({
      success: true,
      photographers,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalPhotographers: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get all photographers error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching photographers'
    });
  }
};

exports.searchPhotographers = async (req, res) => {
  try {
    const { 
      query, 
      location, 
      specialty, 
      minPrice, 
      maxPrice, 
      minRating,
      page = 1, 
      limit = 10 
    } = req.query;
    const skip = (page - 1) * limit;
    const filter = { isActive: true };
    if (query) {
      filter.$text = { $search: query };
    }
    if (location) {
      filter['location.city'] = { $regex: location, $options: 'i' };
    }
    if (specialty) {
      filter.specialties = specialty;
    }
    if (minPrice || maxPrice) {
      filter.hourlyRate = {};
      if (minPrice) filter.hourlyRate.$gte = parseFloat(minPrice);
      if (maxPrice) filter.hourlyRate.$lte = parseFloat(maxPrice);
    }
    if (minRating) {
      filter['rating.average'] = { $gte: parseFloat(minRating) };
    }
    const photographers = await Photographer.find(filter)
      .populate('userId', 'name email profileImage')
      .sort({ 'rating.average': -1 })
      .limit(parseInt(limit))
      .skip(skip);
    const total = await Photographer.countDocuments(filter);
    res.json({
      success: true,
      photographers,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalPhotographers: total
      }
    });
  } catch (error) {
    console.error('Search photographers error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching photographers'
    });
  }
};

exports.getPhotographerById = async (req, res) => {
  try {
    const { id } = req.params;
    const photographer = await Photographer.findById(id)
      .populate('userId', 'name email profileImage phone');
    if (!photographer) {
      return res.status(404).json({
        success: false,
        message: 'Photographer not found'
      });
    }
    const reviewsCount = await Review.countDocuments({ photographerId: id });
    res.json({
      success: true,
      photographer: {
        ...photographer.toObject(),
        reviewsCount
      }
    });
  } catch (error) {
    console.error('Get photographer by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching photographer'
    });
  }
};

exports.getPhotographerPortfolio = async (req, res) => {
  try {
    const { id } = req.params;
    const photographer = await Photographer.findById(id).select('portfolio');
    if (!photographer) {
      return res.status(404).json({
        success: false,
        message: 'Photographer not found'
      });
    }
    res.json({
      success: true,
      portfolio: photographer.portfolio
    });
  } catch (error) {
    console.error('Get portfolio error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching portfolio'
    });
  }
};

exports.getPhotographerReviews = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    const reviews = await Review.find({ photographerId: id })
      .populate('clientId', 'name profileImage')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);
    const total = await Review.countDocuments({ photographerId: id });
    res.json({
      success: true,
      reviews,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalReviews: total
      }
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reviews'
    });
  }
};

exports.createProfile = async (req, res) => {
  // Validation logic removed for CommonJS conversion
  try {
    // Check if user is a photographer
    if (req.user.role !== 'photographer') {
      return res.status(403).json({
        success: false,
        message: 'Only photographers can create profiles'
      });
    }
    // Check if profile already exists
    const existingProfile = await Photographer.findOne({ userId: req.user.id });
    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message: 'Profile already exists'
      });
    }
    const profileData = {
      userId: req.user.id,
      ...req.body
    };
    const photographer = await Photographer.create(profileData);
    res.status(201).json({
      success: true,
      photographer
    });
  } catch (error) {
    console.error('Create profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating profile'
    });
  }
};

exports.updateProfile = async (req, res) => {
  // Validation logic removed for CommonJS conversion
  try {
    const photographer = await Photographer.findOne({ userId: req.user.id });
    if (!photographer) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        photographer[key] = req.body[key];
      }
    });
    await photographer.save();
    res.json({
      success: true,
      photographer
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile'
    });
  }
};

exports.addPortfolioItem = async (req, res) => {
  try {
    const photographer = await Photographer.findOne({ userId: req.user.id });
    
    if (!photographer) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    const { title, description, category } = req.body;
    const images = req.files;

    if (!images || images.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one image is required'
      });
    }

    const uploadedImages = [];
    
    for (const image of images) {
      const result = await uploadToCloudinary(image.path);
      uploadedImages.push({
        title,
        description,
        category,
        imageUrl: result.secure_url
      });
    }

    photographer.portfolio.push(...uploadedImages);
    await photographer.save();

    res.json({
      success: true,
      portfolio: photographer.portfolio
    });
  } catch (error) {
    console.error('Add portfolio item error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding portfolio item'
    });
  }
};

exports.removePortfolioItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    
    const photographer = await Photographer.findOne({ userId: req.user.id });
    
    if (!photographer) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    const itemIndex = photographer.portfolio.findIndex(item => item._id.toString() === itemId);
    
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio item not found'
      });
    }

    photographer.portfolio.splice(itemIndex, 1);
    await photographer.save();

    res.json({
      success: true,
      message: 'Portfolio item removed successfully'
    });
  } catch (error) {
    console.error('Remove portfolio item error:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing portfolio item'
    });
  }
};

exports.updateAvailability = async (req, res) => {
  try {
    const { availability } = req.body;
    
    const photographer = await Photographer.findOne({ userId: req.user.id });
    
    if (!photographer) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    photographer.availability = availability;
    await photographer.save();

    res.json({
      success: true,
      availability: photographer.availability
    });
  } catch (error) {
    console.error('Update availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating availability'
    });
  }
};

exports.verifyPhotographer = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const photographer = await Photographer.findByIdAndUpdate(
      id,
      { isVerified: true },
      { new: true }
    );

    if (!photographer) {
      return res.status(404).json({
        success: false,
        message: 'Photographer not found'
      });
    }

    res.json({
      success: true,
      photographer
    });
  } catch (error) {
    console.error('Verify photographer error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying photographer'
    });
  }
};

exports.updatePhotographerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const photographer = await Photographer.findByIdAndUpdate(
      id,
      { isActive },
      { new: true }
    );

    if (!photographer) {
      return res.status(404).json({
        success: false,
        message: 'Photographer not found'
      });
    }

    res.json({
      success: true,
      photographer
    });
  } catch (error) {
    console.error('Update photographer status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating photographer status'
    });
  }
}; 