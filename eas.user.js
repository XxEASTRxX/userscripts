// ==UserScript==
// @name         EASx Bypass V2
// @namespace    EASx
// @version      2.0
// @description  Bypass ad-links using the EASx API
// @author       EASx
// @match        *://*/*
// @downloadURL  https://raw.githubusercontent.com/XxEASTRxX/userscripts/refs/heads/main/newscript.js
// @updateURL    https://raw.githubusercontent.com/XxEASTRxX/userscripts/refs/heads/main/newscript.js
// @homepageURL  https://eas.lol
// @icon         https://i.eas-x.com/FtWEhV-Gj45KW9k8o_CDy
// @run-at       document-start
// ==/UserScript==

(async () => {
    const supportedDomains = [
    'linkvertise.com', 'link-target.net', 'link-center.net', 'link-to.net',
    'bit.ly', 't.ly', 'jpeg.ly', 'tiny.cc', 'tinyurl.com', 'tinylink.onl',
    'shorter.me', 'is.gd', 'v.gd', 'rebrand.ly', 'mboost.me', 'bst.gg',
    'bst.wtf', 'boost.ink', 'sub2get.com', 'sub4unlock.io', 'sub4unlock.com',
    'sub4unlock.net', 'rekonise.com', 'rkns.link', 'subfinal.com',
    'unlocknow.net', 'ytsubme.com', 'work.ink', 'cuty.io', 'cuty.me',
    'adfoc.us', 'justpaste.it', 'paste-drop.com', 'pastebin.com',
    'pastecanyon.com', 'pastehill.com', 'pastemode.com', 'rentry.org',
    'paster.so', 'loot-link.com', 'loot-links.com', 'lootlink.org',
    'lootlinks.co', 'lootdest.info', 'lootdest.org', 'lootdest.com',
    'links-loot.com', 'linksloot.net'
];


    const config = {
        time: 10,
        endpoint: 'https://usr.eas-x.com'
    };

    function isCurrentDomainSupported() {
        const currentHostname = window.location.hostname.replace('www.', '');
        return supportedDomains.some(domain => currentHostname === domain ||
            currentHostname.endsWith('.' + domain));
    }

    const urlParams = new URLSearchParams(window.location.search);
    const redirectUrl = urlParams.get('redirect');

    if (redirectUrl) {
        window.location.href = redirectUrl;
        return;
    }

    if (window.location.hostname === 'linkvertise.com' && window.location.search.includes('url=')) {
        const params = new URLSearchParams(window.location.search);
        const targetUrl = params.get('url');
        if (targetUrl) {
            setTimeout(() => {
                window.location.href = decodeURIComponent(targetUrl);
            }, 100);
            return;
        }
    }

    if (!isCurrentDomainSupported()) {
        return;
    }


    Object.defineProperty(Document.prototype, 'referrer', {
        get: function() {
            return 'https://linkvertise.com';
        }
    });

    Object.defineProperty(document, 'referrer', {
        get: function() {
            return 'https://linkvertise.com';
        }
    });


    const originalXHR = window.XMLHttpRequest;
    window.XMLHttpRequest = function() {
        const xhr = new originalXHR();
        const originalOpen = xhr.open;
        xhr.open = function() {
            const args = arguments;
            originalOpen.apply(xhr, args);
            xhr.setRequestHeader('Referer', 'https://linkvertise.com');
        };
        return xhr;
    };


    if (window.location.hostname === 'linkvertise.com' && window.location.pathname === '/') {
        return;
    }


    const originalCreateElement = document.createElement.bind(document);
    document.createElement = function(elementName) {
        const element = originalCreateElement(elementName);
        if (elementName.toLowerCase() === 'script') {
            element.setAttribute('type', 'text/plain');
        }
        return element;
    };


    document.documentElement.innerHTML = `
        <html>
            <head>
                <title>EASx Bypass</title>
                <style>
                    body {
                        background: #000000; /* Black background */
                        color: #ffffff; /* White text */
                        font-family: Arial, sans-serif;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        margin: 0;
                    }
                    .container {
                        text-align: center;
                        padding: 20px;
                        border-radius: 10px;
                        background: #1a1a1a; /* Dark gray background */
                        box-shadow: 0 0 20px rgba(255,255,255,0.2);
                        width: 100%;
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                    }
                    .loading {
                        margin: 20px 0;
                        font-size: 18px;
                    }
                    .redirect-button {
                        background: #ffffff; /* White button */
                        color: #000000; /* Black text */
                        border: none;
                        padding: 10px 20px;
                        border-radius: 5px;
                        cursor: pointer;
                        display: none;
                    }
                    input[type="text"] {
                        background: #333333; /* Dark gray input */
                        color: #ffffff; /* White text */
                        border: 1px solid #555555;
                    }
                    button {
                        background: #555555; /* Gray buttons */
                        color: #ffffff; /* White text */
                        border: none;
                        padding: 10px 20px;
                        border-radius: 4px;
                        cursor: pointer;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>EASx Bypass</h1>
                    <div class="loading" id="status">Processing your request...</div>
                    <button id="redirect" class="redirect-button">Click That Blue Button</button>
                </div>
            </body>
        </html>
    `;

    document.getElementById('redirect').addEventListener('click', () => {
        window.location.href = data.result;
    });

    const currentUrl = window.location.href;

    async function createCaptchaFrame() {
        const existingFrame = document.querySelector('iframe[src*="/captcha"]');
        if (existingFrame) {
            existingFrame.remove();
        }

        return new Promise((resolve) => {
            const iframe = document.createElement('iframe');
            iframe.src = `${config.endpoint}/captcha`;
            iframe.style.cssText = 'width: 300px; height: 100px; border: none; margin: 10px auto; display: block; overflow: hidden;';

            const messageHandler = function(e) {
                if (e.origin === config.endpoint && e.data.type === 'turnstile-token') {
                    window.removeEventListener('message', messageHandler);
                    iframe.remove();
                    resolve(e.data.token);
                }
            };

            window.addEventListener('message', messageHandler);
            document.querySelector('.container').appendChild(iframe);
        });
    }

    async function startBypass() {
        const statusEl = document.getElementById('status');
        statusEl.textContent = `Waiting ${config.time}s to avoid detection...`;

        await new Promise(r => setTimeout(r, config.time * 1000));

        statusEl.textContent = 'Please complete the captcha...';

        try {
            const token = await createCaptchaFrame();

            statusEl.textContent = 'Requesting bypass...';


            const response = await fetch(`${config.endpoint}/api/userscript?url=${encodeURIComponent(currentUrl)}&token=${token}`);
            const data = await response.json();

            if (data.status === 'success') {
                if (data.isUrl) {
                    if (data.result.startsWith('https://flux.li/android/external/main.php?')) {
                        statusEl.textContent = 'Bypass successful! Fluxus implements extra security checks to detect bypasses, so automatic redirection isn\'t possible.';
                        const container = document.querySelector('.container');
                        const redirectBtn = container.querySelector('#redirect');
                        redirectBtn.style.display = 'inline-block';
                        if (!document.getElementById('flux-result-container')) {
                            const escapedResult = data.result
                                .replace(/\\/g, '\\\\')
                                .replace(/`/g, '\\`')
                                .replace(/'/g, "\\'")
                                .replace(/"/g, '&quot;');

                            container.innerHTML += `
                                <div style="margin-top: 20px; display: flex; align-items: center; gap: 10px;" id="flux-result-container">
                                    <input type="text"
                                        id="result-box-flux"
                                        value="${escapedResult}"
                                        readonly
                                        style="flex: 1; padding: 10px; background: #2a2a2a; color: white; border: 1px solid #444; border-radius: 4px;">
                                    <button id="copy-flux-button" onclick="navigator.clipboard.writeText('${escapedResult}').then(() => {
                                        this.textContent = 'Copied!';
                                        setTimeout(() => { this.textContent = 'Copy'; }, 2000);
                                    })"
                                        style="padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">
                                        Copy
                                    </button>
                                    <button id="redirect-flux-button" style="padding: 10px 20px; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer;">Redirect</button>
                                </div>
                            `;

                            const redirectFluxBtn = document.getElementById('redirect-flux-button');
                            redirectFluxBtn.addEventListener('click', () => {
                                window.location.href = data.result;
                            });

                            redirectBtn.addEventListener('click', () => {
                                window.location.href = data.result;
                            });
                        }
                    } else {
                        statusEl.textContent = 'Bypass successful! Redirecting...';
                        window.location.href = data.result;
                    }
                } else {
                    const escapedResult = data.result
                        .replace(/\\/g, '\\\\')
                        .replace(/`/g, '\\`')
                        .replace(/'/g, "\\'")
                        .replace(/"/g, '&quot;');
                    statusEl.textContent = 'Bypass successful! Here is your result:';
                    document.querySelector('.container').innerHTML += `
                        <div style="margin-top: 20px; display: flex; align-items: center; gap: 10px;">
                            <input type="text"
                                id="result-box"
                                value="${escapedResult}"
                                readonly
                                style="flex: 1; padding: 10px; background: #2a2a2a; color: white; border: 1px solid #444; border-radius: 4px;">
                            <button id="copy-button" onclick="navigator.clipboard.writeText('${escapedResult}').then(() => {
                                this.textContent = 'Copied!';
                                setTimeout(() => { this.textContent = 'Copy'; }, 2000);
                            })"
                                style="padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">
                                Copy
                            </button>
                            <button id="redirect-button" style="padding: 10px 20px; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer;">Redirect</button>
                        </div>
                    `;

                    const redirectBtn = document.getElementById('redirect-button');
                    redirectBtn.addEventListener('click', () => {
                        window.location.href = data.result;
                    });
                }
            } else {
                throw new Error(data.message || 'Bypass failed');
            }
        } catch (error) {
            statusEl.textContent = `Error: ${error.message}`;
            console.error('Bypass error:', error);
        }
    }

    startBypass();
})();
