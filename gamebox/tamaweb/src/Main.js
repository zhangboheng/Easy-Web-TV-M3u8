class SpriteElement extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.image = document.createElement("img");
        this.shadowRoot.appendChild(this.image);
        this.image.style['-webkit-user-drag'] = 'none'
    }
    updateImage() {
        const src = this.getAttribute("src");
        const width = this.getAttribute("width");
        const height = this.getAttribute("height");
        const index = this.getAttribute("index");
        const naturalWidth = this.getAttribute("naturalWidth") || this.image.naturalWidth || 64;
        const posX = this.getAttribute('pos-x') || 0;
        const posY = this.getAttribute('pos-y') || 0;
        this.image.src = App.checkResourceOverride(src);
        this.image.width = width;
        this.image.height = height;
        const x = (index % (naturalWidth / width)) * width;
        const y = Math.floor(index / (naturalWidth / width)) * height;
        this.image.style.objectFit = "none";
        this.image.style.objectPosition = `-${x + posX}px -${y + posY}px`;
        this.image.style.imageRendering = 'pixelated';
        this.image.onerror = () => {
            this.image.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuNBLfpoMAAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAIAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAYAAAAAEAAABgAAAAAQAAAFBhaW50Lk5FVCA1LjEuNAADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAADX5rshveZftAAAADNJREFUOE9jZGBg+M+ABxzHL83AhC5AKhg1YDAYwHic4T/eiLZkYEQXQgEUu2DUgMFgAABKkwXjX3A3rgAAAABJRU5ErkJggg==';
        }
    }
    connectedCallback() {
        this.updateImage();
    }
    attributeChangedCallback(name, oldValue, newValue) {
        this.updateImage();
    }
    static get observedAttributes() {
        return ["src", "width", "height", "index"];
    }
}
customElements.define("c-sprite", SpriteElement);

/* Object.defineProperty(HTMLElement.prototype, 'safeInnerHTML', {
    get: function() {
        return this.innerHTML;
    },
    set: function(content) {
        // const sanitizedContent = DOMPurify.sanitize(content);
        const sanitizedContent = sanitize(content);
        this.innerHTML = sanitizedContent;
    }
}); */

class AudioChannel {
    audioContext = new AudioContext();
    audioBufferCache = new Map();
    currentSource = null;
    isBusy = false;
    constructor(props = {}){
        const { preloadList } = props;

        if(preloadList){
            preloadList.forEach(path => this.load(path));
        }

    }
    async load(path){
        try {
            const response = await fetch(path);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
            this.audioBufferCache.set(path, audioBuffer);
            return audioBuffer;
        } catch (e) {
            return null;
        }
    }
    async play(path, force) {
        if (this.isBusy && !force) return;

        const buffer = this.audioBufferCache.get(path) ?? await this.load(path);
        if (!buffer) return;

        if (force && this.currentSource) {
            try {
                this.currentSource.stop();
            } catch (e) {}
            this.currentSource.disconnect();
        }

        const source = this.audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(this.audioContext.destination);
        source.start(0);

        this.currentSource = source;
        this.isBusy = true;

        source.onended = () => {
            this.isBusy = false;
            this.currentSource = null;
        };
    }
}

function handleServiceWorker(){
    // Vendored for Easy-Web-TV-M3u8: its own service worker is disabled to avoid
    // conflicts with the app-level service worker (sw.js) cache management.
    return;
    const isOnItch = location.host.indexOf('itch') !== -1;
    if(!navigator?.serviceWorker || isOnItch) return;
    
    let shownControllerChangeModal = false;
    navigator?.serviceWorker?.register('service-worker.js').then((registration) => {
        console.log('Service Worker Registered')
    });
    navigator?.serviceWorker?.addEventListener('controllerchange', () => {
        if(!shownControllerChangeModal && !isOnItch && App.awayTime){
            shownControllerChangeModal = true;
            document.querySelector('#download-container').style.display = 'none';
            document.querySelector('#download-complete-container').style.display = '';
        }
    })

    const channel = new BroadcastChannel('sw-messages');
    channel.addEventListener('message', event => {
        switch(event.data.type){
            case "install":
                if(!App.awayTime || isOnItch) break;
                const downloadContainer = document.querySelector('#download-container');
                downloadContainer.style.display = '';
                downloadContainer.onclick = () => {
                    downloadContainer.style.display = 'none';
                }
                break;
        }
    });
}

const showError = (msg, stack) => {
    const element = document.querySelector('#loading-error');
    element.innerHTML = `<i class="fa-solid fa-warning"></i> ${sanitize(msg)}`;
    element.onclick = () => {
        if(!stack) return;
        showError(stack, msg);
    }
    return;
    document.querySelector('.error-container').style.display = ''
    document.querySelector('#error-message').textContent = msg;
}
window.onerror = (message) => {
    showError(message);
    App.sendErrorLog(message);
}
window.onunhandledrejection = (event) => {
    const reason = event?.reason;
    const message = typeof reason === 'string' ? reason : reason?.message || 'Unknown rejection';
    const stack = reason?.stack || false;

    if (/Failed to fetch|Load failed|NetworkError/i.test(message)) return;

    showError(event?.reason, event?.reason?.stack);
    if(stack) App.sendErrorLog(`${message} - ${stack}`);
}

handleServiceWorker();
App.init();