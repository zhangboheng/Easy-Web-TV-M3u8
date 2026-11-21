/**
 * DOM Utility Library
 * Native JavaScript replacement for jQuery
 * @version 1.0.0
 */

const DOM = {
    // Selector functions
    $(selector, context = document) {
        return context.querySelector(selector);
    },

    $$(selector, context = document) {
        return Array.from(context.querySelectorAll(selector));
    },

    // Event handling
    on(element, event, handler, options = {}) {
        if (typeof element === 'string') {
            element = this.$(element);
        }
        if (element) {
            element.addEventListener(event, handler, options);
        }
        return element;
    },

    off(element, event, handler, options = {}) {
        if (typeof element === 'string') {
            element = this.$(element);
        }
        if (element) {
            element.removeEventListener(event, handler, options);
        }
        return element;
    },

    one(element, event, handler) {
        return this.on(element, event, handler, { once: true });
    },

    // Class manipulation
    addClass(element, ...classNames) {
        if (typeof element === 'string') {
            element = this.$(element);
        }
        if (element) {
            element.classList.add(...classNames);
        }
        return element;
    },

    removeClass(element, ...classNames) {
        if (typeof element === 'string') {
            element = this.$(element);
        }
        if (element) {
            element.classList.remove(...classNames);
        }
        return element;
    },

    toggleClass(element, className, force) {
        if (typeof element === 'string') {
            element = this.$(element);
        }
        if (element) {
            element.classList.toggle(className, force);
        }
        return element;
    },

    hasClass(element, className) {
        if (typeof element === 'string') {
            element = this.$(element);
        }
        return element ? element.classList.contains(className) : false;
    },

    // Display manipulation
    show(element, display = 'block') {
        if (typeof element === 'string') {
            element = this.$(element);
        }
        if (element) {
            element.style.display = display;
        }
        return element;
    },

    hide(element) {
        if (typeof element === 'string') {
            element = this.$(element);
        }
        if (element) {
            element.style.display = 'none';
        }
        return element;
    },

    toggle(element, display = 'block') {
        if (typeof element === 'string') {
            element = this.$(element);
        }
        if (element) {
            element.style.display = element.style.display === 'none' ? display : 'none';
        }
        return element;
    },

    isVisible(element) {
        if (typeof element === 'string') {
            element = this.$(element);
        }
        if (!element) return false;
        return element.offsetWidth > 0 || element.offsetHeight > 0 || element.style.display !== 'none';
    },

    // Attribute manipulation
    attr(element, name, value) {
        if (typeof element === 'string') {
            element = this.$(element);
        }
        if (!element) return undefined;
        if (value === undefined) {
            return element.getAttribute(name);
        }
        element.setAttribute(name, value);
        return element;
    },

    removeAttr(element, name) {
        if (typeof element === 'string') {
            element = this.$(element);
        }
        if (element) {
            element.removeAttribute(name);
        }
        return element;
    },

    // Property manipulation
    prop(element, name, value) {
        if (typeof element === 'string') {
            element = this.$(element);
        }
        if (!element) return undefined;
        if (value === undefined) {
            return element[name];
        }
        element[name] = value;
        return element;
    },

    // Form value
    val(element, value) {
        if (typeof element === 'string') {
            element = this.$(element);
        }
        if (!element) return undefined;
        if (value === undefined) {
            return element.value;
        }
        element.value = value;
        return element;
    },

    // DOM manipulation
    html(element, content) {
        if (typeof element === 'string') {
            element = this.$(element);
        }
        if (!element) return undefined;
        if (content === undefined) {
            return element.innerHTML;
        }
        element.innerHTML = content;
        return element;
    },

    text(element, content) {
        if (typeof element === 'string') {
            element = this.$(element);
        }
        if (!element) return undefined;
        if (content === undefined) {
            return element.textContent;
        }
        element.textContent = content;
        return element;
    },

    append(parent, child) {
        if (typeof parent === 'string') {
            parent = this.$(parent);
        }
        if (parent) {
            if (typeof child === 'string') {
                parent.insertAdjacentHTML('beforeend', child);
            } else {
                parent.appendChild(child);
            }
        }
        return parent;
    },

    prepend(parent, child) {
        if (typeof parent === 'string') {
            parent = this.$(parent);
        }
        if (parent) {
            if (typeof child === 'string') {
                parent.insertAdjacentHTML('afterbegin', child);
            } else {
                parent.insertBefore(child, parent.firstChild);
            }
        }
        return parent;
    },

    remove(element) {
        if (typeof element === 'string') {
            element = this.$(element);
        }
        if (element && element.parentNode) {
            element.parentNode.removeChild(element);
        }
    },

    empty(element) {
        if (typeof element === 'string') {
            element = this.$(element);
        }
        if (element) {
            element.innerHTML = '';
        }
        return element;
    },

    // CSS manipulation
    css(element, property, value) {
        if (typeof element === 'string') {
            element = this.$(element);
        }
        if (!element) return undefined;
        if (typeof property === 'object') {
            Object.assign(element.style, property);
            return element;
        }
        if (value === undefined) {
            return getComputedStyle(element)[property];
        }
        element.style[property] = value;
        return element;
    },

    // Find children
    find(element, selector) {
        if (typeof element === 'string') {
            element = this.$(element);
        }
        if (!element) return null;
        return element.querySelector(selector);
    },

    findAll(element, selector) {
        if (typeof element === 'string') {
            element = this.$(element);
        }
        if (!element) return [];
        return Array.from(element.querySelectorAll(selector));
    },

    // Parent/children
    parent(element) {
        if (typeof element === 'string') {
            element = this.$(element);
        }
        return element ? element.parentNode : null;
    },

    children(element) {
        if (typeof element === 'string') {
            element = this.$(element);
        }
        return element ? Array.from(element.children) : [];
    },

    // Data attributes
    data(element, key, value) {
        if (typeof element === 'string') {
            element = this.$(element);
        }
        if (!element) return undefined;
        if (value === undefined) {
            return element.dataset[key];
        }
        element.dataset[key] = value;
        return element;
    },

    // Create element
    create(tag, attributes = {}, children = []) {
        const element = document.createElement(tag);
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'class') {
                element.className = value;
            } else if (key === 'style' && typeof value === 'object') {
                Object.assign(element.style, value);
            } else if (key.startsWith('on')) {
                const event = key.slice(2).toLowerCase();
                element.addEventListener(event, value);
            } else {
                element.setAttribute(key, value);
            }
        });
        children.forEach(child => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else {
                element.appendChild(child);
            }
        });
        return element;
    },

    // Clone element
    clone(element, deep = true) {
        if (typeof element === 'string') {
            element = this.$(element);
        }
        return element ? element.cloneNode(deep) : null;
    },

    // Each iteration
    each(selector, callback, context = document) {
        const elements = this.$$(selector, context);
        elements.forEach((element, index) => {
            callback.call(element, index, element);
        });
    },

    // Ready function
    ready(callback) {
        if (document.readyState !== 'loading') {
            callback();
        } else {
            document.addEventListener('DOMContentLoaded', callback);
        }
    }
};

// AJAX utilities using Fetch API
const Ajax = {
    request(url, options = {}) {
        const defaults = {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            },
            timeout: 10000
        };

        const config = { ...defaults, ...options };
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), config.timeout);
        config.signal = controller.signal;

        return fetch(url, config)
            .then(response => {
                clearTimeout(timeoutId);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response;
            })
            .catch(error => {
                clearTimeout(timeoutId);
                throw error;
            });
    },

    get(url, options = {}) {
        return this.request(url, { ...options, method: 'GET' });
    },

    post(url, data, options = {}) {
        return this.request(url, {
            ...options,
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        });
    },

    json(url, options = {}) {
        return this.request(url, options).then(r => r.json());
    },

    text(url, options = {}) {
        return this.request(url, options).then(r => r.text());
    }
};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DOM, Ajax };
}
