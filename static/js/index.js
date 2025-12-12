window.HELP_IMPROVE_VIDEOJS = false;

// Language Management
let currentLanguage = localStorage.getItem('selectedLanguage') || 'zh';

// Switch language
function switchLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('selectedLanguage', lang);
    
    // Update button states
    document.getElementById('lang-zh').classList.toggle('active', lang === 'zh');
    document.getElementById('lang-en').classList.toggle('active', lang === 'en');
    
    // Update static section titles based on language
    updateStaticTitles(lang);
    
    // Reload content
    loadMarkdownContent();
}

// Update static section titles based on language
function updateStaticTitles(lang) {
    const translations = {
        'zh': {
            'abstract': '摘要',
            'poster': 'Poster',
            'bibtex': 'BibTeX'
        },
        'en': {
            'abstract': 'Abstract',
            'poster': 'Poster',
            'bibtex': 'BibTeX'
        }
    };
    
    const abstractTitle = document.getElementById('abstract-title');
    if (abstractTitle) {
        abstractTitle.textContent = translations[lang].abstract;
    }
}

// Initialize language on page load
function initializeLanguage() {
    const langZh = document.getElementById('lang-zh');
    const langEn = document.getElementById('lang-en');
    
    if (currentLanguage === 'zh') {
        langZh?.classList.add('active');
        langEn?.classList.remove('active');
    } else {
        langZh?.classList.remove('active');
        langEn?.classList.add('active');
    }
}

// Get content file based on language
function getContentFile() {
    return currentLanguage === 'en' ? 'page-content-en.md' : 'page-content.md';
}

// Copy BibTeX to clipboard
function copyBibTeX() {
    const bibtexElement = document.getElementById('bibtex-code');
    const button = document.querySelector('.copy-bibtex-btn');
    const copyText = button.querySelector('.copy-text');
    
    if (bibtexElement) {
        navigator.clipboard.writeText(bibtexElement.textContent).then(function() {
            // Success feedback
            button.classList.add('copied');
            copyText.textContent = 'Cop';
            
            setTimeout(function() {
                button.classList.remove('copied');
                copyText.textContent = 'Copy';
            }, 2000);
        }).catch(function(err) {
            console.error('Failed to copy: ', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = bibtexElement.textContent;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            button.classList.add('copied');
            copyText.textContent = 'Cop';
            setTimeout(function() {
                button.classList.remove('copied');
                copyText.textContent = 'Copy';
            }, 2000);
        });
    }
}

// Scroll to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Show/hide scroll to top button
window.addEventListener('scroll', function() {
    const scrollButton = document.querySelector('.scroll-to-top');
    if (window.pageYOffset > 300) {
        scrollButton.classList.add('visible');
    } else {
        scrollButton.classList.remove('visible');
    }
});

// Video carousel autoplay when in view
function setupVideoCarouselAutoplay() {
    const carouselVideos = document.querySelectorAll('.results-carousel video');
    
    if (carouselVideos.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            if (entry.isIntersecting) {
                // Video is in view, play it
                video.play().catch(e => {
                    // Autoplay failed, probably due to browser policy
                    console.log('Autoplay prevented:', e);
                });
            } else {
                // Video is out of view, pause it
                video.pause();
            }
        });
    }, {
        threshold: 0.5 // Trigger when 50% of the video is visible
    });
    
    carouselVideos.forEach(video => {
        observer.observe(video);
    });
}

