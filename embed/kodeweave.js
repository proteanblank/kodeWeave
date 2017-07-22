// Show Editors If URL Contains Them
// If domain is HTTP
var site = window.location;
site = site.toString();
if (site.substring(0, 7) === "http://") {
  window.location.href = "https://" + site.substring(7, site.length);
}

// Clear Input Values - JQuery Plugin
(function($) {
  $.fn.clear = function() {
    $(this).val("");
  };
}) (jQuery);

// Initialize Open and Close for HTML editor
var openHTML = CodeMirror(document.querySelector("#openHTML"), {
  mode: "text/html",
  value: "<!DOCTYPE html><html><head>"
});
var closeHTML = CodeMirror(document.querySelector("#closeHTML"), {
  mode: "text/html",
  value: "<meta charset=\"utf-8\"><meta name=\"viewport\" content=\"initial-scale=1.0\"><meta http-equiv=\"X-UA-Compatible\" content=\"IE=9\" />\n"
});
var closeRefs = CodeMirror(document.querySelector("#closeRefs"), {
  mode: "text/html",
  value: "  </head>\n  <body>\n"
});
var closeFinal = CodeMirror(document.querySelector("#closeFinal"), {
  mode: "text/html",
  value: "\n  </body>\n</html>"
});

var str = window.location.href,
    url = window.location.hash,
    hash = window.location.hash,
    htmlContent, cssContent, jsContent, cssSelected;

// Live preview
function updatePreview() {
  $(".preview-frame").empty();
  var frame = document.createElement("iframe");
  frame.setAttribute("id", "preview");
  frame.setAttribute("sandbox", "allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts");
  document.querySelector(".preview-frame").appendChild(frame);
  
  var previewFrame = document.getElementById("preview");
  var preview =  previewFrame.contentDocument ||  previewFrame.contentWindow.document;
  var heading = openHTML.getValue() + closeHTML.getValue() + $("[data-action=library-code]").val() + "<link rel=\"stylesheet\" href=\"../editor/libraries/font-awesome/font-awesome.css\"><link rel=\"stylesheet\" href=\"../editor/libraries/font-awesome/macset.css\">\n" + "<script src=\"    ../editor/lib/screenlog.js\"></script>";
  // var heading = openHTML.getValue() + $("[data-action=sitetitle]").val() + closeHTML.getValue() + $("[data-action=library-code]").val() + "    <link rel=\"stylesheet\" href=\"libraries/font-awesome/font-awesome.css\">\n" + "    <link rel=\"stylesheet\" href=\"libraries/font-awesome/macset.css\">\n";
  preview.open();
  var htmlSelected = $("#html-preprocessor option:selected").val();
  var jsSelected   = $("#js-preprocessor   option:selected").val();

  cssPreProcessor();

  if ( jsSelected == "none") {
    jsContent = "<script>screenLog.init({ autoScroll: false });</script><script>" + jsEditor.getValue() + "</script>";
  } else if ( jsSelected == "coffeescript") {
    jsContent = "<script>screenLog.init({ autoScroll: false });</script><script>" + CoffeeScript.compile(jsEditor.getValue(), { bare: true }) + "</script>";
  } else if ( jsSelected == "typescript") {
    jsContent = "<script>screenLog.init({ autoScroll: false });</script><script type=\"text/typescript\">" + jsEditor.getValue() + "</script>\n  <script type=\"text/javascript\" src='../editor/lib/typescript.min.js'></script>\n  <script type=\"text/javascript\" src='../editor/lib/typescript.compile.min.js'></script>";
  }

  if ( htmlSelected == "none") {
    htmlContent = heading + "<style id='b8c770cc'>" + cssContent + "</style>" + closeRefs.getValue() + "\n" + htmlEditor.getValue() + "\n\n    " + jsContent + closeFinal.getValue();
    preview.write(htmlContent);
  } else if ( htmlSelected == "jade") {
    var options = {
        pretty: true
    };
    var jade2HTML = jade.render(htmlEditor.getValue(), options);
    htmlContent = heading + "<style id='b8c770cc'>" + cssContent + "</style>" + closeRefs.getValue() + "\n" + jade2HTML + jsContent + closeFinal.getValue();
    preview.write(htmlContent);
  }
  preview.close();
}

document.querySelector("[data-action=rerun]").onclick = function(e) {
  e.preventDefault();
  updatePreview();
};
function loadgist(gistid) {
  $.ajax({
    url: "https://api.github.com/gists/" + gistid,
    type: "GET",
    dataType: "jsonp",
    jsonp: "callback"
  }).success(function(gistdata) {
    var htmlVal    = gistdata.data.files["index.html"];
    var jadeVal    = gistdata.data.files["index.jade"];
    var cssVal     = gistdata.data.files["index.css"];
    var stylusVal  = gistdata.data.files["index.styl"];
    var lessVal    = gistdata.data.files["index.less"];
    var jsVal      = gistdata.data.files["index.js"];
    var coffeeVal  = gistdata.data.files["index.coffee"];
    var tsVal      = gistdata.data.files["index.ts"];
    var mdVal      = gistdata.data.files["README.md"];
    var libraries  = gistdata.data.files["libraries.json"].content;
    var jsonLibs   = JSON.parse(libraries);

    // Return libraries from json
    $.each(jsonLibs, function(name, value) {
      $(".ldd-submenu #" + name).prop("checked", value).trigger("keyup");
    });

    // Set checked libraries into preview
    $("#jquery").trigger("keyup");

    // Return the editor's values
    if (mdVal) {
      mdEditor.setValue(mdVal.content);
    }
    if (!mdVal) {
      $("[data-target=mdEditor]").addClass("hide");
    }
    if (htmlVal) {
      htmlEditor.setValue(htmlVal.content);
      $("#html-preprocessor").val("none").change();
    }
    if (jadeVal) {
      htmlEditor.setValue(jadeVal.content);
      $("#html-preprocessor").val("jade").change();
      $("[data-target=htmlEditor]").text("Pug");
    }
    if (!htmlVal && !jadeVal) {
      $("[data-target=htmlEditor]").addClass("hide");
    }
    if (cssVal) {
      cssEditor.setValue(cssVal.content);
      $("#css-preprocessor").val("none").change();
    }
    if (stylusVal) {
      cssEditor.setValue(stylusVal.content);
      $("#css-preprocessor").val("stylus").change();
      $(window).on("load resize", function() {
        if ( $(this).width() <= 420 ) {
          $("[data-target=cssEditor]").text("Styl");
        } else {
          $("[data-target=cssEditor]").text("Stylus");
        }
      });
    }
    if (lessVal) {
      cssEditor.setValue(lessVal.content);
      $("#css-preprocessor").val("less").change();
      $("[data-target=cssEditor]").text("LESS");
    }
    if (!cssVal && !stylusVal && !lessVal) {
      $("[data-target=cssEditor]").addClass("hide");
    }
    if (jsVal) {
      jsEditor.setValue(jsVal.content);
      $("#js-preprocessor").val("none").change();
      jsContent = "<script>" + jsEditor.getValue() + "</script>";
      $(window).on("load resize", function() {
        if ( $(this).width() <= 420 ) {
          $("[data-target=jsEditor]").text("JS");
        } else {
          $("[data-target=jsEditor]").text("JavaScript");
        }
      });
    }
    if (coffeeVal) {
      jsEditor.setValue(coffeeVal.content);
      $("#js-preprocessor").val("coffeescript").change();
      jsContent = "<script>" + CoffeeScript.compile(jsEditor.getValue(), { bare: true }) + "</script>";
      $(window).on("load resize", function() {
        if ( $(this).width() <= 420 ) {
          $("[data-target=jsEditor]").text("Coffee");
        } else {
          $("[data-target=jsEditor]").text("CoffeeScript");
        }
      });
    }
    if (tsVal) {
      jsEditor.setValue(tsVal.content);
      $("#js-preprocessor").val("typescript").change();
      jsContent = "<script type='text/typescript'>" + jsEditor.getValue() + "</script>";
      $(window).on("load resize", function() {
        if ( $(this).width() <= 420 ) {
          $("[data-target=jsEditor]").text("TS");
        } else {
          $("[data-target=jsEditor]").text("TypeScript");
        }
      });
    }
    if (!jsVal && !coffeeVal && !tsVal) {
      $("[data-target=jsEditor]").addClass("hide");
    }
    $(".preloader").remove();
    setTimeout(function() {
      $(".mainmenu a:not(.hide):first").trigger("click");
    }, 500);
  }).error(function(e) {
    // ajax error
    $(".preloader").remove();
    console.warn("Error: Could not load weave!", e);
    alertify.error("Error: Could not load weave!");
  });
}

// Render Chosen Preprocessor
function cssPreProcessor(cssSelected) {
  cssSelected = $("#css-preprocessor  option:selected").val();

  if (cssSelected == "none") {
    cssContent = cssEditor.getValue();
  } else if (cssSelected == "stylus") {
    var cssVal = cssEditor.getValue();
    stylus(cssVal).render(function(err, out) {
      if(err !== null) {
        console.error("something went wrong");
      } else {
        cssContent = out;
      }
    });
  } else if ( cssSelected == "less") {
    less.render(cssEditor.getValue(), function (e, output) {
      yourCSS = output.css;
    });
  }
}

