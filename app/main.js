// Rules Specified for HTML Validation
var ruleSets = {
  "tagname-lowercase": true,
  "attr-lowercase": true,
  "attr-value-double-quotes": true,
  "tag-pair": true,
  "spec-char-escape": true,
  "id-unique": true,
  "src-not-empty": true,
  "attr-no-duplication": true
}

// Initialize HTML editor
var htmlEditor = CodeMirror(document.getElementById("htmlEditor"), {
  mode: "text/html",
  tabMode: "indent",
  styleActiveLine: true,
  lineNumbers: true,
  lineWrapping: true,
  autoCloseTags: true,
  foldGutter: true,
  dragDrop: true,
  lint: true,
  gutters: ["CodeMirror-lint-markers", "CodeMirror-linenumbers", "CodeMirror-foldgutter"],
  extraKeys: {
    "Ctrl-Q": function(cm){ cm.foldCode(cm.getCursor()) },
    "Ctrl-'": function(){ applyLowercase() },
    "Ctrl-\\": function(){ applyUppercase() },
    "Cmd-'": function(){ applyLowercase() },
    "Cmd-\\": function(){ applyUppercase() },
    "Shift-Ctrl-'": function(){ applyMinify() },
    "Shift-Ctrl-\\": function(){ applyBeautify() },
    "Shift-Cmd-'": function(){ applyMinify() },
    "Shift-Cmd-\\": function(){ applyBeautify() }
  },
  value: "<!-- comment -->\nhello world!",
  paletteHints: true
})
Inlet(htmlEditor)
emmetCodeMirror(htmlEditor)
var cssEditor = CodeMirror(document.getElementById("cssEditor"), {
  mode: "text/css",
  tabMode: "indent",
  styleActiveLine: true,
  lineNumbers: true,
  lineWrapping: true,
  autoCloseTags: true,
  foldGutter: true,
  dragDrop: true,
  lint: true,
  gutters: ["CodeMirror-lint-markers", "CodeMirror-linenumbers", "CodeMirror-foldgutter"],
  extraKeys: {
    "Ctrl-Q": function(cm){ cm.foldCode(cm.getCursor()) },
    "Ctrl-'": function(){ applyLowercase() },
    "Ctrl-\\": function(){ applyUppercase() },
    "Cmd-'": function(){ applyLowercase() },
    "Cmd-\\": function(){ applyUppercase() },
    "Shift-Ctrl-'": function(){ applyMinify() },
    "Shift-Ctrl-\\": function(){ applyBeautify() },
    "Shift-Cmd-'": function(){ applyMinify() },
    "Shift-Cmd-\\": function(){ applyBeautify() }
  },
  paletteHints: true
})
Inlet(cssEditor)
emmetCodeMirror(cssEditor)
var jsEditor = CodeMirror(document.getElementById("jsEditor"), {
  tabMode: "indent",
  styleActiveLine: true,
  lineNumbers: true,
  lineWrapping: true,
  autoCloseTags: true,
  foldGutter: true,
  dragDrop: true,
  lint: true,
  gutters: ["CodeMirror-lint-markers", "CodeMirror-linenumbers", "CodeMirror-foldgutter"],
  extraKeys: {
    "Ctrl-Q": function(cm){ cm.foldCode(cm.getCursor()) },
    "Ctrl-'": function(){ applyLowercase() },
    "Ctrl-\\": function(){ applyUppercase() },
    "Cmd-'": function(){ applyLowercase() },
    "Cmd-\\": function(){ applyUppercase() },
    "Shift-Ctrl-'": function(){ applyMinify() },
    "Shift-Ctrl-\\": function(){ applyBeautify() },
    "Shift-Cmd-'": function(){ applyMinify() },
    "Shift-Cmd-\\": function(){ applyBeautify() },
    "Ctrl-Space": "autocomplete"
  },
  mode: {name: "javascript", globalVars: false},
  paletteHints: true
})
Inlet(jsEditor)
var mdEditor = CodeMirror(document.getElementById("mdEditor"), {
  mode: "text/x-markdown",
  theme: "default",
  tabMode: "indent",
  styleActiveLine: true,
  lineNumbers: true,
  lineWrapping: true,
  autoCloseTags: true,
  dragDrop: true,
  gutters: ["CodeMirror-linenumbers"],
  extraKeys: {
    "Enter": "newlineAndIndentContinueMarkdownList",
    "Ctrl-Q": function(cm){ cm.foldCode(cm.getCursor()) },
    "Ctrl-'": function(){ applyLowercase() },
    "Ctrl-\\": function(){ applyUppercase() },
    "Cmd-'": function(){ applyLowercase() },
    "Cmd-\\": function(){ applyUppercase() },
    "Shift-Ctrl-'": function(){ applyMinify() },
    "Shift-Ctrl-\\": function(){ applyBeautify() },
    "Shift-Cmd-'": function(){ applyMinify() },
    "Shift-Cmd-\\": function(){ applyBeautify() }
  }
})