// Load and render Markdown content
async function loadMarkdownContent() {
    try {
        console.log(`Loading page content from Markdown (${currentLanguage})...`);
        
        // Wait for marked to be available
        let attempts = 0;
        while (typeof marked === 'undefined' && attempts < 50) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        
        if (typeof marked === 'undefined') {
            throw new Error('Marked.js library not loaded');
        }
        
        const contentFile = getContentFile();
        console.log('Marked.js loaded, fetching', contentFile);
        
        // Fetch the Markdown file
        const response = await fetch(contentFile);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const markdownText = await response.text();
        console.log('Markdown content loaded, length:', markdownText.length);
        
        // Configure marked options
        marked.setOptions({
            breaks: true,
            gfm: true,
            headerIds: true,
            mangle: false
        });
        
        // Parse the full markdown
        const fullHtml = marked.parse(markdownText);
        
        // Extract different sections from the markdown
        const sections = extractSections(markdownText);
        
        // Render title (first h1)
        const titleContainer = document.getElementById('md-title');
        if (titleContainer && sections.title) {
            titleContainer.innerHTML = `<h1 class="title is-1 publication-title">${sections.title}</h1>`;
        }
        
        // Render authors and institutions
        const authorsContainer = document.getElementById('md-authors');
        if (authorsContainer) {
            if (sections.authors) {
                const authorsHtml = marked.parse(sections.authors);
                authorsContainer.innerHTML = `<div class="is-size-5 publication-authors">${authorsHtml}</div>`;
            } else {
                // Hide authors container if no authors data
                authorsContainer.style.display = 'none';
            }
        }
        
        // Render links as buttons
        const linksContainer = document.getElementById('md-links');
        if (linksContainer && sections.links) {
            linksContainer.innerHTML = renderLinks(sections.links);
        }
        
        // Render video description
        const videoDescContainer = document.getElementById('md-video-desc');
        if (videoDescContainer && sections.videoDesc) {
            const videoHtml = marked.parse(sections.videoDesc);
            videoDescContainer.innerHTML = `<h2 class="subtitle has-text-centered">${videoHtml}</h2>`;
        }
        
        // Render abstract
        const abstractContainer = document.getElementById('md-abstract');
        if (abstractContainer && sections.abstract) {
            const abstractHtml = marked.parse(sections.abstract);
            abstractContainer.innerHTML = abstractHtml;
        }
        
        // Render main content
        const contentContainer = document.getElementById('markdown-content');
        if (contentContainer && sections.mainContent) {
            const contentHtml = marked.parse(sections.mainContent);
            contentContainer.innerHTML = contentHtml;
        }
        
        console.log('All Markdown sections rendered successfully');
        
    } catch (error) {
        console.error('Error loading Markdown:', error);
        const containers = ['md-title', 'md-authors', 'md-links', 'md-video-desc', 'md-abstract', 'markdown-content'];
        containers.forEach(id => {
            const container = document.getElementById(id);
            if (container) {
                container.innerHTML = `<p class="has-text-danger">Error loading content: ${error.message}</p>`;
            }
        });
    }
}

// Extract different sections from markdown text
function extractSections(markdown) {
    const sections = {};
    
    // Extract title (first h1)
    const titleMatch = markdown.match(/^#\s+(.+)$/m);
    sections.title = titleMatch ? titleMatch[1].trim() : '';
    
    // Extract links section (## 项目链接 or ## Project Links)
    // 范围: 从 ## 项目链接 到下一个 ---
    const linksMatch = markdown.match(/##\s+(?:项目链接|Project Links)\s*\n([\s\S]*?)\n---/);
    if (linksMatch) {
        sections.links = linksMatch[1].trim();
    }
    
    // Extract video description (## 视频简介 or ## Video Introduction)
    // 范围: 从 ## 视频简介 到下一个 ---
    const videoMatch = markdown.match(/##\s+(?:视频简介|Video Introduction)\s*\n([\s\S]*?)\n---/);
    if (videoMatch) {
        sections.videoDesc = videoMatch[1].trim();
    }
    
    // Extract abstract (## 摘要 or ## Abstract)
    // 范围: 从 ## 摘要 到下一个 ---
    const abstractMatch = markdown.match(/##\s+(?:摘要|Abstract)\s*\n([\s\S]*?)\n---/);
    if (abstractMatch) {
        sections.abstract = abstractMatch[1].trim();
    }
    
    // Extract main content (everything after last --- before methods)
    // 范围: 从 ## 方法概述 或 ## Method Overview 到末尾
    const mainContentMatch = markdown.match(/---\s*\n(##\s+(?:方法概述|Method Overview)[\s\S]*)/);
    if (mainContentMatch) {
        sections.mainContent = mainContentMatch[1];
    }
    
    return sections;
}

// Render links as styled buttons
function renderLinks(linksText) {
    const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
    const links = [];
    let match;
    
    while ((match = linkPattern.exec(linksText)) !== null) {
        const text = match[1];
        const url = match[2];
        
        // Determine icon based on text
        let icon = 'fas fa-link';
        if (text.includes('论文') || text.includes('Paper')) {
            icon = 'fas fa-file-pdf';
        } else if (text.includes('代码') || text.includes('Code') || text.includes('GitHub')) {
            icon = 'fab fa-github';
        } else if (text.includes('arXiv')) {
            icon = 'ai ai-arxiv';
        } else if (text.includes('补充') || text.includes('Supplementary')) {
            icon = 'fas fa-file-pdf';
        }
        
        const cleanText = text.replace(/[📄📦💻📚]/g, '').trim();
        
        links.push(`
            <span class="link-block">
                <a href="${url}" target="_blank" class="external-link button is-normal is-rounded is-dark">
                    <span class="icon"><i class="${icon}"></i></span>
                    <span>${cleanText}</span>
                </a>
            </span>
        `);
    }
    
    return links.join('\n');
}

// Wait for both DOM and window to be fully loaded
window.addEventListener('load', function() {
    console.log('Window loaded, initializing...');
    initializeLanguage();
    loadMarkdownContent();
});

$(document).ready(function() {
    // Check for click events on the navbar burger icon

    var options = {
		slidesToScroll: 1,
		slidesToShow: 1,
		loop: true,
		infinite: true,
		autoplay: true,
		autoplaySpeed: 5000,
    }

	// Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);
	
    bulmaSlider.attach();
    
    // Setup video autoplay for carousel
    setupVideoCarouselAutoplay();

})