// If url doesn't contain a hash launch editor
if (!url) {
  $(document.body).append('<div class="fixedfill preloader"></div>');
  $(".preloader").html('<div class="table"><div class="cell"><h1>No weave detected!</h1><a class="launcheditor" href="../editor" target="_blank">Launch Editor!</a></div></div><style>.launcheditor {\n  position: relative;\n  background: #4e92a2;\n  color: #fff;\n  padding: 1em 2em;\n  font-size: 14px;\n  top: 15px;\n}\n\n.launcheditor:hover {\n  background: #57b5cc;\n}\n\n.launcheditor:active {\n  background: #407c8a;\n}</style>');
} else {
  // Show Editors If URL Contains Them
  if (url.indexOf("?") > -1) {
    $("[data-target=mdEditor]").addClass("hide");
    $("[data-target=htmlEditor]").addClass("hide");
    $("[data-target=cssEditor]").addClass("hide");
    $("[data-target=jsEditor]").addClass("hide");
    $("[data-target=preview]").addClass("hide");

    if (url.indexOf("md") > -1) {
      $("[data-target=mdEditor]").removeClass("hide");
      mdeditor.checked = true;
    }
    if (url.indexOf("html") > -1) {
      $("[data-target=htmlEditor]").removeClass("hide");
      htmleditor.checked = true;
    }
    if (url.indexOf("css") > -1) {
      $("[data-target=cssEditor]").removeClass("hide");
      csseditor.checked = true;
    }
    if (url.indexOf("js") > -1) {
      $("[data-target=jsEditor]").removeClass("hide");
      jseditor.checked = true;
    }
    if (url.indexOf("result") > -1) {
      $("[data-target=preview]").removeClass("hide");
      previeweditor.checked = true;
    }
    if (url.indexOf("edit") > -1) {
      // Initialize HTML editor
      var htmlEditor = CodeMirror(document.getElementById("htmlEditor"), {
        mode: "text/html",
        tabMode: "indent",
        styleActiveLine: true,
        lineNumbers: true,
        lineWrapping: true,
        autoCloseTags: true,
        foldGutter: true,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
        value: ""
      });
      Inlet(htmlEditor);
      var cssEditor = CodeMirror(document.getElementById("cssEditor"), {
        mode: "text/css",
        tabMode: "indent",
        styleActiveLine: true,
        lineNumbers: true,
        lineWrapping: true,
        autoCloseTags: true,
        foldGutter: true,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
      });
      Inlet(cssEditor);
      var jsEditor = CodeMirror(document.getElementById("jsEditor"), {
        tabMode: "indent",
        styleActiveLine: true,
        lineNumbers: true,
        lineWrapping: true,
        autoCloseTags: true,
        foldGutter: true,
        dragDrop: true,
        lint: false,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
        mode: {name: "javascript", globalVars: false}
      });
      Inlet(jsEditor);
      var mdEditor = CodeMirror(document.getElementById("mdEditor"), {
        mode: "text/x-markdown",
        theme: "default",
        tabMode: "indent",
        styleActiveLine: true,
        lineNumbers: true,
        lineWrapping: true,
        autoCloseTags: true,
        gutters: ["CodeMirror-linenumbers"]
      });
      Inlet(mdEditor);

      htmlEditor.on("change", function() {
        updatePreview();
      });
      cssEditor.on("change", function() {
        cssPreProcessor();
        $("#preview").contents().find("#b8c770cc").html(cssContent);

        setTimeout(function() {
          cssEditor.setOption("paletteHints", "true");
        }, 300);
      });
      jsEditor.on("change", function() {
        updatePreview();
      });
    }
    if (url.indexOf("edit") === -1) {
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
      });
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
      });
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
      });
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
      });
    }
    if (url.indexOf("dark") > -1) {
      mdEditor.setOption("theme", "kwdark");
      htmlEditor.setOption("theme", "kwdark");
      cssEditor.setOption("theme", "kwdark");
      jsEditor.setOption("theme", "kwdark");
      $("header").css("background", "#2c323b");
      $("header a").css("color", "#a3b7c7");
    }
    if (url.indexOf("transparent") > -1) {
      $(".CodeMirror, .CodeMirror *").css("background", "transparent!important");
    }
    if (url.indexOf("transparent") === -1) {
      $(".editor, .result").css("z-index", "1");
    }
    if (url.indexOf("norerun") > -1) {
      $(".rerun").remove();
    }

    setTimeout(function() {
      /*
        If URL does not contain "result"
        remove iframe#preview for faster render
      */
      if ($("[data-target=mdEditor]").hasClass("hide")) {
        $("#mdEditor").remove();
      }
      if ($("[data-target=htmlEditor]").hasClass("hide")) {
        $("#htmlEditor").remove();
      }
      if ($("[data-target=cssEditor]").hasClass("hide")) {
        $("#cssEditor").remove();
      }
      if ($("[data-target=jsEditor]").hasClass("hide")) {
        $("#jsEditor").remove();
      }
      if ($("[data-target=preview]").hasClass("hide")) {
        $("#preview").remove();
      }
    }, 300);
    setTimeout(function() {
      $(".mainmenu .hide").remove();
      $(".mainmenu a:not(.hide):first").trigger("click");
    }, 500);
  } else {
    window.location.href = "https://mikethedj4.github.io/kodeWeave/embed/" + url + "?md,html,css,js,result";
  }
  
  // Handles Menubar
  // 617 for width
  $(".mainmenu a").on("click", function(e) {
    if ( $(".selected").is(":visible") ) {
      $(".mainmenu a").removeClass("selected");
    }
    if ( $(window).width() <= 617 ) {
      // Small Phones
      $(this).addClass("selected");

      $("#mdEditor").addClass("hide");
      $("#htmlEditor").addClass("hide");
      $("#cssEditor").addClass("hide");
      $("#jsEditor").addClass("hide");
      if (url.indexOf("?") > -1) {
        if (url.indexOf("transparent") > -1) { 
          // Don't do anything with preview
        } else {
          $("#preview").addClass("hide");
        }
      }
      $("#" + $(this).attr("data-target")).removeClass("hide");
    } else {
      // Large Tablets
      if ( $(this).attr("data-target").toLowerCase() === "preview" ) {
        return false;
      }
      $(this).addClass("selected");

      $("#mdEditor").addClass("hide");
      $("#htmlEditor").addClass("hide");
      $("#cssEditor").addClass("hide");
      $("#jsEditor").addClass("hide");
      $("#" + $(this).attr("data-target")).removeClass("hide");
    }

    mdEditor.refresh();
    htmlEditor.refresh();
    cssEditor.refresh();
    jsEditor.refresh();

    setTimeout(function() {
      mdEditor.setOption("paletteHints", "true");
      htmlEditor.setOption("paletteHints", "true");
      cssEditor.setOption("paletteHints", "true");
      jsEditor.setOption("paletteHints", "true");
      return false;
    }, 300);
    return false;
  });

  $(window).on("load resize", function() {
    if (previeweditor.checked === true) {
      if (mdeditor.checked || htmleditor.checked || csseditor.checked || jseditor.checked) {
        if ( $(this).width() <= 617 ) {
          $(".editor").css("width", "100%");
          $(".preview-editor").css("left", "0");
          $("[data-target=preview]").show();
        } else {
          $(".editor").css("width", "50%");
          $(".preview-editor").css("left", "50%");
          if ($("[data-target=preview]").hasClass("selected")) {
            $("[data-target=preview]").hide().removeClass("selected");
            setTimeout(function() {
              $(".mainmenu a:not(.hide):first").trigger("click");
            });
          } else {
            $("[data-target=preview]").hide();
            $("#preview").show();
          }
        }

        if ( $(this).width() <= 420 ) {
          $("[data-target=mdEditor]").text("MD");
        } else {
          $("[data-target=mdEditor]").text("Markdown");
        }
      } else {
        $("header, .rerun").remove();
        $(".editor").css("width", "100%");
        $("#editors, .preview-editor").css("top", "0");
        $("#editors").css("bottom", "0");
        $(".preview-editor").css("left", "0");
        $(".preview-editor").css("height", "calc(100vh - 4px)");
        $("[data-target=preview]").show();
      }
    }
  });

  var myarray = [],
      current = 1,
      checkedLibs = function() {
        if ( $("#alertify").is(":checked") ) {
          $('.alertifyjs').clear();
          download_to_textbox('../editor/libraries/alertifyjs/css/alertify.min.css', $('.alertifyjs1'));
          download_to_textbox('../editor/libraries/alertifyjs/css/themes/default.min.css', $('.alertifyjs2'));
          download_to_textbox('../editor/libraries/alertifyjs/alertify.min.js', $('.alertifyjs3'));
          download_to_textbox('../editor/libraries/alertifyjs/css/alertify.rtl.min.css', $('.alertifyjs4'));
          download_to_textbox('../editor/libraries/alertifyjs/css/themes/bootstrap.min.css', $('.alertifyjs5'));
          download_to_textbox('../editor/libraries/alertifyjs/css/themes/bootstrap.rtl.min.css', $('.alertifyjs6'));
          download_to_textbox('../editor/libraries/alertifyjs/css/themes/default.rtl.min.css', $('.alertifyjs7'));
          download_to_textbox('../editor/libraries/alertifyjs/css/themes/semantic.min.css', $('.alertifyjs8'));
          download_to_textbox('../editor/libraries/alertifyjs/css/themes/semantic.rtl.min.css', $('.alertifyjs9'));

          $(".alertifyzip").val("zip.file('libraries/alertifyjs/css/alertify.min.css', $(\".alertifyjs1\").val());\n    zip.file('libraries/alertifyjs/css/themes/default.min.css', $(\".alertifyjs2\").val());\n    zip.file('libraries/alertifyjs/alertify.min.js', $(\".alertifyjs3\").val());\n    zip.file('libraries/alertifyjs/css/alertify.rtl.min.css', $(\".alertifyjs4\").val());\n    zip.file('libraries/alertifyjs/css/themes/bootstrap.min.css', $(\".alertifyjs5\").val());\n    zip.file('libraries/alertifyjs/css/themes/bootstrap.rtl.min.css', $(\".alertifyjs6\").val());\n    zip.file('libraries/alertifyjs/css/themes/default.rtl.min.css', $(\".alertifyjs7\").val());\n    zip.file('libraries/alertifyjs/css/themes/semantic.min.css', $(\".alertifyjs8\").val());\n    zip.file('libraries/alertifyjs/css/themes/semantic.rtl.min.css', $(\".alertifyjs9\").val());");
        } else {
          $('.alertifyjs, .alertifyzip').clear();
        }

        if ( $("#angular").is(":checked") ) {
          $('.angularjs').clear();
          download_to_textbox('../editor/libraries/angular/angular.min.js', $('.angularjs'));
          $(".angularzip").val("zip.file('libraries/angular/angular.min.js', $(\".angularjs\").val());");
        } else {
          $('.angularjs, .angularzip').clear();
        }

        if ( $("#angularmaterial").is(":checked") ) {
          $('.angularmaterial').clear();
          download_to_textbox('../editor//angular-material/angular-material.min.css', $('.angularmaterial1'));
          download_to_textbox('../editor//angular-material/angular.min.js', $('.angularmaterial2'));
          download_to_textbox('../editor//angular-material/angular-material.min.js', $('.angularmaterial3'));
          download_to_textbox('../editor//angular-animate.min.js', $('.angularmaterial4'));
          download_to_textbox('../editor//angular-material/angular-aria.min.js', $('.angularmaterial5'));
          $(".angularmaterialzip").val("zip.file('libraries/angular-material/angular-material.min.css', $(\".angularmaterial1\").val());\n zip.file('libraries/angular-material/angular.min.js', $(\".angularmaterial2\").val());\n zip.file('libraries/angular-material/angular-material.min.js', $(\".angularmaterial3\").val());\n zip.file('libraries/angular-material/angular-animate.min.js', $(\".angularmaterial4\").val());\n zip.file('libraries/angular-material/angular-aria.min.js', $(\".angularmaterial5\").val());");
        } else {
          $('.angularmaterial, .angularmaterialzip').clear();
        }
      
        if ( $("#animatecss").is(":checked") ) {
          $('.animatecss').clear();
          download_to_textbox('../editor/libraries/animateCSS/animate.min.css', $('.animatecss'));
          $(".animatecsszip").val("zip.file('libraries/animateCSS/animate.min.css', $(\".animatecss\").val());");
        } else {
          $('.animatecss, .animatecsszip').clear();
        }
        if ( $("#backbone").is(":checked") ) {
          $('.backbone').clear();
          download_to_textbox('../editor/libraries/backbone/backbone.js', $('.backbone'));
          $('.backbone').trigger("change");
          $(".backbonezip").val("zip.file('libraries/backbone/backbone.js', $('.backbone').val());");
        } else {
          $('.backbone, .backbonezip').clear();
        }
        if ( $("#bootstrap").is(":checked") ) {
          $('.bootstrap').clear();
          download_to_textbox('../editor/libraries/bootstrap/bootstrap.css', $('.bootstrap1'));
          download_to_textbox('../editor/libraries/bootstrap/bootstrap.js', $('.bootstrap2'));
          $('.bootstrap1, .bootstrap2').trigger("change");
          $(".bootstrapzip").val("zip.file('libraries/bootstrap/bootstrap.css', $('.bootstrap1').val());\n  zip.file('libraries/bootstrap/bootstrap.js', $('.bootstrap2').val());");
        } else {
          $('.bootstrap, .bootstrapzip').clear();
        }
        if ( $("#chartjs").is(":checked") ) {
          $('.chartjs').clear();
          download_to_textbox('../editor/libraries/chartjs/chart.min.js', $('.chartjs'));
          $('.chartjs').trigger("change");
          $(".chartjszip").val("zip.file('libraries/chartjs/chart.min.js', $('.chartjs').val());");
        } else {
          $('.chartjs, .chartjszip').clear();
        }
        if ( $("#codemirror").is(":checked") ) {
          $('.codemirror').clear();

          download_to_textbox('../editor/libraries/codemirror/lib/codemirror.css', $('.codemirror1'));
          download_to_textbox('../editor/libraries/codemirror/addon/fold/foldgutter.css', $('.codemirror2'));
          download_to_textbox('../editor/libraries/codemirror/lib/codemirror.js', $('.codemirror3'));
          download_to_textbox('../editor/libraries/codemirror/javascripts/code-completion.js', $('.codemirror4'));
          download_to_textbox('../editor/libraries/codemirror/javascripts/css-completion.js', $('.codemirror5'));
          download_to_textbox('../editor/libraries/codemirror/javascripts/html-completion.js', $('.codemirror6'));
          download_to_textbox('../editor/libraries/codemirror/mode/javascript/javascript.js', $('.codemirror7'));
          download_to_textbox('../editor/libraries/codemirror/mode/xml/xml.js', $('.codemirror8'));
          download_to_textbox('../editor/libraries/codemirror/mode/css/css.js', $('.codemirror9'));
          download_to_textbox('../editor/libraries/codemirror/mode/htmlmixed/htmlmixed.js', $('.codemirror10'));
          download_to_textbox('../editor/libraries/codemirror/addon/edit/closetag.js', $('.codemirror11'));
          download_to_textbox('../editor/libraries/codemirror/addon/edit/matchbrackets.js', $('.codemirror12'));
          download_to_textbox('../editor/libraries/codemirror/addon/selection/active-line.js', $('.codemirror13'));
          download_to_textbox('../editor/libraries/codemirror/addon/fold/foldcode.js', $('.codemirror14'));
          download_to_textbox('../editor/libraries/codemirror/addon/fold/foldgutter.js', $('.codemirror15'));
          download_to_textbox('../editor/libraries/codemirror/addon/fold/brace-fold.js', $('.codemirror16'));
          download_to_textbox('../editor/libraries/codemirror/addon/fold/xml-fold.js', $('.codemirror17'));
          download_to_textbox('../editor/libraries/codemirror/addon/fold/comment-fold.js', $('.codemirror18'));
          download_to_textbox('../editor/libraries/codemirror/addon/search/search.js', $('.codemirror19'));
          download_to_textbox('../editor/libraries/codemirror/addon/search/searchcursor.js', $('.codemirror20'));
          download_to_textbox('../editor/libraries/codemirror/addon/dialog/dialog.js', $('.codemirror21'));
          download_to_textbox('../editor/libraries/codemirror/addon/hint/show-hint.js', $('.codemirror22'));
          download_to_textbox('../editor/libraries/codemirror/addon/hint/xml-hint.js', $('.codemirror23'));
          download_to_textbox('../editor/libraries/codemirror/addon/hint/html-hint.js', $('.codemirror24'));
          download_to_textbox('../editor/libraries/codemirror/addon/hint/css-hint.js', $('.codemirror25'));
          download_to_textbox('../editor/libraries/codemirror/addon/hint/javascript-hint.js', $('.codemirror26'));
          download_to_textbox('../editor/libraries/codemirror/addon/search/match-highlighter.js', $('.codemirror27'));
          download_to_textbox('../editor/libraries/codemirror/htmlhint.js', $('.codemirror28'));
          download_to_textbox('../editor/libraries/codemirror/csslint.js', $('.codemirror29'));
          download_to_textbox('../editor/libraries/codemirror/jshint.js', $('.codemirror30'));
          download_to_textbox('../editor/libraries/codemirror/addon/lint/lint.js', $('.codemirror31'));
          download_to_textbox('../editor/libraries/codemirror/addon/lint/html-lint.js', $('.codemirror32'));
          download_to_textbox('../editor/libraries/codemirror/addon/lint/css-lint.js', $('.codemirror33'));
          download_to_textbox('../editor/libraries/codemirror/addon/lint/javascript-lint.js', $('.codemirror34'));
          download_to_textbox('../editor/libraries/codemirror/inlet.min.js', $('.codemirror35'));
          download_to_textbox('../editor/libraries/codemirror/inlet.css', $('.codemirror36'));
          download_to_textbox('../editor/libraries/codemirror/emmet.js', $('.codemirror37'));
          download_to_textbox('../editor/libraries/codemirror/addon/lint/lint.css', $('.codemirror38'));
          download_to_textbox('../editor/libraries/codemirror/addon/dialog/dialog.css', $('.codemirror39'));
          download_to_textbox('../editor/libraries/codemirror/addon/hint/show-hint.css', $('.codemirror40'));
          download_to_textbox('../editor/libraries/codemirror/addon/search/jump-to-line.js', $('.codemirror41'));
          download_to_textbox('../editor/libraries/codemirror/markdown.js', $('.codemirror42'));
          download_to_textbox('../editor/libraries/codemirror/continuelist.js', $('.codemirror43'));
          download_to_textbox('../editor/libraries/codemirror/mode/haml/haml.js', $('.codemirror44'));
          download_to_textbox('../editor/libraries/codemirror/mode/jade/jade.js', $('.codemirror45'));
          download_to_textbox('../editor/libraries/codemirror/mode/sass/sass.js', $('.codemirror46'));
          download_to_textbox('../editor/libraries/codemirror/mode/livescript/livescript.js', $('.codemirror47'));
          download_to_textbox('../editor/libraries/codemirror/mode/coffeescript/coffeescript.js', $('.codemirror48'));
          download_to_textbox('../editor/libraries/codemirror/mode/ruby/ruby.js', $('.codemirror49'));
          download_to_textbox('../editor/libraries/codemirror/coffee-script.js', $('.codemirror50'));
          download_to_textbox('../editor/libraries/codemirror/coffeelint.js', $('.codemirror51'));
          download_to_textbox('../editor/libraries/codemirror/addon/lint/coffeescript-lint.js', $('.codemirror52'));

          // var grabCodemirror = [
          //   "zip.file('libraries/codemirror/lib/codemirror.css', $('.codemirror1').val());\n",
          //   "zip.file('libraries/codemirror/addon/fold/foldgutter.css', $('.codemirror2').val());\n",
          //   "zip.file('libraries/codemirror/lib/codemirror.js', $('.codemirror3').val());\n",
          //   "zip.file('libraries/codemirror/javascripts/code-completion.js', $('.codemirror4').val());\n",
          //   "zip.file('libraries/codemirror/javascripts/css-completion.js', $('.codemirror5').val());\n",
          //   "zip.file('libraries/codemirror/javascripts/html-completion.js', $('.codemirror6').val());\n",
          //   "zip.file('libraries/codemirror/mode/javascript/javascript.js', $('.codemirror7').val());\n",
          //   "zip.file('libraries/codemirror/mode/xml/xml.js', $('.codemirror8').val());\n",
          //   "zip.file('libraries/codemirror/mode/css/css.js', $('.codemirror9').val());\n",
          //   "zip.file('libraries/codemirror/mode/htmlmixed/htmlmixed.js', $('.codemirror10').val());\n",
          //   "zip.file('libraries/codemirror/addon/edit/closetag.js', $('.codemirror11').val());\n",
          //   "zip.file('libraries/codemirror/addon/edit/matchbrackets.js', $('.codemirror12').val());\n",
          //   "zip.file('libraries/codemirror/addon/selection/active-line.js', $('.codemirror13').val());\n",
          //   "zip.file('libraries/codemirror/addon/fold/foldcode.js', $('.codemirror14').val());\n",
          //   "zip.file('libraries/codemirror/addon/fold/foldgutter.js', $('.codemirror15').val());\n",
          //   "zip.file('libraries/codemirror/addon/fold/brace-fold.js', $('.codemirror16').val());\n",
          //   "zip.file('libraries/codemirror/addon/fold/xml-fold.js', $('.codemirror17').val());\n",
          //   "zip.file('libraries/codemirror/addon/fold/comment-fold.js', $('.codemirror18').val());\n",
          //   "zip.file('libraries/codemirror/addon/search/search.js', $('.codemirror19').val());\n",
          //   "zip.file('libraries/codemirror/addon/search/searchcursor.js', $('.codemirror20').val());\n",
          //   "zip.file('libraries/codemirror/addon/dialog/dialog.js', $('.codemirror21').val());\n",
          //   "zip.file('libraries/codemirror/addon/hint/show-hint.js', $('.codemirror22').val());\n",
          //   "zip.file('libraries/codemirror/addon/hint/xml-hint.js', $('.codemirror23').val());\n",
          //   "zip.file('libraries/codemirror/addon/hint/html-hint.js', $('.codemirror24').val());\n",
          //   "zip.file('libraries/codemirror/addon/hint/css-hint.js', $('.codemirror25').val());\n",
          //   "zip.file('libraries/codemirror/addon/hint/javascript-hint.js', $('.codemirror26').val());\n",
          //   "zip.file('libraries/codemirror/addon/search/match-highlighter.js', $('.codemirror27').val());\n",
          //   "zip.file('libraries/codemirror/htmlhint.js', $('.codemirror28').val());\n",
          //   "zip.file('libraries/codemirror/csslint.js', $('.codemirror29').val());\n",
          //   "zip.file('libraries/codemirror/jshint.js', $('.codemirror30').val());\n",
          //   "zip.file('libraries/codemirror/addon/lint/lint.js', $('.codemirror31').val());\n",
          //   "zip.file('libraries/codemirror/addon/lint/html-lint.js', $('.codemirror32').val());\n",
          //   "zip.file('libraries/codemirror/addon/lint/css-lint.js', $('.codemirror33').val());\n",
          //   "zip.file('libraries/codemirror/addon/lint/javascript-lint.js', $('.codemirror34').val());\n",
          //   "zip.file('libraries/codemirror/inlet.min.js', $('.codemirror35').val());\n",
          //   "zip.file('libraries/codemirror/inlet.css', $('.codemirror36').val());\n",
          //   "zip.file('libraries/codemirror/emmet.js', $('.codemirror37').val());\n",
          //   "zip.file('libraries/codemirror/addon/lint/lint.css', $('.codemirror38').val());\n",
          //   "zip.file('libraries/codemirror/addon/dialog/dialog.css', $('.codemirror39').val());\n",
          //   "zip.file('libraries/codemirror/addon/hint/show-hint.css', $('.codemirror40').val());\n",
          //   "zip.file('libraries/codemirror/addon/search/jump-to-line.js', $('.codemirror41').val());\n",
          //   "zip.file('libraries/codemirror/markdown.js', $('.codemirror42').val());\n",
          //   "zip.file('libraries/codemirror/continuelist.js', $('.codemirror43').val());\n",
          //   "zip.file('libraries/codemirror/mode/haml/haml.js', $('.codemirror44').val());\n",
          //   "zip.file('libraries/codemirror/mode/jade/jade.js', $('.codemirror45').val());\n",
          //   "zip.file('libraries/codemirror/mode/sass/sass.js', $('.codemirror46').val());\n",
          //   "zip.file('libraries/codemirror/mode/livescript/livescript.js', $('.codemirror47').val());\n",
          //   "zip.file('libraries/codemirror/mode/coffeescript/coffeescript.js', $('.codemirror48').val());\n",
          //   "zip.file('libraries/codemirror/mode/ruby/ruby.js', $('.codemirror49').val());\n",
          //   "zip.file('libraries/codemirror/coffee-script.js', $('.codemirror50').val());\n",
          //   "zip.file('libraries/codemirror/coffeelint.js', $('.codemirror51').val());\n",
          //   "zip.file('libraries/codemirror/addon/lint/coffeescript-lint.js', $('.codemirror52').val());\n"
          // ];

          var grabCodemirror = "zip.file('libraries/codemirror/lib/codemirror.css', $('.codemirror1').val());\n\n      zip.file('libraries/codemirror/addon/fold/foldgutter.css', $('.codemirror2').val());\n\n      zip.file('libraries/codemirror/lib/codemirror.js', $('.codemirror3').val());\n\n      zip.file('libraries/codemirror/javascripts/code-completion.js', $('.codemirror4').val());\n\n      zip.file('libraries/codemirror/javascripts/css-completion.js', $('.codemirror5').val());\n\n      zip.file('libraries/codemirror/javascripts/html-completion.js', $('.codemirror6').val());\n\n      zip.file('libraries/codemirror/mode/javascript/javascript.js', $('.codemirror7').val());\n\n      zip.file('libraries/codemirror/mode/xml/xml.js', $('.codemirror8').val());\n\n      zip.file('libraries/codemirror/mode/css/css.js', $('.codemirror9').val());\n\n      zip.file('libraries/codemirror/mode/htmlmixed/htmlmixed.js', $('.codemirror10').val());\n\n      zip.file('libraries/codemirror/addon/edit/closetag.js', $('.codemirror11').val());\n\n      zip.file('libraries/codemirror/addon/edit/matchbrackets.js', $('.codemirror12').val());\n\n      zip.file('libraries/codemirror/addon/selection/active-line.js', $('.codemirror13').val());\n\n      zip.file('libraries/codemirror/addon/fold/foldcode.js', $('.codemirror14').val());\n\n      zip.file('libraries/codemirror/addon/fold/foldgutter.js', $('.codemirror15').val());\n\n      zip.file('libraries/codemirror/addon/fold/brace-fold.js', $('.codemirror16').val());\n\n      zip.file('libraries/codemirror/addon/fold/xml-fold.js', $('.codemirror17').val());\n\n      zip.file('libraries/codemirror/addon/fold/comment-fold.js', $('.codemirror18').val());\n\n      zip.file('libraries/codemirror/addon/search/search.js', $('.codemirror19').val());\n\n      zip.file('libraries/codemirror/addon/search/searchcursor.js', $('.codemirror20').val());\n\n      zip.file('libraries/codemirror/addon/dialog/dialog.js', $('.codemirror21').val());\n\n      zip.file('libraries/codemirror/addon/hint/show-hint.js', $('.codemirror22').val());\n\n      zip.file('libraries/codemirror/addon/hint/xml-hint.js', $('.codemirror23').val());\n\n      zip.file('libraries/codemirror/addon/hint/html-hint.js', $('.codemirror24').val());\n\n      zip.file('libraries/codemirror/addon/hint/css-hint.js', $('.codemirror25').val());\n\n      zip.file('libraries/codemirror/addon/hint/javascript-hint.js', $('.codemirror26').val());\n\n      zip.file('libraries/codemirror/addon/search/match-highlighter.js', $('.codemirror27').val());\n\n      zip.file('libraries/codemirror/htmlhint.js', $('.codemirror28').val());\n\n      zip.file('libraries/codemirror/csslint.js', $('.codemirror29').val());\n\n      zip.file('libraries/codemirror/jshint.js', $('.codemirror30').val());\n\n      zip.file('libraries/codemirror/addon/lint/lint.js', $('.codemirror31').val());\n\n      zip.file('libraries/codemirror/addon/lint/html-lint.js', $('.codemirror32').val());\n\n      zip.file('libraries/codemirror/addon/lint/css-lint.js', $('.codemirror33').val());\n\n      zip.file('libraries/codemirror/addon/lint/javascript-lint.js', $('.codemirror34').val());\n\n      zip.file('libraries/codemirror/inlet.min.js', $('.codemirror35').val());\n\n      zip.file('libraries/codemirror/inlet.css', $('.codemirror36').val());\n\n      zip.file('libraries/codemirror/emmet.js', $('.codemirror37').val());\n\n      zip.file('libraries/codemirror/addon/lint/lint.css', $('.codemirror38').val());\n\n      zip.file('libraries/codemirror/addon/dialog/dialog.css', $('.codemirror39').val());\n\n      zip.file('libraries/codemirror/addon/hint/show-hint.css', $('.codemirror40').val());\n\n      zip.file('libraries/codemirror/addon/search/jump-to-line.js', $('.codemirror41').val());\n\n      zip.file('libraries/codemirror/markdown.js', $('.codemirror42').val());\n\n      zip.file('libraries/codemirror/continuelist.js', $('.codemirror43').val());\n\n      zip.file('libraries/codemirror/mode/haml/haml.js', $('.codemirror44').val());\n\n      zip.file('libraries/codemirror/mode/jade/jade.js', $('.codemirror45').val());\n\n      zip.file('libraries/codemirror/mode/sass/sass.js', $('.codemirror46').val());\n\n      zip.file('libraries/codemirror/mode/livescript/livescript.js', $('.codemirror47').val());\n\n      zip.file('libraries/codemirror/mode/coffeescript/coffeescript.js', $('.codemirror48').val());\n\n      zip.file('libraries/codemirror/mode/ruby/ruby.js', $('.codemirror49').val());\n\n      zip.file('libraries/codemirror/coffee-script.js', $('.codemirror50').val());\n\n      zip.file('libraries/codemirror/coffeelint.js', $('.codemirror51').val());\n\n      zip.file('libraries/codemirror/addon/lint/coffeescript-lint.js', $('.codemirror52').val());\n";

          $('.codemirror').trigger("change");
          $(".codemirrorzip").val(grabCodemirror);
        } else {
          $('.codemirror, .codemirrorzip').clear();
        }
        if ( $("#createjs").is(":checked") ) {
          $('.createjs').clear();
          download_to_textbox('../editor/libraries/createjs/createjs.min.js', $('.createjs1'));
          download_to_textbox('../editor/libraries/createjs/easeljs.min.js', $('.createjs2'));
          download_to_textbox('../editor/libraries/createjs/tweenjs.min.js', $('.createjs3'));
          download_to_textbox('../editor/libraries/createjs/soundjs.min.js', $('.createjs4'));
          download_to_textbox('../editor/libraries/createjs/preloadjs.min.js', $('.createjs5'));
          $('.createjs').trigger("change");
          $(".createjszip").val("zip.file('libraries/createjs/createjs.min.js', $('.createjs1').val());\nzip.file('libraries/createjs/easeljs.min.js', $('.createjs2').val());\nzip.file('libraries/createjs/tweenjs.min.js', $('.createjs3').val());\nzip.file('libraries/createjs/soundjs.min.js', $('.createjs4').val());\nzip.file('libraries/createjs/preloadjs.min.js', $('.createjs5').val());");
        } else {
          $('.createjs, .createjszip').clear();
        }
        if ( $("#d3").is(":checked") ) {
          $('.d3').clear();
          download_to_textbox('../editor/libraries/d3/d3.js', $('.d3'));
          $('.d3').trigger("change");
          $(".d3zip").val("zip.file('libraries/d3/d3.js', $(\".d3\").val());");
        } else {
          $('.d3, .d3zip').clear();
        }
        if ( $("#dojo").is(":checked") ) {
          $('.dojo').clear();
          download_to_textbox('../editor/libraries/dojo/dojo.js', $('.dojo'));
          $('.dojo').trigger("change");
          $(".dojozip").val("zip.file('libraries/dojo/dojo.js', $(\".dojo\").val());");
        } else {
          $('.dojo, .dojozip').clear();
        }
        if ( $("#enhance").is(":checked") ) {
          $('.enhance').clear();
          download_to_textbox('../editor/libraries/enhance/enhance.js', $('.enhance'));
          $('.enhance').trigger("change");
          $(".enhancezip").val("zip.file('libraries/enhance/enhance.js', $('.enhance').val());");
        } else {
          $('.enhance, .enhancezip').clear();
        }
        if ( $("#fabric").is(":checked") ) {
          $('.fabric').clear();
          download_to_textbox('../editor/libraries/fabric/fabric.min.js', $('.fabric'));
          $('.fabric').trigger("change");
          $(".fabriczip").val("zip.file('libraries/fabric/fabric.min.js', $(\".fabric\").val());");
        } else {
          $('.fabric, .fabriczip').clear();
        }
        if ( $("#foundation").is(":checked") ) {
          $('.foundation').clear();
          download_to_textbox('../editor/libraries/foundation/foundation.min.css', $('.foundation1'));
          download_to_textbox('../editor/libraries/foundation/foundation.min.js', $('.foundation2'));
          $('.foundation').trigger("change");
          $(".fabriczip").val("zip.file('libraries/foundation/foundation.min.css', $(\".foundation1\").val());\nzip.file('libraries/foundation/foundation.min.js', $(\".foundation2\").val());");
        } else {
          $('.foundation, .foundationzip').clear();
        }
        if ( $("#handlebars").is(":checked") ) {
          $('.handlebars').clear();
          download_to_textbox('../editor/libraries/handlebars/handlebars.min.js', $('.handlebars'));
          $('.handlebars').trigger("change");
          $(".handlebarszip").val("zip.file('../editor/libraries/handlebars/handlebars.min.js', $(\".handlebars\").val());");
        } else {
          $('.handlebars, .handlebarszip').clear();
        }
        if ( $("#hintcss").is(":checked") ) {
          $('.hintcss').clear();
          download_to_textbox('../editor/libraries/hintCSS/hint.min.css', $('.hintcss'));
          $('.hintcss').trigger("change");
          $(".hintcsszip").val("zip.file('libraries/hintCSS/hint.min.css', $(\".hintcss\").val());");
        } else {
          $('.hintcss, .hintcsszip').clear();
        }
        if ( $("#immutable").is(":checked") ) {
          $('.immutable').clear();
          download_to_textbox('../editor/libraries/immutable/immutable.min.js', $('.immutable'));
          $('.immutable').trigger("change");
          $(".immutablezip").val("zip.file('libraries/immutable/immutable.min.js', $('.immutable').val());");
        } else {
          $('.immutable, .immutablezip').clear();
        }
        if ( $("#jarallax").is(":checked") ) {
          $('.jarallax').clear();
          download_to_textbox('../editor/libraries/jarallax/jarallax.js', $('.jarallax'));
          $('.jarallax').trigger("change");
          $(".jarallaxzip").val("zip.file('libraries/jarallax/jarallax.js', $(\".jarallax\").val());");
        } else {
          $('.jarallax, .jarallaxzip').clear();
        }
        if ( $("#jquery").is(":checked") ) {
          $('.jquery').clear();
          download_to_textbox('../editor/libraries/jquery/jquery.js', $('.jquery1'));
          download_to_textbox('../editor/libraries/jquery/jquery-migrate-1.2.1.min.js', $('.jquery2'));
          $('.jquery').trigger("change");
          $(".jqueryzip").val("zip.file('libraries/jquery/jquery.js', $(\".jquery1\").val());\nzip.file('libraries/jquery/jquery-migrate-1.2.1.min.js', $(\".jquery2\").val());");
        } else {
          $('.jquery, .jqueryzip').clear();
        }
        if ( $("#jqueryui").is(":checked") ) {
          $('.jqueryui').clear();
          download_to_textbox('../editor/libraries/jqueryui/jqueryui.css', $('.jqueryui1'));
          download_to_textbox('../editor/libraries/jqueryui/jqueryui.min.js', $('.jqueryui2'));
          download_to_textbox('../editor/libraries/jqueryui/jquery.ui.touch-punch.min.js', $('.jqueryui3'));
          $('.jqueryui').trigger("change");
          $(".jqueryuizip").val("zip.file('libraries/jqueryui/jqueryui.css', $(\".jqueryui1\").val());\nzip.file('libraries/jqueryui/jqueryui.min.js', $(\".jqueryui2\").val());\nzip.file('libraries/jqueryui/jquery.ui.touch-punch.min.js', $(\".jqueryui3\").val());");
        } else {
          $('.jqueryui, .jqueryuizip').clear();
        }
        if ( $("#jquerytools").is(":checked") ) {
          $('.jquerytools').clear();
          download_to_textbox('../editor/libraries/jquerytools/jquery.tools.min.js', $('.jquerytools'));
          $('.jquerytools').trigger("change");
          $(".jquerytoolszip").val("zip.file('libraries/jquerytools/jquery.tools.min.js', $(\".jquerytools\").val());");
        } else {
          $('.jquerytools, .jquerytoolszip').clear();
        }
        if ( $("#jszip").is(":checked") ) {
          $('.jszip').clear();
          download_to_textbox('../editor/libraries/jszip/jszip.min.js', $('.jszip1'));
          download_to_textbox('../editor/libraries/jszip/jszip-utils.js', $('.jszip2'));
          download_to_textbox('../editor/libraries/jszip/FileSaver.js', $('.jszip3'));
          download_to_textbox('../editor/libraries/jszip/Blob.js', $('.jszip4'));
          $('.jszip').trigger("change");
          $(".jszipzip").val("zip.file('libraries/jszip/jszip.min.js', $(\".jszip1\").val());\nzip.file('libraries/jszip/jszip-utils.js', $(\".jszip2\").val());\nzip.file('libraries/jszip/FileSaver.js', $(\".jszip3\").val());\nzip.file('libraries/jszip/Blob.js', $(\".jszip4\").val());");
        } else {
          $('.jszip, .jszipzip').clear();
        }
        if ( $("#jqxsplitter").is(":checked") ) {
          $('.jqxsplitter').clear();

          download_to_textbox('../editor/libraries/jqwidgets/styles/jqx.base.css', $('.jqwidgets1'));
          download_to_textbox('../editor/libraries/jqwidgets/styles/jqx.android.css', $('.jqwidgets2'));
          download_to_textbox('../editor/libraries/jqwidgets/styles/jqx.arctic.css', $('.jqwidgets3'));
          download_to_textbox('../editor/libraries/jqwidgets/styles/jqx.black.css', $('.jqwidgets4'));
          download_to_textbox('../editor/libraries/jqwidgets/styles/jqx.blackberry.css', $('.jqwidgets5'));
          download_to_textbox('../editor/libraries/jqwidgets/styles/jqx.bootstrap.css', $('.jqwidgets6'));
          download_to_textbox('../editor/libraries/jqwidgets/styles/jqx.classic.css', $('.jqwidgets7'));
          download_to_textbox('../editor/libraries/jqwidgets/styles/jqx.darkblue.css', $('.jqwidgets8'));
          download_to_textbox('../editor/libraries/jqwidgets/styles/jqx.energyblue.css', $('.jqwidgets9'));
          download_to_textbox('../editor/libraries/jqwidgets/styles/jqx.fresh.css', $('.jqwidgets10'));
          download_to_textbox('../editor/libraries/jqwidgets/styles/jqx.highcontrast.css', $('.jqwidgets11'));
          download_to_textbox('../editor/libraries/jqwidgets/styles/jqx.metro.css', $('.jqwidgets12'));
          download_to_textbox('../editor/libraries/jqwidgets/styles/jqx.metrodark.css', $('.jqwidgets13'));
          download_to_textbox('../editor/libraries/jqwidgets/styles/jqx.mobile.css', $('.jqwidgets14'));
          download_to_textbox('../editor/libraries/jqwidgets/styles/jqx.office.css', $('.jqwidgets15'));
          download_to_textbox('../editor/libraries/jqwidgets/styles/jqx.orange.css', $('.jqwidgets16'));
          download_to_textbox('../editor/libraries/jqwidgets/styles/jqx.shinyblack.css', $('.jqwidgets17'));
          download_to_textbox('../editor/libraries/jqwidgets/styles/jqx.summer.css', $('.jqwidgets18'));
          download_to_textbox('../editor/libraries/jqwidgets/styles/jqx.ui-darkness.css', $('.jqwidgets19'));
          download_to_textbox('../editor/libraries/jqwidgets/styles/jqx.ui-le-frog.css', $('.jqwidgets20'));
          download_to_textbox('../editor/libraries/jqwidgets/styles/jqx.ui-lightness.css', $('.jqwidgets21'));
          download_to_textbox('../editor/libraries/jqwidgets/styles/jqx.ui-overcast.css', $('.jqwidgets22'));
          download_to_textbox('../editor/libraries/jqwidgets/styles/jqx.ui-redmond.css', $('.jqwidgets23'));
          download_to_textbox('../editor/libraries/jqwidgets/styles/jqx.ui-smoothness.css', $('.jqwidgets24'));
          download_to_textbox('../editor/libraries/jqwidgets/styles/jqx.ui-start.css', $('.jqwidgets25'));
          download_to_textbox('../editor/libraries/jqwidgets/styles/jqx.ui-sunny.css', $('.jqwidgets26'));
          download_to_textbox('../editor/libraries/jqwidgets/styles/jqx.web.css', $('.jqwidgets27'));
          download_to_textbox('../editor/libraries/jqwidgets/styles/jqx.windowsphone.css', $('.jqwidgets28'));
          download_to_textbox('../editor/libraries/jqwidgets/jqxcore.js', $('.jqwidgets29'));
          download_to_textbox('../editor/libraries/jqwidgets/jqxsplitter.js', $('.jqwidgets30'));

          // var jqxsplitter = [
          //   "zip.file('libraries/jqwidgets/styles/jqx.base.css', $('.jqwidgets1').val());\n",
          //   "zip.file('libraries/jqwidgets/styles/jqx.android.css', $('.jqwidgets2').val());\n",
          //   "zip.file('libraries/jqwidgets/styles/jqx.arctic.css', $('.jqwidgets3').val());\n",
          //   "zip.file('libraries/jqwidgets/styles/jqx.black.css', $('.jqwidgets4').val());\n",
          //   "zip.file('libraries/jqwidgets/styles/jqx.blackberry.css', $('.jqwidgets5').val());\n",
          //   "zip.file('libraries/jqwidgets/styles/jqx.bootstrap.css', $('.jqwidgets6').val());\n",
          //   "zip.file('libraries/jqwidgets/styles/jqx.classic.css', $('.jqwidgets7').val());\n",
          //   "zip.file('libraries/jqwidgets/styles/jqx.darkblue.css', $('.jqwidgets8').val());\n",
          //   "zip.file('libraries/jqwidgets/styles/jqx.energyblue.css', $('.jqwidgets9').val());\n",
          //   "zip.file('libraries/jqwidgets/styles/jqx.fresh.css', $('.jqwidgets10').val());\n",
          //   "zip.file('libraries/jqwidgets/styles/jqx.highcontrast.css', $('.jqwidgets11').val());\n",
          //   "zip.file('libraries/jqwidgets/styles/jqx.metro.css', $('.jqwidgets12').val());\n",
          //   "zip.file('libraries/jqwidgets/styles/jqx.metrodark.css', $('.jqwidgets13').val());\n",
          //   "zip.file('libraries/jqwidgets/styles/jqx.mobile.css', $('.jqwidgets14').val());\n",
          //   "zip.file('libraries/jqwidgets/styles/jqx.office.css', $('.jqwidgets15').val());\n",
          //   "zip.file('libraries/jqwidgets/styles/jqx.orange.css', $('.jqwidgets16').val());\n",
          //   "zip.file('libraries/jqwidgets/styles/jqx.shinyblack.css', $('.jqwidgets17').val());\n",
          //   "zip.file('libraries/jqwidgets/styles/jqx.summer.css', $('.jqwidgets18').val());\n",
          //   "zip.file('libraries/jqwidgets/styles/jqx.ui-darkness.css', $('.jqwidgets19').val());\n",
          //   "zip.file('libraries/jqwidgets/styles/jqx.ui-le-frog.css', $('.jqwidgets20').val());\n",
          //   "zip.file('libraries/jqwidgets/styles/jqx.ui-lightness.css', $('.jqwidgets21').val());\n",
          //   "zip.file('libraries/jqwidgets/styles/jqx.ui-overcast.css', $('.jqwidgets22').val());\n",
          //   "zip.file('libraries/jqwidgets/styles/jqx.ui-redmond.css', $('.jqwidgets23').val());\n",
          //   "zip.file('libraries/jqwidgets/styles/jqx.ui-smoothness.css', $('.jqwidgets24').val());\n",
          //   "zip.file('libraries/jqwidgets/styles/jqx.ui-start.css', $('.jqwidgets25').val());\n",
          //   "zip.file('libraries/jqwidgets/styles/jqx.ui-sunny.css', $('.jqwidgets26').val());\n",
          //   "zip.file('libraries/jqwidgets/styles/jqx.web.css', $('.jqwidgets27').val());\n",
          //   "zip.file('libraries/jqwidgets/styles/jqx.windowsphone.css', $('.jqwidgets28').val());\n",
          //   "zip.file('libraries/jqwidgets/jqxcore.js', $('.jqwidgets29').val());\n",
          //   "zip.file('libraries/jqwidgets/jqxsplitter.js', $('.jqwidgets30').val());\n"
          // ];

          var jqxsplitter = "zip.file('libraries/jqwidgets/styles/jqx.base.css', $('.jqwidgets1').val());\n\n      zip.file('libraries/jqwidgets/styles/jqx.android.css', $('.jqwidgets2').val());\n\n      zip.file('libraries/jqwidgets/styles/jqx.arctic.css', $('.jqwidgets3').val());\n\n      zip.file('libraries/jqwidgets/styles/jqx.black.css', $('.jqwidgets4').val());\n\n      zip.file('libraries/jqwidgets/styles/jqx.blackberry.css', $('.jqwidgets5').val());\n\n      zip.file('libraries/jqwidgets/styles/jqx.bootstrap.css', $('.jqwidgets6').val());\n\n      zip.file('libraries/jqwidgets/styles/jqx.classic.css', $('.jqwidgets7').val());\n\n      zip.file('libraries/jqwidgets/styles/jqx.darkblue.css', $('.jqwidgets8').val());\n\n      zip.file('libraries/jqwidgets/styles/jqx.energyblue.css', $('.jqwidgets9').val());\n\n      zip.file('libraries/jqwidgets/styles/jqx.fresh.css', $('.jqwidgets10').val());\n\n      zip.file('libraries/jqwidgets/styles/jqx.highcontrast.css', $('.jqwidgets11').val());\n\n      zip.file('libraries/jqwidgets/styles/jqx.metro.css', $('.jqwidgets12').val());\n\n      zip.file('libraries/jqwidgets/styles/jqx.metrodark.css', $('.jqwidgets13').val());\n\n      zip.file('libraries/jqwidgets/styles/jqx.mobile.css', $('.jqwidgets14').val());\n\n      zip.file('libraries/jqwidgets/styles/jqx.office.css', $('.jqwidgets15').val());\n\n      zip.file('libraries/jqwidgets/styles/jqx.orange.css', $('.jqwidgets16').val());\n\n      zip.file('libraries/jqwidgets/styles/jqx.shinyblack.css', $('.jqwidgets17').val());\n\n      zip.file('libraries/jqwidgets/styles/jqx.summer.css', $('.jqwidgets18').val());\n\n      zip.file('libraries/jqwidgets/styles/jqx.ui-darkness.css', $('.jqwidgets19').val());\n\n      zip.file('libraries/jqwidgets/styles/jqx.ui-le-frog.css', $('.jqwidgets20').val());\n\n      zip.file('libraries/jqwidgets/styles/jqx.ui-lightness.css', $('.jqwidgets21').val());\n\n      zip.file('libraries/jqwidgets/styles/jqx.ui-overcast.css', $('.jqwidgets22').val());\n\n      zip.file('libraries/jqwidgets/styles/jqx.ui-redmond.css', $('.jqwidgets23').val());\n\n      zip.file('libraries/jqwidgets/styles/jqx.ui-smoothness.css', $('.jqwidgets24').val());\n\n      zip.file('libraries/jqwidgets/styles/jqx.ui-start.css', $('.jqwidgets25').val());\n\n      zip.file('libraries/jqwidgets/styles/jqx.ui-sunny.css', $('.jqwidgets26').val());\n\n      zip.file('libraries/jqwidgets/styles/jqx.web.css', $('.jqwidgets27').val());\n\n      zip.file('libraries/jqwidgets/styles/jqx.windowsphone.css', $('.jqwidgets28').val());\n\n      zip.file('libraries/jqwidgets/jqxcore.js', $('.jqwidgets29').val());\n\n      zip.file('libraries/jqwidgets/jqxsplitter.js', $('.jqwidgets30').val());\n";

          $('.jqxsplitter').trigger("change");
          $(".jqxsplitterzip").val(jqxsplitter);
        } else {
          $('.jqxsplitter, .jqxsplitterzip').clear();
        }
        if ( $("#kinetic").is(":checked") ) {
          $('.kinetic').clear();
          download_to_textbox('../editor/libraries/kinetic/kinetic.js', $('.kinetic'));
          $('.kinetic').trigger("change");
          $(".kineticzip").val("zip.file('libraries/kinetic/kinetic.js', $(\".kinetic\").val());");
        } else {
          $('.kinetic, .kineticzip').clear();
        }
        if ( $("#knockout").is(":checked") ) {
          $('.knockout').clear();
          download_to_textbox('../editor/libraries/knockout/knockout.js', $('.knockout'));
          $('.knockout').trigger("change");
          $(".knockoutzip").val("zip.file('libraries/knockout/knockout.js', $(\".knockout\").val());");
        } else {
          $('.knockout, .knockoutzip').clear();
        }
        if ( $("#immutable").is(":checked") ) {
          $('.immutable').clear();
          download_to_textbox('../editor/libraries/immutable/lodash.core.js', $('.lodash'));
          $('.lodash').trigger("change");
          $(".lodashzip").val("zip.file('libraries/immutable/lodash.core.js', $('.lodash').val());");
        } else {
          $('.lodash, .lodashzip').clear();
        }
        if ( $("#mdl").is(":checked") ) {
          $('.mdl').clear();
          download_to_textbox('../editor/libraries/mdl/material.min.css', $('.mdl1'));
          download_to_textbox('../editor/libraries/mdl/material.min.js', $('.mdl2'));
          $('.mdl1, .mdl2').trigger("change");
          $(".mdlzip").val("zip.file('libraries/mdl/material.min.css', $('.mdl1').val());\n  zip.file('libraries/mdl/material.min.js', $('.mdl2').val());");
        } else {
          $('.mdl, .mdlzip').clear();
        }
        if ( $("#modernizer").is(":checked") ) {
          $('.modernizer').clear();
          download_to_textbox('../editor/libraries/modernizer/modernizer.js', $('.modernizer'));
          $('.modernizer').trigger("change");
          $(".modernizerzip").val("zip.file('libraries/modernizer/modernizer.js', $(\".modernizer\").val());");
        } else {
          $('.modernizer, .modernizerzip').clear();
        }
        if ( $("#moment").is(":checked") ) {
          $('.moment').clear();
          download_to_textbox('../editor/libraries/moment/moment.js', $('.moment'));
          download_to_textbox('../editor/libraries/moment/moment-with-locales.js', $('.moment'));
          $('.moment').trigger("change");
          $(".momentzip").val("zip.file('libraries/moment/moment.js', $(\".moment1\").val());\nzip.file('libraries/moment/moment-with-locales.js', $(\".moment2\").val());");
        } else {
          $('.moment, .momentzip').clear();
        }
        if ( $("#momenttimezone").is(":checked") ) {
          $('.momenttimezone').clear();
          download_to_textbox('../editor/libraries/moment-timezone/moment-timezone.js', $('.momenttimezone1'));
          download_to_textbox('../editor/libraries/moment-timezone/moment-timezone-with-data.js', $('.momenttimezone2'));
          download_to_textbox('../editor/libraries/moment-timezone/moment-timezone-with-data-2012-2022.js', $('.momenttimezone3'));
          
          $('.momenttimezone').trigger("change");
          
          $(".momenttimezonezip").val("zip.file('libraries/moment-timezone/moment-timezone.js', $(\".momenttimezone1\").val());\nzip.file('libraries/moment/moment.js', $(\".momenttimezone2\").val());\nzip.file('libraries/moment/moment.js', $(\".momenttimezone3\").val());");
        } else {
          $('.momenttimezone, .momenttimezonezip').clear();
        }
        if ( $("#mootools").is(":checked") ) {
          $('.mootools').clear();
          download_to_textbox('../editor/libraries/mootools/mootools-yui-compressed.js', $('.mootools'));
          $('.mootools').trigger("change");
          $(".mootoolszip").val("zip.file('libraries/mootools/mootools-yui-compressed.js', $(\".mootools\").val());");
        } else {
          $('.mootools, .mootoolszip').clear();
        }
        if ( $("#normalize").is(":checked") ) {
          $('.normalize').clear();
          download_to_textbox('../editor/libraries/normalize/normalize.css', $('.normalize'));
          $('.normalize').trigger("change");
          $(".normalizezip").val("zip.file('libraries/normalize/normalize.css', $(\".normalize\").val());");
        } else {
          $('.normalize, .normalizezip').clear();
        }
        if ( $("#paperjs").is(":checked") ) {
          $('.paperjs').clear();
          download_to_textbox('../editor/libraries/paperjs/paperjs.js', $('.paperjs'));
          $('.paperjs').trigger("change");
          $(".paperjszip").val("zip.file('libraries/paperjs/paperjs.js', $(\".paperjs\").val());");
        } else {
          $('.paperjs, .paperjszip').clear();
        }
        if ( $("#polyui").is(":checked") ) {
          $('.polyui').clear();
          download_to_textbox('../editor/libraries/polyui/polyui.css', $('.polyui'));
          $('.polyui').trigger("change");
          $(".polyuizip").val("zip.file('libraries/polyui/polyui.css', $(\".polyui\").val());");
        } else {
          $('.polyui, .polyuizip').clear();
        }
        if ( $("#prefixfree").is(":checked") ) {
          $('.prefixfree').clear();
          download_to_textbox('../editor/libraries/prefixfree/prefixfree.min.js', $('.prefixfree'));
          $('.prefixfree').trigger("change");
          $(".prefixfreezip").val("zip.file('libraries/prefixfree/prefixfree.min.js', $(\".prefixfree\").val());");
        } else {
          $('.prefixfree, .prefixfreezip').clear();
        }
        if ( $("#processingjs").is(":checked") ) {
          $('.processingjs').clear();
          download_to_textbox('../editor/libraries/processingjs/processingjs.js', $('.processingjs'));
          $('.processingjs').trigger("change");
          $(".processingjszip").val("zip.file('libraries/processingjs/processingjs.js', $(\".processingjs\").val());");
        } else {
          $('.processingjs, .processingjsszip').clear();
        }
        if ( $("#prototypejs").is(":checked") ) {
          $('.prototypejs').clear();
          download_to_textbox('../editor/libraries/prototypejs/prototypejs.js', $('.prototypejs'));
          $('.prototypejs').trigger("change");
          $(".prototypejszip").val("zip.file('libraries/prototypejs/prototypejs.js', $(\".prototypejs\").val());");
        } else {
          $('.prototypejs, .prototypejszip').clear();
        }
        if ( $("#qooxdoo").is(":checked") ) {
          $('.qooxdoo').clear();
          download_to_textbox('../editor/libraries/qooxdoo/qooxdoo.js', $('.qooxdoo'));
          $('.qooxdoo').trigger("change");
          $(".qooxdooszip").val("zip.file('libraries/qooxdoo/qooxdoo.js', $(\".qooxdoo\").val());");
        } else {
          $('.qooxdoo, .qooxdooszip').clear();
        }
        if ( $("#react").is(":checked") ) {
          $('.react').clear();
          download_to_textbox('../editor/libraries/react/react-with-addons.js', $('.react1'));
          download_to_textbox('../editor/libraries/react/react-dom.js', $('.react2'));
          $('.react1, .react2').trigger("change");
          $(".reactzip").val("zip.file('libraries/react/react-with-addons.js', $('.react1').val());\n  zip.file('libraries/react/react-dom.js', $('.react2').val());");
        } else {
          $('.react, .reactzip').clear();
        }
        if ( $("#raphael").is(":checked") ) {
          $('.raphael').clear();
          download_to_textbox('../editor/libraries/raphael/raphael.js', $('.raphael'));
          $('.raphael').trigger("change");
          $(".raphaelzip").val("zip.file('libraries/raphael/raphael.js', $(\".raphael\").val());");
        } else {
          $('.raphael, .raphaelzip').clear();
        }
        if ( $("#requirejs").is(":checked") ) {
          $('.requirejs').clear();
          download_to_textbox('../editor/libraries/require/require.js', $('.requirejs'));
          $('.requirejs').trigger("change");
          $(".requirejszip").val("zip.file('libraries/require/require.js', $(\".requirejs\").val());");
        } else {
          $('.requirejs, .requirejszip').clear();
        }
        if ( $("#showdown").is(":checked") ) {
          $('.showdown').clear();
          download_to_textbox('../editor/libraries/showdown/Showdown.min.js', $('.showdown'));
          $('.showdown').trigger("change");
          $(".showdownzip").val("zip.file('libraries/showdown/Showdown.min.js', $(\".showdown\").val());");
        } else {
          $('.showdown, .showdownzip').clear();
        }
        if ( $("#scriptaculous").is(":checked") ) {
          $('.scriptaculous').clear();
          download_to_textbox('../editor/libraries/scriptaculous/scriptaculous.js', $('.scriptaculous'));
          $('.scriptaculous').trigger("change");
          $(".scriptaculouszip").val("zip.file('libraries/scriptaculous/scriptaculous.js', $(\".scriptaculous\").val());");
        } else {
          $('.scriptaculous, .scriptaculouszip').clear();
        }
        if ( $("#smoothscroll").is(":checked") ) {
          $('.smoothscroll').clear();
          download_to_textbox('../editor/libraries/snap-svg/snap-svg.js', $('.smoothscroll'));
          $('.smoothscroll').trigger("change");
          $(".smoothscrollzip").val("zip.file('libraries/SmoothScroll/SmoothScroll.js', $(\".smoothscroll\").val());");
        } else {
          $('.smoothscroll, .smoothscrollzip').clear();
        }
        if ( $("#snapsvg").is(":checked") ) {
          $('.snapsvg').clear();
          download_to_textbox('../editor/libraries/snap-svg/snap-svg.js', $('.snapsvg'));
          $('.snapsvg').trigger("change");
          $(".snapsvgzip").val("zip.file('libraries/snap-svg/snap-svg.js', $(\".snapsvg\").val());");
        } else {
          $('.snapsvg, .snapsvgzip').clear();
        }
        if ( $("#svgjs").is(":checked") ) {
          $('.svgjs').clear();
          download_to_textbox('../editor/libraries/svg-svg/svg-svg.js', $('.svgjs'));
          $('.svgjs').trigger("change");
          $(".svgjszip").val("zip.file('libraries/svg-svg/svg-svg.js', $(\".svgjs\").val());");
        } else {
          $('.svgjs, .svgjszip').clear();
        }
        if ( $("#threejs").is(":checked") ) {
          $('.threejs').clear();
          download_to_textbox('../editor/libraries/threejs/three.min.js', $('.threejs'));
          $('.threejs').trigger("change");
          $(".threejszip").val("zip.file('libraries/threejs/three.min.js', $(\".threejs\").val());");
        } else {
          $('.threejs, .threejszip').clear();
        }
        if ( $("#uikit").is(":checked") ) {
          $('.uikit').clear();
          download_to_textbox('../editor/libraries/uikit/css/uikit.css', $('.uikit1'));
          download_to_textbox('../editor/libraries/uikit/js/uikit.js', $('.uikit2'));
          download_to_textbox('../editor/libraries/uikit/js/uikit-icons.js', $('.uikit3'));
          $('.uikit').trigger("change");
          $(".uikitzip").val("zip.file('../editor/libraries/uikit/css/uikit.css', $('.uikit1').val());\n  zip.file('../editor/libraries/uikit/js/uikit.js', $('.uikit2').val());\n  zip.file('../editor/libraries/uikit/js/uikit-icons.js', $('.uikit3').val());");
        } else {
          $('.uikit, .uikitzip').clear();
        }
        if ( $("#underscorejs").is(":checked") ) {
          $('.underscorejs').clear();
          download_to_textbox('../editor/libraries/underscore/underscore.js', $('.underscorejs'));
          $('.underscorejs').trigger("change");
          $(".underscorejszip").val("zip.file('libraries/underscore/underscore.js', $(\".underscorejs\").val());");
        } else {
          $('.underscorejs, .underscorejszip').clear();
        }
        if ( $("#vue").is(":checked") ) {
          $('.vue').clear();
          download_to_textbox('../editor/libraries/vue/vue.js', $('.vue'));
          $('.vue').trigger("change");
          $(".vuezip").val("zip.file('libraries/vue/vue.js', $('.vue').val());");
        } else {
          $('.vue, .vuezip').clear();
        }
        if ( $("#webfontloader").is(":checked") ) {
          $('.webfontloader').clear();
          download_to_textbox('../editor/libraries/webfont/webfont.js', $('.webfontloader'));
          $('.webfontloader').trigger("change");
          $(".webfontloaderzip").val("zip.file('libraries/webfont/webfont.js', $(\".webfontloader\").val());");
        } else {
          $('.webfontloader, .webfontloaderzip').clear();
        }
        if ( $("#yui").is(":checked") ) {
          $('.yui').clear();
          download_to_textbox('../editor/libraries/yui/yui.js', $('.yui'));
          $('.yui').trigger("change");
          $(".yuizip").val("zip.file('libraries/yui/yui.js', $(\".yui\").val());");
        } else {
          $('.yui, .yuizip').clear();
        }
        if ( $("#zepto").is(":checked") ) {
          $('.zepto').clear();
          download_to_textbox('../editor/libraries/zepto/zepto.js', $('.zepto'));
          $('.zepto').trigger("change");
          $(".zeptozip").val("zip.file('libraries/zepto/zepto.js', $(\".zepto\").val());");
        } else {
          $('.zepto, .zeptozip').clear();
        }

        // Update JSZip (Applied dynamically from HTML div )
        $("[data-action=ziplibs]").val(function() {
          return $.map($(".jszipcode"), function (el) {
            return el.value;
          }).join("");
        });
      },
      download_to_textbox = function (url, el) {
        return $.get(url, null, function (data) {
          el.val(data);
        }, "text");
      },
      download_to_editor = function (url, el) {
        return $.get(url, null, function (data) {
          el.setValue(data);
        }, "text");
      };

  // Load Embeded Weave
  var hash = window.location.hash.substring(1);
