var url = "http://127.0.0.1:3000/* https://127.0.0.1:3000/*";//for testing- should change to the URL of the server in the end

chrome.webRequest.onHeadersReceived.addListener(function(details) {
  for (i = 0; i < details.responseHeaders.length; i++) {
 
    if (isCSPHeader(details.responseHeaders[i].name.toUpperCase())) {
      var csp = details.responseHeaders[i].value;
 
      // append "https://mysite.com" to the authorized sites
      csp = csp.replace('script-src', 'script-src ' + url + "/*");
      csp = csp.replace('connect-src', 'script-src ' + url + "/*");
      csp = csp.replace('style-src', 'style-src ' + url + "/*");
 
      details.responseHeaders[i].value = csp;
    }
  }
 
  return { // Return the new HTTP header
    responseHeaders: details.responseHeaders
  };
}, {
  urls: [
        "*://*.facebook.com/*"
      ],
  types: ["main_frame"]
}, ["blocking", "responseHeaders"]);
 
 
function isCSPHeader(headerName) {
  return (headerName == 'CONTENT-SECURITY-POLICY') || (headerName == 'X-WEBKIT-CSP');
}
/////////////////////////
// chrome.webRequest.onHeadersReceived.addListener(function(details){
//   var headers = details.responseHeaders,
//       blockingResponse = {};
//   for( var i = 0, l = headers.length; i < l; i++ ) {
//     if( headers[i].name == 'content-security-policy' ) {
//       if (details.responseHeaders[i].name.toUpperCase() == "X-WEBKIT-CSP" || details.responseHeaders[i].name.toUpperCase() == "CONTENT-SECURITY-POLICY") {
//         details.responseHeaders[i].value = "default-src *;script-src " + url + " https://*.facebook.com http://*.facebook.com https://*.fbcdn.net http://*.fbcdn.net *.facebook.net *.google-analytics.com *.virtualearth.net *.google.com 127.0.0.1:* *.spotilocal.com:* chrome-extension://lifbcibllhkdhoafpjfnlhfpfgnpldfl 'unsafe-inline' 'unsafe-eval' https://*.akamaihd.net http://*.akamaihd.net;style-src * 'unsafe-inline';connect-src https://*.facebook.com http://*.facebook.com https://*.fbcdn.net http://*.fbcdn.net *.facebook.net *.spotilocal.com:* https://*.akamaihd.net ws://*.facebook.com:* http://*.akamaihd.net " + url + ";"
//       }
//       break;
//     }
    
//   }
//   blockingResponse.responseHeaders = headers;
//   return blockingResponse;
// },
// {urls: ["*://*.facebook.com/*"]},
// ["blocking", "responseHeaders"]);