# Images Directory

This folder is intended for your personal images and project screenshots.

### Suggested Files to Add:

1. **`profile.jpg`**: Your personal headshot or avatar (active in `index.html`).
   - Recommended size: 400x400px (square) or 500x500px.
   - Already configured in `index.html` inside `.profile-avatar`:
     ```html
     <img src="images/profile.jpg" alt="Naflan" class="avatar-img" style="width: 100%; height: 100%; object-fit: cover; border-radius: inherit;">
     ```
   - Simply replace `profile.jpg` with your own photo anytime!

2. **Project Screenshots** (`project1.png`, `project2.png`, etc.):
   - Recommended size: 800x500px (16:10 or 16:9 ratio).
   - `project1.png` is currently active for Project 1 in `index.html`.
   - For other projects (`project2.png` to `project6.png`), replace `<div class="project-preview-mockup ...">...</div>` inside `.project-visual` with:
     ```html
     <img src="images/project2.png" alt="Project Screenshot" class="project-img" style="width: 100%; height: 100%; object-fit: cover;">
     ```

3. **`og-preview.png`**: OpenGraph preview image for social media sharing (when your portfolio link is shared on LinkedIn, Twitter, Discord, or WhatsApp).
   - Recommended size: 1200x630px.