//  $(document.body).append('<div class="fixedfill preloader" style="background: radial-gradient(ellipse at center, rgba(122, 188, 255, 0.85) 0%, rgba(64, 150, 238, 0.87) 100%)!important; color: #fff!important;"></div>');
//  $(".preloader").html('<div class="table"><div class="cell"><h1>Loading Weave!</h1><div class="spinner"><div class="bounce1" style="background: #fff!important;"></div><div class="bounce2" style="background: #fff!important;"></div><div class="bounce3" style="background: #fff!important;"></div></div></div></div>');
  $(document.body).append('<div class="fixedfill preloader" style="background: #fff;"></div>');
  $(".preloader").html('<div class="table"><div class="cell"><img class="spin" src="assets/loading.svg"></div></div>');
//  $(document.body).append('<div class="fixedfill preloader" style="background: #fff;"></div>');
//  $(".preloader").html('<div class="table"><div class="cell"><img src="assets/loading-animation.svg" style="width: 30%;"></div></div>');
  loadgist(hash);
  updatePreview();

  // Edit on kodeWeave Link
  $(".logo").attr("href", "https://mikethedj4.github.io/kodeWeave/editor/#" + hash.substring(0, hash.indexOf('?'))).attr("target", "_blank");

  // Setup Preprocessors
  $(".settings").on("click", function() {
    $(".preprocessor").addClass("hide");
    if ($(this).hasClass("htmlSetting")) {
      $(".html-preprocessor").removeClass("hide");
    } else if ($(this).hasClass("cssSetting")) {
      $(".css-preprocessor").removeClass("hide");
    } else if ($(this).hasClass("jsSetting")) {
      $(".js-preprocessor").removeClass("hide");
    }
    if ($("#html-preprocessor").val() == "none") {
      if (!htmlEditor.getValue) {
        $(".html-preprocessor-convert").addClass("hide");
      }
    } else if ($("#html-preprocessor").val() == "jade") {
      if (!htmlEditor.getValue) {
        $(".html-preprocessor-convert").addClass("hide");
      }
    }
    if ($("#js-preprocessor").val() == "none") {
      if (!jsEditor.getValue) {
        $(".js-preprocessor-convert").addClass("hide");
      }
    } else if ($("#js-preprocessor").val() == "coffeescript") {
      if (!jsEditor.getValue) {
        $(".js-preprocessor-convert").addClass("hide");
      }
    }
    $("[data-action=preprocessors]").fadeIn();
  });
  // Preprocessors (Doesn't compile to preview)
  $("#html-preprocessor").on("change", function() {
    var valueSelected = this.value;
    if ( valueSelected == "none") {
      htmlEditor.setOption("mode", "text/html");
      htmlEditor.setOption("gutters", ["CodeMirror-lint-markers", "CodeMirror-linenumbers", "CodeMirror-foldgutter"]);
      // htmlEditor.refresh();
    } else if ( valueSelected == "jade") {
      htmlEditor.setOption("mode", "text/x-jade");
      htmlEditor.setOption("gutters", ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]);
      // htmlEditor.refresh();
    } else {
      htmlEditor.setOption("mode", "text/html");
      htmlEditor.setOption("gutters", ["CodeMirror-lint-markers", "CodeMirror-linenumbers", "CodeMirror-foldgutter"]);
      // htmlEditor.refresh();
    }
    updatePreview();
  }).trigger("change");
  $("#css-preprocessor").on("change", function() {
    var valueSelected = this.value;
    if ( valueSelected == "none") {
      cssEditor.setOption("mode", "text/css");
      cssEditor.setOption("gutters", ["CodeMirror-lint-markers", "CodeMirror-linenumbers", "CodeMirror-foldgutter"]);
      // cssEditor.refresh();
    } else if ( valueSelected == "stylus") {
      cssEditor.setOption("mode", "text/x-styl");
      cssEditor.setOption("gutters", ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]);
      // cssEditor.refresh();
    } else if ( valueSelected == "less") {
      cssEditor.setOption("mode", "text/x-less");
      cssEditor.setOption("gutters", ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]);
      // cssEditor.refresh();
    } else {
      cssEditor.setOption("mode", "text/css");
      cssEditor.setOption("gutters", ["CodeMirror-lint-markers", "CodeMirror-linenumbers", "CodeMirror-foldgutter"]);
      // cssEditor.refresh();
    }
    updatePreview();
  }).trigger("change");
  $("#js-preprocessor").on("change", function() {
    var valueSelected = this.value;
    if ( valueSelected == "none") {
      jsEditor.setOption("mode", "text/javascript");
      // jsEditor.refresh();
      $(".jsvalidator").show();
    } else if ( valueSelected == "coffeescript") {
      jsEditor.setOption("mode", "text/x-coffeescript");
      // jsEditor.refresh();
    } else if ( valueSelected == "typescript") {
      jsEditor.setOption("mode", "text/typescript");
      // jsEditor.refresh();
    } else {
      $(".jsvalidator").show();
      jsEditor.setOption("mode", "text/javascript");
      // jsEditor.refresh();
    }
    updatePreview();
  }).trigger("change");

  // Save Checked Libraries for LocalStorage
  var textarea = $("[data-action=library-code]");

  // Add/Remove Libraries
  $("[data-action=check]").on("change keyup", function() {
    var value = $(this).parent().nextAll("div").children(".libsources:first").val() + "\n";
    checkedLibs();

    var libsTextarea = $("[data-action=libstextarea]");

    if ( $(this).prop("checked") === true ) {
      textarea.val( textarea.val() + value );
    } else {
      textarea.val( textarea.val().replace( value, "") );
    }

    updatePreview();

    var checked = $("[type=checkbox].check:checked");
    var lsChecked = [];
    for (var i = 0, iLen = checked.length; i < iLen; i++) {
      lsChecked.push($(checked[i]).attr('id'));
    }
  });
  $("#jquery").trigger("keyup");
  checkedLibs();
}