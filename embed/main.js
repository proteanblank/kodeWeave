// Initialize HTML editor
var htmlEditor = CodeMirror(document.getElementById("htmlEditor"), {
  mode: "text/html",
  tabMode: "indent",
  styleActiveLine: true,
  lineNumbers: true,
  lineWrapping: true,
  autoCloseTags: true,
  foldGutter: true,
  readOnly: true,
  gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
  value: ""
})
var cssEditor = CodeMirror(document.getElementById("cssEditor"), {
  mode: "text/css",
  tabMode: "indent",
  styleActiveLine: true,
  lineNumbers: true,
  lineWrapping: true,
  autoCloseTags: true,
  foldGutter: true,
  readOnly: true,
  gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
})
var jsEditor = CodeMirror(document.getElementById("jsEditor"), {
  tabMode: "indent",
  styleActiveLine: true,
  lineNumbers: true,
  lineWrapping: true,
  autoCloseTags: true,
  foldGutter: true,
  dragDrop: true,
  readOnly: true,
  gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
  mode: {name: "javascript", globalVars: false}
})
var mdEditor = CodeMirror(document.getElementById("mdEditor"), {
  mode: "text/x-markdown",
  theme: "default",
  tabMode: "indent",
  styleActiveLine: true,
  lineNumbers: true,
  lineWrapping: true,
  autoCloseTags: true,
  readOnly: true,
  gutters: ["CodeMirror-linenumbers"]
})

// Initialize Open and Close for HTML editor
var openHTML = CodeMirror(document.querySelector("#openHTML"), {
  mode: "text/html",
  value: "<!DOCTYPE html><html><head>"
})
var closeHTML = CodeMirror(document.querySelector("#closeHTML"), {
  mode: "text/html",
  value: "<meta charset=\"utf-8\"><meta name=\"viewport\" content=\"initial-scale=1.0\"><meta http-equiv=\"X-UA-Compatible\" content=\"IE=9\" />\n"
})
var closeRefs = CodeMirror(document.querySelector("#closeRefs"), {
  mode: "text/html",
  value: "  </head>\n  <body>\n"
})
var closeFinal = CodeMirror(document.querySelector("#closeFinal"), {
  mode: "text/html",
  value: "\n  </body>\n</html>"
})

// Live preview
function updatePreview() {
  var previewFrame = document.getElementById("preview")
  var preview =  previewFrame.contentDocument ||  previewFrame.contentWindow.document
  var heading = openHTML.getValue() + closeHTML.getValue() + $("[data-action=library-code]").val() + "<link rel=\"stylesheet\" href=\"../editor/libraries/font-awesome/font-awesome.css\"><link rel=\"stylesheet\" href=\"../editor/libraries/font-awesome/macset.css\">\n"
  preview.open()
  var htmlSelected = $("#html-preprocessor option:selected").val()
  var jsSelected   = $("#js-preprocessor   option:selected").val()
  var cssSelected  = $("#css-preprocessor  option:selected").val()

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
  
  if ( jsSelected == "none") {
    jsContent = "<script>" + jsEditor.getValue() + "</script>"
  } else if ( jsSelected == "coffeescript") {
    jsContent = "<script>" + CoffeeScript.compile(jsEditor.getValue(), { bare: true }) + "</script>"
  }

  if ( htmlSelected == "none") {
    var htmlContent = heading + "<style>" + cssContent + "</style>" + closeRefs.getValue() + "\n" + htmlEditor.getValue()+ jsContent + closeFinal.getValue()
    preview.write(htmlContent)
  } else if ( htmlSelected == "jade") {
    var options = {
        pretty: true
    }
    var jade2HTML = jade.render(htmlEditor.getValue(), options)
    var htmlContent = heading + "<style>" + cssContent + "</style>" + closeRefs.getValue() + "\n" + jade2HTML + jsContent + closeFinal.getValue()
    preview.write(htmlContent)
  }
  preview.close()
}
updatePreview()

htmlEditor.on("change", function() {
  updatePreview()
})
cssEditor.on("change", function() {
  updatePreview()
})
jsEditor.on("change", function() {
  updatePreview()
})

// Handle Tabbed Menu
$(".mainmenu a").on("click", function(element) {
  if ( $(".selected").is(":visible") ) {
    $(".mainmenu a").removeClass("selected")
  }
  $(this).addClass("selected")
  
  $("#mdEditor").addClass("hide")
  $("#htmlEditor").addClass("hide")
  $("#cssEditor").addClass("hide")
  $("#jsEditor").addClass("hide")
  $("#preview").addClass("hide")
  $("#" + $(this).attr("data-target")).removeClass("hide")
  mdEditor.refresh()
  htmlEditor.refresh()
  cssEditor.refresh()
  jsEditor.refresh()
  
  setTimeout(function() {
    mdEditor.setOption("paletteHints", "true")
    htmlEditor.setOption("paletteHints", "true")
    cssEditor.setOption("paletteHints", "true")
    jsEditor.setOption("paletteHints", "true")
  }, 300)
})

// $("[data-target=preview]").click()
$("[data-target=preview]").trigger("click")

$(window).on("load resize", function() {
  if ( $(this).width() <= 420 ) {
    $("[data-target=mdEditor]").text("MD")
    $("[data-target=jsEditor]").text("JS")
  } else {
    $("[data-target=mdEditor]").text("Markdown")
    $("[data-target=jsEditor]").text("JavaScript")
  }
})