if ( localStorage.getItem("htmlData")) {
  htmlEditor.setValue(localStorage.getItem("htmlData"))
}
if ( localStorage.getItem("cssData")) {
  cssEditor.setValue(localStorage.getItem("cssData"))
}
if ( localStorage.getItem("jsData")) {
  jsEditor.setValue(localStorage.getItem("jsData"))
}
if ( localStorage.getItem("mdData")) {
  mdEditor.setValue(localStorage.getItem("mdData"))
}

// Initialize Open and Close for HTML editor
var openHTML = CodeMirror(document.querySelector("#openHTML"), {
  mode: "text/html",
  value: "<!DOCTYPE html>\n<html>\n  <head>\n    <title>"
})
var sitedesc = ( $("[data-action=sitedesc]").val() === "" ? "" : "    <meta name=\"description\" content=\""+ $("[data-action=sitedesc]").val() +"\">\n" )
var siteauthor = ( $("[data-action=siteauthor]").val() === "" ? "" : "    <meta name=\"author\" content=\""+ $("[data-action=siteauthor]").val() +"\">\n" )
var closeHTML = CodeMirror(document.querySelector("#closeHTML"), {
  mode: "text/html",
  value: "</title>\n    <meta charset=\"utf-8\">\n    <meta name=\"viewport\" content=\"initial-scale=1.0\">\n" + sitedesc + siteauthor + "    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=9\" />\n"
})
var closeRefs = CodeMirror(document.querySelector("#closeRefs"), {
  mode: "text/html",
  value: "  </head>\n  <body>\n"
})
var closeFinal = CodeMirror(document.querySelector("#closeFinal"), {
  mode: "text/html",
  value: "\n  </body>\n</html>"
})

$("[data-action=sitedesc], [data-action=siteauthor]").bind("keyup change", function() {
  var sitedesc = ( $("[data-action=sitedesc]").val() === "" ? "" : "    <meta name=\"description\" content=\""+ $("[data-action=sitedesc]").val() +"\">\n" )
  var siteauthor = ( $("[data-action=siteauthor]").val() === "" ? "" : "    <meta name=\"author\" content=\""+ $("[data-action=siteauthor]").val() +"\">\n" )
  closeHTML.setValue("</title>\n    <meta charset=\"utf-8\">\n    <meta name=\"viewport\" content=\"initial-scale=1.0\">\n" + sitedesc + siteauthor + "    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=9\" />\n")
  updatePreview()
})

$(".clear_input").click(function() {
  $("[data-action=sitedesc], [data-action=siteauthor]").trigger("change")
})

// Live preview
function updatePreview() {
  var previewFrame = document.getElementById("preview")
  var preview =  previewFrame.contentDocument ||  previewFrame.contentWindow.document
  var heading = openHTML.getValue() + $("[data-action=sitetitle]").val() + closeHTML.getValue() + $("[data-action=library-code]").val() + "    <link rel=\"stylesheet\" href=\"libraries/font-awesome/font-awesome.css\">\n" + "    <link rel=\"stylesheet\" href=\"libraries/font-awesome/macset.css\">\n" + "    <link rel=\"stylesheet\" href=\"css/index.css\">\n"
  preview.open()
  var htmlSelected = $("#html-preprocessor option:selected").val()
  var jsSelected   = $("#js-preprocessor   option:selected").val()

  if ( jsSelected == "none") {
    jsContent = "<script>" + jsEditor.getValue() + "</script>"
  } else if ( jsSelected == "coffeescript") {
    jsContent = "<script>" + CoffeeScript.compile(jsEditor.getValue(), { bare: true }) + "</script>"
  }

  if ( htmlSelected == "none") {
    var htmlContent = heading + "<style id='b8c770cc'>" + cssEditor.getValue() + "</style>" + closeRefs.getValue() + "\n" + htmlEditor.getValue() + "\n\n    <script src=\"js/index.js\"></script>" + jsContent + closeFinal.getValue()
    preview.write(htmlContent)
  } else if ( htmlSelected == "jade") {
    var options = {
        pretty: true
    }
    var jade2HTML = jade.render(htmlEditor.getValue(), options)
    var htmlContent = heading + "<style id='b8c770cc'>" + cssEditor.getValue() + "</style>" + closeRefs.getValue() + "\n" + jade2HTML + "\n\n    <scr"+"ipt src=\"js/index.js\"></scr"+"ipt>" + jsContent + closeFinal.getValue()
    preview.write(htmlContent)
  }
  preview.close()
}

