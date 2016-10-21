//This script must be placed in the HEAD above all external stylesheet declarations (link[rel=stylesheet])
function loadFonts (url) {
  // 0. Many unsupported browsers should stop here
  var noSupport = !window.addEventListener || (navigator.userAgent.match(/(Android (2|3|4.0|4.1|4.2|4.3))|(Opera (Mini|Mobi))/) && !navigator.userAgent.match(/Chrome/)); // IE8 and below || Android Stock Browser below 4.4 and Opera Mini
  if (!noSupport) {
    // 1. Set up the <style> element, that we are using to apply the base64 encoded font data
    var styleElement = document.createElement('style');
    styleElement.rel = 'stylesheet';
    document.head.appendChild(styleElement);
    // 2. Get file HEAD, to check validity
    var head = new XMLHttpRequest();
    head.open('HEAD', url, true);
    head.onload = function () {
      // 3. Setup localStorage
      var ls = {};
      try {ls = localStorage;} catch (ex) {}
      var lsPrefix = 'ANTfonts__';
      var lsUrl    = lsPrefix + 'url';
      var lsCss    = lsPrefix + 'css';
      var lsTs     = lsPrefix + 'ts';
      var ts       = '' + (new Date(head.getResponseHeader('Last-Modified')).getTime());
      // 4. Checking whether the font data is already in localStorage and up-to-date
      if (ls[ lsCss ] && ls[ lsUrl ] === url && ls[ lsTs ] === ts && window.location.search.indexOf('reloadFonts=1') < 0) {
        // 5a. Applying the font style sheet
        styleElement.textContent = ls[ lsCss ];
      } else {
        // 5b. Fetching the font data from the server
        var get = new XMLHttpRequest();
        get.open('GET', url, true);
        get.onload = function () {
          if (get.status >= 200 && get.status < 400) {
            // 6. Updating localStorage with the fresh data and applying the font data
            ls[ lsUrl ] = url;
            ls[ lsCss ] = styleElement.textContent = get.responseText;
            ls[ lsTs ] = new Date(get.getResponseHeader('Last-Modified')).getTime();
          }
        };
        get.send();
      }
    };
    head.send();
  }
}