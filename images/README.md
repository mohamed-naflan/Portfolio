# Images Directory

This folder is intended for your personal images and project screenshots.

### Suggested Files to Add:

1. **`profile.jpg`**: Your personal headshot or avatar.
   - Recommended size: 400x400px (square) or 500x500px.
   - In `index.html` (around line 125), replace the `<div class="avatar-placeholder">...</div>` with:
     ```html
     <img src="images/profile.jpg" alt="Naflan" class="avatar-img" style="width: 100%; height: 100%; object-fit: cover; border-radius: inherit;">
     ```

2. **Project Screenshots** (`project1.png`, `project2.png`, etc.):
   - Recommended size: 800x500px (16:10 or 16:9 ratio).
   - In `index.html` inside each `.project-visual`, replace `<div class="project-preview-mockup ...">...</div>` with:
     ```html
     <img src="images/project1.png" alt="Project Screenshot" style="width: 100%; height: 100%; object-fit: cover;">
     ```

3. **`og-preview.png`**: OpenGraph preview image for social media sharing (when your portfolio link is shared on LinkedIn, Twitter, Discord, or WhatsApp).
   - Recommended size: 1200x630px.
