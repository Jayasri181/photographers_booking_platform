import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunks
export const fetchPhotographers = createAsyncThunk(
  'photographers/fetchPhotographers',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.getPhotographers(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPhotographer = createAsyncThunk(
  'photographers/fetchPhotographer',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.getPhotographer(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createPhotographerProfile = createAsyncThunk(
  'photographers/createProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await api.createPhotographerProfile(profileData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updatePhotographerProfile = createAsyncThunk(
  'photographers/updateProfile',
  async ({ id, profileData }, { rejectWithValue }) => {
    try {
      const response = await api.updatePhotographerProfile(id, profileData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const searchPhotographers = createAsyncThunk(
  'photographers/search',
  async (query, { rejectWithValue }) => {
    try {
      const response = await api.searchPhotographers(query);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  photographers: [],
  currentPhotographer: null,
  loading: false,
  error: null,
  filters: {
    location: '',
    category: '',
    priceRange: '',
    rating: '',
  },
};

const photographerSlice = createSlice({
  name: 'photographers',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        location: '',
        category: '',
        priceRange: '',
        rating: '',
      };
    },
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentPhotographer: (state) => {
      state.currentPhotographer = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Photographers
      .addCase(fetchPhotographers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPhotographers.fulfilled, (state, action) => {
        state.loading = false;
        state.photographers = action.payload;
        state.error = null;
      })
      .addCase(fetchPhotographers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Single Photographer
      .addCase(fetchPhotographer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPhotographer.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPhotographer = action.payload;
        state.error = null;
      })
      .addCase(fetchPhotographer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Profile
      .addCase(createPhotographerProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPhotographerProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.photographers.push(action.payload);
        state.error = null;
      })
      .addCase(createPhotographerProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Profile
      .addCase(updatePhotographerProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePhotographerProfile.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.photographers.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.photographers[index] = action.payload;
        }
        if (state.currentPhotographer?.id === action.payload.id) {
          state.currentPhotographer = action.payload;
        }
        state.error = null;
      })
      .addCase(updatePhotographerProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Search Photographers
      .addCase(searchPhotographers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchPhotographers.fulfilled, (state, action) => {
        state.loading = false;
        state.photographers = action.payload;
        state.error = null;
      })
      .addCase(searchPhotographers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, clearFilters, clearError, clearCurrentPhotographer } = photographerSlice.actions;
export default photographerSlice.reducer; 