function markdownPreview() {
  var mdconverter = new Showdown.converter(),
      previewFrame = document.getElementById("preview"),
      preview =  previewFrame.contentDocument ||  previewFrame.contentWindow.document

  preview.open()
  preview.write( mdconverter.makeHtml( mdEditor.getValue() ) )
  preview.close()
}
markdownPreview()
updatePreview()

htmlEditor.on("change", function() {
  updatePreview()
  localStorage.setItem("htmlData", htmlEditor.getValue())
})
cssEditor.on("change", function() {
  $("#preview").contents().find("#b8c770cc").html(cssEditor.getValue())
  localStorage.setItem("cssData", cssEditor.getValue())
})
jsEditor.on("change", function() {
  updatePreview()
  localStorage.setItem("jsData", jsEditor.getValue())
})
mdEditor.on("change", function() {
  markdownPreview()
  localStorage.setItem("mdData", mdEditor.getValue())
})

// Don't add to code, replace with new drop file's code
htmlEditor.on("drop", function() {
  htmlEditor.setValue("")
})
cssEditor.on("drop", function() {
  cssEditor.setValue("")
})
jsEditor.on("drop", function() {
  jsEditor.setValue("")
})
mdEditor.on("drop", function() {
  mdEditor.setValue("")
})

// Save Site Title Value for LocalStorage
var JSValStatus = localStorage.getItem("JSValStatus")
if (JSValStatus === "true") {
  $("#myjsvalidationswitch").prop("checked", true)
  JSValEnabled()
} else {
  $("#myjsvalidationswitch").prop("checked", "")
  JSValDisabled()
}

$("#myjsvalidationswitch").on("click", function() {
  localStorage.setItem("JSValStatus", $(this).prop("checked"))
  if ( this.checked === true ) {
    localStorage.setItem("SaveJSValSwitch", '"checked", "true"')
    JSValEnabled()
  } else {
    localStorage.setItem("SaveJSValSwitch", '"checked", ""')
    JSValDisabled()
  }
})

function callCollabUpdate() {
  var updatehtml = htmlEditor.getValue()
  if (TogetherJS.running) {
    TogetherJS.send({
      type: "update-html",
      output: updatehtml
    })
  }
  var updatecss = cssEditor.getValue()
  if (TogetherJS.running) {
    TogetherJS.send({
      type: "update-css",
      output: updatecss
    })
  }
  var updatejs = jsEditor.getValue()
  if (TogetherJS.running) {
    TogetherJS.send({
      type: "update-js",
      output: updatejs
    })
  }
  var updatemd = mdEditor.getValue()
  if (TogetherJS.running) {
    TogetherJS.send({
      type: "update-md",
      output: updatemd
    })
  }
}

// Update TogetherJS
TogetherJS.hub.on("update-html", function(msg) {
  if (!msg.sameUrl) {
      return
  }
  htmlEditor.setValue(msg.output)
})
TogetherJS.hub.on("update-css", function(msg) {
  if (!msg.sameUrl) {
      return
  }
  cssEditor.setValue(msg.output)
})
TogetherJS.hub.on("update-js", function(msg) {
  if (!msg.sameUrl) {
      return
  }
  jsEditor.setValue(msg.output)
})
TogetherJS.hub.on("update-md", function(msg) {
  if (!msg.sameUrl) {
      return
  }
  mdEditor.setValue(msg.output)
})

