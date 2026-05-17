// ===== AUTHENTICATION LOGIC =====
// This file handles login and register functionality

// ===== LOGIN PAGE LOGIC =====
if (window.location.pathname.includes('login.html')) {
  // Redirect if already logged in
  redirectIfLoggedIn();

  // Get login form element
  const loginForm = document.getElementById('loginForm');

  if (loginForm) {
    // Add submit event listener
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Get form values
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      try {
        // Hide previous error messages
        hideError('errorMessage');

        // Show loading state
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Logging in...';
        submitBtn.disabled = true;

        // Send login request to API
        const response = await apiRequest('/auth/login', 'POST', {
          email,
          password,
        });

        // Save token and user info
        setToken(response.token);
        setCurrentUser(response.user);

        // Show success message
        showSuccess('notification', 'Login successful! Redirecting...');

        // Redirect to dashboard after 1 second
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 1000);
      } catch (error) {
        // Show error message
        showError('errorMessage', error.message || 'Login failed. Please try again.');

        // Reset button
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }
}

// ===== REGISTER PAGE LOGIC =====
if (window.location.pathname.includes('register.html')) {
  // Redirect if already logged in
  redirectIfLoggedIn();

  // Get register form element
  const registerForm = document.getElementById('registerForm');

  if (registerForm) {
    // Add submit event listener
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Get form values
      const username = document.getElementById('username').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirmPassword').value;

      // Validate input
      if (password !== confirmPassword) {
        showError('errorMessage', 'Passwords do not match');
        return;
      }

      if (password.length < 6) {
        showError('errorMessage', 'Password must be at least 6 characters');
        return;
      }

      try {
        // Hide previous error messages
        hideError('errorMessage');

        // Show loading state
        const submitBtn = registerForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Registering...';
        submitBtn.disabled = true;

        // Send register request to API
        const response = await apiRequest('/auth/register', 'POST', {
          username,
          email,
          password,
          confirmPassword,
        });

        // Save token and user info
        setToken(response.token);
        setCurrentUser(response.user);

        // Show success message
        showSuccess('notification', 'Registration successful! Redirecting...');

        // Redirect to dashboard after 1 second
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 1000);
      } catch (error) {
        // Show error message
        showError('errorMessage', error.message || 'Registration failed. Please try again.');

        // Reset button
        const submitBtn = registerForm.querySelector('button[type="submit"]');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }
}
