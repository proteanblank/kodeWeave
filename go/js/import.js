// // service worker for progressive web app
// window.onload = () => {
//   'use strict';

//   if ('serviceWorker' in navigator) {
//     navigator.serviceWorker.register('sw.js');
//   }
// };

const loadApp = {
  loadScripts: function() {
    // dynamically load js file function
    dynamicallyLoadScript = (url) => {
      var script = document.createElement('script');
      script.src = url;
      script.setAttribute('defer', '');
    
      document.head.appendChild(script);
    };

    const scriptsArr = [
      'libraries/panzoom/panzoom.mod.js',
      'libraries/jszip/Blob.js',
      'libraries/jszip/FileSaver.js',
      'libraries/jszip/jszip-utils.js',
      'libraries/jszip/jszip.min.js',
      'libraries/codemirror/lib/codemirror.js',
      'libraries/codemirror/mode/javascript/javascript.js',
      'node_modules/@emmetio/codemirror-plugin/dist/browser.js',
      'node_modules/codemirror-colorpicker/dist/codemirror-colorpicker.min.js',
      'libraries/codemirror/mode/xml/xml.js',
      'libraries/codemirror/mode/htmlmixed/htmlmixed.js',
      'libraries/codemirror/addon/edit/closetag.js',
      'libraries/codemirror/addon/edit/matchbrackets.js',
      'libraries/codemirror/addon/selection/active-line.js',
      'libraries/codemirror/addon/fold/foldcode.js',
      'libraries/codemirror/addon/fold/foldgutter.js',
      'libraries/codemirror/addon/fold/brace-fold.js',
      'libraries/codemirror/addon/fold/xml-fold.js',
      'libraries/codemirror/addon/fold/comment-fold.js',
      'libraries/codemirror/addon/search/search.js',
      'libraries/codemirror/addon/search/searchcursor.js',
      'libraries/codemirror/addon/search/match-highlighter.js',
      'libraries/codemirror/addon/lint/lint.js',
      'libraries/codemirror/addon/lint/HTMLHint.js',
      'libraries/codemirror/addon/lint/html-lint.js',
      'libraries/codemirror/addon/lint/jshint.js',
      'libraries/codemirror/addon/lint/javascript-lint.js',
      'libraries/codemirror/addon/hint/show-hint.js',
      'libraries/codemirror/addon/hint/html-hint.js',
      'libraries/codemirror/addon/hint/javascript-hint.js',
      'libraries/codemirror/addon/dialog/dialog.js',
      'libraries/codemirror/addon/search/searchcursor.js',
      'libraries/codemirror/addon/search/search.js',
      'libraries/codemirror/addon/scroll/annotatescrollbar.js',
      'libraries/codemirror/addon/search/matchesonscrollbar.js',
      'libraries/codemirror/addon/search/jump-to-line.js',
      'js/app.js'
    ];

    // loop through array to add required scripts for app
    for (let i in scriptsArr) {

      // end of loop
      let val = parseInt(i) + 1;
      if (val === scriptsArr.length) {
        dynamicallyLoadScript(scriptsArr[i]);

        return false;
      }

      dynamicallyLoadScript(scriptsArr[i]);
    }
  },

  // initalize application function
  init: function() {
    // load scripts required for app to run
    loadApp.loadScripts();
  }
};
loadApp.init();