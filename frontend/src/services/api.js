const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.isBackendAvailable = true;
  }

  // Helper method to get auth headers
  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Generic request method with better error handling
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      this.isBackendAvailable = true;
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      
      // Check if it's a network error (backend not available)
      if (error.name === 'TypeError' || error.message.includes('Failed to fetch')) {
        this.isBackendAvailable = false;
        throw new Error('Backend server is not available. Please try again later.');
      }
      
      throw error;
    }
  }

  // Check if backend is available
  async checkBackendHealth() {
    try {
      await fetch(`${this.baseURL}/health`, { method: 'GET' });
      this.isBackendAvailable = true;
      return true;
    } catch (error) {
      this.isBackendAvailable = false;
      return false;
    }
  }

  // Auth endpoints
  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // Photographer endpoints
  async getPhotographers(params = {}) {
    try {
      return await this.request(`/photographers?${new URLSearchParams(params).toString()}`);
    } catch (error) {
      // Return sample data if backend is not available
      if (!this.isBackendAvailable) {
        console.warn('Backend not available, using sample data');
        return this.getSamplePhotographers();
      }
      throw error;
    }
  }

  async getPhotographer(id) {
    try {
      return await this.request(`/photographers/${id}`);
    } catch (error) {
      // Return sample data if backend is not available
      if (!this.isBackendAvailable) {
        console.warn('Backend not available, using sample data');
        return this.getSamplePhotographer(id);
      }
      throw error;
    }
  }

  async createPhotographerProfile(profileData) {
    return this.request('/photographers', {
      method: 'POST',
      body: JSON.stringify(profileData),
    });
  }

  async updatePhotographerProfile(id, profileData) {
    return this.request(`/photographers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Booking endpoints
  async createBooking(bookingData) {
    return this.request('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  async getBookings(params = {}) {
    try {
      return await this.request(`/bookings?${new URLSearchParams(params).toString()}`);
    } catch (error) {
      // Return empty array if backend is not available
      if (!this.isBackendAvailable) {
        console.warn('Backend not available, returning empty bookings');
        return [];
      }
      throw error;
    }
  }

  async getBooking(id) {
    return this.request(`/bookings/${id}`);
  }

  async updateBooking(id, bookingData) {
    return this.request(`/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(bookingData),
    });
  }

  async cancelBooking(id) {
    return this.request(`/bookings/${id}/cancel`, {
      method: 'PUT',
    });
  }

  // Review endpoints
  async createReview(reviewData) {
    return this.request('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  }

  async getReviews(photographerId) {
    try {
      return await this.request(`/reviews/photographer/${photographerId}`);
    } catch (error) {
      // Return sample reviews if backend is not available
      if (!this.isBackendAvailable) {
        console.warn('Backend not available, using sample reviews');
        return this.getSampleReviews();
      }
      throw error;
    }
  }

  // Message endpoints
  async sendMessage(messageData) {
    return this.request('/messages', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  }

  async getMessages(conversationId) {
    return this.request(`/messages/conversation/${conversationId}`);
  }

  async getConversations() {
    return this.request('/messages/conversations');
  }

  // Payment endpoints
  async createPaymentIntent(bookingId) {
    return this.request(`/payments/create-intent/${bookingId}`, {
      method: 'POST',
    });
  }

  async confirmPayment(paymentData) {
    return this.request('/payments/confirm', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  // Upload endpoints
  async uploadImage(file, type = 'profile') {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', type);

    return this.request('/upload/image', {
      method: 'POST',
      headers: {
        Authorization: this.getAuthHeaders().Authorization,
      },
      body: formData,
    });
  }

  // Search and filter endpoints
  async searchPhotographers(query) {
    try {
      return await this.request(`/photographers/search?q=${encodeURIComponent(query)}`);
    } catch (error) {
      // Return filtered sample data if backend is not available
      if (!this.isBackendAvailable) {
        console.warn('Backend not available, using sample search data');
        return this.getSamplePhotographers().filter(p => 
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.specialty.toLowerCase().includes(query.toLowerCase())
        );
      }
      throw error;
    }
  }

  async getCategories() {
    try {
      return await this.request('/categories');
    } catch (error) {
      // Return sample categories if backend is not available
      if (!this.isBackendAvailable) {
        console.warn('Backend not available, using sample categories');
        return this.getSampleCategories();
      }
      throw error;
    }
  }

  async getLocations() {
    try {
      return await this.request('/locations');
    } catch (error) {
      // Return sample locations if backend is not available
      if (!this.isBackendAvailable) {
        console.warn('Backend not available, using sample locations');
        return this.getSampleLocations();
      }
      throw error;
    }
  }

  // Analytics endpoints
  async getPhotographerAnalytics(photographerId, period = 'month') {
    return this.request(`/analytics/photographer/${photographerId}?period=${period}`);
  }

  async getUserAnalytics(userId, period = 'month') {
    return this.request(`/analytics/user/${userId}?period=${period}`);
  }

  // Sample data methods for fallback
  getSamplePhotographers() {
    return [
      {
        id: 1,
        name: "Sarah Johnson",
        specialty: "Wedding Photography",
        location: "Mumbai, Maharashtra",
        rating: 4.9,
        reviewCount: 127,
        hourlyRate: 2500,
        profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
        bio: "Award-winning wedding photographer with 8+ years of experience capturing love stories across India.",
        categories: ["Wedding", "Engagement", "Pre-wedding"]
      },
      {
        id: 2,
        name: "Rahul Sharma",
        specialty: "Event Photography",
        location: "Delhi, NCR",
        rating: 4.8,
        reviewCount: 89,
        hourlyRate: 1800,
        profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
        bio: "Dynamic event photographer capturing corporate events, parties, and celebrations.",
        categories: ["Event", "Corporate", "Party"]
      }
    ];
  }

  getSamplePhotographer(id) {
    const photographers = this.getSamplePhotographers();
    return photographers.find(p => p.id === parseInt(id)) || photographers[0];
  }

  getSampleReviews() {
    return [
      {
        id: 1,
        user: "Priya & Raj",
        rating: 5,
        comment: "Amazing work! Highly recommended!",
        date: "2024-01-15"
      }
    ];
  }

  getSampleCategories() {
    return [
      { id: 1, name: "Wedding", icon: "💒" },
      { id: 2, name: "Event", icon: "🎉" },
      { id: 3, name: "Portrait", icon: "📸" }
    ];
  }

  getSampleLocations() {
    return [
      "Mumbai, Maharashtra",
      "Delhi, NCR",
      "Bangalore, Karnataka",
      "Hyderabad, Telangana"
    ];
  }
}

export default new ApiService(); 