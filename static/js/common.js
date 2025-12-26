// Common functionality for all pages

document.addEventListener('DOMContentLoaded', () => {
    injectHeader();
    injectFooter();
    // Initialize common components if any
});

function injectHeader() {
    const headerHtml = `
    <nav class="navbar" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <a class="navbar-item" href="index.html">
          <span class="icon" style="margin-right: 5px;">
              <img src="static/images/favicon.ico" alt="SWIFTraj Logo">
          </span>
          <img src="static/images/SWIFTraj.jpg" alt="SWIFTraj" style="height: 1.5rem; width: auto; margin-right: 5px;">
          
          <!-- <strong>SWIFTraj</strong> -->
        </a>
        
        <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div id="navbarBasicExample" class="navbar-menu">
        <div class="navbar-start">
          <a class="navbar-item" href="index.html">Home</a>
          <a class="navbar-item" href="data-description.html">Data Description</a>
          <a class="navbar-item" href="tools.html">Tools</a>
          <a class="navbar-item" href="publications.html">Publications</a>
          <a class="navbar-item" href="download.html">Download</a>
          <a class="navbar-item" href="contributors.html">Contributors</a>
        </div>
      </div>
    </nav>
    `;

    // Insert at the beginning of body
    document.body.insertAdjacentHTML('afterbegin', headerHtml);

    // Navbar burger logic
    const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
    if ($navbarBurgers.length > 0) {
        $navbarBurgers.forEach( el => {
            el.addEventListener('click', () => {
                const target = el.dataset.target;
                const $target = document.getElementById(target);
                el.classList.toggle('is-active');
                $target.classList.toggle('is-active');
            });
        });
    }
}

function injectFooter() {
    const footerHtml = `
    <footer class="footer">
      <div class="container">
        <div class="content has-text-centered">
          <p class="title is-4">Contact</p>
          <p>
            We would love to hear your feedback on the SWIFTraj dataset.<br>
            Feel free to send us your questions and comments.
          </p>
          <p>
            <strong>Email:</strong> <a href="mailto:yuhan@seu.edu.cn" target="_blank">Yu Han</a>, Associate Professor, Southeast University
          </p>
          <p>
            &copy; ${new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </div>
    </footer>
    `;
    
    // Insert at the end of body
    document.body.insertAdjacentHTML('beforeend', footerHtml);
}

// Helper to load Markdown content
// 用于加载 Markdown 内容的辅助函数
async function loadMarkdown(elementId, filePath) {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    // Cache-bust to avoid stale content
    const url = filePath + (filePath.includes('?') ? '&' : '?') + 'v=' + Date.now();
    console.log('[loadMarkdown] Fetching:', url);
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const text = await response.text();
    console.log('[loadMarkdown] Response preview:', (text || '').slice(0, 120));
    // Basic guard: if empty, show a friendly note
    if (!text || !text.trim()) {
      element.innerHTML = "<p>No content found in the markdown file.</p>";
      return;
    }
    element.innerHTML = marked.parse(text);
  } catch (e) {
    console.error("Error loading markdown:", e);
    element.innerHTML = "<p>Error loading content. If you are opening the file directly from disk, please run a local server (e.g., python -m http.server) due to browser restrictions.</p>";
  }
}
