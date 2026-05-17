// ===== BLOG LOGIC =====
// This file handles blog operations for home page, blog details, and create blog

// ===== HOME PAGE - DISPLAY ALL BLOGS =====
if (window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/')) {
  // Load and display all blogs when page loads
  async function loadAllBlogs() {
    try {
      const blogsGrid = document.getElementById('blogsGrid');

      if (blogsGrid) {
        // Show loading message
        blogsGrid.innerHTML = '<p class="loading">Loading blogs...</p>';

        // Fetch all blogs from API
        const response = await apiRequest('/blogs');

        // Check if there are blogs
        if (response.blogs && response.blogs.length > 0) {
          // Display blogs as cards
          displayBlogsAsCards(response.blogs);
        } else {
          // Show message if no blogs
          blogsGrid.innerHTML = '<p class="no-items">No blogs available. Be the first to create one!</p>';
        }
      }
    } catch (error) {
      console.error('Error loading blogs:', error);
      const blogsGrid = document.getElementById('blogsGrid');
      if (blogsGrid) {
        blogsGrid.innerHTML = '<p class="no-items">Error loading blogs. Please refresh the page.</p>';
      }
    }
  }

  // Display blogs as cards in grid
  function displayBlogsAsCards(blogs) {
    const blogsGrid = document.getElementById('blogsGrid');
    if (!blogsGrid) return;

    blogsGrid.innerHTML = '';

    blogs.forEach((blog) => {
      // Create blog card element
      const blogCard = document.createElement('div');
      blogCard.className = 'blog-card';

      // Format date
      const publishDate = formatDate(blog.createdAt);

      // Truncate description
      const description = blog.description.substring(0, 150) + '...';

      // Create card HTML
      blogCard.innerHTML = `
        <div class="blog-card-header">
          <h3>${escapeHtml(blog.title)}</h3>
        </div>
        <div class="blog-card-body">
          <p class="blog-description">${escapeHtml(blog.description)}</p>
          <div class="blog-meta">
            <span class="blog-author">By ${escapeHtml(blog.author.username)}</span>
            <span class="blog-date">${publishDate}</span>
          </div>
        </div>
        <div class="blog-card-footer">
          <button class="btn btn-primary read-more-btn" data-blog-id="${blog._id}">Read More</button>
        </div>
      `;

      // Add click event listener to read more button
      const readMoreBtn = blogCard.querySelector('.read-more-btn');
      readMoreBtn.addEventListener('click', () => {
        window.location.href = `blog-details.html?id=${blog._id}`;
      });

      // Add card to grid
      blogsGrid.appendChild(blogCard);
    });
  }

  // Search functionality
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    let allBlogs = [];

    // Load blogs initially
    async function initializeSearch() {
      try {
        const response = await apiRequest('/blogs');
        allBlogs = response.blogs || [];
      } catch (error) {
        console.error('Error loading blogs for search:', error);
      }
    }

    // Add search event listener
    searchInput.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase();

      // Filter blogs based on search term
      const filteredBlogs = allBlogs.filter((blog) => {
        return (
          blog.title.toLowerCase().includes(searchTerm) ||
          blog.description.toLowerCase().includes(searchTerm) ||
          blog.author.username.toLowerCase().includes(searchTerm)
        );
      });

      // Display filtered blogs
      if (filteredBlogs.length > 0) {
        displayBlogsAsCards(filteredBlogs);
      } else {
        const blogsGrid = document.getElementById('blogsGrid');
        if (blogsGrid) {
          blogsGrid.innerHTML = '<p class="no-items">No blogs found matching your search.</p>';
        }
      }
    });

    // Initialize search on page load
    initializeSearch();
  }

  // Load blogs when page loads
  document.addEventListener('DOMContentLoaded', () => {
    loadAllBlogs();
  });
}

