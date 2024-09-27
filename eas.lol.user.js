// ==UserScript==
// @name          EASx Bypasser
// @namespace     eas.lol
// @version       0.4
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
// @include       /^https?:\/\/flux\.li\/android\/external\/start\.php\?HWID=\S*/
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

    // Define both API URLs
    const easBypassApiUrl = 'http://localhost:8080/bypass';  // EAS Pro Bypass server
    const bypassVipApiUrl = 'https://api.bypass.vip/bypass'; // BYPASS.VIP API

    // Function to send URL for bypassing through EAS Pro Bypass first, then fall back to BYPASS.VIP
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
                        // If bypass is successful, redirect the user
                        window.location.href = data.result;
                    } else {
                        // If EAS Pro Bypass fails, try BYPASS.VIP API
                        bypassVipFallback(url);
                    }
                } else {
                    // If EAS Pro Bypass fails, try BYPASS.VIP API
                    bypassVipFallback(url);
                }
            },
            onerror: function(error) {
                console.error("Error in EAS Bypass: ", error);
                bypassVipFallback(url);
            }
        });
    };

    // Fallback function to use BYPASS.VIP API if EAS Pro Bypass fails
    const bypassVipFallback = (url) => {
        GM_xmlhttpRequest({
            method: 'GET',
            url: `${bypassVipApiUrl}?url=${encodeURIComponent(url)}`,
            headers: { 'Content-Type': 'application/json' },
            onload: function(response) {
                console.log("BYPASS.VIP Response: ", response);
                if (response.status === 200) {
                    const data = JSON.parse(response.responseText);
                    if (data.status === 'success') {
                        // Redirect to the bypassed URL from BYPASS.VIP
                        window.location.href = data.result;
                    } else {
                        GM_notification({
                            title: 'EAS Pro + BYPASS.VIP Bypass Failed',
                            text: 'Unable to bypass the URL.',
                            timeout: 5000
                        });
                    }
                } else {
                    GM_notification({
                        title: 'EAS Pro + BYPASS.VIP Bypass Error',
                        text: 'Failed to connect to BYPASS.VIP.',
                        timeout: 5000
                    });
                }
            },
            onerror: function(error) {
                console.error("Error in BYPASS.VIP: ", error);
                GM_notification({
                    title: 'BYPASS.VIP Error',
                    text: 'Failed to bypass the URL using BYPASS.VIP.',
                    timeout: 5000
                });
            }
        });
    };

    // Start the bypass process with the current URL
    bypassUrl(currentUrl);
})();