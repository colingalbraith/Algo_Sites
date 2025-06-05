/**
 * Common utility functions for algorithm visualizations
 */

class AnimationController {
    constructor(animationSpeed = 1000) {
        this.animationSpeed = animationSpeed;
        this.isPlaying = false;
        this.currentStep = 0;
        this.animationSteps = [];
        this.onStepChange = null;
    }

    setAnimationSteps(steps) {
        this.animationSteps = steps;
        this.currentStep = 0;
        return this;
    }

    setOnStepChange(callback) {
        this.onStepChange = callback;
        return this;
    }

    setSpeed(speedMs) {
        this.animationSpeed = speedMs;
        return this;
    }

    async play() {
        if (this.isPlaying) return;
        this.isPlaying = true;
        
        while (this.isPlaying && this.currentStep < this.animationSteps.length) {
            if (this.onStepChange) {
                this.onStepChange(this.currentStep, this.animationSteps[this.currentStep]);
            }
            
            await this.sleep(this.animationSpeed);
            this.currentStep++;
            
            if (this.currentStep >= this.animationSteps.length) {
                this.isPlaying = false;
                break;
            }
        }
    }

    pause() {
        this.isPlaying = false;
    }

    reset() {
        this.currentStep = 0;
        this.isPlaying = false;
        if (this.onStepChange) {
            this.onStepChange(this.currentStep, this.animationSteps[this.currentStep]);
        }
    }

    stepForward() {
        if (this.currentStep < this.animationSteps.length - 1) {
            this.currentStep++;
            if (this.onStepChange) {
                this.onStepChange(this.currentStep, this.animationSteps[this.currentStep]);
            }
        }
    }