// Adjust User Interface for RWD
$(window).load(function() {
  // Splitter Theme
  $("#mainSplitter, #splitContainer, #leftSplitter, #rightSplitter").jqxSplitter({
    theme: "metro"
  })

  // Select active editor when clicked/touched
  $("#htmlEditor, #cssEditor, #jsEditor, #mdEditor").on("mousedown touchend", function() {
    if ( $(".active").is(":visible") ) {
      $(".active").trigger("click")
    }

    if ( $(this).attr("id") === "htmlEditor" ) {
      activeEditor.val("htmlEditor")
      if ($("#function").is(":hidden")) {
        $("#function").show()
      }
      $(".main-editor-chars").removeClass("hide")
      if ( $(".md-chars").is(":visible") ) {
        $(".md-chars").addClass("hide")
      }
    } else if ( $(this).attr("id") === "cssEditor" ) {
      activeEditor.val("cssEditor")
      if ($("#function").is(":visible")) {
        $("#function").hide()
      }
      $(".main-editor-chars").removeClass("hide")
      if ( $(".md-chars").is(":visible") ) {
        $(".md-chars").addClass("hide")
      }
    } else if ( $(this).attr("id") === "jsEditor" ) {
      activeEditor.val("jsEditor")
      $(".main-editor-chars").removeClass("hide")
      if ( $(".md-chars").is(":visible") ) {
        $(".md-chars").addClass("hide")
      }
      if ($("#function").is(":hidden")) {
        $("#function").show()
      }
    } else if ( $(this).attr("id") === "mdEditor" ) {
      activeEditor.val("mdEditor")
      if ($("#function").is(":hidden")) {
        $("#function").show()
      }
      $(".md-chars").removeClass("hide")
      if ( $(".main-editor-chars").is(":visible") ) {
        $(".md-chars").removeClass("hide")
        $(".main-editor-chars").addClass("hide")
      }
    }
  })
  $("#htmlEditor, #cssEditor, #jsEditor").on("mouseup touchend", function() {
    if ( $("body").hasClass("live-markdown-preview") ) {
      $("body").removeClass("live-markdown-preview")
      if ( !$("body").hasClass("app") ) {
        $("body").addClass("app")
        updatePreview()
      }
    } else if ( !$("body").hasClass("app") ) {
      $("body").addClass("app")
      updatePreview()
    }
  })
  $("#mdEditor").on("mouseup touchend", function() {
    if ( $("body").hasClass("app") ) {
      $("body").removeClass("app")
      if ( !$("body").hasClass("live-markdown-preview") ) {
        $("body").addClass("live-markdown-preview")
        markdownPreview()
      }
    } else if ( !$("body").hasClass("live-markdown-preview") ) {
      $("body").addClass("live-markdown-preview")
      markdownPreview()
    }
  })
}).on("resize", function() {
  // Dropdown Styles Libraries
  if ( $(this).width() > 924 ) {
    if ( $(this).height() > 552 ) {
      $(".libraries-dialog").css({
        "width": "auto",
        "height": "auto",
        "overflow-y": "auto"
      })
    } else {
      $(".libraries-dialog").css({
        "width": "auto",
        "overflow-y": "auto",
        "height": $(window).height() - 100 + "px"
      })
    }
  } else {
    if ( $(this).height() < 552 ) {
      $(".libraries-dialog").css({
        "height": $(window).height() - 100 + "px",
        "overflow-y": "auto"
      })
    } else {
      $(".libraries-dialog").css({
        "height": $(window).height() - 100 + "px",
        "overflow-y": "auto"
      })
    }

    if ( $(this).width() > 551 ) {
      $(".libraries-dialog").css({
        "width": "212px"
      })
    }
  }

  // Dropdown Styles Demos
  if ( $(this).width() > 530 ) {
    if ( $(this).height() > 465 ) {
      $(".demos-dialog").css({
        "width": "auto",
        "height": "352px",
        "overflow-y": "visible"
      })
    } else {
      $(".demos-dialog").css({
        "width": "auto",
        "height": $(window).height() - 100 + "px",
        "overflow-y": "auto"
      })
    }
  } else {
    if ( $(this).height() < 352 ) {
      $(".demos-dialog").css({
        "height": $(window).height() - 100 + "px",
        "overflow-y": "auto"
      })
    } else {
      $(".demos-dialog").css({
        "height": $(window).height() - 100 + "px",
        "overflow-y": "auto"
      })
    }

    if ( $(this).width() > 538 ) {
      $(".demos-dialog").css({
        "width": "212px"
      })
    }
  }

  // Download Dialog Height Fix
  if ( $(this).width() <= 500 ) {
    $(".download-dialog").css({
      "left": "0",
      "width": "325px",
      "overflow-y": "auto"
    })
    if ( $(this).height() < 480 ) {
      if ($(".imagehasloaded").is(":visible")) {
        $(".download-dialog").css({
          "height": $(window).height() - 100 + "px"
        })
      } else {
        $(".download-dialog").css({
        "height": "auto"
        })
      }
    }
  } else {
    $(".download-dialog").css({
      "left": "154.359px",
      "width": "",
      "overflow-y": "auto"
    })
    if ( $(this).height() < 480 ) {
      if ($(".imagehasloaded").is(":visible")) {
        $(".download-dialog").css({
          "height": $(window).height() - 100 + "px"
        })
      } else {
        $(".download-dialog").css({
          "height": "auto"
        })
      }
    }
  }

  // Toolbox Dialog Height Fix
  if ( $(this).height() < 492 ) {
    $(".toolbox").css({
      "height": $(window).height() - 90 + "px"
    })
  } else {
    $(".toolbox").css({
      "height": "auto"
    })
  }
})


