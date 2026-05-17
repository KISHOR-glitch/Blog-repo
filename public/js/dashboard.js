// ===== DASHBOARD LOGIC =====
// This file handles dashboard functionality for logged-in users

// Redirect if not logged in
redirectIfNotLoggedIn();

// Load user data and display on dashboard
async function loadDashboardData() {
  try {
    // Fetch current user data
    const response = await apiRequest('/auth/me');
    const user = response.user;

    // Display user information
    const usernameSpan = document.getElementById('username');
    const emailSpan = document.getElementById('email');
    const welcomeMessage = document.getElementById('welcomeMessage');

    if (usernameSpan) usernameSpan.textContent = escapeHtml(user.username);
    if (emailSpan) emailSpan.textContent = escapeHtml(user.email);
    if (welcomeMessage) welcomeMessage.textContent = `Welcome back, ${escapeHtml(user.username)}!`;
  } catch (error) {
    console.error('Error loading user data:', error);
  }
}

// Load user's blogs
async function loadUserBlogs() {
  try {
    const myBlogsGrid = document.getElementById('myBlogsGrid');

    if (myBlogsGrid) {
      // Show loading message
      myBlogsGrid.innerHTML = '<p class="loading">Loading your blogs...</p>';

      // Fetch user's blogs from API
      const response = await apiRequest('/blogs/user/my-blogs');

      // Check if there are blogs
      if (response.blogs && response.blogs.length > 0) {
        // Display blogs as cards
        displayUserBlogsAsCards(response.blogs);
      } else {
        // Show message if no blogs
        myBlogsGrid.innerHTML = `
          <div class="no-items">
            <p>You haven't created any blogs yet.</p>
            <a href="create-blog.html" class="btn btn-primary">Create Your First Blog</a>
          </div>
        `;
      }
    }
  } catch (error) {
    console.error('Error loading user blogs:', error);
    const myBlogsGrid = document.getElementById('myBlogsGrid');
    if (myBlogsGrid) {
      myBlogsGrid.innerHTML = '<p class="no-items">Error loading your blogs. Please refresh the page.</p>';
    }
  }
}

// Display user blogs as cards in grid
function displayUserBlogsAsCards(blogs) {
  const myBlogsGrid = document.getElementById('myBlogsGrid');
  if (!myBlogsGrid) return;

  myBlogsGrid.innerHTML = '';

  blogs.forEach((blog) => {
    // Create blog card element
    const blogCard = document.createElement('div');
    blogCard.className = 'my-blog-card';

    // Format date
    const publishDate = formatDate(blog.createdAt);

    // Create card HTML
    blogCard.innerHTML = `
      <div class="my-blog-card-content">
        <h3>${escapeHtml(blog.title)}</h3>
        <p>${escapeHtml(blog.description)}</p>
        <div class="blog-meta">
          <span class="blog-date">${publishDate}</span>
          <span class="blog-comments">${blog.comments.length} comments</span>
          <span class="blog-views">${blog.views} views</span>
        </div>
      </div>
      <div class="my-blog-card-footer">
        <a href="blog-details.html?id=${blog._id}" class="btn btn-primary">View</a>
        <a href="edit-blog.html?id=${blog._id}" class="btn btn-secondary">Edit</a>
        <button class="btn btn-danger delete-blog-btn" data-blog-id="${blog._id}">Delete</button>
      </div>
    `;

    // Add delete functionality
    const deleteBtn = blogCard.querySelector('.delete-blog-btn');
    deleteBtn.addEventListener('click', async () => {
      if (confirm('Are you sure you want to delete this blog?')) {
        try {
          await apiRequest(`/blogs/${blog._id}`, 'DELETE');
          loadUserBlogs(); // Reload blogs after deletion
        } catch (error) {
          console.error('Error deleting blog:', error);
          alert('Failed to delete blog');
        }
      }
    });

    // Add card to grid
    myBlogsGrid.appendChild(blogCard);
  });
}

// Helper function to escape HTML
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

// Load dashboard data when page loads
document.addEventListener('DOMContentLoaded', () => {
  loadDashboardData();
  loadUserBlogs();
});