// ===== CREATE BLOG PAGE =====
if (window.location.pathname.includes('create-blog.html')) {
  // Redirect if not logged in
  redirectIfNotLoggedIn();

  // Get create blog form
  const createBlogForm = document.getElementById('createBlogForm');

  if (createBlogForm) {
    // Add submit event listener
    createBlogForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Get form values
      const title = document.getElementById('title').value;
      const description = document.getElementById('description').value;
      const content = document.getElementById('content').value;

      try {
        // Hide previous messages
        hideError('errorMessage');
        hideSuccess('successMessage');

        // Show loading state
        const submitBtn = createBlogForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Creating...';
        submitBtn.disabled = true;

        // Send create blog request to API
        const response = await apiRequest('/blogs', 'POST', {
          title,
          description,
          content,
        });

        // Show success message
        showSuccess('successMessage', 'Blog created successfully! Redirecting...');

        // Reset form
        createBlogForm.reset();

        // Redirect to blog details after 1 second
        setTimeout(() => {
          window.location.href = `blog-details.html?id=${response.blog._id}`;
        }, 1000);
      } catch (error) {
        // Show error message
        showError('errorMessage', error.message || 'Failed to create blog. Please try again.');

        // Reset button
        const submitBtn = createBlogForm.querySelector('button[type="submit"]');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }
}

// ===== EDIT BLOG PAGE =====
if (window.location.pathname.includes('edit-blog.html')) {
  // Redirect if not logged in
  redirectIfNotLoggedIn();

  // Get blog ID from URL query parameter
  const urlParams = new URLSearchParams(window.location.search);
  const blogId = urlParams.get('id');

  if (!blogId) {
    window.location.href = 'index.html';
  }

  // Load blog data on page load
  async function loadBlogForEdit() {
    try {
      // Fetch blog data from API
      const response = await apiRequest(`/blogs/${blogId}`);
      const blog = response.blog;

      // Check if current user is the author
      const currentUser = getCurrentUser();
      if (!currentUser || blog.author._id !== currentUser.id) {
        showError('errorMessage', 'You can only edit your own blogs');
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 2000);
        return;
      }

      // Populate form with blog data
      document.getElementById('title').value = blog.title;
      document.getElementById('description').value = blog.description;
      document.getElementById('content').value = blog.content;
    } catch (error) {
      console.error('Error loading blog:', error);
      showError('errorMessage', 'Blog not found');
    }
  }

  // Load blog data when page loads
  document.addEventListener('DOMContentLoaded', () => {
    loadBlogForEdit();
  });

  // Get edit blog form
  const editBlogForm = document.getElementById('editBlogForm');

  if (editBlogForm) {
    // Add submit event listener
    editBlogForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Get form values
      const title = document.getElementById('title').value;
      const description = document.getElementById('description').value;
      const content = document.getElementById('content').value;

      try {
        // Hide previous messages
        hideError('errorMessage');
        hideSuccess('successMessage');

        // Show loading state
        const submitBtn = editBlogForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Updating...';
        submitBtn.disabled = true;

        // Send update blog request to API
        const response = await apiRequest(`/blogs/${blogId}`, 'PUT', {
          title,
          description,
          content,
        });

        // Show success message
        showSuccess('successMessage', 'Blog updated successfully! Redirecting...');

        // Redirect to blog details after 1 second
        setTimeout(() => {
          window.location.href = `blog-details.html?id=${blogId}`;
        }, 1000);
      } catch (error) {
        // Show error message
        showError('errorMessage', error.message || 'Failed to update blog. Please try again.');

        // Reset button
        const submitBtn = editBlogForm.querySelector('button[type="submit"]');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }
}

// ===== BLOG DETAILS PAGE =====
if (window.location.pathname.includes('blog-details.html')) {
  // Get blog ID from URL query parameter
  const urlParams = new URLSearchParams(window.location.search);
  const blogId = urlParams.get('id');

  if (!blogId) {
    window.location.href = 'index.html';
  }

  // Load blog details
  async function loadBlogDetails() {
    try {
      const blogContent = document.getElementById('blogContent');

      // Fetch blog data from API
      const response = await apiRequest(`/blogs/${blogId}`);
      const blog = response.blog;

      // Format date
      const publishDate = formatDate(blog.createdAt);

      // Check if current user is the author
      const currentUser = getCurrentUser();
      const isAuthor = currentUser && blog.author._id === currentUser.id;

      // Create blog HTML
      let actionsHtml = '';
      if (isAuthor) {
        actionsHtml = `
          <div class="blog-actions">
            <a href="edit-blog.html?id=${blog._id}" class="btn btn-primary">Edit</a>
            <button class="btn btn-danger" id="deleteBlogBtn">Delete</button>
          </div>
        `;
      }

      const blogHTML = `
        <div class="blog-details-header">
          <h1>${escapeHtml(blog.title)}</h1>
          <div class="blog-details-meta">
            <span class="blog-author">By ${escapeHtml(blog.author.username)}</span>
            <span class="blog-date">${publishDate}</span>
            <span class="blog-views">${blog.views} views</span>
          </div>
        </div>
        <div class="blog-details-content">
          ${escapeHtml(blog.content)}
        </div>
        ${actionsHtml}
      `;

      blogContent.innerHTML = blogHTML;

      // Add delete button functionality
      const deleteBtn = document.getElementById('deleteBlogBtn');
      if (deleteBtn) {
        deleteBtn.addEventListener('click', async () => {
          if (confirm('Are you sure you want to delete this blog?')) {
            try {
              await apiRequest(`/blogs/${blogId}`, 'DELETE');
              showSuccess('notification', 'Blog deleted successfully! Redirecting...');
              setTimeout(() => {
                window.location.href = 'index.html';
              }, 1000);
            } catch (error) {
              showError('errorMessage', error.message || 'Failed to delete blog');
            }
          }
        });
      }
    } catch (error) {
      console.error('Error loading blog:', error);
      const blogContent = document.getElementById('blogContent');
      if (blogContent) {
        blogContent.innerHTML = '<p class="no-items">Blog not found</p>';
      }
    }
  }

  // Load comments
  async function loadComments() {
    try {
      const response = await apiRequest(`/blogs/${blogId}`);
      const blog = response.blog;

      const commentsList = document.getElementById('commentsList');
      if (!commentsList) return;

      // Check if there are comments
      if (blog.comments && blog.comments.length > 0) {
        commentsList.innerHTML = '';

        // Display each comment
        blog.comments.forEach((comment) => {
          const commentDate = formatDate(comment.createdAt);
          const currentUser = getCurrentUser();
          const isCommentAuthor = currentUser && comment.author._id === currentUser.id;

          let deleteBtn = '';
          if (isCommentAuthor) {
            deleteBtn = `
              <button class="btn btn-danger delete-comment-btn" data-comment-id="${comment._id}">Delete</button>
            `;
          }

          const commentHTML = `
            <div class="comment-item">
              <div class="comment-author">${escapeHtml(comment.author.username)}</div>
              <div class="comment-date">${commentDate}</div>
              <div class="comment-text">${escapeHtml(comment.text)}</div>
              <div class="comment-actions">
                ${deleteBtn}
              </div>
            </div>
          `;

          const commentElement = document.createElement('div');
          commentElement.innerHTML = commentHTML;
          commentsList.appendChild(commentElement);

          // Add delete comment functionality
          const deleteCommentBtn = commentElement.querySelector('.delete-comment-btn');
          if (deleteCommentBtn) {
            deleteCommentBtn.addEventListener('click', async () => {
              if (confirm('Are you sure you want to delete this comment?')) {
                try {
                  await apiRequest(`/comments/${comment._id}`, 'DELETE');
                  loadComments(); // Reload comments
                } catch (error) {
                  console.error('Error deleting comment:', error);
                }
              }
            });
          }
        });
      } else {
        commentsList.innerHTML = '<p class="no-items">No comments yet. Be the first to comment!</p>';
      }
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  }

  // Load blog details and comments when page loads
  document.addEventListener('DOMContentLoaded', () => {
    loadBlogDetails();
    loadComments();

    // Show comment form if logged in
    const commentForm = document.getElementById('commentForm');
    const submitCommentBtn = document.getElementById('submitCommentBtn');
    const commentText = document.getElementById('commentText');

    if (isLoggedIn() && commentForm && submitCommentBtn) {
      commentForm.style.display = 'block';

      submitCommentBtn.addEventListener('click', async () => {
        const text = commentText.value;

        if (!text.trim()) {
          alert('Please enter a comment');
          return;
        }

        try {
          await apiRequest(`/comments/${blogId}`, 'POST', { text });
          commentText.value = ''; // Clear comment box
          loadComments(); // Reload comments
        } catch (error) {
          console.error('Error adding comment:', error);
          alert('Failed to add comment');
        }
      });
    }
  });
}

// ===== HELPER FUNCTION: Escape HTML =====
// Prevents XSS attacks by escaping special characters
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