// Choose Grid Scheme
$("header a:not(.skip, .dialog a, #charmenu *)").on("click", function() {
  $(this).not(".dialog a").toggleClass("active")
  $(this).next(":not([data-action=download-zip], #collaborate)").not(".dialog a, #charmenu *").toggleClass("hide")

  if ( $("[data-action=tools].active").is(":visible") || $(".add-source.active").is(":visible") || $("[data-action=download].active").is(":visible") || $(".open-demos.active").is(":visible")) {
    $("header a:not(#collaborate)").not(".dialog a, #charmenu *").not(this).removeClass("active").next().addClass("hide")
  }

  $(".dialog.fl").css({
    "left": $(this).offset().left
  })
  if ( $(window).width() <= 500 ) {
    $(".download-dialog").css({
      "left": "0",
      "width": "325px",
      "overflow-y": "auto"
    })
    if ( $(window).height() <= 480 ) {
      if ($(".imagehasloaded").is(":visible")) {
        $(".download-dialog").css({
          "height": $(window).height() - 100 + "px"
        })
      } else {
        $(".download-dialog").css({
        "height": "auto"
        })
      }
    }
  } else {
    $(".download-dialog").css({
      "left": $(this).offset().left,
      "width": "",
      "overflow-y": "auto"
    })
    if ( $(window).height() <= 480 ) {
      if ($(".imagehasloaded").is(":visible")) {
        $(".download-dialog").css({
          "height": $(window).height() - 100 + "px"
        })
      } else {
        $(".download-dialog").css({
          "height": "auto"
        })
      }
    }
  }
})

// Grids
function GridScheme() {
  $("#mainSplitter").jqxSplitter({
    height: "auto",
    width: "100%",
    orientation: "vertical",
    showSplitBar: true,
    panels: [{ size: '25%' },
             { size: '75%',collapsible:false }]
  }).jqxSplitter("collapse")
  $("#splitContainer").jqxSplitter({
    height: "auto",
    width: "100%",
    orientation: "horizontal",
    showSplitBar: true,
    panels: [{ size: "50%",collapsible:false },
             { size: "50%" }]
  })
  $("#leftSplitter").jqxSplitter({
    width: "100%",
    height: "100%",
    orientation: "vertical",
    showSplitBar: true,
    panels: [{
      size: "50%",
      collapsible: false
    }]
  })
  $("#rightSplitter").jqxSplitter({
    width: "100%",
    height: "100%",
    orientation: "vertical",
    showSplitBar: true,
    panels: [{
      size: "50%",
      collapsible: false
    }]
  })
}
GridScheme()
$("#mainSplitter").jqxSplitter({
  height: "auto",
  width: "100%",
  orientation: "vertical",
  showSplitBar: true,
  panels: [{ size: '25%' },
           { size: '75%',collapsible:false }]
}).jqxSplitter("collapse")
