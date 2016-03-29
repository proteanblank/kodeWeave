var timeout,
    delay,
    htmlWaiting,
    cssWaiting,
    jsWaiting,
    JSValEnabled = function() {
      jsEditor.setOption("lint", true)
      jsEditor.setOption("gutters", ["CodeMirror-lint-markers", "CodeMirror-linenumbers", "CodeMirror-foldgutter"])
      jsWaiting = setTimeout(updateJSHints, 300)
      clearTimeout(jsWaiting)
      setTimeout(updateJSHints, 300)
    },
    JSValDisabled = function() {
      jsEditor.setOption("lint", false)
      jsEditor.setOption("gutters", ["CodeMirror-linenumbers", "CodeMirror-foldgutter"])
      for (var i = 0; i < widgets.length; ++i) {
        jsEditor.removeLineWidget(widgets[i])
      }
    },
    singleFileDownload = function() {
      $(".savehtml").click(function() {
        var blob = new Blob([ htmlEditor.getValue() ], {type: "text/html"})
        saveAs(blob, "source.html")
      })
      $(".savecss").click(function() {
        var blob = new Blob([ cssEditor.getValue() ], {type: "text/css"})
        saveAs(blob, "source.css")
      })
      $(".savejs").click(function() {
        var blob = new Blob([ jsEditor.getValue() ], {type: "text/javascript"})
        saveAs(blob, "source.js")
      })
      $(".savemd").click(function() {
        var blob = new Blob([ mdEditor.getValue() ], {type: "text/x-markdown"})
        saveAs(blob, "source.md")
      })
    },
    applyLowercase = function() {
      if ( activeEditor.val() === "htmlEditor" ) {
        var selected_text = htmlEditor.getSelection().toLowerCase()  // Need to grab the Active Selection

        htmlEditor.replaceSelection(selected_text)
        htmlEditor.focus()
      } else if ( activeEditor.val() === "cssEditor" ) {
        var selected_text = cssEditor.getSelection().toLowerCase()  // Need to grab the Active Selection

        cssEditor.replaceSelection(selected_text)
        cssEditor.focus()
      } else if ( activeEditor.val() === "jsEditor" ) {
        var selected_text = jsEditor.getSelection().toLowerCase()  // Need to grab the Active Selection

        jsEditor.replaceSelection(selected_text)
        jsEditor.focus()
      } else if ( activeEditor.val() === "mdEditor" ) {
        var selected_text = mdEditor.getSelection().toLowerCase()  // Need to grab the Active Selection

        mdEditor.replaceSelection(selected_text)
        mdEditor.focus()
      }
    },
    applyUppercase = function() {
      if ( activeEditor.val() === "htmlEditor" ) {
        var selected_text = htmlEditor.getSelection().toUpperCase()  // Need to grab the Active Selection

        htmlEditor.replaceSelection(selected_text)
        htmlEditor.focus()
      } else if ( activeEditor.val() === "cssEditor" ) {
        var selected_text = cssEditor.getSelection().toUpperCase()  // Need to grab the Active Selection

        cssEditor.replaceSelection(selected_text)
        cssEditor.focus()
      } else if ( activeEditor.val() === "jsEditor" ) {
        var selected_text = jsEditor.getSelection().toUpperCase()  // Need to grab the Active Selection

        jsEditor.replaceSelection(selected_text)
        jsEditor.focus()
      } else if ( activeEditor.val() === "mdEditor" ) {
        var selected_text = mdEditor.getSelection().toUpperCase()  // Need to grab the Active Selection

        mdEditor.replaceSelection(selected_text)
        mdEditor.focus()
      }
    },
    applyMinify = function() {
      if ( activeEditor.val() === "htmlEditor" ) {
        htmlEditor.setValue(htmlEditor.getValue().replace(/\<\!--\s*?[^\s?\[][\s\S]*?--\>/g,'').replace(/\>\s*\</g,'><'))
        $("[data-action=tools].active").trigger("click")
      } else if ( activeEditor.val() === "cssEditor" ) {
        cssEditor.setValue( cssEditor.getValue().replace(/\/\*.*\*\/|\/\*[\s\S]*?\*\/|\n|\t|\v|\s{2,}/g,"").replace(/\s*\{\s*/g,"{").replace(/\s*\}\s*/g,"}").replace(/\s*\:\s*/g,":").replace(/\s*\;\s*/g,";").replace(/\s*\,\s*/g,",").replace(/\s*\~\s*/g,"~").replace(/\s*\>\s*/g,">").replace(/\s*\+\s*/g,"+").replace(/\s*\!\s*/g,"!") )
      } else if ( activeEditor.val() === "jsEditor" ) {
        jsEditor.setValue( jsEditor.getValue().replace(/\/\*[\s\S]*?\*\/|\/\/.*\n|\s{2,}|\n|\t|\v|\s(?=function\(.*?\))|\s(?=\=)|\s(?=\{)/g,"").replace(/\s?function\s?\(/g,"function(").replace(/\s?\{\s?/g,"{").replace(/\s?\}\s?/g,"}").replace(/\,\s?/g,",").replace(/if\s?/g,"if") )
      }
    },
    applyBeautify = function() {
      if ( activeEditor.val() === "htmlEditor" ) {
        beautifyHTML()
      } else if ( activeEditor.val() === "cssEditor" ) {
        beautifyCSS()
      } else if ( activeEditor.val() === "jsEditor" ) {
        beautifyJS()
      }
    },
    OtherKeyResults = function() {
      $("[data-action=lowercase]").attr("title", "CTRL+'")
      $("[data-action=uppercase]").attr("title", "CTRL+\\")
      $("[data-action=gotoline]").attr("title", "Ctrl+L")
      $("[data-action=search]").attr("title", "CTRL+F")
      $("[data-action=replace]").attr("title", "Shift-Ctrl-F")
      $("[data-action=replaceall]").attr("title", "Shift-Ctrl-R")
      $("[data-action=minify]").attr("title", "Shift+Ctrl+'")
      $("[data-action=tidy]").attr("title", "Shift+Ctrl+\\")
      $("[data-action=toggle_comment]").attr("title", "Ctrl+/")
    },
    shortcutKeys = function() {
      // Load File
      shortcut.add("Ctrl+O", function() {
        $("[data-action=open-file]").trigger("click")
      })
      // New Document
      shortcut.add("Ctrl+N", function() {
        $(".check").attr("checked", false).trigger("change")
        $("[data-action=sitetitle]").val("site title").change()
        $("[data-action=sitedesc]").val("sample description").change()
        $("[data-action=siteauthor]").val("kodeWeave").change()
        htmlEditor.setValue("<!-- comment -->\nhello world!")
        cssEditor.setValue("")
        jsEditor.setValue("")
      })
      // Export layout hotkey
      shortcut.add("Ctrl+S", function() {
        $("[data-action=download-zip]").trigger("click")
      })
      // Reload Application
      shortcut.add("F5", function() {
        location.reload(true)
      })
      shortcut.add("Ctrl+R", function() {
        location.reload(true)
      })
      $("#restartapp").click(function() {
        location.reload(true)
      })
      // window.addEventListener("keydown", function(e) {
      // // New Document (CMD+N)
      //   if ( e.metaKey && e.keyCode == 78 ) {
      //     $(".check").attr("checked", false).trigger("change")
      //     htmlEditor.setValue("<!-- comment -->\nhello world!")
      //     cssEditor.setValue("")
      //     jsEditor.setValue("")
      //     mdEditor.setValue("")
      //   }
      // // Export as Zip (CMD+S)
      //   if ( e.metaKey && e.keyCode == 83 ) {
      //     $("[data-action=download-zip]").trigger("click")
      //   }
      // })

      if ( navigator.platform.indexOf('Mac') > -1 ) {
        $("[data-action=lowercase]").attr("title", "Cmd+'")
        $("[data-action=uppercase]").attr("title", "Cmd+\\")
        $("[data-action=gotoline]").attr("title", "Cmd+L")
        $("[data-action=search]").attr("title", "CMD+F")
        $("[data-action=replace]").attr("title", "Cmd+Option+F")
        $("[data-action=replaceall]").attr("title", "Shift+Cmd+Option+F")
        $("[data-action=minify]").attr("title", "Shift+Cmd+'")
        $("[data-action=tidy]").attr("title", "Shift+Cmd+\\")
        $("[data-action=toggle_comment]").attr("title", "Cmd+/")
      } else {
        OtherKeyResults()
      }
    },
    initGenerators = function() {
      // Tidy Up/Beautify Code
      $("[data-action=tidy]").click(function() {
        // if ( activeEditor.val() === "htmlEditor" ) {
        //   var htmlLines = htmlEditor.lineCount()
        //   htmlEditor.autoFormatRange({line:0, ch:0}, {line:htmlLines})
        // } else if ( activeEditor.val() === "cssEditor" ) {
        //   var cssLines = cssEditor.lineCount()
        //   cssEditor.autoFormatRange({line:0, ch:0}, {line:cssLines})
        // } else if ( activeEditor.val() === "jsEditor" ) {
        //   var jsLines = jsEditor.lineCount()
        //   jsEditor.autoFormatRange({line:0, ch:0}, {line:jsLines})
        // }

        applyBeautify()

        $("[data-action=tools].active").trigger("click")
      })

      // Minify Code
      $("[data-action=minify]").click(function() {
        applyMinify()
        $("[data-action=tools].active").trigger("click")
      })

      // Go To Line
      $("[data-action=gotoline]").click(function() {
        if ( activeEditor.val() === "htmlEditor" ) {
          htmlEditor.execCommand("gotoLine")
        } else if ( activeEditor.val() === "cssEditor" ) {
          cssEditor.execCommand("gotoLine")
        } else if ( activeEditor.val() === "jsEditor" ) {
          jsEditor.execCommand("gotoLine")
        } else if ( activeEditor.val() === "mdEditor" ) {
          mdEditor.execCommand("gotoLine")
        }

        $("[data-action=tools].active").trigger("click")
      })

      // Comment Current Selection
      $("[data-action=toggle_comment]").click(function() {
        if ( activeEditor.val() === "htmlEditor" ) {
          htmlEditor.execCommand("emmet.toggle_comment")
        } else if ( activeEditor.val() === "cssEditor" ) {
          cssEditor.execCommand("emmet.toggle_comment")
        } else if ( activeEditor.val() === "jsEditor" ) {
          jsEditor.execCommand("emmet.toggle_comment")
        } else if ( activeEditor.val() === "mdEditor" ) {
          mdEditor.execCommand("emmet.toggle_comment")
        }

        $("[data-action=tools].active").trigger("click")
      })

      // Make text selection lowercase
      $("[data-action=lowercase]").click(function() {
        applyLowercase()
        $("[data-action=tools].active").trigger("click")
      })

      // Make text selection uppercase
      $("[data-action=uppercase]").click(function() {
        applyUppercase()
        $("[data-action=tools].active").trigger("click")
      })

      $("[data-action=search]").click(function() {
        if ( activeEditor.val() === "htmlEditor" ) {
          htmlEditor.execCommand("find")
        } else if ( activeEditor.val() === "cssEditor" ) {
          cssEditor.execCommand("find")
        } else if ( activeEditor.val() === "jsEditor" ) {
          jsEditor.execCommand("find")
        } else if ( activeEditor.val() === "mdEditor" ) {
          mdEditor.execCommand("find")
        }
        $("[data-action=tools].active").trigger("click")
      })
      $("[data-action=replace]").click(function() {
        if ( activeEditor.val() === "htmlEditor" ) {
          htmlEditor.execCommand("replace")
        } else if ( activeEditor.val() === "cssEditor" ) {
          cssEditor.execCommand("replace")
        } else if ( activeEditor.val() === "jsEditor" ) {
          jsEditor.execCommand("replace")
        } else if ( activeEditor.val() === "mdEditor" ) {
          mdEditor.execCommand("replace")
        }
        $("[data-action=tools].active").trigger("click")
      })
      $("[data-action=replaceall]").click(function() {
        if ( activeEditor.val() === "htmlEditor" ) {
          htmlEditor.execCommand("replaceAll")
        } else if ( activeEditor.val() === "cssEditor" ) {
          cssEditor.execCommand("replaceAll")
        } else if ( activeEditor.val() === "jsEditor" ) {
          jsEditor.execCommand("replaceAll")
        } else if ( activeEditor.val() === "mdEditor" ) {
          mdEditor.execCommand("replaceAll")
        }
        $("[data-action=tools].active").trigger("click")
      })
    },
    fullscreenEditor = function() {
      $(".fullscreen-html-toggle").click(function() {
        $(this).toggleClass("fill unfill")
        if ( $(".fullscreen-html-toggle.unfill").is(":visible") ) {
          $(this).html('<span class="fa fa-expand" id="fullscreen-html"></span>')
          GridScheme()
        } else if ( $(".fullscreen-html-toggle.fill").is(":visible") ) {
          $(this).html('<span class="fa fa-compress" id="fullscreen-html"></span>')
          $("#mainSplitter").jqxSplitter({
            height: "auto",
            width: "100%",
            orientation: "vertical",
            showSplitBar: false,
            panels: [{ size: '0%' },
                     { size: '100%',collapsible:false }]
          })
          $("#splitContainer").jqxSplitter({
            height: "auto",
            width: "100%",
            orientation: "vertical",
            showSplitBar: false,
            panels: [{ size: "100%" },
                     { size: "100%" }]
          })
          $("#leftSplitter").jqxSplitter({
            height: "100%",
            width: "100%",
            orientation: "horizontal",
            showSplitBar: false,
            panels: [{ size: "100%" },
                     { size: "0%"}]
          })
          $("#rightSplitter").jqxSplitter({
            height: "100%",
            width: "100%",
            orientation: "horizontal",
            showSplitBar: false,
            panels: [{ size: "0%"},
                     { size: "0%"}]
          })
        }
      })
      $(".fullscreen-css-toggle").click(function() {
        $(this).toggleClass("fill unfill")
        if ( $(".fullscreen-css-toggle.unfill").is(":visible") ) {
          $(this).html('<span class="fa fa-expand" id="fullscreen-css"></span>')
          GridScheme()
        } else if ( $(".fullscreen-css-toggle.fill").is(":visible") ) {
          $(this).html('<span class="fa fa-compress" id="fullscreen-css"></span>')
          $("#mainSplitter").jqxSplitter({
            height: "auto",
            width: "100%",
            orientation: "vertical",
            showSplitBar: false,
            panels: [{ size: '0%' },
                     { size: '100%',collapsible:false }]
          })
          $("#splitContainer").jqxSplitter({
            height: "auto",
            width: "100%",
            orientation: "vertical",
            showSplitBar: false,
            panels: [{ size: "100%" },
                     { size: "100%" }]
          })
          $("#leftSplitter").jqxSplitter({
            height: "100%",
            width: "100%",
            orientation: "horizontal",
            showSplitBar: false,
            panels: [{ size: "0%" },
                     { size: "100%"}]
          })
          $("#rightSplitter").jqxSplitter({
            height: "100%",
            width: "100%",
            orientation: "horizontal",
            showSplitBar: false,
            panels: [{ size: "100%"},
                     { size: "0%"}]
          })
        }
      })
      $(".fullscreen-js-toggle").click(function() {
        $(this).toggleClass("fill unfill")
        if ( $(".fullscreen-js-toggle.unfill").is(":visible") ) {
          $(this).html('<span class="fa fa-expand" id="fullscreen-js"></span>')
          GridScheme()
        } else if ( $(".fullscreen-js-toggle.fill").is(":visible") ) {
          $(this).html('<span class="fa fa-compress" id="fullscreen-js"></span>')
          $("#mainSplitter").jqxSplitter({
            height: "auto",
            width: "100%",
            orientation: "vertical",
            showSplitBar: false,
            panels: [{ size: '0%' },
                     { size: '100%',collapsible:false }]
          })
          $("#splitContainer").jqxSplitter({
            height: "auto",
            width: "100%",
            orientation: "vertical",
            showSplitBar: false,
            panels: [{ size: "0%" },
                     { size: "100%" }]
          })
          $("#leftSplitter").jqxSplitter({
            height: "100%",
            width: "100%",
            orientation: "horizontal",
            showSplitBar: false,
            panels: [{ size: "0%" },
                     { size: "0%"}]
          })
          $("#rightSplitter").jqxSplitter({
            height: "100%",
            width: "100%",
            orientation: "horizontal",
            showSplitBar: false,
            panels: [{ size: "100%"},
                     { size: "0%"}]
          })
        }
      })
      $(".fullscreen-md-toggle").click(function() {
        $(this).toggleClass("fill unfill")
        if ( $(".fullscreen-md-toggle.unfill").is(":visible") ) {
          $(this).html('<span class="fa fa-expand" id="fullscreen-md"></span>')
          GridScheme()
        } else if ( $(".fullscreen-md-toggle.fill").is(":visible") ) {
          $(this).html('<span class="fa fa-compress" id="fullscreen-md"></span>')
          $("#mainSplitter").jqxSplitter({
            height: "auto",
            width: "100%",
            orientation: "vertical",
            showSplitBar: false,
            panels: [{ size: '100%' },
                     { size: '0%',collapsible:false }]
          })
          $("#splitContainer").jqxSplitter({
            height: "auto",
            width: "100%",
            orientation: "vertical",
            showSplitBar: false,
            panels: [{ size: "0%" },
                     { size: "0%" }]
          })
        }
      })
      $(".preview-mode-toggle").click(function() {
        $(this).toggleClass("fill unfill")
        if ( $(".preview-mode-toggle.unfill").is(":visible") ) {
          $(this).html('<span class="fa fa-expand" id="preview-mode"></span>')
          GridScheme()
        } else if ( $(".preview-mode-toggle.fill").is(":visible") ) {
          $(this).html('<span class="fa fa-compress" id="preview-mode"></span>')
          $("#mainSplitter").jqxSplitter({
            height: "auto",
            width: "100%",
            orientation: "vertical",
            showSplitBar: false,
            panels: [{ size: '0%' },
                     { size: '100%',collapsible:false }]
          })
          $("#splitContainer").jqxSplitter({
            height: "auto",
            width: "100%",
            orientation: "vertical",
            showSplitBar: false,
            panels: [{ size: "0%" },
                     { size: "100%" }]
          })
          $("#leftSplitter").jqxSplitter({
            height: "100%",
            width: "100%",
            orientation: "horizontal",
            showSplitBar: false,
            panels: [{ size: "0%" },
                     { size: "0%"}]
          })
          $("#rightSplitter").jqxSplitter({
            height: "100%",
            width: "100%",
            orientation: "horizontal",
            showSplitBar: false,
            panels: [{ size: "0%"},
                     { size: "100%"}]
          })
        }
      })
    },
    appDemos = function() {
      var clearPreview = function() {
        var previewFrame = document.getElementById("preview")
        var preview =  previewFrame.contentDocument ||  previewFrame.contentWindow.document
        preview.open()
        preview.write("")
        preview.close()
      };

      $("[data-action=alphabetizer]").on("click", function() {
        clearPreview()
        $(".check").attr("checked", false).trigger("change")
        $("[data-action=library-code]").val("").change()
        $("[data-action=sitetitle]").val("Alphabetizer").change()
        htmlEditor.setValue("<div class=\"grid\">\n  <div class=\"grid__col--12\">\n    <button class=\"btn--default\" data-action=\"alphabetize\">Alphabetize</button>\n    <textarea class=\"form__input\" data-action=\"input-list\" rows=\"7\" placeholder=\"Alphabetize your text here...\">China\nIndia\nUnited States of America\nIndonesia\nBrazil\nPakistan\nNigeria\nBangladesh\nRussia\nJapan\nMexico\nPhilippines\nEthiopia\nVietnam\nEgypt\nGermany\nIran\nTurkey\nDemocratic Republic of the Congo\nFrance</textarea>\n  </div>\n</div>")
        cssEditor.setValue("")
        jsEditor.setValue("var txt = document.querySelector(\"[data-action=input-list]\")\n\ndocument.querySelector(\"[data-action=alphabetize]\").addEventListener(\"click\", function() {\n  txt.value = (txt.value.split(\"\\n\").sort(caseInsensitive).join(\"\\n\"))\n\n  function caseInsensitive(a, b) {\n    return a.toLowerCase().localeCompare(b.toLowerCase())\n  }\n})\n")
        $(".open-demos, #polyui").trigger("click")
        callCollabUpdate()
      })
        $("[data-action=angular]").on("click", function() {
          $(".check").attr("checked", false).trigger("change")
          $("[data-action=library-code]").val("").change()
          $("[data-action=sitetitle]").val("Angular JS Demo").change()
          htmlEditor.setValue("<div class=\"page-wrap\" ng-app>\n  <h1 class=\"headline\">Simple content toggle with AngularJS</h1>\n  <p>\n    Choose what to display:\n    <select class=\"content-select\" ng-model=\"selection\">\n      <option value=\"content1\">Content #1</option>\n      <option value=\"content2\">Content #2</option>\n    </select>\n  </p>\n\n  <div class=\"container\">\n    <article ng-show=\"selection == 'content1'\">\n      <h2 class=\"h2\">Content #1</h2>\n      <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est.</p>\n    </article>\n    <article ng-show=\"selection == 'content2'\">\n      <h2 class=\"h2\">Content #2</h2>\n      <p>Consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>\n    </article>\n  </div>\n</div>")
          cssEditor.setValue("body {\n  padding: 3em 2em;\n  font-size: 1em;\n  line-height: 1;\n}\n\n/* Pen specific CSS */\n.page-wrap {\n  margin: 0 auto;\n  max-width: 700px;\n}\n\n.headline {\n  margin: 0 0 .7em 0;\n  font-size: 1.7em;\n  font-weight: bold;\n}\n\n.content-select {\n  margin: 0 0 0 1em;\n}\n\narticle {\n  margin: 3em 0 0 0;\n}\narticle p {\n  margin: 0 0 .5em 0;\n  line-height: 1.3;\n}\narticle .h2 {\n  margin: 0 0 .5em 0;\n  font-size: 1.2em;\n}")
          jsEditor.setValue("")
          $(".open-demos, #normalize, #angular").trigger("click")
          callCollabUpdate()
        })
      $("[data-action=applicator]").on("click", function() {
        clearPreview()
        $(".check").attr("checked", false).trigger("change")
        $("[data-action=library-code]").val("").change()
        $("[data-action=sitetitle]").val("Code Applicator").change()
        htmlEditor.setValue("<textarea id=\"addcode\" placeholder=\"Encode here...\"></textarea>\n<textarea id=\"encode\" readonly placeholder=\"Encoded code goes here...\"></textarea>\n<div id=\"decode\">Preview code here.</div>")
        cssEditor.setValue("body {\n  margin: 0;\n}\n\n::-webkit-input-placeholder { /* WebKit browsers */\n  color: #555;\n}\n:-moz-placeholder { /* Mozilla Firefox 4 to 18 */\n  color: #555;\n}\n::-moz-placeholder { /* Mozilla Firefox 19+ */\n  color: #555;\n}\n:-ms-input-placeholder { /* Internet Explorer 10+ */\n  color: #555;\n}\n\n#addcode, #encode, #decode {\n  position: absolute;\n  font-family: monospace;\n  line-height: 1.4em;\n  font-size: 1em;\n  overflow: auto;\n  resize: none;\n  margin: 0;\n  padding: 0;\n  border: 0;\n}\n\n#encode, #decode {\n  left: 0;\n  width: 50%;\n  height: 50%;\n  background-color: #fff;\n}\n\n#addcode {\n  top: 0;\n  right: 0;\n  bottom: 0;\n  margin: 0;\n  width: 50%;\n  height: 100%;\n  min-height: 1.4em;\n  border: 0;\n  border-radius: 0;\n  resize: none;\n  color: #ccc;\n  background-color: #111;\n}\n\n#encode {\n  top: 0;\n}\n\n#decode {\n  bottom: 0;\n}\n")
        jsEditor.setValue("document.querySelector(\"#addcode\").onkeyup = function() {\n  document.querySelector(\"#encode\").textContent = this.value\n  document.querySelector(\"#encode\").textContent = document.querySelector(\"#encode\").innerHTML\n  if ( this.value === \"\" ) {\n    document.querySelector(\"#decode\").innerHTML = \"Preview code here.\"\n  } else {\n    document.querySelector(\"#decode\").innerHTML = this.value\n  }\n  return false\n}\n\ndocument.querySelector(\"#encode\").onclick = function() {\n  this.select()\n  return false\n}\n")
        $(".open-demos").trigger("click")
        callCollabUpdate()
      })
      $("[data-action=charactermap]").on("click", function() {
        clearPreview()
        $(".check").attr("checked", false).trigger("change")
        $("[data-action=library-code]").val("").change()
        $("[data-action=sitetitle]").val("Character Map").change()
        htmlEditor.setValue("<iframe src=\"http://dev.w3.org/html5/html-author/charref\"></iframe>")
        cssEditor.setValue("html, body {\n  height: 100%;\n}\n\niframe {\n  width: 100%;\n  height: 100%;\n  border: 0;\n}")
        jsEditor.setValue("")
        $(".open-demos").trigger("click")
        callCollabUpdate()
      })
      $("[data-action=codeeditor]").on("click", function() {
        clearPreview()
        $(".check").attr("checked", false).trigger("change")
        $("[data-action=library-code]").val("").change()
        $("[data-action=sitetitle]").val("Code Editor").change()
        htmlEditor.setValue("<textarea id=\"code\"><!doctype html>\n<html>\n  <head>\n    <meta charset=utf-8>\n    <title>HTML5 canvas demo</title>\n    <style>\n      p {\n        font: 12px Verdana, sans-serif;\n        color: #935033;\n      }\n    </style>\n  </head>\n  <body>\n    <p>Canvas pane goes here:</p>\n    <canvas id=\"pane\" width=\"300\" height=\"200\"></canvas>\n\n    <script>\n      var canvas = document.getElementById(\"pane\")\n      var context = canvas.getContext(\"2d\")\n\n      context.fillStyle = \"rgb(250,0,0)\"\n      context.fillRect(10, 10, 55, 50)\n\n      context.fillStyle = \"rgba(0, 0, 250, 0.5)\"\n      context.fillRect(30, 30, 55, 50)\n    </script>\n  </body>\n</html></textarea>\n\n<iframe id=\"preview\"></iframe>")
        cssEditor.setValue(".CodeMirror {\n  float: left;\n  width: 50%;\n  border: 1px solid #000;\n}\n\niframe {\n  width: 49%;\n  float: left;\n  height: 300px;\n  border: 1px solid #000;\n  border-left: 0;\n}")
        jsEditor.setValue("var delay\n\n// Initialize CodeMirror editor\nvar editor = CodeMirror.fromTextArea(document.getElementById(\"code\"), {\n  mode: \"text/html\",\n  tabMode: \"indent\",\n  styleActiveLine: true,\n  lineNumbers: true,\n  lineWrapping: true,\n  autoCloseTags: true,\n  foldGutter: true,\n  dragDrop: true,\n  lint: true,\n  gutters: [\"CodeMirror-lint-markers\", \"CodeMirror-linenumbers\", \"CodeMirror-foldgutter\"]\n})\nInlet(editor)\nemmetCodeMirror(editor)\n\n// Live preview\neditor.on(\"change\", function() {\n  clearTimeout(delay)\n  delay = setTimeout(updatePreview, 300)\n})\n\nfunction updatePreview() {\n  var previewFrame = document.getElementById(\"preview\")\n  var preview =  previewFrame.contentDocument ||  previewFrame.contentWindow.document\n  preview.open()\n  preview.write(editor.getValue())\n  preview.close()\n}\nsetTimeout(updatePreview, 300)\n")
        $(".open-demos, #codemirror").trigger("click")
        callCollabUpdate()
      })
      $("[data-action=convertforvalues]").on("click", function() {
        clearPreview()
        $(".check").attr("checked", false).trigger("change")
        $("[data-action=library-code]").val("").change()
        $("[data-action=sitetitle]").val("Convert for Values").change()
        htmlEditor.setValue("<textarea class=\"editor\" placeholder=\"Code with multiple lines here...\"></textarea>\n<textarea class=\"preview\" placeholder=\"Generated result here...\"></textarea>")
        cssEditor.setValue("body {\n  margin: 0;\n  background: #333;\n}\n\n.editor, .preview {\n  position: absolute;\n  width: 50%;\n  height: 100%;\n  padding: 0;\n  font-family: monospace;\n  min-height: 1.4em;\n  line-height: 1.4em;\n  font-size: 1em;\n  border: 0;\n  border-radius: 0;\n  resize: none;\n}\n\n.editor {\n  left: 0;\n  color: #0b0;\n  background-color: #000;\n}\n\n::-webkit-input-placeholder { /* WebKit browsers */\n  color: #0f6;\n}\n:-moz-placeholder { /* Mozilla Firefox 4 to 18 */\n  color: #0f6;\n}\n::-moz-placeholder { /* Mozilla Firefox 19+ */\n  color: #0f6;\n}\n:-ms-input-placeholder { /* Internet Explorer 10+ */\n  color: #0f6;\n}\n\n.preview {\n  right: 0;\n  background-color: #fff;\n}\n")
        jsEditor.setValue("$(document).ready(function() {\n  var editor = $(\".editor\"),\n      preview = $(\".preview\");\n  \n  // Remove new line and insert new line showing the text in value\n  editor.keyup(function() {\n    preview.val( this.value.replace(/\"/g,'\\\\\"').replace(/\\n/g,\"\\\\n\") )\n  }).click(function() {\n    this.select()\n  })\n  \n  // Easily Select Converted Code\n  preview.click(function() {\n    this.select()\n  })\n})\n")
        $(".open-demos, #normalize, #jquery").trigger("click")
        callCollabUpdate()
      })
      $("[data-action=dateclock]").on("click", function() {
        clearPreview()
        $(".check").attr("checked", false).trigger("change")
        $("[data-action=library-code]").val("").change()
        $("[data-action=sitetitle]").val("Date and Time").change()
        htmlEditor.setValue("<span class=\"date\" data-action=\"leftdate\"></span>\n<span class=\"date fr\" data-action=\"rightdate\"></span>\n<div class=\"clock\" data-action=\"clock\"></div>\n")
        cssEditor.setValue(".date {\n  font-family: arial;\n}\n\n.fr {\n  float: right;\n}\n\n.clock {\n  font: bold 1.5em sans;\n  text-align: center;\n}")
        jsEditor.setValue("// Define a function to display the current time\nfunction displayTime() {\n  var now = new Date();\n  document.querySelector('[data-action=clock]').innerHTML =  now.toLocaleTimeString();\n  setTimeout(displayTime, 1000);\n}\ndisplayTime();\n\n// Date\nvar currentTime = new Date();\nvar month = currentTime.getMonth() + 1;\nvar date = currentTime.getDate();\nvar year = currentTime.getFullYear();\ndocument.querySelector('[data-action=leftdate]').innerHTML = month + '/' + date + '/' + year;\n\nvar today = new Date();\nif (year < 1000)\n  year += 1900;\nvar day = today.getDay();\nvar monthname = today.getMonth();\nif (date < 10)\n  date = '0' + date;\nvar dayarray = new Array('Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday');\nvar montharray = new Array('January','February','March','April','May','June','July','August','September','October','November','December');\ndocument.querySelector('[data-action=rightdate]').innerHTML = dayarray[day] + ', ' + montharray[monthname] + ' ' + date + ', ' + year;\n")
        $(".open-demos").trigger("click")
        callCollabUpdate()
      })
      $("[data-action=detectorientation]").on("click", function() {
        clearPreview()
        $(".check").attr("checked", false).trigger("change")
        $("[data-action=library-code]").val("").change()
        $("[data-action=sitetitle]").val("Detect Orientation").change()
        htmlEditor.setValue("<h1 class=\"portrait\">Portrait</h1>\n<h1 class=\"landscape\">Landscape</h1>\n<footer class=\"foot\"></footer>")
        cssEditor.setValue("body {\n  font: 26px arial;\n}\n.portrait, .landscape, .foot {\n  text-align: center;\n}\n.foot {\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  padding: 26px;\n}\n")
        jsEditor.setValue("var detectOrientation = function() {\n  if ( window.innerWidth > window.innerHeight ) {\n    document.querySelector(\".landscape\").style.display = \"block\"\n    document.querySelector(\".portrait\").style.display = \"none\"\n  } else if ( window.innerWidth < window.innerHeight ) {\n    document.querySelector(\".landscape\").style.display = \"none\"\n    document.querySelector(\".portrait\").style.display = \"block\"\n  }\n  document.querySelector(\".foot\").innerHTML =  window.innerWidth + \"px, \" + window.innerHeight + \"px\"\n}\n\nwindow.addEventListener(\"resize\", function() {\n  detectOrientation()\n})\n\ndetectOrientation()\n")
        $(".open-demos").trigger("click")
        callCollabUpdate()
      })
      $("[data-action=osdisplay]").on("click", function() {
        clearPreview()
        $(".check").attr("checked", false).trigger("change")
        $("[data-action=library-code]").val("").change()
        $("[data-action=sitetitle]").val("Detect Operating System").change()
        htmlEditor.setValue("<div data-output=\"os\"></div>")
        cssEditor.setValue("")
        jsEditor.setValue("document.addEventListener(\"DOMContentLoaded\", function() {\n  document.querySelector(\"[data-output=os]\").innerHTML = \"<strong>Operating System</strong>: \" + navigator.platform\n})")
        $(".open-demos").trigger("click")
        callCollabUpdate()
      })
      $("[data-action=markdowneditor]").on("click", function() {
        clearPreview()
        $(".check").attr("checked", false).trigger("change")
        $("[data-action=library-code]").val("").change()
        $("[data-action=sitetitle]").val("Live Markdown Editor").change()
        htmlEditor.setValue("<div class=\"editor-and-preview-container\">\n  <div class=\"editor-container\">Markdown Editor</div>\n  <div class=\"preview-container\">Preview</div>\n</div>\n<div class=\"editor-and-preview-container\">\n  <div class=\"editor-container\">\n    <textarea id=\"editor\">Welcome!\n===================\n\n![Placer text](http://kodeweave.sourceforge.net/logo.png)  \n\nHey! I'm your placement Markdown text.\n\n----------\n\n\nTypography\n-------------\n\n[kodeWeave Link](http://kodeweave.sourceforge.net/)  \n**bold text**  \n*italic text*  \n\n### Blockquote:\n\n> Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\n### Bullet List\n\n - Green\n - Eggs\n - and\n - Ham\n\n### Numbered List\n\n 1. Green\n 2. Eggs\n 3. and\n 4. Ham\n</textarea>\n  </div>\n  <div class=\"preview-container\">\n    <div id=\"preview\"></div>\n  </div>\n</div>")
        cssEditor.setValue("* {\n  box-sizing: border-box;\n}\n\nbody {\n  line-height: 1.4;\n}\n\n.editor-and-preview-container {\n  padding: 1em;\n  width: 100%;\n  height: 100%;\n}\n\n.editor-container, .preview-container {\n  display: inline;\n  overflow: hidden;\n  float: left;\n  width: 50%;\n  height: 100%;\n}\n\n#editor {\n  display: inline-block;\n  width: 100%;\n  height: 500px;\n  resize: none;\n  padding: 1em;\n  line-height: 1.5;\n}\n#editor:focus {\n  outline: none;\n}\n\n#preview {\n  width: 100%;\n  height: 500px;\n  border: 1px green solid;\n  padding: 0 1em;\n  overflow: auto;\n}")
        jsEditor.setValue("var mdconverter = new Showdown.converter()\nvar editor  = $(\"#editor\"),\n    preview = $(\"#preview\");\nfunction updatePreview() {\n  preview.html(mdconverter.makeHtml(editor.val()))\n}\nupdatePreview()\neditor.on(\"keyup\", function () {\n  updatePreview()\n})")
        $(".open-demos, #normalize, #jquery, #showdown").trigger("click")
        callCollabUpdate()
      })
      $("[data-action=keylogger]").on("click", function() {
        clearPreview()
        $(".check").attr("checked", false).trigger("change")
        $("[data-action=library-code]").val("").change()
        $("[data-action=sitetitle]").val("Keylogger").change()
        htmlEditor.setValue("<div class=\"container-fluid\">\n  <div class=\"row\">\n    <div class=\"col-lg-12\">\n      <input type=\"text\" class=\"form-control\" data-action=\"input\" placeholder=\"Type here for keyCode\" />\n    </div>\n  </div>\n</div>")
        cssEditor.setValue("html, body {\n  height: 100%;\n}\n\nbody {\n  padding: 1em 0;\n  background: #0072ff;\n}\n\n.form-control {\n  border-radius: 5px;\n  box-shadow: 0 0 25px #00162d;\n}")
        jsEditor.setValue("$(\"[data-action=input]\").keydown(function(e) {\n  this.value = e.which\n  e.preventDefault()\n})")
        $(".open-demos, #jquery, #bootstrap").trigger("click")
        callCollabUpdate()
      })
      $("[data-action=newdocument]").on("click", function() {
        clearPreview()
        $(".check").attr("checked", false).trigger("change")
        $("[data-action=library-code]").val("").change()
        $("[data-action=sitetitle]").val("site title").change()
        $("[data-action=sitedesc]").val("sample description").change()
        $("[data-action=siteauthor]").val("kodeWeave").change()
        htmlEditor.setValue("<!-- comment -->\nhello world!")
        cssEditor.setValue("")
        jsEditor.setValue("")
        if ($(".open-demos.active").is(":visible")) {
          $(".open-demos").trigger("click")
        }
        callCollabUpdate()
      })
      $("[data-action=packagezipfiles]").on("click", function() {
        clearPreview()
        $(".check").attr("checked", false).trigger("change")
        $("[data-action=library-code]").val("").change()
        $("[data-action=sitetitle]").val("Package Zip Files [JSZip Demo]").change()
        htmlEditor.setValue("<div class=\"grid\">\n  <div class=\"grid__col--12\">\n    <button class=\"btn--default download\">Run</button>\n    <textarea class=\"form__input\" id=\"jszipdemo\" rows=\"7\" placeholder=\"Demo code here...\">var zip = new JSZip();\nzip.file(\"Hello.txt\", \"Hello World\");\nvar folder = zip.folder(\"images\");\nfolder.file(\"folder.txt\", \"I'm a file in a new folder\");\nvar content = zip.generate({type:\"blob\"});\n// see FileSaver.js\nsaveAs(content, \"example.zip\");</textarea>\n  </div>\n</div>\n")
        cssEditor.setValue("")
        jsEditor.setValue("$(\".download\").click(function() {\n  setTimeout($(\"#jszipdemo\").val(), 0)\n})\n")
        $(".open-demos, #polyui, #jquery, #jszip").trigger("click")
        callCollabUpdate()
      })
      $("[data-action=passwordgen]").on("click", function() {
        clearPreview()
        $(".check").attr("checked", false).trigger("change")
        $("[data-action=library-code]").val("").change()
        $("[data-action=sitetitle]").val("Password Generator").change()
        htmlEditor.setValue("<div class=\"container-fluid\">\n  <div class=\"row\">\n    <div class=\"col-lg-12\">\n      <div class=\"input-group\">\n        <input type=\"text\" class=\"form-control\" data-action=\"genoutput\" />\n        <span class=\"input-group-btn\">\n          <button class=\"btn btn-default btn-primary\" type=\"button\" data-action=\"gen\">\n            Generate!\n          </button>\n        </span>\n      </div>\n    </div>\n  </div>\n</div>")
        cssEditor.setValue("html, body {\n  height: 100%;\n}\n\nbody {\n  padding: 1em 0;\n  background: #0072ff;\n}\n\n.input-group {\n  box-shadow: 0 0 25px #00162d;\n}\n\n.input-group, .form-control, .input-group-btn, .btn {\n  border-radius: 5px;\n}")
        jsEditor.setValue("function PasswordGen() {\n  var char = \"0123456789abcdefghijklmnopqrstuvwxyz\",\n  fullchar = \"0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ\",\n  genHash  = \"\",\n             i;\n\n  for (i = 0; i < 8; i++) {\n    var rnum = Math.floor(Math.random() * char.length)\n    genHash += char.substring(rnum, rnum + 1)\n  }\n\n  $(\"[data-action=genoutput]\").val(genHash)\n}\n\n$(\"[data-action=gen]\").click(function() {\n  PasswordGen()\n})\n\nPasswordGen()")
        $(".open-demos, #jquery, #bootstrap").trigger("click")
        callCollabUpdate()
      })
      $("[data-action=pdfembed]").on("click", function() {
        clearPreview()
        $(".check").attr("checked", false).trigger("change")
        $("[data-action=library-code]").val("").change()
        $("[data-action=sitetitle]").val("Embed a PDF Example").change()
        htmlEditor.setValue("<embed width=\"100%\" height=\"100%\" name=\"plugin\" src=\"http://www.usconstitution.net/const.pdf\" type=\"application/pdf\">")
        cssEditor.setValue("html, body {\n  height: 100%;\n  overflow: hidden;\n}")
        jsEditor.setValue("")
        $(".open-demos, #normalize").trigger("click")
        callCollabUpdate()
      })
      $("[data-action=pictureviewer]").on("click", function() {
        clearPreview()
        $(".check").attr("checked", false).trigger("change")
        $("[data-action=library-code]").val("").change()
        $("[data-action=sitetitle]").val("FileReader Picture Viewer").change()
        htmlEditor.setValue("<div id=\"holder\">\n  Drag and drop image <a data-action=\"call\" href=\"javascript:void()\">here</a>...\n</div> \n\n<div class=\"fill check hide\" align=\"center\">\n  <canvas class=\"logo\" width=\"128\" height=\"128\"></canvas>\n</div>\n\n<div class=\"hide\">\n  <input type=\"file\" data-action=\"load\">\n</div>\n\n<p id=\"status\">\n  File API &amp; FileReader API not supported\n</p>")
        cssEditor.setValue("#holder {\n  border: 10px dashed #ccc;\n  margin: 20px auto;\n  text-align: center;\n}\n#holder.hover {\n  border: 10px dashed #333;\n}\n\n.hide {\n  display: none;\n}\n.fill {\n  width: 100%;\n}")
        jsEditor.setValue("var canvas = $(\".logo\"),\n    ctx = canvas[0].getContext(\"2d\"),\n    holder = document.getElementById(\"holder\"),\n    state = document.getElementById(\"status\");\n\nif (typeof window.FileReader === \"undefined\") {\n  state.className = \"fail\"\n} else {\n  state.className = \"success\"\n  state.innerHTML = \"File API & FileReader available\"\n}\n\nfunction displayPreview(file) {\n  var reader = new FileReader()\n\n  reader.onload = function(e) {\n    var img = new Image()\n    img.src = e.target.result\n    img.onload = function() {\n      // x, y, width, height\n      ctx.clearRect(0, 0, 128, 128)\n      ctx.drawImage(img, 0, 0, 128, 128)\n    }\n  }\n  reader.readAsDataURL(file)\n}\n\n$(\"[data-action=call]\").click(function() {\n  $(\"[data-action=load]\").trigger(\"click\")\n})\n\n$(\"[data-action=load]\").change(function(e) {\n  var file = e.target.files[0]\n  displayPreview(file)\n  $(\".check\").removeClass(\"hide\")\n})\n\n// Drag and drop image load\nholder.ondragover = function () {\n  this.className = \"hover\"\n  return false\n}\nholder.ondragend = function () {\n  this.className = \"\"\n  return false\n}\nholder.ondrop = function(e) {\n  this.className = \"\"\n  e.preventDefault()\n  var file = e.dataTransfer.files[0]\n  displayPreview(file)\n  $(\".check\").removeClass(\"hide\")\n}")
        $(".open-demos, #jquery").trigger("click")
        callCollabUpdate()
      })
      $("[data-action=polyui]").on("click", function() {
        clearPreview()
        $(".check").attr("checked", false).trigger("change")
        $("[data-action=library-code]").val("").change()
        $("[data-action=sitetitle]").val("Poly UI Kit").change()
        htmlEditor.setValue("<div class=\"grid\">\n  <header class=\"grid__col--12 panel--padded--centered\" role=\"banner\"> \n    <a class=\"site-logo\" href=\"javascript:void(0)\">\n      <b class=\"srt\">Poly - UI Toolkit</b>\n    </a>\n    <nav class=\"navbar\" role=\"navigation\">\n      <span id=\"toggle\" class=\"icn--nav-toggle is-displayed-mobile\">\n        <b class=\"srt\">Toggle</b>\n      </span>   \n      <ul class=\"nav is-collapsed-mobile\" role=\"navigation\">\n        <li class=\"nav__item\"><a href=\"#type\">Typography</a></li>\n        <li class=\"nav__item\"><a href=\"#buttons\">Buttons</a></li>\n        <li class=\"nav__item\"><a href=\"#forms\">Form</a></li>\n        <li class=\"nav__item\"><a href=\"#images\">Images</a></li>\n        <li class=\"nav__item\"><a href=\"#grid\">Grid</a></li>\n        <li class=\"nav__item--current\"><a href=\"#nav\">Navigation</a></li>\n        <!-- Current Page Class Style -->\n        <!-- <li class=\"nav__item--current\"><a href=\"#nav\">Navigation</a></li> -->\n      </ul>\n    </nav>\n  </header>\n</div>\n\n<div class=\"grid is-hidden-mobile\">\n  <div class=\"grid__col--12\">\n    <img class=\"img--hero\" src=\"http://treehouse-code-samples.s3.amazonaws.com/poly/img/hero.jpg\" alt=\"Poly - A simple UI Kit\">\n  </div>\n</div>\n\n<h4 id=\"type\" class=\"grid\">Typography</h4>\n\n<div class=\"grid\">\n  <div class=\"centered grid__col--8\">\n    <h1 class=\"headline-primary--grouped\">Take a look at this amazing headline</h1>\n    <h2 class=\"headline-secondary--grouped\">Don't forget about the subtitle</h2>\n    <p>This is a typical paragraph for the UI Kit. <a href=\"#\">Here is what a link might look like</a>. The typical font family for this kit is Helvetica Neue.  This kit is intended for clean and refreshing web layouts. No jazz hands here, just the essentials to make dreams come true, with minimal clean web design. The kit comes fully equipped with everything from full responsive media styling to buttons to form fields. <em>I enjoy using italics as well from time to time</em>. Fell free to create the most amazing designs ever with this kit. I truly hope you enjoy not only the kit but this amazing paragraph as well. :)</p>\n    <blockquote>You know what really gets me going? A really nice set of block quotes.  That's right, block quotes that say, \"Hey, I'm an article you want to read and nurture.\"</blockquote>\n  </div>\n</div>\n\n<h4 id=\"buttons\" class=\"grid\">Buttons</h4>\n\n<div class=\"grid\">\n  <div class=\"grid__col--12\">\n    <a class=\"btn--default\" href=\"#\">Button Default</a>\n    <a class=\"btn--success\" href=\"#\">Button Success</a>\n    <a class=\"btn--error\" href=\"#\">Button Error</a>\n    <button class=\"btn--warning\">Button Warning</button>\n    <button class=\"btn--info\">Button Info</button>\n  </div>\n</div>\n\n<h4 id=\"forms\" class=\"grid\">Form Elements</h4>\n\n<div class=\"grid\">\n  <div class=\"grid__col--7\"> \n    <form class=\"form\">\n      <label class=\"form__label--hidden\" for=\"name\">Name:</label> \n      <input class=\"form__input\" type=\"text\" id=\"name\" placeholder=\"Name\">\n\n      <label class=\"form__label--hidden\" for=\"email\">Email:</label>\n      <input class=\"form__input\" type=\"email\" id=\"email\" placeholder=\"email@website.com\">\n\n      <label class=\"form__label--hidden\" for=\"msg\">Message:</label>\n      <textarea class=\"form__input\" id=\"msg\" placeholder=\"Message...\" rows=\"7\"></textarea>\n\n      <input class=\"btn--default\" type=\"submit\" value=\"Submit\">\n      <input class=\"btn--warning\" type=\"reset\" value=\"Reset\">\n    </form>\n  </div>\n  <div class=\"grid__col--4\">\n    <img class=\"img--avatar\" src=\"http://treehouse-code-samples.s3.amazonaws.com/poly/img/avatar.png\" alt=\"Avatar\">\n    <form>\n      <label class=\"form__label--hidden\" for=\"username\">Username:</label> \n      <input class=\"form__input\" type=\"text\" id=\"username\" placeholder=\"Username\">\n      <label class=\"form__label--hidden\" for=\"password\">Password:</label>\n      <input class=\"form__input\" type=\"password\" id=\"password\" placeholder=\"Password\">\n      <input class=\"form__btn\" type=\"submit\" value=\"Login\">\n    </form>\n  </div>\n</div>\n\n<h4 id=\"images\" class=\"grid\">Images</h4>\n\n<div class=\"grid\">\n  <div class=\"grid__col--5\">\n    <img src=\"http://treehouse-code-samples.s3.amazonaws.com/poly/img/sample.jpg\" alt=\"sample image\">\n  </div>\n  <div class=\"grid__col--5\">\n    <img class=\"img--wrap\" src=\"http://treehouse-code-samples.s3.amazonaws.com/poly/img/sample.jpg\" alt=\"sample image\">\n  </div>\n  <div class=\"grid__col--2\">\n    <img class=\"img--avatar\" src=\"http://treehouse-code-samples.s3.amazonaws.com/poly/img/avatar.png\" alt=\"Avatar\">\n  </div>\n</div>\n\n<h4 id=\"grid\" class=\"grid\">Grid System</h4>\n\n<div class=\"theme__poly\">\n  <div class=\"grid\">\n    <div class=\"grid__col--12\">.grid__col--12</div>\n  </div>\n  <div class=\"grid\">\n    <div class=\"grid__col--6\">.grid__col--6</div>\n    <div class=\"grid__col--6\">.grid__col--6</div>\n  </div>\n  <div class=\"grid\">\n    <div class=\"grid__col--4\">.grid__col--4</div>\n    <div class=\"grid__col--4\">.grid__col--4</div>\n    <div class=\"grid__col--4\">.grid__col--4</div>\n  </div>\n  <div class=\"grid\">\n    <div class=\"grid__col--3\">.grid__col--3</div>\n    <div class=\"grid__col--3\">.grid__col--3</div>\n    <div class=\"grid__col--3\">.grid__col--3</div>\n    <div class=\"grid__col--3\">.grid__col--3</div>\n  </div>\n  <div class=\"grid\">\n    <div class=\"grid__col--5\">.grid__col--5</div>\n    <div class=\"grid__col--7\">.grid__col--7</div>\n  </div>\n  <div class=\"grid\">\n    <div class=\"grid__col--8\">.grid__col--8</div>\n    <div class=\"grid__col--4\">.grid__col--4</div>\n  </div>\n  <div class=\"grid\">\n    <div class=\"centered grid__col--7\">.centered .grid__col--7</div>\n  </div>\n</div>\n\n<div class=\"grid\">\n  <div class=\"grid__col--7\">\n    <h4 id=\"nav\">Navigation</h4>\n    <ul class=\"nav\" role=\"navigation\">\n      <li class=\"nav__item\"><a href=\"#\">Nav Link</a></li>\n      <li class=\"nav__item\"><a href=\"#\">Nav Link 2</a></li>\n      <li class=\"nav__item--current\"><a href=\"#\">Nav Current</a></li>\n    </ul>\n    <p>This is what the navigation menu looks like when the screen is at 769px or higher. When the screen is less than 769px, you will have the option to display a toggle menu icon.</p>\n  </div>\n\n  <div class=\"grid__col--4\">\n    <h4>Offcanvas Menu</h4>\n    <div class=\"offcanvas\">\n      <span class=\"icn--close\">\n        <b class=\"srt\">close</b>\n      </span>\n      <ul class=\"menu\" role=\"navigation\">\n        <a class=\"menu__link\" href=\"#\">Link 1</a>\n        <a class=\"menu__link\" href=\"#\">Link 2</a>\n        <a class=\"menu__link\" href=\"#\">Link 3</a>\n        <a class=\"menu__link--end\" href=\"#\">Link 4</a>\n      </ul>\n    </div>\n  </div>\n</div>")
        cssEditor.setValue("")
        jsEditor.setValue("// Toggle Menu for Phones\n$(\"#toggle\").click(function() {\n  $(this).next(\".nav\").toggleClass(\"is-collapsed-mobile\")\n})\n\n// Handles Navigation Style Classes\n$(\".nav__item\").on(\"click\", function() {\n  $(this).parent().find(\"li\").removeClass(\"nav__item--current\").addClass(\"nav__item\")\n  $(this).addClass(\"nav__item--current\").removeClass(\"nav__item\")\n})")
        $(".open-demos, #polyui, #jquery").trigger("click")
        callCollabUpdate()
      })

      $("[data-action=simpleslideshow]").on("click", function() {
        clearPreview()
        $(".check").attr("checked", false).trigger("change")
        $("[data-action=library-code]").val("").change()
        $("[data-action=sitetitle]").val("Simplest jQuery Slideshow").change()
        htmlEditor.setValue("<div class=\"fadelinks\">\n  <a>\n    <img src=\"http://farm3.static.flickr.com/2610/4148988872_990b6da667.jpg\">\n  </a>\n  <a>\n    <img src=\"http://farm3.static.flickr.com/2597/4121218611_040cd7b3f2.jpg\">\n  </a>\n  <a>\n    <img src=\"http://farm3.static.flickr.com/2531/4121218751_ac8bf49d5d.jpg\">\n  </a>\n</div>\n")
        cssEditor.setValue("body {\n  font-family: arial, helvetica, sans-serif;\n  font-size: 12px;\n}\n\n.fadelinks {\n  position: relative;\n  height: 332px;\n  width: 500px;\n}\n\n.fadelinks > a {\n  display: block;\n  position: absolute;\n  top: 0;\n  left: 0;\n}")
        jsEditor.setValue("$(document).ready(function() {\n  $(\".fadelinks > :gt(0)\").hide()\n  setInterval(function() {\n    $(\".fadelinks > :first-child\").fadeOut().next().fadeIn().end().appendTo(\".fadelinks\")\n  }, 3000)\n})")
        $(".open-demos, #normalize, #jquery").trigger("click")
        callCollabUpdate()
      })
      $("[data-action=splitter]").on("click", function() {
        clearPreview()
        $(".check").attr("checked", false).trigger("change")
        $("[data-action=library-code]").val("").change()
        $("[data-action=sitetitle]").val("JQWidgets Splitter").change()
        htmlEditor.setValue("<div id=\"mainSplitter\">\n  <div>\n    <div id=\"firstNested\">\n      <div>\n        <div id=\"secondNested\">\n          <div>\n            <span>Panel 1</span></div>\n          <div>\n            <span>Panel 2</span></div>\n        </div>\n      </div>\n      <div>\n        <span>Panel 3</span></div>\n    </div>\n  </div>\n  <div>\n    <div id=\"thirdNested\">\n      <div>\n        <span>Panel 4</span></div>\n      <div>\n        <span>Panel 5</span></div>\n    </div>\n  </div>\n</div>\n")
        cssEditor.setValue("")
        jsEditor.setValue("$(document).ready(function () {\n  $(\"#mainSplitter\").jqxSplitter({\n    width: 850,\n    height: 850,\n    orientation: \"horizontal\",\n    panels: [{\n      size: 300,\n      collapsible: false\n    }]\n  });\n  $(\"#firstNested\").jqxSplitter({\n    width: \"100%\",\n    height: \"100%\",\n    orientation: \"vertical\",\n    panels: [{\n      size: 300,\n      collapsible: false\n    }]\n  });\n  $(\"#secondNested\").jqxSplitter({\n    width: \"100%\", \n    height: \"100%\", \n    orientation: \"horizontal\",\n    panels: [{ size: 150 }]\n  });\n  $(\"#thirdNested\").jqxSplitter({\n    width: \"100%\",\n    height: \"100%\", \n    orientation: \"horizontal\",\n    panels: [{\n      size: 150,\n      collapsible: false\n    }]\n  });\n});\n")
        $(".open-demos, #jquery, #jqxsplitter").trigger("click")
        callCollabUpdate()
      })
    },
    charGeneration = function() {
      $("#undo").on("click", function() {
        if ( activeEditor.val() === "htmlEditor" ) {
          htmlEditor.undo()
        } else if ( activeEditor.val() === "cssEditor" ) {
          cssEditor.undo()
        } else if ( activeEditor.val() === "jsEditor" ) {
          jsEditor.undo()
        } else if ( activeEditor.val() === "mdEditor" ) {
          mdEditor.undo()
        }
      })
      $("#redo").on("click", function() {
        if ( activeEditor.val() === "htmlEditor" ) {
          htmlEditor.redo()
        } else if ( activeEditor.val() === "cssEditor" ) {
          cssEditor.redo()
        } else if ( activeEditor.val() === "jsEditor" ) {
          jsEditor.redo()
        } else if ( activeEditor.val() === "mdEditor" ) {
          mdEditor.redo()
        }
      })
      $("#tabindent").on("click", function() {
        if ( activeEditor.val() === "htmlEditor" ) {
          htmlEditor.execCommand("indentMore")
          htmlEditor.focus()
        } else if ( activeEditor.val() === "cssEditor" ) {
          cssEditor.execCommand("indentMore")
          cssEditor.focus()
        } else if ( activeEditor.val() === "jsEditor" ) {
          jsEditor.execCommand("indentMore")
          jsEditor.focus()
        } else if ( activeEditor.val() === "mdEditor" ) {
          mdEditor.execCommand("indentMore")
          mdEditor.focus()
        }
      })
      $("#taboutdent").on("click", function() {
        if ( activeEditor.val() === "htmlEditor" ) {
          htmlEditor.execCommand("indentLess")
          htmlEditor.focus()
        } else if ( activeEditor.val() === "cssEditor" ) {
          cssEditor.execCommand("indentLess")
          cssEditor.focus()
        } else if ( activeEditor.val() === "jsEditor" ) {
          jsEditor.execCommand("indentLess")
          jsEditor.focus()
        } else if ( activeEditor.val() === "mdEditor" ) {
          mdEditor.execCommand("indentLess")
          mdEditor.focus()
        }
      })
      $("#zeninit").on("click", function() {
        if ( activeEditor.val() === "htmlEditor" ) {
          htmlEditor.execCommand("emmet.expand_abbreviation_with_tab")
          htmlEditor.focus()
        } else if ( activeEditor.val() === "cssEditor" ) {
          cssEditor.execCommand("emmet.expand_abbreviation_with_tab")
          cssEditor.focus()
        } else if ( activeEditor.val() === "jsEditor" ) {
          jsEditor.execCommand("emmet.expand_abbreviation_with_tab")
          jsEditor.focus()
        }
      })
      $("#charsym1").on("click", function() {
        if ( activeEditor.val() === "htmlEditor" ) {
          var selected_text = htmlEditor.getSelection()  // Need to grab the Active Selection

          htmlEditor.replaceSelection("<" + selected_text + ">")
          htmlEditor.focus()
        } else if ( activeEditor.val() === "cssEditor" ) {
          var selected_text = cssEditor.getSelection()  // Need to grab the Active Selection

          cssEditor.replaceSelection("<" + selected_text + ">")
          cssEditor.focus()
        } else if ( activeEditor.val() === "jsEditor" ) {
          var selected_text = jsEditor.getSelection()  // Need to grab the Active Selection

          jsEditor.replaceSelection("<" + selected_text + ">")
          jsEditor.focus()
        } else if ( activeEditor.val() === "mdEditor" ) {
          var selected_text = mdEditor.getSelection()  // Need to grab the Active Selection

          mdEditor.replaceSelection("<" + selected_text + ">")
          mdEditor.focus()
        }
      })
      $("#charsym2").on("click", function() {
        if ( activeEditor.val() === "htmlEditor" ) {
          var selected_text = htmlEditor.getSelection()  // Need to grab the Active Selection

          htmlEditor.replaceSelection("{" + selected_text + "}")
          htmlEditor.focus()
        } else if ( activeEditor.val() === "cssEditor" ) {
          var selected_text = cssEditor.getSelection()  // Need to grab the Active Selection

          cssEditor.replaceSelection("{" + selected_text + "}")
          cssEditor.focus()
        } else if ( activeEditor.val() === "jsEditor" ) {
          var selected_text = jsEditor.getSelection()  // Need to grab the Active Selection

          jsEditor.replaceSelection("{" + selected_text + "}")
          jsEditor.focus()
        } else if ( activeEditor.val() === "mdEditor" ) {
          var selected_text = mdEditor.getSelection()  // Need to grab the Active Selection

          mdEditor.replaceSelection("{" + selected_text + "}")
          mdEditor.focus()
        }
      })
      $("#charsym3").on("click", function() {
        if ( activeEditor.val() === "htmlEditor" ) {
          var selected_text = htmlEditor.getSelection()  // Need to grab the Active Selection

          htmlEditor.replaceSelection('"' + selected_text + '"')
          htmlEditor.focus()
        } else if ( activeEditor.val() === "cssEditor" ) {
          var selected_text = cssEditor.getSelection()  // Need to grab the Active Selection

          cssEditor.replaceSelection('"' + selected_text + '"')
          cssEditor.focus()
        } else if ( activeEditor.val() === "jsEditor" ) {
          var selected_text = jsEditor.getSelection()  // Need to grab the Active Selection

          jsEditor.replaceSelection('"' + selected_text + '"')
          jsEditor.focus()
        } else if ( activeEditor.val() === "mdEditor" ) {
          var selected_text = mdEditor.getSelection()  // Need to grab the Active Selection

          mdEditor.replaceSelection('"' + selected_text + '"')
          mdEditor.focus()
        }
      })
      $("#charsym4").on("click", function() {
        if ( activeEditor.val() === "htmlEditor" ) {
          var selected_text = htmlEditor.getSelection()  // Need to grab the Active Selection

          htmlEditor.replaceSelection("'" + selected_text + "'")
          htmlEditor.focus()
        } else if ( activeEditor.val() === "cssEditor" ) {
          var selected_text = cssEditor.getSelection()  // Need to grab the Active Selection

          cssEditor.replaceSelection("'" + selected_text + "'")
          cssEditor.focus()
        } else if ( activeEditor.val() === "jsEditor" ) {
          var selected_text = jsEditor.getSelection()  // Need to grab the Active Selection

          jsEditor.replaceSelection("'" + selected_text + "'")
          jsEditor.focus()
        } else if ( activeEditor.val() === "mdEditor" ) {
          var selected_text = mdEditor.getSelection()  // Need to grab the Active Selection

          mdEditor.replaceSelection("'" + selected_text + "'")
          mdEditor.focus()
        }
      })
      $("#charsym5").on("click", function() {
        if ( activeEditor.val() === "htmlEditor" ) {
          var selected_text = htmlEditor.getSelection()  // Need to grab the Active Selection

          htmlEditor.replaceSelection("(" + selected_text + ")")
          htmlEditor.focus()
        } else if ( activeEditor.val() === "cssEditor" ) {
          var selected_text = cssEditor.getSelection()  // Need to grab the Active Selection

          cssEditor.replaceSelection("(" + selected_text + ")")
          cssEditor.focus()
        } else if ( activeEditor.val() === "jsEditor" ) {
          var selected_text = jsEditor.getSelection()  // Need to grab the Active Selection

          jsEditor.replaceSelection("(" + selected_text + ")")
          jsEditor.focus()
        } else if ( activeEditor.val() === "mdEditor" ) {
          var selected_text = mdEditor.getSelection()  // Need to grab the Active Selection

          mdEditor.replaceSelection("(" + selected_text + ")")
          mdEditor.focus()
        }
      })
      $("#charsym6").on("click", function() {
        if ( activeEditor.val() === "htmlEditor" ) {
          var selected_text = htmlEditor.getSelection()  // Need to grab the Active Selection

          htmlEditor.replaceSelection("[" + selected_text + "]")
          htmlEditor.focus()
        } else if ( activeEditor.val() === "cssEditor" ) {
          var selected_text = cssEditor.getSelection()  // Need to grab the Active Selection

          cssEditor.replaceSelection("[" + selected_text + "]")
          cssEditor.focus()
        } else if ( activeEditor.val() === "jsEditor" ) {
          var selected_text = jsEditor.getSelection()  // Need to grab the Active Selection

          jsEditor.replaceSelection("[" + selected_text + "]")
          jsEditor.focus()
        } else if ( activeEditor.val() === "mdEditor" ) {
          var selected_text = mdEditor.getSelection()  // Need to grab the Active Selection

          mdEditor.replaceSelection("[" + selected_text + "]")
          mdEditor.focus()
        }
      })
      $("#function").on("click", function() {
        if ( activeEditor.val() === "htmlEditor" ) {
          var selected_text = htmlEditor.getSelection()  // Need to grab the Active Selection

          htmlEditor.replaceSelection("function() {}")
          htmlEditor.focus()
        } else if ( activeEditor.val() === "cssEditor" ) {
          alertify.alert("Can't add <strong>\"function() {}\"</strong> into CSS")
        } else if ( activeEditor.val() === "jsEditor" ) {
          var selected_text = jsEditor.getSelection()  // Need to grab the Active Selection

          jsEditor.replaceSelection("function() {}")
          jsEditor.focus()
        }
      })
      $("[data-add=sym]").on("click", function() {
        if ( activeEditor.val() === "htmlEditor" ) {
          var selected_text = htmlEditor.getSelection()  // Need to grab the Active Selection

          htmlEditor.replaceSelection(selected_text + this.textContent)
          htmlEditor.focus()
        } else if ( activeEditor.val() === "cssEditor" ) {
          var selected_text = cssEditor.getSelection()  // Need to grab the Active Selection

          cssEditor.replaceSelection(selected_text + this.textContent)
          cssEditor.focus()
        } else if ( activeEditor.val() === "jsEditor" ) {
          var selected_text = jsEditor.getSelection()  // Need to grab the Active Selection

          jsEditor.replaceSelection(selected_text + this.textContent)
          jsEditor.focus()
        } else if ( activeEditor.val() === "mdEditor" ) {
          var selected_text = mdEditor.getSelection()  // Need to grab the Active Selection

          mdEditor.replaceSelection(selected_text + this.textContent)
          mdEditor.focus()
        }
      })

      // WYSIWYG Editor for Markdown
      $("#lorem").on("click", function() {
        var selected_text = mdEditor.getSelection()  // Need to grab the Active Selection

        mdEditor.replaceSelection("Lorem ipsum dolor sit amet, consectetur adipisicing elit. Totam impedit dolore magnam dolor, atque quia dicta voluptatum. Nam impedit distinctio, tempore molestiae voluptatibus ducimus ullam! Molestiae consectetur, recusandae labore? Cupiditate.")
        mdEditor.focus()
      })
      $("#bold").on("click", function() {
        var selected_text = mdEditor.getSelection()  // Need to grab the Active Selection

        mdEditor.replaceSelection("**" + selected_text + "**")
        mdEditor.focus()
      })
      $("#italic").on("click", function() {
        var selected_text = mdEditor.getSelection()  // Need to grab the Active Selection

        mdEditor.replaceSelection("*" + selected_text + "*")
        mdEditor.focus()
      })
      $("#strike").on("click", function() {
        var selected_text = mdEditor.getSelection()  // Need to grab the Active Selection

        mdEditor.replaceSelection("<strike>" + selected_text + "</strike>")
        mdEditor.focus()
      })
      $("#anchor").on("click", function() {
        alertify.prompt("Enter URL Below", "",
        function(evt, value) {
          var selected_text = mdEditor.getSelection()  // Need to grab the Active Selection

          mdEditor.replaceSelection("")
          mdEditor.replaceSelection("["+ selected_text +"]("+ value +")")
          mdEditor.focus()
        },
        function() {
          // User clicked cancel
        }).set('basic', true)
      })
      CodeMirror.commands.quoteSelection = function(cm) {
        var from = cm.getCursor("from").line, to = cm.getCursor("to").line
        for (var line = to; line >= from; line--)
          cm.replaceSelection("> ", {line: line, ch: 0})
      }
      $("#quote").on("click", function() {
        mdEditor.execCommand("quoteSelection")
      })
      $("#code").on("click", function() {
        var selected_text = mdEditor.getSelection()  // Need to grab the Active Selection

        mdEditor.replaceSelection("`" + selected_text + "`")
        mdEditor.focus()
      })
      $("#img").on("click", function() {
        alertify.prompt("Enter Image URL Below", "",
        function(evt, value) {
          var selected_text = mdEditor.getSelection()  // Need to grab the Active Selection

          mdEditor.replaceSelection("")
          mdEditor.replaceSelection("!["+ selected_text +"]("+ value +")")
          mdEditor.focus()
        },
        function() {
          // User clicked cancel
        }).set('basic', true)
      })
      $("#list-ol").on("click", function() {
        var selected_text = mdEditor.getSelection()  // Need to grab the Active Selection

        mdEditor.replaceSelection(selected_text + "\n\n  1. \n\n")
        mdEditor.focus()
      })
      $("#list-ul").on("click", function() {
        var selected_text = mdEditor.getSelection()  // Need to grab the Active Selection

        mdEditor.replaceSelection(selected_text + "\n\n  - \n\n")
        mdEditor.focus()
      })
      $("#h1").on("click", function() {
        var selected_text = mdEditor.getSelection()  // Need to grab the Active Selection

        mdEditor.replaceSelection("# " + selected_text)
        mdEditor.focus()
      })
      $("#h2").on("click", function() {
        var selected_text = mdEditor.getSelection()  // Need to grab the Active Selection

        mdEditor.replaceSelection("## " + selected_text)
        mdEditor.focus()
      })
      $("#h3").on("click", function() {
        var selected_text = mdEditor.getSelection()  // Need to grab the Active Selection

        mdEditor.replaceSelection("### " + selected_text)
        mdEditor.focus()
      })
      $("#h4").on("click", function() {
        var selected_text = mdEditor.getSelection()  // Need to grab the Active Selection

        mdEditor.replaceSelection("#### " + selected_text)
        mdEditor.focus()
      })
      $("#h5").on("click", function() {
        var selected_text = mdEditor.getSelection()  // Need to grab the Active Selection

        mdEditor.replaceSelection("##### " + selected_text)
        mdEditor.focus()
      })
      $("#h6").on("click", function() {
        var selected_text = mdEditor.getSelection()  // Need to grab the Active Selection

        mdEditor.replaceSelection("###### " + selected_text)
        mdEditor.focus()
      })
      $("#hr").on("click", function() {
        var selected_text = mdEditor.getSelection()  // Need to grab the Active Selection

        mdEditor.replaceSelection(selected_text + "\n\n----------\n\n")
        mdEditor.focus()
      })
    }
