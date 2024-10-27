// ==UserScript==
// @name          EASx Bypasser
// @namespace     eas.lol
// @version       0.6
// @description   Automatically bypass ad-links and get to your destination without ads!
// @include       /^https?:\/\/\S*[.]*\/s\?\S*/
// @include       /^https?:\/\/\paster[.]so\/\S*/
// @include       /^https?:\/\/\boost[.]ink\/\S*/
// @include       /^https?:\/\/linkvertise\.com\/\d*\/\S*/
// @include       /^https?:\/\/\mboost[.]me\/\S*/
// @include       /^https?:\/\/\bst[.]gg\/\S*/
// @include       /^https?:\/\/\booo[.]st\/\S*/
// @include       /^https?:\/\/\socialwolvez[.]com\/\S*/
// @include       /^https?:\/\/\www[.]sub2get[.]com\/\S*/
// @include       /^https?:\/\/\sub2get[.]com\/\S*/
// @include       /^https?:\/\/\v[.]gd\/\S*/
// @include       /^https?:\/\/\unlocknow[.]net\/\S*/
// @include       /^https?:\/\/\sub2unlock[.]com\/\S*/
// @include       /^https?:\/\/\sub2unlock[.]net\/\S*/
// @include       /^https?:\/\/\sub2unlock[.]io\/\S*/
// @include       /^https?:\/\/\sub4unlock[.]io\/\S*/
// @include       /^https?:\/\/\rekonise[.]com\/\S*/
// @include       /^https?:\/\/\adfoc[.]us\/\S*/
// @include       /^https?:\/\/\bstlar[.]com\/\S*/
// @include       /^https?:\/\/\work[.]ink\/\S*/
// @include       /^https?:\/\/\workink[.]net\/\S*/
// @include       /^https?:\/\/\cety[.]app\/\S*/
// @grant         GM_xmlhttpRequest
// @grant         GM_notification
// @grant         GM_addStyle
// @connect       eas.lol
// @run-at        document-start
// @downloadURL   https://github.com/XxEASTRxX/userscripts/raw/refs/heads/main/eas.lol.user.js
// @updateURL     https://github.com/XxEASTRxX/userscripts/raw/refs/heads/main/eas.lol.user.js
// @homepageURL   https://eas.lol/bypass
// @icon          https://images-ext-1.discordapp.net/external/ytuMH8lC37HyWvwTocddNGChuItDTmCLVam5KO25Geg/%3Fsize%3D1024/https/cdn.discordapp.com/avatars/1271386553855381547/a27d955e374ba79a7a916ea484b03e06.png?format=webp&quality=lossless&width=676&height=676
// @credits most of bypasses provided by bypas.vip thank u pookie
// ==/UserScript==

(function() {
    'use strict';

    const currentUrl = window.location.href;

    // Updated to use HTTPS
    const easBypassApiUrl = 'https://eas.lol/bypass';

    const bypassUrl = (url) => {
        GM_xmlhttpRequest({
            method: 'POST',
            url: easBypassApiUrl,
            headers: { 'Content-Type': 'application/json' },
            data: JSON.stringify({ url: url }),
            onload: function(response) {
                console.log("EAS Bypass Response: ", response);
                if (response.status === 200) {
                    const contentTypeMatch = response.responseHeaders.match(/content-type:\s*(.*)/i);
                    const contentType = contentTypeMatch ? contentTypeMatch[1].toLowerCase() : '';

                    if (contentType.includes('application/json')) {
                        try {
                            const data = JSON.parse(response.responseText);
                            if (data.result) {
                                console.log('EAS Pro Bypass successful. Redirecting to:', data.result);
                                window.location.href = data.result;
                            } else {
                                console.warn('EAS Pro Bypass failed.');
                                GM_notification({
                                    title: 'EAS Pro Bypass Failed',
                                    text: 'Unable to bypass the URL.',
                                    timeout: 5000
                                });
                            }
                        } catch (parseError) {
                            console.error("JSON Parsing Error:", parseError);
                            GM_notification({
                                title: 'EAS Pro Bypass Error',
                                text: 'Invalid response format.',
                                timeout: 5000
                            });
                        }
                    } else {
                        console.warn('Unexpected Content-Type:', contentType);
                        GM_notification({
                            title: 'EAS Pro Bypass Error',
                            text: 'Unexpected response format.',
                            timeout: 5000
                        });
                    }
                } else {
                    console.warn('EAS Pro Bypass failed with status:', response.status);
                    GM_notification({
                        title: 'EAS Pro Bypass Error',
                        text: 'Failed to connect to EAS Pro Bypass server.',
                        timeout: 5000
                    });
                }
            },
            onerror: function(error) {
                console.error("Error in EAS Bypass:", error);
                GM_notification({
                    title: 'EAS Pro Bypass Error',
                    text: 'Failed to bypass the URL using EAS Pro Bypass.',
                    timeout: 5000
                });
            }
        });
    };

    bypassUrl(currentUrl);
})();
