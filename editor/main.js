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

// Render Chosen CSS Preprocessor
function cssPreProcessor(cssSelected) {
  var cssSelected = $("#css-preprocessor  option:selected").val()

  if (cssSelected == "none") {
    cssContent = cssEditor.getValue()
  } else if (cssSelected == "stylus") {
    var cssVal = cssEditor.getValue()
    stylus(cssVal).render(function(err, out) {
      if(err != null) {
        console.error("something went wrong")
      } else {
        cssContent = out
      }
    })
  }
}

// Live preview
function updatePreview() {
  var previewFrame = document.getElementById("preview")
  var preview =  previewFrame.contentDocument ||  previewFrame.contentWindow.document
  var heading = openHTML.getValue() + $("[data-action=sitetitle]").val() + closeHTML.getValue() + $("[data-action=library-code]").val() + "    <link rel=\"stylesheet\" href=\"libraries/font-awesome/font-awesome.css\">\n" + "    <link rel=\"stylesheet\" href=\"libraries/font-awesome/macset.css\">\n" + "    <link rel=\"stylesheet\" href=\"css/index.css\">\n"
  preview.open()
  var htmlSelected = $("#html-preprocessor option:selected").val()
  var jsSelected   = $("#js-preprocessor   option:selected").val()
  
  cssPreProcessor()
  
  if ( jsSelected == "none") {
    jsContent = "<script>" + jsEditor.getValue() + "</script>"
  } else if ( jsSelected == "coffeescript") {
    jsContent = "<script>" + CoffeeScript.compile(jsEditor.getValue(), { bare: true }) + "</script>"
  }

  if ( htmlSelected == "none") {
    var htmlContent = heading + "<style id='b8c770cc'>" + cssContent + "</style>" + closeRefs.getValue() + "\n" + htmlEditor.getValue() + "\n\n    <script src=\"js/index.js\"></script>" + jsContent + closeFinal.getValue()
    preview.write(htmlContent)
  } else if ( htmlSelected == "jade") {
    var options = {
        pretty: true
    }
    var jade2HTML = jade.render(htmlEditor.getValue(), options)
    var htmlContent = heading + "<style id='b8c770cc'>" + cssContent + "</style>" + closeRefs.getValue() + "\n" + jade2HTML + "\n\n    <scr"+"ipt src=\"js/index.js\"></scr"+"ipt>" + jsContent + closeFinal.getValue()
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
  
  setTimeout(function() {
    htmlEditor.setOption("paletteHints", "true")
  }, 300)
})
cssEditor.on("change", function() {
  cssPreProcessor()
  $("#preview").contents().find("#b8c770cc").html(cssContent)
  localStorage.setItem("cssData", cssEditor.getValue())
  
  var valueSelected = $("#css-preprocessor").val()
  if ( valueSelected == "stylus") {
      cssEditor.setOption("lint", false)
      cssEditor.refresh()
  } else {
    cssEditor.setOption("lint", true)
    cssEditor.refresh()
  }

  setTimeout(function() {
    cssEditor.setOption("paletteHints", "true")
  }, 300)
})
jsEditor.on("change", function() {
  updatePreview()
  localStorage.setItem("jsData", jsEditor.getValue())
  
  setTimeout(function() {
    jsEditor.setOption("paletteHints", "true")
  }, 300)
})
mdEditor.on("change", function() {
  markdownPreview()
  localStorage.setItem("mdData", mdEditor.getValue())
  
  setTimeout(function() {
    mdEditor.setOption("paletteHints", "true")
  }, 300)
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
    $("input[name=menubar].active").trigger("click")

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
})

// Handle Menu Dropdowns
$("input[name=menubar]").on("change", function() {
  $(this).toggleClass("active")
  $("input[name=menubar]:checkbox").not(this).removeClass("active").prop("checked", false)
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
