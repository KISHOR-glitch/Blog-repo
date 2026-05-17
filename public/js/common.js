// ===== COMMON UTILITIES =====
// This file contains common functions used across all pages

// API Base URL (from environment or default)
const API_URL = localStorage.getItem('API_URL') || 'http://localhost:5000/api';

// ===== LOCAL STORAGE UTILITIES =====

// Get JWT token from localStorage
function getToken() {
  return localStorage.getItem('token');
}

// Set JWT token in localStorage
function setToken(token) {
  localStorage.setItem('token', token);
}

// Remove JWT token from localStorage
function removeToken() {
  localStorage.removeItem('token');
}

// Check if user is logged in
function isLoggedIn() {
  return !!getToken();
}

// Get current user from localStorage
function getCurrentUser() {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
}

// Set current user in localStorage
function setCurrentUser(user) {
  localStorage.setItem('currentUser', JSON.stringify(user));
}

// Remove current user from localStorage
function removeCurrentUser() {
  localStorage.removeItem('currentUser');
}

// ===== HTTP HELPER FUNCTIONS =====

// Make API request with authentication
async function apiRequest(endpoint, method = 'GET', data = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    // Add JWT token to Authorization header if user is logged in
    const token = getToken();
    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    // Add request body for POST, PUT, PATCH requests
    if (data) {
      options.body = JSON.stringify(data);
    }

    // Make the request
    const response = await fetch(`${API_URL}${endpoint}`, options);
    const result = await response.json();

    // Check if response is successful
    if (!response.ok) {
      throw new Error(result.message || 'Request failed');
    }

    return result;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// ===== DATE FORMATTING =====

// Format date to readable format
function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

// ===== UI HELPER FUNCTIONS =====

// Show error message
function showError(elementId, message) {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = message;
    element.style.display = 'block';
  }
}

// Hide error message
function hideError(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.style.display = 'none';
  }
}

// Show success message
function showSuccess(elementId, message) {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = message;
    element.style.display = 'block';
  }
}

// Hide success message
function hideSuccess(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.style.display = 'none';
  }
}

// ===== NAVBAR MANAGEMENT =====

// Update navbar based on login status
function updateNavbar() {
  const isUserLoggedIn = isLoggedIn();
  const user = getCurrentUser();

  // Elements that show when logged in
  const loggedInElements = document.querySelectorAll('[id^="nav"]');

  if (isUserLoggedIn) {
    // Hide login and register links
    const loginLink = document.getElementById('navLogin');
    const registerLink = document.getElementById('navRegister');
    if (loginLink) loginLink.style.display = 'none';
    if (registerLink) registerLink.style.display = 'none';

    // Show logged-in links
    const createBlogLink = document.getElementById('navCreateBlog');
    const dashboardLink = document.getElementById('navDashboard');
    const logoutLink = document.getElementById('navLogout');

    if (createBlogLink) createBlogLink.style.display = 'inline-block';
    if (dashboardLink) dashboardLink.style.display = 'inline-block';
    if (logoutLink) logoutLink.style.display = 'inline-block';

    // Add logout functionality
    if (logoutLink) {
      logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
      });
    }

    // Add navigation
    if (dashboardLink) {
      dashboardLink.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'dashboard.html';
      });
    }

    if (createBlogLink) {
      createBlogLink.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'create-blog.html';
      });
    }
  }
}

// Logout function
function logout() {
  removeToken();
  removeCurrentUser();
  showSuccess('notification', 'Logged out successfully');
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 1000);
}

// ===== REDIRECT HELPERS =====

// Redirect to login if not authenticated
function redirectIfNotLoggedIn() {
  if (!isLoggedIn()) {
    window.location.href = 'login.html';
  }
}

// Redirect to home if already logged in
function redirectIfLoggedIn() {
  if (isLoggedIn()) {
    window.location.href = 'index.html';
  }
}

// ===== INITIALIZATION =====

// Initialize common functionality when page loads
document.addEventListener('DOMContentLoaded', () => {
  updateNavbar();
});
