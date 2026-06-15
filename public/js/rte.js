// ===== RICH TEXT EDITOR =====
// Handles toolbar formatting for contenteditable editor

document.addEventListener('DOMContentLoaded', () => {
  const editor = document.getElementById('contentEditor');
  const hiddenContent = document.getElementById('content');
  const toolbar = document.getElementById('rteToolbar');

  if (!editor || !toolbar) return;

  // Clear placeholder on first click
  editor.addEventListener('focus', () => {
    if (editor.innerHTML === '<p>Write your blog content here...</p>') {
      editor.innerHTML = '';
    }
  });

  // Toolbar button click
  toolbar.addEventListener('click', (e) => {
    const btn = e.target.closest('.rte-btn');
    if (!btn) return;
    e.preventDefault();

    const cmd = btn.dataset.cmd;
    const val = btn.dataset.val || null;

    editor.focus();
    document.execCommand(cmd, false, val);

    // Toggle active state for bold/italic/underline
    updateToolbarState();
  });

  // Update active button states on selection change
  document.addEventListener('selectionchange', updateToolbarState);

  function updateToolbarState() {
    const cmds = ['bold', 'italic', 'underline'];
    cmds.forEach((cmd) => {
      const btn = toolbar.querySelector(`[data-cmd="${cmd}"]`);
      if (btn) {
        btn.classList.toggle('rte-btn-active', document.queryCommandState(cmd));
      }
    });
  }
});
