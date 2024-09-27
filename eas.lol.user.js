// ==UserScript==
// @name          EASx Bypasser
// @namespace     eas.lol
// @version       0.5
// @description   Automatically bypass ad-links using the EASx API and get to your destination without ads!
// @include       /^https?:\/\/linkvertise\.com\/\d*\/\S*/
// @include       /^https?:\/\/\S*[.]*\/s\?\S*/
// @include       /^https?:\/\/\paster[.]so\/\S*/
// @include       /^https?:\/\/\boost[.]ink\/\S*/
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
// @connect       localhost
// @run-at        document-start
// @downloadURL   https://eas.lol/data/eas.lol.user.js
// @updateURL     https://eas.lol/data/eas.lol.user.js
// @homepageURL   https://eas.lol/bypass
// @icon          https://images-ext-1.discordapp.net/external/ytuMH8lC37HyWvwTocddNGChuItDTmCLVam5KO25Geg/%3Fsize%3D1024/https/cdn.discordapp.com/avatars/1271386553855381547/a27d955e374ba79a7a916ea484b03e06.png?format=webp&quality=lossless&width=676&height=676
// ==/UserScript==

(function() {
    'use strict';

    // Get the current URL
    const currentUrl = window.location.href;

    // Define EAS Pro Bypass API URL
    const easBypassApiUrl = 'http://localhost:8080/bypass';  // EAS Pro Bypass server

    // Function to send URL for bypassing through EAS Pro Bypass
    const bypassUrl = (url) => {
        GM_xmlhttpRequest({
            method: 'POST',
            url: easBypassApiUrl,
            headers: { 'Content-Type': 'application/json' },
            data: JSON.stringify({ url: url }),
            onload: function(response) {
                console.log("EAS Bypass Response: ", response);
                if (response.status === 200) {
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

    // Start the bypass process with the current URL
    bypassUrl(currentUrl);
})();