    stepBackward() {
        if (this.currentStep > 0) {
            this.currentStep--;
            if (this.onStepChange) {
                this.onStepChange(this.currentStep, this.animationSteps[this.currentStep]);
            }
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

/**
 * Creates standard animation controls UI
 * @param {AnimationController} controller - The animation controller
 * @returns {HTMLElement} - The controls element
 */
function createAnimationControls(controller) {
    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'control-group';
    
    // Speed control
    const speedLabel = document.createElement('label');
    speedLabel.textContent = 'Speed: ';
    
    const speedSlider = document.createElement('input');
    speedSlider.type = 'range';
    speedSlider.min = '100';
    speedSlider.max = '2000';
    speedSlider.value = controller.animationSpeed;
    speedSlider.addEventListener('input', () => {
        controller.setSpeed(parseInt(speedSlider.value));
    });
    
    // Play button
    const playBtn = document.createElement('button');
    playBtn.textContent = '▶️ Play';
    playBtn.addEventListener('click', () => {
        if (controller.isPlaying) {
            controller.pause();
            playBtn.textContent = '▶️ Play';
        } else {
            controller.play();
            playBtn.textContent = '⏸️ Pause';
        }
    });
    
    // Reset button
    const resetBtn = document.createElement('button');
    resetBtn.textContent = '🔄 Reset';
    resetBtn.addEventListener('click', () => {
        controller.reset();
        playBtn.textContent = '▶️ Play';
    });
    
    // Step buttons
    const prevBtn = document.createElement('button');
    prevBtn.textContent = '⏮️ Prev';
    prevBtn.addEventListener('click', () => {
        controller.stepBackward();
    });
    
    const nextBtn = document.createElement('button');
    nextBtn.textContent = '⏭️ Next';
    nextBtn.addEventListener('click', () => {
        controller.stepForward();
    });
    
    controlsDiv.appendChild(speedLabel);
    controlsDiv.appendChild(speedSlider);
    controlsDiv.appendChild(prevBtn);
    controlsDiv.appendChild(playBtn);
    controlsDiv.appendChild(nextBtn);
    controlsDiv.appendChild(resetBtn);
    
    return controlsDiv;
}

/**
 * Creates a complexity analysis panel
 * @param {Object} complexityData - Object containing complexity information
 * @returns {HTMLElement} - The complexity panel element
 */
function createComplexityPanel(complexityData) {
    const panel = document.createElement('div');
    panel.className = 'complexity-panel';
    
    const title = document.createElement('h2');
    title.style.textAlign = 'center';
    title.style.marginBottom = '20px';
    title.textContent = 'Space & Time Complexity Analysis';
    panel.appendChild(title);
    
    const grid = document.createElement('div');
    grid.className = 'complexity-grid';
    
    // Time complexity card
    const timeCard = document.createElement('div');
    timeCard.className = 'complexity-card';
    
    const timeTitle = document.createElement('h3');
    timeTitle.textContent = 'Time Complexity';
    timeCard.appendChild(timeTitle);
    
    for (const [operation, complexity] of Object.entries(complexityData.time)) {
        const metric = document.createElement('div');
        metric.className = 'complexity-metric';
        metric.innerHTML = `<strong>${operation}:</strong> ${complexity}`;
        timeCard.appendChild(metric);
    }
    
    // Space complexity card
    const spaceCard = document.createElement('div');
    spaceCard.className = 'complexity-card';
    
    const spaceTitle = document.createElement('h3');
    spaceTitle.textContent = 'Space Complexity';
    spaceCard.appendChild(spaceTitle);
    
    for (const [type, complexity] of Object.entries(complexityData.space)) {
        const metric = document.createElement('div');
        metric.className = 'complexity-metric';
        metric.innerHTML = `<strong>${type}:</strong> ${complexity}`;
        spaceCard.appendChild(metric);
    }
    
    // Applications card
    const appCard = document.createElement('div');
    appCard.className = 'complexity-card';
    
    const appTitle = document.createElement('h3');
    appTitle.textContent = 'Applications';
    appCard.appendChild(appTitle);
    
    for (const application of complexityData.applications) {
        const metric = document.createElement('div');
        metric.className = 'complexity-metric';
        metric.textContent = application;
        appCard.appendChild(metric);
    }
    
    grid.appendChild(timeCard);
    grid.appendChild(spaceCard);
    grid.appendChild(appCard);
    panel.appendChild(grid);
    
    return panel;
}

/**
 * Creates a code snippet panel with syntax highlighting
 * @param {string} code - The code to display
 * @param {string} language - The programming language
 * @returns {HTMLElement} - The code panel element
 */
function createCodePanel(code, language = 'javascript') {
    const panel = document.createElement('div');
    panel.className = 'code-panel';
    panel.style.background = 'white';
    panel.style.borderRadius = '15px';
    panel.style.padding = '20px';
    panel.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
    panel.style.marginBottom = '20px';
    panel.style.overflow = 'auto';
    
    const pre = document.createElement('pre');
    pre.style.margin = '0';
    pre.style.padding = '15px';
    pre.style.background = '#f8f9fa';
    pre.style.borderRadius = '10px';
    pre.style.overflowX = 'auto';
    
    const code_elem = document.createElement('code');
    code_elem.textContent = code;
    code_elem.className = language;
    
    pre.appendChild(code_elem);
    panel.appendChild(pre);
    
    return panel;
}

/**
 * Creates the standard navigation bar
 * @param {string} currentPage - The current page name
 * @returns {HTMLElement} - The navigation bar element
 */
function createNavBar(currentPage) {
    const siteRootPages = [
        { name: 'Home', url: 'index.html' },
        { name: 'Graph Rep', url: 'pages/graph-representation.html' },
        { name: 'Stack', url: 'pages/stack.html' },
        { name: 'Queue', url: 'pages/queue.html' },
        { name: 'Array', url: 'pages/array.html' },
        { name: 'Linked List', url: 'pages/linked-list.html' },
        { name: 'DFS & BFS', url: 'pages/graph-traversal.html' },
        { name: 'Shortest Path', url: 'pages/shortest-path.html' },
        { name: 'Network Flow', url: 'pages/network-flow.html' },
        { name: 'Knapsack', url: 'pages/dp-knapsack.html' },
        { name: 'Painting Houses', url: 'pages/painting-houses.html' },
        { name: 'Counting Stairs', url: 'pages/counting-stairs.html' }
    ];

    let pages = JSON.parse(JSON.stringify(siteRootPages)); // Use 'pages' as the variable for the rest of the function

    const isHomePage = currentPage.toLowerCase() === 'home';

    pages.forEach(page => {
        if (isHomePage) {
            // URLs are already correct if defined relative to root (e.g., 'pages/stack.html')
            // For the current page ('index.html'), ensure it's not a clickable link or points to '#'
            if (page.name.toLowerCase() === currentPage.toLowerCase()) {
                // page.url = '#'; // Optionally make current page non-clickable or styled differently
            }
        } else { // We are on a page inside /pages/ (e.g., pages/stack.html)
            if (page.url.startsWith('pages/')) {
                // If link is 'pages/other.html', it should become 'other.html'
                page.url = page.url.substring('pages/'.length);
            } else if (page.url === 'index.html') {
                // If link is 'index.html', it should become '../index.html'
                page.url = '../index.html';
            }
            // For the current page (e.g. 'stack.html'), ensure it's not a clickable link or points to '#'
            if (page.url.endsWith(currentPage.toLowerCase() + '.html') || page.name.toLowerCase() === currentPage.toLowerCase()){
                 // page.url = '#'; // Optionally make current page non-clickable or styled differently
            }
        }
    });
    
    const navContainer = document.createElement('div');
    navContainer.className = 'nav-container';
    
    const navbar = document.createElement('div');
    navbar.className = 'navbar';
    
    pages.forEach(page => {
        const link = document.createElement('a');
        link.href = page.url;
        // For pages within the 'pages' directory, ensure links to other pages are correct
        // For the homepage, links should be relative to root
        // For other pages, links should be relative to the 'pages' directory (e.g., '../index.html' or 'other-page.html')
        
        // This logic is now handled by the conditional URL adjustment above for the 'Home' page
        // and by ensuring page.url is correctly defined for other pages.
        link.textContent = page.name;
        link.className = 'nav-link';
        
        if (page.name.toLowerCase() === currentPage.toLowerCase()) {
            link.classList.add('active');
        }
        
        navbar.appendChild(link);
    });
    
    navContainer.appendChild(navbar);
    return navContainer;
}

/**
 * Creates breadcrumbs navigation
 * @param {Array} path - Array of {name, url} objects representing the path
 * @returns {HTMLElement} - The breadcrumbs element
 */
function createBreadcrumbs(path) {
    const breadcrumbs = document.createElement('div');
    breadcrumbs.className = 'breadcrumbs';
    
    path.forEach((item, index) => {
        if (index > 0) {
            const separator = document.createTextNode(' > ');
            breadcrumbs.appendChild(separator);
        }
        
        if (item.url) {
            const link = document.createElement('a');
            link.href = item.url;
            link.textContent = item.name;
            breadcrumbs.appendChild(link);
        } else {
            const span = document.createElement('span');
            span.textContent = item.name;
            breadcrumbs.appendChild(span);
        }
    });
    
    return breadcrumbs;
}
