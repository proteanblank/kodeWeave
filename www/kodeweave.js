function saveFile(fileData, fileName) {
  // Get access to the file system
  window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
    // Create the file.
    fileSystem.root.getFile(fileName, { create: true, exclusive: false }, function (entry) {
      // After you save the file, you can access it with this URL
      myFileUrl = entry.toURL();
      entry.createWriter(function(writer) {
        writer.onwriteend = function(evt) {
          alert("Successfully saved file to " + myFileUrl);
        };
        // Write to the file
        writer.write(fileData);
      }, function(error) {
        alert("Error: Could not create file writer, " + error.code);
      });
    }, function(error) {
      alert("Error: Could not create file, " + error.code);
    });
  }, function(evt) {
    alert("Error: Could not access file system, " + evt.target.error.code);
  });
}

document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
  // Device is ready
}

var timeout, delay, selected_text, str, mynum, 
    start_cursor, cursorLine, cursorCh, blob,
    jsContent, htmlContent, cssContent, cssSelected,
    showEditors, hasMD, hasHTML, hasCSS, hasJS,
    editEmbed, darkUI, seeThrough, hasResult, offset, tsCode, tsCompileCode, sass = new Sass(),
    activeEditor = document.querySelector("[data-action=activeEditor]"),
    checkStatus = function() {
      if (navigator.onLine) {
        // user is online
        if ($(".checkStatus").hasClass("hide")) {
          $(".checkStatus").removeClass("hide");
        }
      } else {
        // user is offline
        $(".checkStatus").addClass("hide");
      }
    },
    welcomeDialog = function() {
      // Use localStorage for Welcome dialog
      // If user closed it prevent show upon every reload
      var closedWelcome = localStorage.getItem("closedWelcome");
      if (closedWelcome === "true") {
        // hide dialog
        $("#close-walkthrough").prop("checked", true);
      } else {
        // show dialog
        $("#close-walkthrough").prop("checked", "");
      }
      $("#close-walkthrough").click(function() {
        localStorage.setItem("closedWelcome", $(this).prop("checked"));
      });
    },
    loadgist = function(gistid) {
      $.ajax({
        url: "https://api.github.com/gists/" + gistid,
        type: "GET",
        dataType: "jsonp",
        jsonp: "callback"
      }).success(function(gistdata) {
        var htmlVal        = gistdata.data.files["index.html"];
        var jadeVal        = gistdata.data.files["index.jade"];
        var cssVal         = gistdata.data.files["index.css"];
        var stylusVal      = gistdata.data.files["index.styl"];
        var lessVal        = gistdata.data.files["index.less"];
        var scssVal        = gistdata.data.files["index.scss"];
        var sassVal        = gistdata.data.files["index.sass"];
        var jsVal          = gistdata.data.files["index.js"];
        var coffeeVal      = gistdata.data.files["index.coffee"];
        var typescriptVal  = gistdata.data.files["index.ts"];
        var babelVal       = gistdata.data.files["index.jsx"];
        var mdVal      = gistdata.data.files["README.md"];
        var settings   = gistdata.data.files["settings.json"].content;
        var libraries  = gistdata.data.files["libraries.json"].content;
        var jsonSets   = JSON.parse(settings);
        var jsonLibs   = JSON.parse(libraries);

        // Return font settings from json
        var siteTitle        = jsonSets.siteTitle;
        var WeaveVersion     = jsonSets.version;
        var editorFontSize   = jsonSets.editorFontSize;
        var WeaveDesc        = jsonSets.description;
        var WeaveAuthor      = jsonSets.author;

        $("[data-action=sitetitle]").val(siteTitle);
        $("[data-value=version]").val(WeaveVersion);
        $("[data-editor=fontSize]").val(editorFontSize);
        $("[data-action=sitedesc]").val(WeaveDesc);
        $("[data-action=siteauthor]").val(WeaveAuthor);
        storeValues();

        // Return settings from the json
        $(".metaboxes input.heading").trigger("keyup");

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
        if (htmlVal) {
          htmlEditor.setValue(htmlVal.content);
          $("#html-preprocessor").val("none").trigger("change");
        }
        if (jadeVal) {
          htmlEditor.setValue(jadeVal.content);
          $("#html-preprocessor").val("jade").trigger("change");
        }
        if (!htmlVal && !jadeVal) {
          htmlEditor.setValue("");
        }
        if (!htmlVal && !jadeVal && mdVal) {
          var selectEditor = document.getElementById("selectEditor");
          if (!selectEditor.checked) {
            $("#selectEditor").trigger("click");
            // Change grid to only show markdown
            $("#splitContainer").jqxSplitter({
              height: "auto",
              width: "100%",
              orientation: "vertical",
              showSplitBar: true,
              panels: [{ size: "50%",collapsible:false },
                       { size: "50%" }]
            });
            $("#leftSplitter").jqxSplitter({
              width: "100%",
              height: "100%",
              orientation: "horizontal",
              showSplitBar: true,
              panels: [{ size: "50%",collapsible:false },
                       { size: "0%" }]
            }).jqxSplitter("collapse");
            $("#rightSplitter").jqxSplitter({
              width: "100%",
              height: "100%",
              orientation: "horizontal",
              showSplitBar: true,
              panels: [{ size: "0%",collapsible:false },
                       { size: "50%" }]
            });
          }
        }
        if (cssVal) {
          cssEditor.setValue(cssVal.content);
          $("#css-preprocessor").val("none").trigger("change");
        }
        if (stylusVal) {
          cssEditor.setValue(stylusVal.content);
          $("#css-preprocessor").val("stylus").trigger("change");
        }
        if (lessVal) {
          cssEditor.setValue(lessVal.content);
          $("#css-preprocessor").val("less").trigger("change");
        }
        if (scssVal) {
          cssEditor.setValue(scssVal.content);
          $("#css-preprocessor").val("scss").trigger("change");
        }
        if (sassVal) {
          cssEditor.setValue(sassVal.content);
          $("#css-preprocessor").val("sass").trigger("change");
        }
        if (!cssVal && !stylusVal && !lessVal && !scssVal && !sassVal) {
          cssEditor.setValue("");
        }
        if (jsVal) {
          jsEditor.setValue(jsVal.content);
          $("#js-preprocessor").val("none").trigger("change");
        }
        if (coffeeVal) {
          jsEditor.setValue(coffeeVal.content);
          $("#js-preprocessor").val("coffeescript").trigger("change");
        }
        if (typescriptVal) {
          jsEditor.setValue(typescriptVal.content);
          $("#js-preprocessor").val("typescript").trigger("change");
        }
        if (babelVal) {
          jsEditor.setValue(babelVal.content);
          $("#js-preprocessor").val("babel").trigger("change");
        }
        if (!jsVal && !coffeeVal && !typescriptVal && !babelVal) {
          jsEditor.setValue("");
        }

        setTimeout(function() {
          mdEditor.setOption("paletteHints", "true");
          htmlEditor.setOption("paletteHints", "true");
          cssEditor.setOption("paletteHints", "true");
          jsEditor.setOption("paletteHints", "true");
        }, 300);
      }).error(function(e) {
        // ajax error
        console.warn("Error: Could not load weave!", e);
        alertify.error("Error: Could not load weave!");
      });
    },
    renderYourHTML = function() {
      var htmlSelected  = $("#html-preprocessor option:selected").val();

      if ( htmlSelected == "none") {
        yourHTML = htmlEditor.getValue();
      } else if ( htmlSelected == "jade") {
        var options = {
            pretty: true
        };
        yourHTML = jade.render(htmlEditor.getValue(), options);
      }
    },
    renderYourCSS = function() {
      cssSelected = $("#css-preprocessor option:selected").val();

      if ( cssSelected == "none") {
        yourCSS = cssEditor.getValue();
      } else if ( cssSelected == "stylus") {
        stylus(cssEditor.getValue()).render(function(err, out) {
          if(err !== null) {
            console.error("something went wrong");
          } else {
            yourCSS = out;
          }
        });
      } else if ( cssSelected == "less") {
        less.render(cssEditor.getValue(), function (e, output) {
          yourCSS = output.css;
        });
      } else if (cssSelected == "scss" || cssSelected == "sass") {
        var cssVal = cssEditor.getValue();

        sass.compile(cssVal, function(result) {
          yourCSS = result.text;
        });
      }
    },
    renderYourJS = function() {
      var jsSelected = $("#js-preprocessor option:selected").val();
      
      if ( jsSelected == "none") {
        yourJS = jsEditor.getValue();
      } else if ( jsSelected == "coffeescript") {
        yourJS = CoffeeScript.compile(jsEditor.getValue(), { bare: true });
      } else if ( jsSelected == "typescript") {
        yourJS = jsEditor.getValue();
      } else if ( jsSelected == "babel") {
        var result = Babel.transform(jsEditor.getValue(), {
          presets: ['latest', 'stage-2', 'react']
        });
        yourJS = result.code;
      }
    },
    singleFileDownload = function() {
      document.querySelector(".savehtml").onclick = function() {
        var htmlSelected = $("#html-preprocessor option:selected").val();

        if ( htmlSelected == "none") {
          yourHTML = htmlEditor.getValue();
          blob = new Blob([ yourHTML ], {type: "text/html"});
          saveFile(blob, "source.html");
        } else if ( htmlSelected == "jade") {
          blob = new Blob([ htmlEditor.getValue() ], {type: "text/x-jade"});
          saveFile(blob, "source.jade");
        }
        
        // Ask to support open source software.
        if (navigator.onLine) {
          alertify.message("<div class=\"grid\"><div class=\"centered grid__col--12 tc\"><h2>Help keep this free!</h2><a href=\"https://snaptee.co/t/2nezt/?r=fb&teeId=2nezt\" target=\"_blank\"><img src=\"assets/model-2.jpg\" width=\"100%\"></a><a class=\"btn--success\" href=\"https://snaptee.co/t/2nezt/?r=fb&teeId=2nezt\" target=\"_blank\" style=\"display: block;\">Buy Now</a></div></div>");
        }
      };
      document.querySelector(".savecss").onclick = function() {
        cssSelected = $("#css-preprocessor option:selected").val();

        if ( cssSelected == "none") {
          yourCSS = cssEditor.getValue();
          blob = new Blob([ yourCSS ], {type: "css"});
          saveFile(blob, "source.css");
        } else if ( cssSelected == "stylus") {
          blob = new Blob([ cssEditor.getValue() ], {type: "text/x-styl"});
          saveFile(blob, "source.styl");
        } else if ( cssSelected == "less") {
          blob = new Blob([ cssEditor.getValue() ], {type: "text/x-less"});
          saveFile(blob, "source.less");
        } else if ( cssSelected == "scss") {
          blob = new Blob([ cssEditor.getValue() ], {type: "text/x-scss"});
          saveFile(blob, "source.scss");
        } else if ( cssSelected == "sass") {
          blob = new Blob([ cssEditor.getValue() ], {type: "text/x-sass"});
          saveFile(blob, "source.sass");
        }
        
        // Ask to support open source software.
        if (navigator.onLine) {
          alertify.message("<div class=\"grid\"><div class=\"centered grid__col--12 tc\"><h2>Help keep this free!</h2><a href=\"https://snaptee.co/t/2nezt/?r=fb&teeId=2nezt\" target=\"_blank\"><img src=\"assets/model-2.jpg\" width=\"100%\"></a><a class=\"btn--success\" href=\"https://snaptee.co/t/2nezt/?r=fb&teeId=2nezt\" target=\"_blank\" style=\"display: block;\">Buy Now</a></div></div>");
        }
      };
      document.querySelector(".savejs").onclick = function() {
        var jsSelected = $("#js-preprocessor option:selected").val();

        if ( jsSelected == "none") {
          blob = new Blob([ jsEditor.getValue() ], {type: "text/javascript"});
          saveFile(blob, "source.js");
        } else if ( jsSelected == "coffeescript") {
          blob = new Blob([ jsEditor.getValue() ], {type: "text/x-coffeescript"});
          saveFile(blob, "source.coffee");
        } else if ( jsSelected == "typescript") {
          blob = new Blob([ jsEditor.getValue() ], {type: "text/typescript"});
          saveFile(blob, "source.ts");
        } else if ( jsSelected == "babel") {
          blob = new Blob([ jsEditor.getValue() ], {type: "text/javascript"});
          saveFile(blob, "source.jsx");
        }
        
        // Ask to support open source software.
        if (navigator.onLine) {
          alertify.message("<div class=\"grid\"><div class=\"centered grid__col--12 tc\"><h2>Help keep this free!</h2><a href=\"https://snaptee.co/t/2nezt/?r=fb&teeId=2nezt\" target=\"_blank\"><img src=\"assets/model-2.jpg\" width=\"100%\"></a><a class=\"btn--success\" href=\"https://snaptee.co/t/2nezt/?r=fb&teeId=2nezt\" target=\"_blank\" style=\"display: block;\">Buy Now</a></div></div>");
        }
      };
      document.querySelector(".savemd").onclick = function() {
        var blob = new Blob([ mdEditor.getValue() ], {type: "text/x-markdown"});
        saveFile(blob, "source.md");
        
        // Ask to support open source software.
        if (navigator.onLine) {
          alertify.message("<div class=\"grid\"><div class=\"centered grid__col--12 tc\"><h2>Help keep this free!</h2><a href=\"https://snaptee.co/t/2nezt/?r=fb&teeId=2nezt\" target=\"_blank\"><img src=\"assets/model-2.jpg\" width=\"100%\"></a><a class=\"btn--success\" href=\"https://snaptee.co/t/2nezt/?r=fb&teeId=2nezt\" target=\"_blank\" style=\"display: block;\">Buy Now</a></div></div>");
        }
      };
    },
    applyLowercase = function() {      
      if ($(".editoractionlist").is(':visible')) {
        $(".editoractionlist").addClass('hide');
      }
      if ( activeEditor.value === "htmlEditor" ) {
        selected_text = htmlEditor.getSelection().toLowerCase();  // Need to grab the Active Selection

        htmlEditor.replaceSelection(selected_text).focus();
      } else if ( activeEditor.value === "cssEditor" ) {
        selected_text = cssEditor.getSelection().toLowerCase();  // Need to grab the Active Selection

        cssEditor.replaceSelection(selected_text).focus();
      } else if ( activeEditor.value === "jsEditor" ) {
        selected_text = jsEditor.getSelection().toLowerCase();  // Need to grab the Active Selection

        jsEditor.replaceSelection(selected_text).focus();
      } else if ( activeEditor.value === "mdEditor" ) {
        selected_text = mdEditor.getSelection().toLowerCase();  // Need to grab the Active Selection

        mdEditor.replaceSelection(selected_text).focus();
      }
    },
    applyUppercase = function() {      
      if ($(".editoractionlist").is(':visible')) {
        $(".editoractionlist").addClass('hide');
      }
      if ( activeEditor.value === "htmlEditor" ) {
        selected_text = htmlEditor.getSelection().toUpperCase();  // Need to grab the Active Selection

        htmlEditor.replaceSelection(selected_text).focus();
      } else if ( activeEditor.value === "cssEditor" ) {
        selected_text = cssEditor.getSelection().toUpperCase();  // Need to grab the Active Selection

        cssEditor.replaceSelection(selected_text).focus();
      } else if ( activeEditor.value === "jsEditor" ) {
        selected_text = jsEditor.getSelection().toUpperCase();  // Need to grab the Active Selection

        jsEditor.replaceSelection(selected_text).focus();
      } else if ( activeEditor.value === "mdEditor" ) {
        selected_text = mdEditor.getSelection().toUpperCase();  // Need to grab the Active Selection

        mdEditor.replaceSelection(selected_text).focus();
      }
    },
    applyDuplication = function() {
      if ( activeEditor.value === "htmlEditor" ) {
        selected_text = htmlEditor.getSelection();  // Need to grab the Active Selection
        
        if (!selected_text) {
          var selectedText = htmlEditor.getLine(htmlEditor.getCursor().line)
          htmlEditor.replaceSelection('\n' + selectedText).focus();
        } else {
          htmlEditor.replaceSelection(selected_text + '\n' + selected_text).focus();
        }
      } else if ( activeEditor.value === "cssEditor" ) {
        selected_text = cssEditor.getSelection();  // Need to grab the Active Selection

        if (!selected_text) {
          var selectedText = cssEditor.getLine(cssEditor.getCursor().line)
          cssEditor.replaceSelection('\n' + selectedText).focus();
        } else {
          cssEditor.replaceSelection(selected_text + '\n' + selected_text).focus();
        }
      } else if ( activeEditor.value === "jsEditor" ) {
        selected_text = jsEditor.getSelection();  // Need to grab the Active Selection

        if (!selected_text) {
          var selectedText = jsEditor.getLine(jsEditor.getCursor().line)
          jsEditor.replaceSelection('\n' + selectedText).focus();
        } else {
          jsEditor.replaceSelection(selected_text + '\n' + selected_text).focus();
        }
      } else if ( activeEditor.value === "mdEditor" ) {
        selected_text = mdEditor.getSelection();  // Need to grab the Active Selection

        if (!selected_text) {
          var selectedText = mdEditor.getLine(mdEditor.getCursor().line)
          mdEditor.replaceSelection('\n' + selectedText).focus();
        } else {
          mdEditor.replaceSelection(selected_text + '\n' + selected_text).focus();
        }
      }
    },
    applyMinify = function() {      
      if ($(".editoractionlist").is(':visible')) {
        $(".editoractionlist").addClass('hide');
      }
      if ( activeEditor.value === "htmlEditor" ) {
        htmlEditor.setValue(htmlEditor.getValue().replace(/\<\!--\s*?[^\s?\[][\s\S]*?--\>/g,'').replace(/\>\s*\</g,'><'));
        $("input[name=menubar].active").trigger("click");
      } else if ( activeEditor.value === "cssEditor" ) {
        cssEditor.setValue( cssEditor.getValue().replace(/\/\*.*\*\/|\/\*[\s\S]*?\*\/|\n|\t|\v|\s{2,}/g,"").replace(/\s*\{\s*/g,"{").replace(/\s*\}\s*/g,"}").replace(/\s*\:\s*/g,":").replace(/\s*\;\s*/g,";").replace(/\s*\,\s*/g,",").replace(/\s*\~\s*/g,"~").replace(/\s*\>\s*/g,">").replace(/\s*\+\s*/g,"+").replace(/\s*\!\s*/g,"!") );
      } else if ( activeEditor.value === "jsEditor" ) {
        jsEditor.setValue( jsEditor.getValue().replace(/\/\*[\s\S]*?\*\/|\/\/.*\n|\s{2,}|\n|\t|\v|\s(?=function\(.*?\))|\s(?=\=)|\s(?=\{)/g,"").replace(/\s?function\s?\(/g,"function(").replace(/\s?\{\s?/g,"{").replace(/\s?\}\s?/g,"}").replace(/\,\s?/g,",").replace(/if\s?/g,"if") );
      }
    },
    applyBeautify = function() {      
      if ($(".editoractionlist").is(':visible')) {
        $(".editoractionlist").addClass('hide');
      }
      if ( activeEditor.value === "htmlEditor" ) {
        beautifyHTML();
      } else if ( activeEditor.value === "cssEditor" ) {
        beautifyCSS();
      } else if ( activeEditor.value === "jsEditor" ) {
        beautifyJS();
      }
    },
    OtherKeyResults = function() {
      $("[data-action=lowercase]").attr("title", "CTRL+'");
      $("[data-action=uppercase]").attr("title", "CTRL+\\");
      $("[data-action=gotoline]").attr("title", "Ctrl+L");
      $("[data-action=search]").attr("title", "CTRL+F");
      $("[data-action=replace]").attr("title", "Shift-Ctrl-F");
      $("[data-action=replaceall]").attr("title", "Shift-Ctrl-R");
      $("[data-action=minify]").attr("title", "Shift+Ctrl+'");
      $("[data-action=tidy]").attr("title", "Shift+Ctrl+\\");
      $("[data-action=toggle_comment]").attr("title", "Ctrl+/");
    },
    shortcutKeys = function() {
      // Load File
      shortcut.add("Ctrl+O", function() {
        $("[data-action=open-file]").trigger("click");
      });
      // New Document
      shortcut.add("Ctrl+N", function() {
        $(".check").attr("checked", false).trigger("change");
        $("[data-action=sitetitle]").val("site title").trigger("change");
        $("[data-action=sitedesc]").val("sample description").trigger("change");
        $("[data-action=siteauthor]").val("kodeWeave").trigger("change");
        htmlEditor.setValue("<!-- comment -->\nhello world!");
        cssEditor.setValue("");
        jsEditor.setValue("");
      });
      // Export layout hotkey
      shortcut.add("Ctrl+S", function() {
        $("[data-action=download-zip]").trigger("click");
      });
      // Reload Application
      shortcut.add("F5", function() {
        location.reload(true);
      });
      shortcut.add("Ctrl+R", function() {
        location.reload(true);
      });
      document.getElementById("restartapp").onclick = function() {
        location.reload(true);
      };
      // window.addEventListener("keydown", function(e) {
      // // New Document (CMD+N)
      //   if ( e.metaKey && e.keyCode == 78 ) {
      //     $(".check").attr("checked", false).trigger("change");
      //     htmlEditor.setValue("<!-- comment -->\nhello world!");
      //     cssEditor.setValue("");
      //     jsEditor.setValue("");
      //     mdEditor.setValue("");
      //   }
      // // Export as Zip (CMD+S)
      //   if ( e.metaKey && e.keyCode == 83 ) {
      //     $("[data-action=download-zip]").trigger("click");
      //   }
      // });

      if ( navigator.platform.indexOf('Mac') > -1 ) {
        $("[data-action=lowercase]").attr("title", "Cmd+'");
        $("[data-action=uppercase]").attr("title", "Cmd+\\");
        $("[data-action=gotoline]").attr("title", "Cmd+L");
        $("[data-action=search]").attr("title", "CMD+F");
        $("[data-action=replace]").attr("title", "Cmd+Option+F");
        $("[data-action=replaceall]").attr("title", "Shift+Cmd+Option+F");
        $("[data-action=minify]").attr("title", "Shift+Cmd+'");
        $("[data-action=tidy]").attr("title", "Shift+Cmd+\\");
        $("[data-action=toggle_comment]").attr("title", "Cmd+/");
      } else {
        OtherKeyResults();
      }
    },
    initGenerators = function() {
      // Tidy Up/Beautify Code
      document.querySelector("[data-action=tidy]").onclick = function() {
        // if ( activeEditor.value === "htmlEditor" ) {
        //   var htmlLines = htmlEditor.lineCount();
        //   htmlEditor.autoFormatRange({line:0, ch:0}, {line:htmlLines});
        // } else if ( activeEditor.value === "cssEditor" ) {
        //   var cssLines = cssEditor.lineCount();
        //   cssEditor.autoFormatRange({line:0, ch:0}, {line:cssLines});
        // } else if ( activeEditor.value === "jsEditor" ) {
        //   var jsLines = jsEditor.lineCount();
        //   jsEditor.autoFormatRange({line:0, ch:0}, {line:jsLines});
        // }

        applyBeautify();
        $(".editoractionlist").addClass('hide');
      };

      // Minify Code
      document.querySelector("[data-action=minify]").onclick = function() {
        applyMinify();
        $(".editoractionlist").addClass('hide');
      };

      // Go To Line
      document.querySelector("[data-action=gotoline]").onclick = function() {
        if ( activeEditor.value === "htmlEditor" ) {
          htmlEditor.execCommand("gotoLine");
        } else if ( activeEditor.value === "cssEditor" ) {
          cssEditor.execCommand("gotoLine");
        } else if ( activeEditor.value === "jsEditor" ) {
          jsEditor.execCommand("gotoLine");
        } else if ( activeEditor.value === "mdEditor" ) {
          mdEditor.execCommand("gotoLine");
        }
        $("input[name=menubar].active").trigger("click");
      };

      // Comment Current Selection
      document.querySelector("[data-action=toggle_comment]").onclick = function() {
        if ( activeEditor.value === "htmlEditor" ) {
          htmlEditor.execCommand("emmet.toggle_comment");
        } else if ( activeEditor.value === "cssEditor" ) {
          cssEditor.execCommand("emmet.toggle_comment");
        } else if ( activeEditor.value === "jsEditor" ) {
          jsEditor.execCommand("emmet.toggle_comment");
        } else if ( activeEditor.value === "mdEditor" ) {
          mdEditor.execCommand("emmet.toggle_comment");
        }
        $("input[name=menubar].active").trigger("click");
      };

      // Make text selection lowercase
      document.querySelector("[data-action=lowercase]").onclick = function() {
        applyLowercase();
        $(".editoractionlist").addClass('hide');
      };

      // Make text selection uppercase
      document.querySelector("[data-action=uppercase]").onclick = function() {
        applyUppercase();
        $(".editoractionlist").addClass('hide');
      };

      document.querySelector("[data-action=search]").onclick = function() {
        if ( activeEditor.value === "htmlEditor" ) {
          htmlEditor.execCommand("find");
        } else if ( activeEditor.value === "cssEditor" ) {
          cssEditor.execCommand("find");
        } else if ( activeEditor.value === "jsEditor" ) {
          jsEditor.execCommand("find");
        } else if ( activeEditor.value === "mdEditor" ) {
          mdEditor.execCommand("find");
        }
        $("input[name=menubar].active").trigger("click");
      };
      document.querySelector("[data-action=replace]").onclick = function() {
        if ( activeEditor.value === "htmlEditor" ) {
          htmlEditor.execCommand("replace");
        } else if ( activeEditor.value === "cssEditor" ) {
          cssEditor.execCommand("replace");
        } else if ( activeEditor.value === "jsEditor" ) {
          jsEditor.execCommand("replace");
        } else if ( activeEditor.value === "mdEditor" ) {
          mdEditor.execCommand("replace");
        }
        $("input[name=menubar].active").trigger("click");
      };
      document.querySelector("[data-action=replaceall]").onclick = function() {
        if ( activeEditor.value === "htmlEditor" ) {
          htmlEditor.execCommand("replaceAll");
        } else if ( activeEditor.value === "cssEditor" ) {
          cssEditor.execCommand("replaceAll");
        } else if ( activeEditor.value === "jsEditor" ) {
          jsEditor.execCommand("replaceAll");
        } else if ( activeEditor.value === "mdEditor" ) {
          mdEditor.execCommand("replaceAll");
        }
        $("input[name=menubar].active").trigger("click");
      };
    },
    newDocument = function() {
      document.querySelector("[data-action=newdocument]").onclick = function() {
        // localStorage.clear();
        localStorage.removeItem("htmlPreprocessorVal");
        localStorage.removeItem("cssPreprocessorVal");
        localStorage.removeItem("jsPreprocessorVal");
        localStorage.removeItem("htmlData");
        localStorage.removeItem("cssData");
        localStorage.removeItem("jsData");
        localStorage.removeItem("mdData");
        localStorage.removeItem("checkedInputs");
        localStorage.removeItem("checkedLibraries");
        localStorage.removeItem("JSValStatus");
        localStorage.removeItem("SaveJSValSwitch");
        localStorage.removeItem("siteTitle");
        localStorage.removeItem("appVersion");
        // localStorage.removeItem("fontSize");
        localStorage.removeItem("saveDesc");
        // localStorage.removeItem("saveAuthor");
        // localStorage.removeItem("gridSetting");
        localStorage.removeItem("closedWelcome");
        if (window.location.hash) {
          window.location.href = window.location.toString().split(/\?|#/)[0];
        } else {
          location.reload(true);
        }
      };
    },
    activateMD = function() {
      activeEditor.value = "mdEditor";
      if ($("#function").is(":hidden")) {
        $("#function").show();
      }
      $(".md-chars").removeClass("hide");
      if ( $(".main-editor-chars").is(":visible") ) {
        $(".md-chars").removeClass("hide");
        $(".main-editor-chars").addClass("hide");
      }
    },
    charGeneration = function() {
      document.getElementById("undo").onclick = function() {
        if ( activeEditor.value === "htmlEditor" ) {
          htmlEditor.undo();
        } else if ( activeEditor.value === "cssEditor" ) {
          cssEditor.undo();
        } else if ( activeEditor.value === "jsEditor" ) {
          jsEditor.undo();
        } else if ( activeEditor.value === "mdEditor" ) {
          mdEditor.undo();
        }
      };
      document.getElementById("redo").onclick = function() {
        if ( activeEditor.value === "htmlEditor" ) {
          htmlEditor.redo();
        } else if ( activeEditor.value === "cssEditor" ) {
          cssEditor.redo();
        } else if ( activeEditor.value === "jsEditor" ) {
          jsEditor.redo();
        } else if ( activeEditor.value === "mdEditor" ) {
          mdEditor.redo();
        }
      };
      document.getElementById("tabindent").onclick = function() {
        if ( activeEditor.value === "htmlEditor" ) {
          htmlEditor.execCommand("indentMore").focus();
        } else if ( activeEditor.value === "cssEditor" ) {
          cssEditor.execCommand("indentMore").focus();
        } else if ( activeEditor.value === "jsEditor" ) {
          jsEditor.execCommand("indentMore").focus();
        } else if ( activeEditor.value === "mdEditor" ) {
          mdEditor.execCommand("indentMore").focus();
        }
      };
      document.getElementById("taboutdent").onclick = function() {
        if ( activeEditor.value === "htmlEditor" ) {
          htmlEditor.execCommand("indentLess").focus();
        } else if ( activeEditor.value === "cssEditor" ) {
          cssEditor.execCommand("indentLess").focus();
        } else if ( activeEditor.value === "jsEditor" ) {
          jsEditor.execCommand("indentLess").focus();
        } else if ( activeEditor.value === "mdEditor" ) {
          mdEditor.execCommand("indentLess").focus();
        }
      };
      document.getElementById("zeninit").onclick = function() {
        if ( activeEditor.value === "htmlEditor" ) {
          htmlEditor.execCommand("emmet.expand_abbreviation_with_tab").focus();
        } else if ( activeEditor.value === "cssEditor" ) {
          cssEditor.execCommand("emmet.expand_abbreviation_with_tab").focus();
        } else if ( activeEditor.value === "jsEditor" ) {
          jsEditor.execCommand("emmet.expand_abbreviation_with_tab").focus();
        }
      };
      document.getElementById("charsym1").onclick = function() {
        if ( activeEditor.value === "htmlEditor" ) {
          if (!htmlEditor.getSelection().split(" ").join("")) {
            selected_text = htmlEditor.getSelection();  // Need to grab the Active Selection

            htmlEditor.replaceSelection("", htmlEditor.getCursor());
            htmlEditor.replaceRange("<>", htmlEditor.getCursor()).focus();
            str = ">";
            mynum = str.length;
            start_cursor = htmlEditor.getCursor();  // Need to get the cursor position
            cursorLine = start_cursor.line;
            cursorCh = start_cursor.ch;

            // Code to move cursor back [x] amount of spaces. [x] is the data-val value.
            htmlEditor.setCursor({line: cursorLine , ch : cursorCh -mynum });
            htmlEditor.replaceRange(selected_text, htmlEditor.getCursor()).focus();
          } else {
            selected_text = htmlEditor.getSelection();  // Need to grab the Active Selection

            htmlEditor.replaceSelection("<" + selected_text + ">").focus();
          }
        } else if ( activeEditor.value === "cssEditor" ) {
          if (!cssEditor.getSelection().split(" ").join("")) {
            selected_text = cssEditor.getSelection();  // Need to grab the Active Selection

            cssEditor.replaceSelection("", cssEditor.getCursor());
            cssEditor.replaceRange("<>", cssEditor.getCursor()).focus();
            str = ">";
            mynum = str.length;
            start_cursor = cssEditor.getCursor();  // Need to get the cursor position
            cursorLine = start_cursor.line;
            cursorCh = start_cursor.ch;

            // Code to move cursor back [x] amount of spaces. [x] is the data-val value.
            cssEditor.setCursor({line: cursorLine , ch : cursorCh -mynum });
            cssEditor.replaceRange(selected_text, cssEditor.getCursor()).focus();
          } else {
            selected_text = cssEditor.getSelection();  // Need to grab the Active Selection

            cssEditor.replaceSelection("<" + selected_text + ">").focus();
          }
        } else if ( activeEditor.value === "jsEditor" ) {
          if (!jsEditor.getSelection().split(" ").join("")) {
            selected_text = jsEditor.getSelection();  // Need to grab the Active Selection

            jsEditor.replaceSelection("", jsEditor.getCursor());
            jsEditor.replaceRange("<>", jsEditor.getCursor()).focus();
            str = ">";
            mynum = str.length;
            start_cursor = jsEditor.getCursor();  // Need to get the cursor position
            cursorLine = start_cursor.line;
            cursorCh = start_cursor.ch;

            // Code to move cursor back [x] amount of spaces. [x] is the data-val value.
            jsEditor.setCursor({line: cursorLine , ch : cursorCh -mynum });
            jsEditor.replaceRange(selected_text, jsEditor.getCursor()).focus();
          } else {
            selected_text = jsEditor.getSelection();  // Need to grab the Active Selection

            jsEditor.replaceSelection("<" + selected_text + ">").focus();
          }
        } else if ( activeEditor.value === "mdEditor" ) {
          if (!mdEditor.getSelection().split(" ").join("")) {
            selected_text = mdEditor.getSelection();  // Need to grab the Active Selection

            mdEditor.replaceSelection("", mdEditor.getCursor());
            mdEditor.replaceRange("<>", mdEditor.getCursor()).focus();
            str = ">";
            mynum = str.length;
            start_cursor = mdEditor.getCursor();  // Need to get the cursor position
            cursorLine = start_cursor.line;
            cursorCh = start_cursor.ch;

            // Code to move cursor back [x] amount of spaces. [x] is the data-val value.
            mdEditor.setCursor({line: cursorLine , ch : cursorCh -mynum });
            mdEditor.replaceRange(selected_text, mdEditor.getCursor()).focus();
          } else {
            selected_text = mdEditor.getSelection();  // Need to grab the Active Selection

            mdEditor.replaceSelection("<" + selected_text + ">").focus();
          }
        }
      };
      document.getElementById("charsym2").onclick = function() {
        if ( activeEditor.value === "htmlEditor" ) {
          if (!htmlEditor.getSelection().split(" ").join("")) {
            selected_text = htmlEditor.getSelection();  // Need to grab the Active Selection

            htmlEditor.replaceSelection("", htmlEditor.getCursor());
            htmlEditor.replaceRange("{}", htmlEditor.getCursor()).focus();
            str = "}";
            mynum = str.length;
            start_cursor = htmlEditor.getCursor();  // Need to get the cursor position
            cursorLine = start_cursor.line;
            cursorCh = start_cursor.ch;

            // Code to move cursor back [x] amount of spaces. [x] is the data-val value.
            htmlEditor.setCursor({line: cursorLine , ch : cursorCh -mynum });
            htmlEditor.replaceRange(selected_text, htmlEditor.getCursor()).focus();
          } else {
            selected_text = htmlEditor.getSelection();  // Need to grab the Active Selection

            htmlEditor.replaceSelection("{" + selected_text + "}").focus();
          }
        } else if ( activeEditor.value === "cssEditor" ) {
          if (!cssEditor.getSelection().split(" ").join("")) {
            selected_text = cssEditor.getSelection();  // Need to grab the Active Selection

            cssEditor.replaceSelection("", cssEditor.getCursor());
            cssEditor.replaceRange("{}", cssEditor.getCursor()).focus();
            str = "}";
            mynum = str.length;
            start_cursor = cssEditor.getCursor();  // Need to get the cursor position
            cursorLine = start_cursor.line;
            cursorCh = start_cursor.ch;

            // Code to move cursor back [x] amount of spaces. [x] is the data-val value.
            cssEditor.setCursor({line: cursorLine , ch : cursorCh -mynum });
            cssEditor.replaceRange(selected_text, cssEditor.getCursor()).focus();
          } else {
            selected_text = cssEditor.getSelection();  // Need to grab the Active Selection

            cssEditor.replaceSelection("{" + selected_text + "}").focus();
          }
        } else if ( activeEditor.value === "jsEditor" ) {
          if (!jsEditor.getSelection().split(" ").join("")) {
            selected_text = jsEditor.getSelection();  // Need to grab the Active Selection

            jsEditor.replaceSelection("", jsEditor.getCursor());
            jsEditor.replaceRange("{}", jsEditor.getCursor()).focus();
            str = "}";
            mynum = str.length;
            start_cursor = jsEditor.getCursor();  // Need to get the cursor position
            cursorLine = start_cursor.line;
            cursorCh = start_cursor.ch;

            // Code to move cursor back [x] amount of spaces. [x] is the data-val value.
            jsEditor.setCursor({line: cursorLine , ch : cursorCh -mynum });
            jsEditor.replaceRange(selected_text, jsEditor.getCursor()).focus();
          } else {
            selected_text = jsEditor.getSelection();  // Need to grab the Active Selection

            jsEditor.replaceSelection("{" + selected_text + "}").focus();
          }
        } else if ( activeEditor.value === "mdEditor" ) {
          if (!mdEditor.getSelection().split(" ").join("")) {
            selected_text = mdEditor.getSelection();  // Need to grab the Active Selection

            mdEditor.replaceSelection("", mdEditor.getCursor());
            mdEditor.replaceRange("{}", mdEditor.getCursor()).focus();
            str = "}";
            mynum = str.length;
            start_cursor = mdEditor.getCursor();  // Need to get the cursor position
            cursorLine = start_cursor.line;
            cursorCh = start_cursor.ch;

            // Code to move cursor back [x] amount of spaces. [x] is the data-val value.
            mdEditor.setCursor({line: cursorLine , ch : cursorCh -mynum });
            mdEditor.replaceRange(selected_text, mdEditor.getCursor()).focus();
          } else {
            selected_text = mdEditor.getSelection();  // Need to grab the Active Selection

            mdEditor.replaceSelection("{" + selected_text + "}").focus();
          }
        }
      };
      document.getElementById("charsym3").onclick = function() {
        if ( activeEditor.value === "htmlEditor" ) {
          if (!htmlEditor.getSelection().split(" ").join("")) {
            selected_text = htmlEditor.getSelection();  // Need to grab the Active Selection

            htmlEditor.replaceSelection("", htmlEditor.getCursor());
            htmlEditor.replaceRange('""', htmlEditor.getCursor()).focus();
            str = '"';
            mynum = str.length;
            start_cursor = htmlEditor.getCursor();  // Need to get the cursor position
            cursorLine = start_cursor.line;
            cursorCh = start_cursor.ch;

            // Code to move cursor back [x] amount of spaces. [x] is the data-val value.
            htmlEditor.setCursor({line: cursorLine , ch : cursorCh -mynum });
            htmlEditor.replaceRange(selected_text, htmlEditor.getCursor()).focus();
          } else {
            selected_text = htmlEditor.getSelection();  // Need to grab the Active Selection

            htmlEditor.replaceSelection('"' + selected_text + '"').focus();
          }
        } else if ( activeEditor.value === "cssEditor" ) {
          if (!cssEditor.getSelection().split(" ").join("")) {
            selected_text = cssEditor.getSelection();  // Need to grab the Active Selection

            cssEditor.replaceSelection("", cssEditor.getCursor());
            cssEditor.replaceRange('""', cssEditor.getCursor()).focus();
            str = '"';
            mynum = str.length;
            start_cursor = cssEditor.getCursor();  // Need to get the cursor position
            cursorLine = start_cursor.line;
            cursorCh = start_cursor.ch;

            // Code to move cursor back [x] amount of spaces. [x] is the data-val value.
            cssEditor.setCursor({line: cursorLine , ch : cursorCh -mynum });
            cssEditor.replaceRange(selected_text, cssEditor.getCursor()).focus();
          } else {
            selected_text = cssEditor.getSelection();  // Need to grab the Active Selection

            cssEditor.replaceSelection('"' + selected_text + '"').focus();
          }
        } else if ( activeEditor.value === "jsEditor" ) {
          if (!jsEditor.getSelection().split(" ").join("")) {
            selected_text = jsEditor.getSelection();  // Need to grab the Active Selection

            jsEditor.replaceSelection("", jsEditor.getCursor());
            jsEditor.replaceRange('""', jsEditor.getCursor()).focus();
            str = '"';
            mynum = str.length;
            start_cursor = jsEditor.getCursor();  // Need to get the cursor position
            cursorLine = start_cursor.line;
            cursorCh = start_cursor.ch;

            // Code to move cursor back [x] amount of spaces. [x] is the data-val value.
            jsEditor.setCursor({line: cursorLine , ch : cursorCh -mynum });
            jsEditor.replaceRange(selected_text, jsEditor.getCursor()).focus();
          } else {
            selected_text = jsEditor.getSelection();  // Need to grab the Active Selection

            jsEditor.replaceSelection('"' + selected_text + '"').focus();
          }
        } else if ( activeEditor.value === "mdEditor" ) {
          if (!mdEditor.getSelection().split(" ").join("")) {
            selected_text = mdEditor.getSelection();  // Need to grab the Active Selection

            mdEditor.replaceSelection("", mdEditor.getCursor());
            mdEditor.replaceRange('""', mdEditor.getCursor()).focus();
            str = '"';
            mynum = str.length;
            start_cursor = mdEditor.getCursor();  // Need to get the cursor position
            cursorLine = start_cursor.line;
            cursorCh = start_cursor.ch;

            // Code to move cursor back [x] amount of spaces. [x] is the data-val value.
            mdEditor.setCursor({line: cursorLine , ch : cursorCh -mynum });
            mdEditor.replaceRange(selected_text, mdEditor.getCursor()).focus();
          } else {
            selected_text = mdEditor.getSelection();  // Need to grab the Active Selection

            mdEditor.replaceSelection('"' + selected_text + '"').focus();
          }
        }
      };
      document.getElementById("charsym4").onclick = function() {
        if ( activeEditor.value === "htmlEditor" ) {
          if (!htmlEditor.getSelection().split(" ").join("")) {
            selected_text = htmlEditor.getSelection();  // Need to grab the Active Selection

            htmlEditor.replaceSelection("", htmlEditor.getCursor());
            htmlEditor.replaceRange("''", htmlEditor.getCursor()).focus();
            str = "'";
            mynum = str.length;
            start_cursor = htmlEditor.getCursor();  // Need to get the cursor position
            cursorLine = start_cursor.line;
            cursorCh = start_cursor.ch;

            // Code to move cursor back [x] amount of spaces. [x] is the data-val value.
            htmlEditor.setCursor({line: cursorLine , ch : cursorCh -mynum });
            htmlEditor.replaceRange(selected_text, htmlEditor.getCursor()).focus();
          } else {
            selected_text = htmlEditor.getSelection();  // Need to grab the Active Selection

            htmlEditor.replaceSelection("'" + selected_text + "'").focus();
          }
        } else if ( activeEditor.value === "cssEditor" ) {
          if (!cssEditor.getSelection().split(" ").join("")) {
            selected_text = cssEditor.getSelection();  // Need to grab the Active Selection

            cssEditor.replaceSelection("", cssEditor.getCursor());
            cssEditor.replaceRange("''", cssEditor.getCursor()).focus();
            str = "'";
            mynum = str.length;
            start_cursor = cssEditor.getCursor();  // Need to get the cursor position
            cursorLine = start_cursor.line;
            cursorCh = start_cursor.ch;

            // Code to move cursor back [x] amount of spaces. [x] is the data-val value.
            cssEditor.setCursor({line: cursorLine , ch : cursorCh -mynum });
            cssEditor.replaceRange(selected_text, cssEditor.getCursor()).focus();
          } else {
            selected_text = cssEditor.getSelection();  // Need to grab the Active Selection

            cssEditor.replaceSelection("'" + selected_text + "'").focus();
          }
        } else if ( activeEditor.value === "jsEditor" ) {
          if (!jsEditor.getSelection().split(" ").join("")) {
            selected_text = jsEditor.getSelection();  // Need to grab the Active Selection

            jsEditor.replaceSelection("", jsEditor.getCursor());
            jsEditor.replaceRange("''", jsEditor.getCursor()).focus();
            str = "'";
            mynum = str.length;
            start_cursor = jsEditor.getCursor();  // Need to get the cursor position
            cursorLine = start_cursor.line;
            cursorCh = start_cursor.ch;

            // Code to move cursor back [x] amount of spaces. [x] is the data-val value.
            jsEditor.setCursor({line: cursorLine , ch : cursorCh -mynum });
            jsEditor.replaceRange(selected_text, jsEditor.getCursor()).focus();
          } else {
            selected_text = jsEditor.getSelection();  // Need to grab the Active Selection

            jsEditor.replaceSelection("'" + selected_text + "'").focus();
          }
        } else if ( activeEditor.value === "mdEditor" ) {
          if (!mdEditor.getSelection().split(" ").join("")) {
            selected_text = mdEditor.getSelection();  // Need to grab the Active Selection

            mdEditor.replaceSelection("", mdEditor.getCursor());
            mdEditor.replaceRange("''", mdEditor.getCursor()).focus();
            str = "'";
            mynum = str.length;
            start_cursor = mdEditor.getCursor();  // Need to get the cursor position
            cursorLine = start_cursor.line;
            cursorCh = start_cursor.ch;

            // Code to move cursor back [x] amount of spaces. [x] is the data-val value.
            mdEditor.setCursor({line: cursorLine , ch : cursorCh -mynum });
            mdEditor.replaceRange(selected_text, mdEditor.getCursor()).focus();
          } else {
            selected_text = mdEditor.getSelection();  // Need to grab the Active Selection

            mdEditor.replaceSelection("'" + selected_text + "'").focus();
          }
        }
      };
      document.getElementById("charsym5").onclick = function() {
        if ( activeEditor.value === "htmlEditor" ) {
          if (!htmlEditor.getSelection().split(" ").join("")) {
            selected_text = htmlEditor.getSelection();  // Need to grab the Active Selection

            htmlEditor.replaceSelection("", htmlEditor.getCursor());
            htmlEditor.replaceRange("()", htmlEditor.getCursor()).focus();
            str = ")";
            mynum = str.length;
            start_cursor = htmlEditor.getCursor();  // Need to get the cursor position
            cursorLine = start_cursor.line;
            cursorCh = start_cursor.ch;

            // Code to move cursor back [x] amount of spaces. [x] is the data-val value.
            htmlEditor.setCursor({line: cursorLine , ch : cursorCh -mynum });
            htmlEditor.replaceRange(selected_text, htmlEditor.getCursor()).focus();
          } else {
            selected_text = htmlEditor.getSelection();  // Need to grab the Active Selection

            htmlEditor.replaceSelection("(" + selected_text + ")").focus();
          }
        } else if ( activeEditor.value === "cssEditor" ) {
          if (!cssEditor.getSelection().split(" ").join("")) {
            selected_text = cssEditor.getSelection();  // Need to grab the Active Selection

            cssEditor.replaceSelection("", cssEditor.getCursor());
            cssEditor.replaceRange("()", cssEditor.getCursor()).focus();
            str = ")";
            mynum = str.length;
            start_cursor = cssEditor.getCursor();  // Need to get the cursor position
            cursorLine = start_cursor.line;
            cursorCh = start_cursor.ch;

            // Code to move cursor back [x] amount of spaces. [x] is the data-val value.
            cssEditor.setCursor({line: cursorLine , ch : cursorCh -mynum });
            cssEditor.replaceRange(selected_text, cssEditor.getCursor()).focus();
          } else {
            selected_text = cssEditor.getSelection();  // Need to grab the Active Selection

            cssEditor.replaceSelection("(" + selected_text + ")").focus();
          }
        } else if ( activeEditor.value === "jsEditor" ) {
          if (!jsEditor.getSelection().split(" ").join("")) {
            selected_text = jsEditor.getSelection();  // Need to grab the Active Selection

            jsEditor.replaceSelection("", jsEditor.getCursor());
            jsEditor.replaceRange("()", jsEditor.getCursor()).focus();
            str = ")";
            mynum = str.length;
            start_cursor = jsEditor.getCursor();  // Need to get the cursor position
            cursorLine = start_cursor.line;
            cursorCh = start_cursor.ch;

            // Code to move cursor back [x] amount of spaces. [x] is the data-val value.
            jsEditor.setCursor({line: cursorLine , ch : cursorCh -mynum });
            jsEditor.replaceRange(selected_text, jsEditor.getCursor()).focus();
          } else {
            selected_text = jsEditor.getSelection();  // Need to grab the Active Selection

            jsEditor.replaceSelection("(" + selected_text + ")").focus();
          }
        } else if ( activeEditor.value === "mdEditor" ) {
          if (!mdEditor.getSelection().split(" ").join("")) {
            selected_text = mdEditor.getSelection();  // Need to grab the Active Selection

            mdEditor.replaceSelection("", mdEditor.getCursor());
            mdEditor.replaceRange("()", mdEditor.getCursor()).focus();
            str = ")";
            mynum = str.length;
            start_cursor = mdEditor.getCursor();  // Need to get the cursor position
            cursorLine = start_cursor.line;
            cursorCh = start_cursor.ch;

            // Code to move cursor back [x] amount of spaces. [x] is the data-val value.
            mdEditor.setCursor({line: cursorLine , ch : cursorCh -mynum });
            mdEditor.replaceRange(selected_text, mdEditor.getCursor()).focus();
          } else {
            selected_text = mdEditor.getSelection();  // Need to grab the Active Selection

            mdEditor.replaceSelection("(" + selected_text + ")").focus();
          }
        }
      };
      document.getElementById("charsym6").onclick = function() {
        if ( activeEditor.value === "htmlEditor" ) {
          if (!htmlEditor.getSelection().split(" ").join("")) {
            selected_text = htmlEditor.getSelection();  // Need to grab the Active Selection

            htmlEditor.replaceSelection("", htmlEditor.getCursor());
            htmlEditor.replaceRange("[]", htmlEditor.getCursor()).focus();
            str = "]";
            mynum = str.length;
            start_cursor = htmlEditor.getCursor();  // Need to get the cursor position
            cursorLine = start_cursor.line;
            cursorCh = start_cursor.ch;

            // Code to move cursor back [x] amount of spaces. [x] is the data-val value.
            htmlEditor.setCursor({line: cursorLine , ch : cursorCh -mynum });
            htmlEditor.replaceRange(selected_text, htmlEditor.getCursor()).focus();
          } else {
            selected_text = htmlEditor.getSelection();  // Need to grab the Active Selection

            htmlEditor.replaceSelection("[" + selected_text + "]").focus();
          }
        } else if ( activeEditor.value === "cssEditor" ) {
          if (!cssEditor.getSelection().split(" ").join("")) {
            selected_text = cssEditor.getSelection();  // Need to grab the Active Selection

            cssEditor.replaceSelection("", cssEditor.getCursor());
            cssEditor.replaceRange("[]", cssEditor.getCursor()).focus();
            str = "]";
            mynum = str.length;
            start_cursor = cssEditor.getCursor();  // Need to get the cursor position
            cursorLine = start_cursor.line;
            cursorCh = start_cursor.ch;

            // Code to move cursor back [x] amount of spaces. [x] is the data-val value.
            cssEditor.setCursor({line: cursorLine , ch : cursorCh -mynum });
            cssEditor.replaceRange(selected_text, cssEditor.getCursor()).focus();
          } else {
            selected_text = cssEditor.getSelection();  // Need to grab the Active Selection

            cssEditor.replaceSelection("[" + selected_text + "]").focus();
          }
        } else if ( activeEditor.value === "jsEditor" ) {
          if (!jsEditor.getSelection().split(" ").join("")) {
            selected_text = jsEditor.getSelection();  // Need to grab the Active Selection

            jsEditor.replaceSelection("", jsEditor.getCursor());
            jsEditor.replaceRange("[]", jsEditor.getCursor()).focus();
            str = "]";
            mynum = str.length;
            start_cursor = jsEditor.getCursor();  // Need to get the cursor position
            cursorLine = start_cursor.line;
            cursorCh = start_cursor.ch;

            // Code to move cursor back [x] amount of spaces. [x] is the data-val value.
            jsEditor.setCursor({line: cursorLine , ch : cursorCh -mynum });
            jsEditor.replaceRange(selected_text, jsEditor.getCursor()).focus();
          } else {
            selected_text = jsEditor.getSelection();  // Need to grab the Active Selection

            jsEditor.replaceSelection("[" + selected_text + "]").focus();
          }
        } else if ( activeEditor.value === "mdEditor" ) {
          if (!mdEditor.getSelection().split(" ").join("")) {
            selected_text = mdEditor.getSelection();  // Need to grab the Active Selection

            mdEditor.replaceSelection("", mdEditor.getCursor());
            mdEditor.replaceRange("[]", mdEditor.getCursor()).focus();
            str = "]";
            mynum = str.length;
            start_cursor = mdEditor.getCursor();  // Need to get the cursor position
            cursorLine = start_cursor.line;
            cursorCh = start_cursor.ch;

            // Code to move cursor back [x] amount of spaces. [x] is the data-val value.
            mdEditor.setCursor({line: cursorLine , ch : cursorCh -mynum });
            mdEditor.replaceRange(selected_text, mdEditor.getCursor()).focus();
          } else {
            selected_text = mdEditor.getSelection();  // Need to grab the Active Selection

            mdEditor.replaceSelection("[" + selected_text + "]").focus();
          }
        }
      };
      document.getElementById("function").onclick = function() {
        if ( activeEditor.value === "htmlEditor" ) {
          selected_text = htmlEditor.getSelection();  // Need to grab the Active Selection

          htmlEditor.replaceSelection("function() {}").focus();
        } else if ( activeEditor.value === "cssEditor" ) {
          alertify.alert("Can't add <strong>\"function() {}\"</strong> into CSS").set("basic", true);
        } else if ( activeEditor.value === "jsEditor" ) {
          selected_text = jsEditor.getSelection();  // Need to grab the Active Selection

          jsEditor.replaceSelection("function() {}").focus();
        }
      };
      $("[data-add=sym]").on("click", function() {
        if ( activeEditor.value === "htmlEditor" ) {
          selected_text = htmlEditor.getSelection();  // Need to grab the Active Selection

          htmlEditor.replaceSelection(selected_text + this.textContent).focus();
        } else if ( activeEditor.value === "cssEditor" ) {
          selected_text = cssEditor.getSelection();  // Need to grab the Active Selection

          cssEditor.replaceSelection(selected_text + this.textContent).focus();
        } else if ( activeEditor.value === "jsEditor" ) {
          selected_text = jsEditor.getSelection();  // Need to grab the Active Selection

          jsEditor.replaceSelection(selected_text + this.textContent).focus();
        } else if ( activeEditor.value === "mdEditor" ) {
          selected_text = mdEditor.getSelection();  // Need to grab the Active Selection

          mdEditor.replaceSelection(selected_text + this.textContent).focus();
        }
      });

      // WYSIWYG Editor for Markdown
      document.getElementById("lorem").onclick = function() {
        selected_text = mdEditor.getSelection();  // Need to grab the Active Selection

        mdEditor.replaceSelection("Lorem ipsum dolor sit amet, consectetur adipisicing elit. Totam impedit dolore magnam dolor, atque quia dicta voluptatum. Nam impedit distinctio, tempore molestiae voluptatibus ducimus ullam! Molestiae consectetur, recusandae labore? Cupiditate.").focus();
      };
      document.getElementById("bold").onclick = function() {
        selected_text = mdEditor.getSelection();  // Need to grab the Active Selection

        mdEditor.replaceSelection("**" + selected_text + "**").focus();
      };
      document.getElementById("italic").onclick = function() {
        selected_text = mdEditor.getSelection();  // Need to grab the Active Selection

        mdEditor.replaceSelection("*" + selected_text + "*").focus();
      };
      document.getElementById("strike").onclick = function() {
        selected_text = mdEditor.getSelection();  // Need to grab the Active Selection

        mdEditor.replaceSelection("<strike>" + selected_text + "</strike>").focus();
      };
      document.getElementById("anchor").onclick = function() {
        alertify.prompt("Enter URL Below", "",
        function(evt, value) {
          selected_text = mdEditor.getSelection();  // Need to grab the Active Selection

          mdEditor.replaceSelection("");
          mdEditor.replaceSelection("["+ selected_text +"]("+ value +")").focus();
        },
        function() {
          // User clicked cancel
        }).set('basic', true);
      };
      document.getElementById("quote").onclick = function() {
        selected_text = mdEditor.getSelection();  // Need to grab the Active Selection

        mdEditor.replaceSelection("\n  > " + selected_text.replace(/\n/g,'\n  > ')).focus();
      };
      document.getElementById("code").onclick = function() {
        selected_text = mdEditor.getSelection();  // Need to grab the Active Selection

        mdEditor.replaceSelection("`" + selected_text + "`").focus();
      };
      document.getElementById("img").onclick = function() {
        alertify.prompt("Enter Image URL Below", "",
        function(evt, value) {
          selected_text = mdEditor.getSelection();  // Need to grab the Active Selection

          mdEditor.replaceSelection("");
          mdEditor.replaceSelection("!["+ selected_text +"]("+ value +")").focus();
        },
        function() {
          // User clicked cancel
        }).set('basic', true);
      };
      document.getElementById("list-ol").onclick = function() {
        selected_text = mdEditor.getSelection();  // Need to grab the Active Selection

        var i, len, text;
        for (i = 0, len = selected_text.split("\n").length, text = ""; i < len; i++) {
            text += i + 1 + ". " + selected_text.split("\n")[i] + "\n  ";
        }
        mdEditor.replaceSelection("\n  " + text).focus();
      };
      document.getElementById("list-ul").onclick = function() {
        selected_text = mdEditor.getSelection();  // Need to grab the Active Selection

        mdEditor.replaceSelection("\n  - " + selected_text.replace(/\n/g,'\n  - ')).focus();
      };
      document.getElementById("h1").onclick = function() {
        selected_text = mdEditor.getSelection();  // Need to grab the Active Selection

        mdEditor.replaceSelection("# " + selected_text).focus();
      };
      document.getElementById("h2").onclick = function() {
        selected_text = mdEditor.getSelection();  // Need to grab the Active Selection

        mdEditor.replaceSelection("## " + selected_text).focus();
      };
      document.getElementById("h3").onclick = function() {
        selected_text = mdEditor.getSelection();  // Need to grab the Active Selection

        mdEditor.replaceSelection("### " + selected_text).focus();
      };
      document.getElementById("h4").onclick = function() {
        selected_text = mdEditor.getSelection();  // Need to grab the Active Selection

        mdEditor.replaceSelection("#### " + selected_text).focus();
      };
      document.getElementById("h5").onclick = function() {
        selected_text = mdEditor.getSelection();  // Need to grab the Active Selection

        mdEditor.replaceSelection("##### " + selected_text).focus();
      };
      document.getElementById("h6").onclick = function() {
        selected_text = mdEditor.getSelection();  // Need to grab the Active Selection

        mdEditor.replaceSelection("###### " + selected_text).focus();
      };
      document.getElementById("hr").onclick = function() {
        selected_text = mdEditor.getSelection();  // Need to grab the Active Selection

        mdEditor.replaceSelection(selected_text + "\n\n----------\n\n").focus();
      };
    },
    initdataURLGrabber = function() {
      var logo            = document.querySelector("[data-action=dataurloutput]"),
          imgUrl          = document.querySelector("[data-url=dataurlimgurl]"),
          dataurlholder   = document.getElementById("dataurlholder"),
          JSimgUrl        = document.querySelector("[data-url=dataurlimgurl]");

      $("#dataurl").on("change", function() {
        (this.checked) ? $("input[name=menubar].active").trigger("click") : "";
      });

      // Save Site Title Value for LocalStorage
      function displayDURL(file) {
        var reader = new FileReader();

        reader.onload = function(e) {
          var img = new Image();
          img.src = e.target.result;
          img.onload = function() {
            var dataUrl = e.target.result;
            logo.src = dataUrl;
            imgUrl.value = logo.src;
          };
        };
        reader.readAsDataURL(file);
      }

      // Select all dataurl when textbox clicked
      JSimgUrl.onfocus = function() {
        this.select();
        return false;
      };

      $("#inputdataurl").change(function(e) {
        var file = e.target.files[0];
        displayDURL(file);
        $(".checkdataurl").removeClass("hide");
      });

      // Drag and drop image load
      dataurlholder.ondragover = function () {
        this.className = "block fn txtcenter pointer hover";
        return false;
      };
      dataurlholder.ondragend = function () {
        this.className = "block fn txtcenter pointer";
        return false;
      };
      dataurlholder.ondrop = function(e) {
        this.className = "block fn txtcenter pointer";
        e.preventDefault();
        var file = e.dataTransfer.files[0];
        displayDURL(file);
        $(".checkdataurl").removeClass("hide");
      };

      // Insert DataURL into Active Editor
      document.querySelector("[data-action=dataURLtoEditor]").onclick = function() {
        if ( activeEditor.value === "htmlEditor" ) {
          htmlEditor.replaceSelection(imgUrl.value);
          htmlEditor.focus();
        } else if ( activeEditor.value === "cssEditor" ) {
          cssEditor.replaceSelection(imgUrl.value);
          cssEditor.focus();
        } else if ( activeEditor.value === "jsEditor" ) {
          jsEditor.replaceSelection(imgUrl.value);
          jsEditor.focus();
        } else if ( activeEditor.value === "mdEditor" ) {
          mdEditor.replaceSelection(imgUrl.value);
          mdEditor.focus();
        }
        $("#dataurl").trigger("click");
      };
    },
    responsiveUI = function() {
      // Splitter Theme
      $("#mainSplitter, #splitContainer, #leftSplitter, #rightSplitter").jqxSplitter({
        theme: "metro"
      });
      
      // Handle dropdown list for Editors
      $("[data-call=dropdown]").click(function(e) {
        $("input[name=menubar].active").trigger("click");
        
        if ($(this).hasClass('openeddropdown')) {
          $(".editoractionlist").addClass('hide');
          $(this).removeClass('openeddropdown');
          return false;
        } else if ($("[data-call=dropdown].openeddropdown").is(":visible")) {
          $("[data-call=dropdown]").removeClass('openeddropdown');
          return false;
        }

        // If no preprocessor is selected dont show compile
        var htmlSelected = $("#html-preprocessor option:selected").val();
        var cssSelected  = $("#css-preprocessor  option:selected").val();
        var jsSelected   = $("#js-preprocessor   option:selected").val();
        
        // Check HTML
        if ($(this).hasClass("htmlarea")) {
          if ( activeEditor.value == "mdEditor") {
            mdEditor.focus();
            $(".editoractionlist li").addClass('hide');
            $(".texttransform").removeClass('hide');
            offset = $(this).offset();
            $(".editoractionlist").css({
              top: offset.top + 21 - 4,
              left: offset.left - $(".editoractionlist").width() + 10
            });
          } else {
            htmlEditor.focus();
            activeEditor.value = 'htmlEditor';
          }
          if (activeEditor.value == "htmlEditor") {
            if ( htmlSelected == "none") {
              htmlEditor.focus();
              activeEditor.value = 'htmlEditor';
              $(".viewcompiledcode").text('Run html2jade');
              $(".minifycode, .tidycode").removeClass('hide');
              $("[data-action=tidy]").text('Tidy HTML');
              $("[data-action=minify]").text('Minify HTML');
              offset = $(this).offset();
              $(".editoractionlist").css({
                top: offset.top + 21 - 4,
                left: offset.left - $(".editoractionlist").width() + 10
              });
            } else if ( htmlSelected == "jade") {
              htmlEditor.focus();
              activeEditor.value = 'htmlEditor';
              $(".viewcompiledcode").removeClass('hide');
              $(".minifycode, .tidycode").removeClass('hide');
              if (htmlSelected == "jade") {
                $(".minifycode, .tidycode").addClass('hide');
              }
              $(".viewcompiledcode").text('Convert ' + $("#html-preprocessor option:selected").val() + ' to HTML');
              $("[data-action=tidy]").text('Tidy ' + $("#html-preprocessor option:selected").val());
              $("[data-action=minify]").text('Minify ' + $("#html-preprocessor option:selected").val());
              offset = $(this).offset();
              $(".editoractionlist").css({
                top: offset.top + 21 - 4,
                left: offset.left - $(".editoractionlist").width() + 10
              });
            }
          }
        }
        // Check CSS
        if ($(this).hasClass("cssarea")) {
          cssEditor.focus();
          activeEditor.value = 'cssEditor';
          if (activeEditor.value == "cssEditor") {
            if (cssSelected == "none") {
              $(".viewcompiledcode").removeClass('hide');
              $(".viewcompiledcode").text('Run css2stylus');
              $(".minifycode, .tidycode").removeClass('hide');
              $("[data-action=tidy]").text('Tidy CSS');
              $("[data-action=minify]").text('Minify CSS');
              offset = $(this).offset();
              $(".editoractionlist").css({
                top: offset.top + 21 - 4,
                left: offset.left - $(".editoractionlist").width() + 10
              });
            } else {
              $(".viewcompiledcode").removeClass('hide');
              $(".minifycode, .tidycode").removeClass('hide');
              if (cssSelected == "stylus") {
                $(".minifycode, .tidycode").addClass('hide');
              }
              $(".viewcompiledcode").text('Convert ' + $("#css-preprocessor option:selected").val() + ' to CSS');
              $("[data-action=tidy]").text('Tidy ' + $("#css-preprocessor option:selected").val());
              $("[data-action=minify]").text('Minify ' + $("#css-preprocessor option:selected").val());
              offset = $(this).offset();
              $(".editoractionlist").css({
                top: offset.top + 21 - 4,
                left: offset.left - $(".editoractionlist").width() + 10
              });
            }
          }
        }
        // Check Javascript
        if ($(this).hasClass("jsarea")) {
          jsEditor.focus();
          activeEditor.value = 'jsEditor';
          if (activeEditor.value == "jsEditor") {
            if ( jsSelected == "none") {
              $(".viewcompiledcode").text('Run js2Coffee');
              $(".minifycode, .tidycode").removeClass('hide');
              $("[data-action=tidy]").text('Tidy Javascript');
              $("[data-action=minify]").text('Minify Javascript');
              offset = $(this).offset();
              $(".editoractionlist").css({
                top: offset.top + 21 - 4,
                left: offset.left - $(".editoractionlist").width() + 10
              });
            } else {
              $(".viewcompiledcode").removeClass('hide');
              $(".minifycode, .tidycode").removeClass('hide');
              if (jsSelected == "typescript") {
                $(".minifycode, .tidycode, .viewcompiledcode").addClass('hide');
              } else if (jsSelected == "coffeescript") {
                $(".minifycode, .tidycode").addClass('hide');
              } else if (jsSelected == "babel") {
                $(".minifycode, .tidycode").addClass('hide');
              }
              $(".viewcompiledcode").text('Convert ' + $("#js-preprocessor option:selected").val() + ' to Javascript');
              $("[data-action=tidy]").text('Tidy ' + $("#js-preprocessor option:selected").val());
              $("[data-action=minify]").text('Minify ' + $("#js-preprocessor option:selected").val());
              offset = $(this).offset();
              $(".editoractionlist").css({
                top: offset.top + 21 - 4,
                left: offset.left - $(".editoractionlist").width() + 10
              });
            }
          }
        }
        
        if ($('.editoractionlist').is(':visible')) {
          offset = $(this).offset();
          $(".editoractionlist").css({
            top: offset.top + 21 - 4,
            left: offset.left - $(".editoractionlist").width() + 10
          });
          return false;
        } else if ($('.editoractionlist').hasClass('hide')) {
          $(".editoractionlist").removeClass('hide');
          $(this).addClass('openeddropdown');
          return false;
        }
        return false;
      });
      $('[data-action=compile]').click(function() {
        $(".editoractionlist").removeClass('hide');
        
        // If no preprocessor is selected dont show compile
        var htmlSelected = $("#html-preprocessor option:selected").val();
        var cssSelected = $("#css-preprocessor  option:selected").val();
        var jsSelected   = $("#js-preprocessor   option:selected").val();
        
        // Check HTML
        if (activeEditor.value === "htmlEditor") {
          if ( htmlSelected == "none") {
            $("#html-preprocessor").val("jade").trigger("change");
            var options = {
                pretty: true
            };
            Html2Jade.convertHtml(htmlEditor.getValue(), {selectById: true}, function (err, jadeString) {
              if(err) {
                console.error(err);
              } else {
                if (!/<html>/.test(htmlEditor.getValue())) {
                  jadeString = jadeString
                                .replace('html\n', '')
                                .replace('head\n', '')
                                .replace(/^\s\s/, '')
                                .replace(/\n\s\s/, '\n');
                }

                if (!/<body>/.test(htmlEditor.getValue())) {
                  jadeString = jadeString
                                .replace(/.*body\n/, '')
                                .replace(/^\s\s/, '')
                                .replace(/\n\s\s/, '\n');
                };
                htmlEditor.setValue(jadeString);
              }
            });
            $(".editoractionlist").addClass('hide');
          } else if ( htmlSelected == "jade") {
            $("#html-preprocessor").val("none").trigger("change");
            htmlContent = jade.render(htmlEditor.getValue(), options);
            htmlEditor.setValue(htmlContent);
            beautifyHTML();
            $(".editoractionlist").addClass('hide');
          }
        }

        // Check CSS
        if (activeEditor.value === "cssEditor") {
          if ( cssSelected == "none") {
            $("#css-preprocessor").val("stylus").trigger("change");
            $(".viewcompiledcode").removeClass('hide');
            var css = cssEditor.getValue();
            var converter = new Css2Stylus.Converter(css);
            converter.processCss();
            cssEditor.setValue(converter.getStylus());
            $(".editoractionlist").addClass('hide');
          } else if (cssSelected == "stylus") {
            $("#css-preprocessor").val("none").trigger("change");
            $(".viewcompiledcode").removeClass('hide');
            var cssVal = cssEditor.getValue();
            stylus(cssVal).render(function(err, out) {
              if(err !== null) {
                console.error("something went wrong");
              } else {
                cssEditor.setValue(out);
                $('#css-preprocessor option').filter(function() { 
                  return ($(this).text() == 'None');
                }).prop('selected', true);
              }
            });
            $(".editoractionlist").addClass('hide');
          } else if (cssSelected == "less") {
            $("#css-preprocessor").val("none").trigger("change");
            $(".viewcompiledcode").removeClass('hide');
            var cssVal = cssEditor.getValue();
            less.render(cssVal, function (e, output) {
              cssEditor.setValue(output.css);
              $('#css-preprocessor option').filter(function() { 
                return ($(this).text() == 'None');
              }).prop('selected', true);
            });
            $(".editoractionlist").addClass('hide');
          }
        }

        // Check Javascript
        if (activeEditor.value === "jsEditor") {
          if ( jsSelected == "none") {
            $("#js-preprocessor").val("coffeescript").trigger("change");
            result = js2coffee.build(jsEditor.getValue());
            jsEditor.setValue(result.code);
            $(".editoractionlist").addClass('hide');
          } else if ( jsSelected == "coffeescript") {
            $("#js-preprocessor").val("none").trigger("change");
            jsContent = CoffeeScript.compile(jsEditor.getValue(), { bare: true });
            jsEditor.setValue(jsContent);
            beautifyJS();
            $(".editoractionlist").addClass('hide');
          } else if ( jsSelected == "babel") {
            $("#js-preprocessor").val("none").trigger("change");
            var result = Babel.transform(jsEditor.getValue(), {
              presets: ['latest', 'stage-2', 'react']
            });
            jsContent = result.code;
            jsEditor.setValue(jsContent);
            beautifyJS();
            $(".editoractionlist").addClass('hide');
            $("#js-preprocessor").val("none").trigger("change");
          }
        }
      });
      
      // Hide dropdown if other elements are clicked
      $("header a, header label").click(function() {
        if ($(".editoractionlist").is(':visible')) {
          $(".editoractionlist").addClass('hide');
        }
      });
      $(".sidebtns a:not([data-call=dropdown])").click(function() {
        if ($(".editoractionlist").is(':visible')) {
          $(".editoractionlist").addClass('hide');
        }
      });

      // Select active editor when clicked/touched
      $("#htmlEditor, #cssEditor, #jsEditor, #mdEditor").on("mousedown touchend", function() {
        $("input[name=menubar].active").trigger("click");
        if ($(".editoractionlist").is(':visible')) {
          $(".editoractionlist").addClass('hide');
        }

        if ( $(this).attr("id") === "htmlEditor" ) {
          activeEditor.value = "htmlEditor";
          if ($("#function").is(":hidden")) {
            $("#function").show();
          }
          $(".main-editor-chars").removeClass("hide");
          if ( $(".md-chars").is(":visible") ) {
            $(".md-chars").addClass("hide");
          }
        } else if ( $(this).attr("id") === "cssEditor" ) {
          activeEditor.value = "cssEditor";
          if ($("#function").is(":visible")) {
            $("#function").hide();
          }
          $(".main-editor-chars").removeClass("hide");
          if ( $(".md-chars").is(":visible") ) {
            $(".md-chars").addClass("hide");
          }
        } else if ( $(this).attr("id") === "jsEditor" ) {
          activeEditor.value = "jsEditor";
          $(".main-editor-chars").removeClass("hide");
          if ( $(".md-chars").is(":visible") ) {
            $(".md-chars").addClass("hide");
          }
          if ($("#function").is(":hidden")) {
            $("#function").show();
          }
        } else if ( $(this).attr("id") === "mdEditor" ) {
          activeEditor.value = "mdEditor";
          if ($("#function").is(":hidden")) {
            $("#function").show();
          }
          $(".md-chars").removeClass("hide");
          if ( $(".main-editor-chars").is(":visible") ) {
            $(".md-chars").removeClass("hide");
            $(".main-editor-chars").addClass("hide");
          }
        }
      });
      $("#htmlEditor, #cssEditor, #jsEditor").on("mouseup touchend", function() {
        if ( $(document.body).hasClass("live-markdown-preview") ) {
          $(document.body).removeClass("live-markdown-preview");
          if ( !$(document.body).hasClass("app") ) {
            $(document.body).addClass("app");
            updatePreview();
          }
        } else if ( !$(document.body).hasClass("app") ) {
          $(document.body).addClass("app");
          updatePreview();
        }
      });
      $("#mdEditor").on("mouseup touchend", function() {
        if ( $(document.body).hasClass("app") ) {
          $(document.body).removeClass("app");
          if ( !$(document.body).hasClass("live-markdown-preview") ) {
            $(document.body).addClass("live-markdown-preview");
            markdownPreview();
          }
        } else if ( !$(document.body).hasClass("live-markdown-preview") ) {
          $(document.body).addClass("live-markdown-preview");
          markdownPreview();
        }
      });

      // Handle Menu Dropdowns
      $("input[name=menubar]").on("change", function() {
        $(this).toggleClass("active");
        $("input[name=menubar]:checkbox").not(this).removeClass("active").prop("checked", false);
      });

      // Grids
      var checked = JSON.parse(localStorage.getItem("gridSetting"));
      document.getElementById("changeGrid").checked = checked;
      var gridChecked = function() {
        $("#splitContainer").jqxSplitter({
          height: "auto",
          width: "100%",
          orientation: "vertical",
          showSplitBar: true,
          panels: [{ size: "50%",collapsible:false },
                   { size: "50%" }]
        });
        $("#leftSplitter").jqxSplitter({
          width: "100%",
          height: "100%",
          orientation: "horizontal",
          showSplitBar: true,
          panels: [{
            size: "50%",
            collapsible: false
          }]
        });
        $("#rightSplitter").jqxSplitter({
          width: "100%",
          height: "100%",
          orientation: "horizontal",
          showSplitBar: true,
          panels: [{
            size: "50%",
            collapsible: false
          }]
        });
      };
      var gridNotChecked = function() {
        $("#splitContainer").jqxSplitter({
          height: "auto",
          width: "100%",
          orientation: "horizontal",
          showSplitBar: true,
          panels: [{ size: "50%",collapsible:false },
                   { size: "50%" }]
        });
        $("#leftSplitter").jqxSplitter({
          width: "100%",
          height: "100%",
          orientation: "vertical",
          showSplitBar: true,
          panels: [{
            size: "50%",
            collapsible: false
          }]
        });
        $("#rightSplitter").jqxSplitter({
          width: "100%",
          height: "100%",
          orientation: "vertical",
          showSplitBar: true,
          panels: [{
            size: "50%",
            collapsible: false
          }]
        });
      };
      function GridScheme() {
        var checkbox = document.getElementById("changeGrid");
        (checkbox.checked) ? gridChecked() : gridNotChecked();
        (checkbox.checked) ? localStorage.setItem("gridSetting", "true") : localStorage.setItem("gridSetting", "false");
        
        if ($("[data-toggle=previewdimensions]").is(":visible")) {
          $("[data-output=dimensions]").text($(".preview-editor").css('width') + ", " + $(".preview-editor").css('height'));
        }
      }
      $("#changeGrid").on("change", function() {
        GridScheme();
        $("input[name=menubar].active").trigger("click");
      }).trigger("change");
      $("#selectEditor").on("change", function() {
        $("#mdEditor, .savemd, #htmlEditor, .savehtml, .htmlSetting").toggleClass("invisible");
        $(".show-editor").toggleClass("html-editor md-editor");

        if (this.checked) {
          $(".pickEditor").attr("src", "assets/html5-small.svg");
          $(".selectEditor").css("top", "87px");
          mdEditor.focus();
          activeEditor.value = "mdEditor";
          if ($("#function").is(":hidden")) {
            $("#function").show();
          }
          $(".md-chars").removeClass("hide");
          if ( $(".main-editor-chars").is(":visible") ) {
            $(".md-chars").removeClass("hide");
            $(".main-editor-chars").addClass("hide");
          }
        } else {
          $(".pickEditor").attr("src", "assets/md-small.svg");
          $(".selectEditor").css("top", "");
          htmlEditor.focus();
          activeEditor.value = "htmlEditor";
          if ($("#function").is(":hidden")) {
            $("#function").show();
          }
          $(".main-editor-chars").removeClass("hide");
          if ( $(".md-chars").is(":visible") ) {
            $(".md-chars").addClass("hide");
          }
        }
      });
      
      document.querySelector(".fullscreen-html-toggle").onclick = function() {
        $(this).toggleClass("fill unfill");
        if ( $(".fullscreen-html-toggle.unfill").is(":visible") ) {
          $(this).html('<span class="fa fa-expand" id="fullscreen-html"></span>');
          GridScheme();
        } else if ( $(".fullscreen-html-toggle.fill").is(":visible") ) {
          $(this).html('<span class="fa fa-compress" id="fullscreen-html"></span>');
          $("#splitContainer").jqxSplitter({
            height: "auto",
            width: "100%",
            orientation: "vertical",
            showSplitBar: false,
            panels: [{ size: "100%" },
                     { size: "100%" }]
          });
          $("#leftSplitter").jqxSplitter({
            height: "100%",
            width: "100%",
            orientation: "horizontal",
            showSplitBar: false,
            panels: [{ size: "100%" },
                     { size: "0%"}]
          });
          $("#rightSplitter").jqxSplitter({
            height: "100%",
            width: "100%",
            orientation: "horizontal",
            showSplitBar: false,
            panels: [{ size: "0%"},
                     { size: "0%"}]
          });
        }
      };
      document.querySelector(".fullscreen-css-toggle").onclick = function() {
        $(this).toggleClass("fill unfill");
        if ( $(".fullscreen-css-toggle.unfill").is(":visible") ) {
          $(this).html('<span class="fa fa-expand" id="fullscreen-css"></span>');
          GridScheme();
        } else if ( $(".fullscreen-css-toggle.fill").is(":visible") ) {
          $(this).html('<span class="fa fa-compress" id="fullscreen-css"></span>');
          $("#splitContainer").jqxSplitter({
            height: "auto",
            width: "100%",
            orientation: "vertical",
            showSplitBar: false,
            panels: [{ size: "100%" },
                     { size: "100%" }]
          });
          $("#leftSplitter").jqxSplitter({
            height: "100%",
            width: "100%",
            orientation: "horizontal",
            showSplitBar: false,
            panels: [{ size: "0%" },
                     { size: "100%"}]
          });
          $("#rightSplitter").jqxSplitter({
            height: "100%",
            width: "100%",
            orientation: "horizontal",
            showSplitBar: false,
            panels: [{ size: "100%"},
                     { size: "0%"}]
          });
        }
      };
      document.querySelector(".fullscreen-js-toggle").onclick = function() {
        $(this).toggleClass("fill unfill");
        if ( $(".fullscreen-js-toggle.unfill").is(":visible") ) {
          $(this).html('<span class="fa fa-expand" id="fullscreen-js"></span>');
          GridScheme();
        } else if ( $(".fullscreen-js-toggle.fill").is(":visible") ) {
          $(this).html('<span class="fa fa-compress" id="fullscreen-js"></span>');
          $("#splitContainer").jqxSplitter({
            height: "auto",
            width: "100%",
            orientation: "vertical",
            showSplitBar: false,
            panels: [{ size: "0%" },
                     { size: "100%" }]
          });
          $("#leftSplitter").jqxSplitter({
            height: "100%",
            width: "100%",
            orientation: "horizontal",
            showSplitBar: false,
            panels: [{ size: "0%" },
                     { size: "0%"}]
          });
          $("#rightSplitter").jqxSplitter({
            height: "100%",
            width: "100%",
            orientation: "horizontal",
            showSplitBar: false,
            panels: [{ size: "100%"},
                     { size: "0%"}]
          });
        }
      };
      document.querySelector(".preview-mode-toggle").onclick = function() {
        $(this).toggleClass("fill unfill");
        if ( $(".preview-mode-toggle.unfill").is(":visible") ) {
          $(this).html('<span class="fa fa-expand" id="preview-mode"></span>');
          GridScheme();
        } else if ( $(".preview-mode-toggle.fill").is(":visible") ) {
          $(this).html('<span class="fa fa-compress" id="preview-mode"></span>');
          $("#splitContainer").jqxSplitter({
            height: "auto",
            width: "100%",
            orientation: "vertical",
            showSplitBar: false,
            panels: [{ size: "0%" },
                     { size: "100%" }]
          });
          $("#leftSplitter").jqxSplitter({
            height: "100%",
            width: "100%",
            orientation: "horizontal",
            showSplitBar: false,
            panels: [{ size: "0%" },
                     { size: "0%"}]
          });
          $("#rightSplitter").jqxSplitter({
            height: "100%",
            width: "100%",
            orientation: "horizontal",
            showSplitBar: false,
            panels: [{ size: "0%"},
                     { size: "100%"}]
          });
          if ($("[data-toggle=previewdimensions]").is(":visible")) {
            $("[data-output=dimensions]").text($(".preview-editor").css('width') + ", " + $(".preview-editor").css('height'));
          }
        }
      };
      
      // Change Welcome Dialog Margin when Orientation Changes
      $(window).on("load resize", function() {
        if ( window.innerWidth > window.innerHeight ) {
          // Landscape
          document.querySelector(".walkthrough-dialog").style = "";
        } else if ( window.innerWidth < window.innerHeight ) {
          // Portrait
          document.querySelector(".walkthrough-dialog").style.margin = "2em";
        }
      });
    },
    loadFiles = function() {
      // Load Files Into Editor
      document.querySelector("[data-action=open-load]").onclick = function() {
        $("input[name=menubar].active").trigger("click");
          if (navigator.onLine) {
            // user is online
            $("[data-action=loadDialog]").fadeIn();
          } else {
            // user is offline
            $("#loadfile").trigger("click");
          }
      };
      document.querySelector("[data-action=open-file]").onclick = function() {
        $("#loadfile").trigger("click");
        $("[data-action=loadDialog]").fadeOut();
      };
      document.querySelector("[data-action=loadProject]").onclick = function() {
        alertify.prompt("Enter project code below!", "",
          function(evt, value) {
          localStorage.clear();
          loadgist(value);
        },
        function() {
          // User clicked cancel
        }).set('basic', true);
        $("[data-action=loadDialog]").fadeOut();
      };
      document.querySelector("[data-action=load-cancel]").onclick = function() {
        $("[data-action=loadDialog]").fadeOut();
      };
      $("#loadfile").on("change", function() {
        loadfile(this);
      });

      function loadfile(input) {
        var reader = new FileReader();
        reader.onload = function(e) {
          // var path = input.value.replace(/.*(\/|\\)/, '');
          var path = input.value;
          if (path.toLowerCase().substring(path.length - 5) === ".html") {
            htmlEditor.setValue("");
            htmlEditor.setValue( e.target.result );
            $("#html-preprocessor").val("none").trigger("change");
          } else if (path.toLowerCase().substring(path.length - 5) === ".jade") {
            htmlEditor.setValue("");
            htmlEditor.setValue( e.target.result );
            $("#html-preprocessor").val("jade").trigger("change");
          } else if (path.toLowerCase().substring(path.length - 4) === ".pug") {
            htmlEditor.setValue("");
            htmlEditor.setValue( e.target.result );
            $("#html-preprocessor").val("jade").trigger("change");
          } else if (path.toLowerCase().substring(path.length - 4) === ".css") {
            cssEditor.setValue("");
            cssEditor.setValue( e.target.result );
            $("#css-preprocessor").val("none").trigger("change");
          } else if (path.toLowerCase().substring(path.length - 5) === ".styl") {
            cssEditor.setValue("");
            cssEditor.setValue( e.target.result );
            $("#css-preprocessor").val("stylus").trigger("change");
          } else if (path.toLowerCase().substring(path.length - 5) === ".less") {
            cssEditor.setValue("");
            cssEditor.setValue( e.target.result );
            $("#css-preprocessor").val("less").trigger("change");
          } else if (path.toLowerCase().substring(path.length - 5) === ".scss") {
            cssEditor.setValue("");
            cssEditor.setValue( e.target.result );
            $("#css-preprocessor").val("scss").trigger("change");
          } else if (path.toLowerCase().substring(path.length - 5) === ".sass") {
            cssEditor.setValue("");
            cssEditor.setValue( e.target.result );
            $("#css-preprocessor").val("sass").trigger("change");
          } else if (path.toLowerCase().substring(path.length - 3) === ".js") {
            jsEditor.setValue("");
            jsEditor.setValue( e.target.result );
            $("#js-preprocessor").val("none").trigger("change");
          } else if (path.toLowerCase().substring(path.length - 7) === ".coffee") {
            jsEditor.setValue("");
            jsEditor.setValue( e.target.result );
            $("#js-preprocessor").val("coffeescript").trigger("change");
          } else if (path.toLowerCase().substring(path.length - 3) === ".ts") {
            jsEditor.setValue("");
            jsEditor.setValue( e.target.result );
            $("#js-preprocessor").val("typescript").trigger("change");
          } else if (path.toLowerCase().substring(path.length - 4) === ".jsx") {
            jsEditor.setValue("");
            jsEditor.setValue( e.target.result );
            $("#js-preprocessor").val("babel").trigger("change");
          } else if (path.toLowerCase().substring(path.length - 3) === ".es") {
            jsEditor.setValue("");
            jsEditor.setValue( e.target.result );
            $("#js-preprocessor").val("babel").trigger("change");
          } else if (path.toLowerCase().substring(path.length - 4) === ".es6") {
            jsEditor.setValue("");
            jsEditor.setValue( e.target.result );
            $("#js-preprocessor").val("babel").trigger("change");
          } else if (path.toLowerCase().substring(path.length - 5) === ".json") {
            jsEditor.setValue("");
            jsEditor.setValue( e.target.result );
            $("#js-preprocessor").val("none").trigger("change");
          } else if (path.toLowerCase().substring(path.length - 3) === ".md") {
            mdEditor.setValue("");
            mdEditor.setValue( e.target.result );
          } else if (path.toLowerCase().substring(path.length - 4) === ".svg") {
            htmlEditor.setValue("");
            htmlEditor.setValue( e.target.result );
            $("#html-preprocessor").val("none").trigger("change");
          } else {
            alertify.error("Sorry kodeWeave does not support that file type!");
          }
        };
        $("input[name=menubar].active").trigger("click");
        reader.readAsText(input.files[0]);
      }

      if (window.File && window.FileReader && window.FileList && window.Blob) {

      } else {
        alertify.error("The File APIs are not fully supported in this browser.");
      }

      singleFileDownload();
    },
    preprocessors = function() {
      $("[data-call=settings]").click(function() {
        $("input[name=menubar].active").trigger("click");
        if ($(this).hasClass("htmlSetting")) {
          $("#html-preprocessors").attr("checked", true);
        } else if ($(this).hasClass("cssSetting")) {
          $("#css-preprocessors").attr("checked", true);
        } else if ($(this).hasClass("jsSetting")) {
          $("#js-preprocessors").attr("checked", true);
        }
        $("[data-action=preprocessors]").fadeIn();
      });
      $(".confirm-preprocessor").click(function() {
        // Default fadeout speed is 400ms
        $("[data-action=preprocessors]").fadeOut();
      });
      // Preprocessors (Doesn't compile to preview)
      $("#html-preprocessor").on("change", function() {
        var valueSelected = this.value;
        localStorage.setItem("htmlPreprocessorVal", this.value);
        if ( valueSelected == "none") {
          htmlEditor.setOption("mode", "text/html");
          htmlEditor.setOption("gutters", ["CodeMirror-lint-markers", "CodeMirror-linenumbers", "CodeMirror-foldgutter"]);
          // htmlEditor.refresh();
          $(".html-editor").css('background-image', 'url("assets/html5.svg")');
        } else if ( valueSelected == "jade") {
          htmlEditor.setOption("mode", "text/x-jade");
          htmlEditor.setOption("gutters", ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]);
          // htmlEditor.refresh();
          $(".html-editor").css('background-image', 'url("assets/jade.svg")');
        } else {
          htmlEditor.setOption("mode", "text/html");
          htmlEditor.setOption("gutters", ["CodeMirror-lint-markers", "CodeMirror-linenumbers", "CodeMirror-foldgutter"]);
          // htmlEditor.refresh();
        }
        updatePreview();
      }).trigger("change");
      $("#css-preprocessor").on("change", function() {
        var valueSelected = this.value;
        localStorage.setItem("cssPreprocessorVal", this.value);

        if ( valueSelected == "none") {
          cssEditor.setOption("mode", "css");
          cssEditor.setOption("gutters", ["CodeMirror-lint-markers", "CodeMirror-linenumbers", "CodeMirror-foldgutter"]);
          // cssEditor.setOption("lint", true);
          // cssEditor.refresh();
          $(".css-editor").css('background-image', 'url("assets/css3.svg")');
        } else if ( valueSelected == "stylus") {
          cssEditor.setOption("mode", "text/x-styl");
          cssEditor.setOption("gutters", ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]);
          setTimeout(function() {
            $(".CodeMirror-lint-mark-error, .CodeMirror-lint-mark-error-metro").removeClass("CodeMirror-lint-mark-error CodeMirror-lint-mark-error-metro");
            $(".CodeMirror-lint-mark-warning, .CodeMirror-lint-mark-warning-metro").removeClass("CodeMirror-lint-mark-warning CodeMirror-lint-mark-warning-metro");
          }, 300);
          // cssEditor.setOption("lint", false);
          // cssEditor.refresh();
          $(".css-editor").css('background-image', 'url("assets/stylus.svg")');
        } else if ( valueSelected == "less") {
          cssEditor.setOption("mode", "text/x-less");
          cssEditor.setOption("gutters", ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]);
          setTimeout(function() {
            $(".CodeMirror-lint-mark-error, .CodeMirror-lint-mark-error-metro").removeClass("CodeMirror-lint-mark-error CodeMirror-lint-mark-error-metro");
            $(".CodeMirror-lint-mark-warning, .CodeMirror-lint-mark-warning-metro").removeClass("CodeMirror-lint-mark-warning CodeMirror-lint-mark-warning-metro");
          }, 300);
          // cssEditor.setOption("lint", false);
          // cssEditor.refresh();
          $(".css-editor").css('background-image', 'url("assets/scss.svg")');
        } else if ( valueSelected == "scss") {
          cssEditor.setOption("mode", "text/x-scss");
          cssEditor.setOption("gutters", ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]);
          setTimeout(function() {
            $(".CodeMirror-lint-mark-error, .CodeMirror-lint-mark-error-metro").removeClass("CodeMirror-lint-mark-error CodeMirror-lint-mark-error-metro");
            $(".CodeMirror-lint-mark-warning, .CodeMirror-lint-mark-warning-metro").removeClass("CodeMirror-lint-mark-warning CodeMirror-lint-mark-warning-metro");
          }, 300);
          // cssEditor.setOption("lint", false);
          // cssEditor.refresh();
          $(".css-editor").css('background-image', 'url("assets/scss.svg")');
        } else if ( valueSelected == "sass") {
          cssEditor.setOption("mode", "text/x-sass");
          cssEditor.setOption("gutters", ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]);
          setTimeout(function() {
            $(".CodeMirror-lint-mark-error, .CodeMirror-lint-mark-error-metro").removeClass("CodeMirror-lint-mark-error CodeMirror-lint-mark-error-metro");
            $(".CodeMirror-lint-mark-warning, .CodeMirror-lint-mark-warning-metro").removeClass("CodeMirror-lint-mark-warning CodeMirror-lint-mark-warning-metro");
          }, 300);
          // cssEditor.setOption("lint", false);
          // cssEditor.refresh();
          $(".css-editor").css('background-image', 'url("assets/sass.svg")');
        } else {
          cssEditor.setOption("mode", "css");
          cssEditor.setOption("gutters", ["CodeMirror-lint-markers", "CodeMirror-linenumbers", "CodeMirror-foldgutter"]);
          // cssEditor.setOption("lint", true);
          // cssEditor.refresh();
        }
        updatePreview();
      }).trigger("change");
      $("#js-preprocessor").on("change", function() {
        var valueSelected = this.value;
        localStorage.setItem("jsPreprocessorVal", this.value);
        if ( valueSelected == "none") {
          jsEditor.setOption("mode", "javascript");
          jsEditor.refresh();
          $(".js-editor").css('background-image', 'url("assets/js.svg")');
        } else if ( valueSelected == "coffeescript") {
          jsEditor.setOption("mode", "text/x-coffeescript");
          $(".js-editor").css('background-image', 'url("assets/coffeescript.svg")');
        } else if ( valueSelected == "typescript") {
          jsEditor.setOption("mode", "text/typescript");
          $(".js-editor").css('background-image', 'url("assets/typescript.svg")');
        } else if ( valueSelected == "babel") {
          jsEditor.setOption("mode", "text/javascript");
          $(".js-editor").css('background-image', 'url("assets/babel.svg")');
        }
        updatePreview();
      }).trigger("change");
    },
    miscellaneous = function() {
      // Tool Inputs
      $("[data-action=sitedesc], [data-action=siteauthor]").bind("keyup change", function() {
        var sitedesc = ( document.querySelector("[data-action=sitedesc]").value === "" ? "" : "    <meta name=\"description\" content=\""+ document.querySelector("[data-action=sitedesc]").value +"\">\n" );
        var siteauthor = ( document.querySelector("[data-action=siteauthor]").value === "" ? "" : "    <meta name=\"author\" content=\""+ document.querySelector("[data-action=siteauthor]").value +"\">\n" );
        closeHTML.setValue("</title>\n    <meta charset=\"utf-8\">\n    <meta name=\"viewport\" content=\"initial-scale=1.0\">\n" + sitedesc + siteauthor + "    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=9\" />\n");
        updatePreview();
      });
      $(".clear_input").click(function() {
        $("[data-action=sitedesc], [data-action=siteauthor]").trigger("change");
      });
      
      // Show Preloader
      $("[data-action=download-as-win-app], [data-action=download-as-win32-app], [data-action=download-as-mac-app], [data-action=download-as-lin-app], [data-action=download-as-lin32-app], [data-action=app-confirm], [data-action=ext-confirm]").click(function() {
        $(document.body).append('<div class="fixedfill preloader hide"></div>');
        $(".preloader").html('<div class="table"><div class="cell"><h1>Exporting application!</h1><div class="spinner"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div></div></div>').removeClass("hide");
      });
      
      // If textbox has a value...
      // a clear icon will display to clear the input
      $(".metaboxes .heading").not("input[type=number]").clearSearch();
      
      // Show Twitter Feed
      document.querySelector("[data-action=feed]").onclick = function() {
        $("#tab3").trigger("click");
      };
      
      // Close Share Dialog
      document.querySelector("[data-action=social-cancel]").onclick = function() {
        $("[data-action=socialdialog]").fadeOut();
        document.getElementById("clearSharePreview").innerHTML = "";
      };
      
      welcomeDialog();
    },
    storeValues = function() {
      // Save Site Title Value for LocalStorage
      if ( localStorage.getItem("siteTitle")) {
        $("[data-action=sitetitle]").val(localStorage.getItem("siteTitle"));
      }
      $("[data-action=sitetitle]").on("keyup change", function() {
        localStorage.setItem("siteTitle", this.value);
        if (this.value.split(" ").join("") === "") {
          document.title = "kodeWeave";
        } else {
          document.title = "kodeWeave: " + this.value;
        }
      });
      
      document.title = "kodeWeave: " + document.querySelector("[data-action=sitetitle]").value;

      // Save FontSize for LocalStorage
      if ( localStorage.getItem("fontSize")) {
        document.querySelector("[data-editor=fontSize]").value = localStorage.getItem("fontSize");
        $(".CodeMirror").css("font-size", localStorage.getItem("fontSize") + "px");
      }
      $("[data-editor=fontSize]").on("keyup change", function() {
        $(".CodeMirror").css("font-size", this.value + "px");
        localStorage.setItem("fontSize", this.value);
      });

      // Save Description for LocalStorage
      if ( localStorage.getItem("saveDesc")) {
        document.querySelector("[data-action=sitedesc]").value = localStorage.getItem("saveDesc");
      }
      $("[data-action=sitedesc]").on("keyup change", function() {
        localStorage.setItem("saveDesc", this.value);
      });
      // Save Author for LocalStorage
      if ( localStorage.getItem("saveAuthor")) {
        document.querySelector("[data-action=siteauthor]").value = localStorage.getItem("saveAuthor");
      }
      $("[data-action=siteauthor]").on("keyup change", function() {
        localStorage.setItem("saveAuthor", this.value);
      });
      // Save Preprocessors
      if ( localStorage.getItem("htmlPreprocessorVal")) {
        $("#html-preprocessor").val(localStorage.getItem("htmlPreprocessorVal"));
      }
      if ( localStorage.getItem("cssPreprocessorVal")) {
        $("#css-preprocessor").val(localStorage.getItem("cssPreprocessorVal"));
      }
      if ( localStorage.getItem("jsPreprocessorVal")) {
        document.getElementById("js-preprocessor").value = localStorage.getItem("jsPreprocessorVal");
      }
      
      // Save Weave for Offline Usage
      if ( localStorage.getItem("savedWeaves")) {
        $("[data-saved=libraries]").html(localStorage.getItem("savedWeaves"));
        handleWeaves();
      }
    },
    checkedLibs = function() {
      if ( $("#alertify").is(":checked") ) {
        $('.alertifyjs').clear();
        download_to_textbox('libraries/alertifyjs/css/alertify.min.css', $('.alertifyjs1'));
        download_to_textbox('libraries/alertifyjs/css/themes/default.min.css', $('.alertifyjs2'));
        download_to_textbox('libraries/alertifyjs/alertify.min.js', $('.alertifyjs3'));
        download_to_textbox('libraries/alertifyjs/css/alertify.rtl.min.css', $('.alertifyjs4'));
        download_to_textbox('libraries/alertifyjs/css/themes/bootstrap.min.css', $('.alertifyjs5'));
        download_to_textbox('libraries/alertifyjs/css/themes/bootstrap.rtl.min.css', $('.alertifyjs6'));
        download_to_textbox('libraries/alertifyjs/css/themes/default.rtl.min.css', $('.alertifyjs7'));
        download_to_textbox('libraries/alertifyjs/css/themes/semantic.min.css', $('.alertifyjs8'));
        download_to_textbox('libraries/alertifyjs/css/themes/semantic.rtl.min.css', $('.alertifyjs9'));

        $(".alertifyzip").val("zip.file('libraries/alertifyjs/css/alertify.min.css', $(\".alertifyjs1\").val());\n    zip.file('libraries/alertifyjs/css/themes/default.min.css', $(\".alertifyjs2\").val());\n    zip.file('libraries/alertifyjs/alertify.min.js', $(\".alertifyjs3\").val());\n    zip.file('libraries/alertifyjs/css/alertify.rtl.min.css', $(\".alertifyjs4\").val());\n    zip.file('libraries/alertifyjs/css/themes/bootstrap.min.css', $(\".alertifyjs5\").val());\n    zip.file('libraries/alertifyjs/css/themes/bootstrap.rtl.min.css', $(\".alertifyjs6\").val());\n    zip.file('libraries/alertifyjs/css/themes/default.rtl.min.css', $(\".alertifyjs7\").val());\n    zip.file('libraries/alertifyjs/css/themes/semantic.min.css', $(\".alertifyjs8\").val());\n    zip.file('libraries/alertifyjs/css/themes/semantic.rtl.min.css', $(\".alertifyjs9\").val());");
      } else {
        $('.alertifyjs, .alertifyzip').clear();
      }

      if ( $("#angular").is(":checked") ) {
        $('.angularjs').clear();
        download_to_textbox('libraries/angular/angular.min.js', $('.angularjs'));
        $(".angularzip").val("zip.file('libraries/angular/angular.min.js', $(\".angularjs\").val());");
      } else {
        $('.angularjs, .angularzip').clear();
      }

      if ( $("#angularmaterial").is(":checked") ) {
        $('.angularmaterial').clear();
        download_to_textbox('libraries/angular-material/angular-material.min.css', $('.angularmaterial1'));
        download_to_textbox('libraries/angular-material/angular.min.js', $('.angularmaterial2'));
        download_to_textbox('libraries/angular-material/angular-material.min.js', $('.angularmaterial3'));
        download_to_textbox('libraries/angular-animate.min.js', $('.angularmaterial4'));
        download_to_textbox('libraries/angular-material/angular-aria.min.js', $('.angularmaterial5'));
        $(".angularmaterialzip").val("zip.file('libraries/angular-material/angular-material.min.css', $(\".angularmaterial1\").val());\n zip.file('libraries/angular-material/angular.min.js', $(\".angularmaterial2\").val());\n zip.file('libraries/angular-material/angular-material.min.js', $(\".angularmaterial3\").val());\n zip.file('libraries/angular-material/angular-animate.min.js', $(\".angularmaterial4\").val());\n zip.file('libraries/angular-material/angular-aria.min.js', $(\".angularmaterial5\").val());");
      } else {
        $('.angularmaterial, .angularmaterialzip').clear();
      }
      
      if ( $("#animatecss").is(":checked") ) {
        $('.animatecss').clear();
        download_to_textbox('libraries/animateCSS/animate.min.css', $('.animatecss'));
        $(".animatecsszip").val("zip.file('libraries/animateCSS/animate.min.css', $(\".animatecss\").val());");
      } else {
        $('.animatecss, .animatecsszip').clear();
      }
      if ( $("#backbone").is(":checked") ) {
        $('.backbone').clear();
        download_to_textbox('libraries/backbone/backbone.js', $('.backbone'));
        $('.backbone').trigger("change");
        $(".backbonezip").val("zip.file('libraries/backbone/backbone.js', $('.backbone').val());");
      } else {
        $('.backbone, .backbonezip').clear();
      }
      if ( $("#bootstrap").is(":checked") ) {
        $('.bootstrap').clear();
        download_to_textbox('libraries/bootstrap/bootstrap.css', $('.bootstrap1'));
        download_to_textbox('libraries/bootstrap/bootstrap.js', $('.bootstrap2'));
        $('.bootstrap1, .bootstrap2').trigger("change");
        $(".bootstrapzip").val("zip.file('libraries/bootstrap/bootstrap.css', $('.bootstrap1').val());\n  zip.file('libraries/bootstrap/bootstrap.js', $('.bootstrap2').val());");
      } else {
        $('.bootstrap, .bootstrapzip').clear();
      }
      if ( $("#chartjs").is(":checked") ) {
        $('.chartjs').clear();
        download_to_textbox('libraries/chartjs/chart.min.js', $('.chartjs'));
        $('.chartjs').trigger("change");
        $(".chartjszip").val("zip.file('libraries/chartjs/chart.min.js', $('.chartjs').val());");
      } else {
        $('.chartjs, .chartjszip').clear();
      }
      if ( $("#codemirror").is(":checked") ) {
        $('.codemirror').clear();

        download_to_textbox('libraries/codemirror/lib/codemirror.css', $('.codemirror1'));
        download_to_textbox('libraries/codemirror/addon/fold/foldgutter.css', $('.codemirror2'));
        download_to_textbox('libraries/codemirror/lib/codemirror.js', $('.codemirror3'));
        download_to_textbox('libraries/codemirror/mode/javascript/javascript.js', $('.codemirror7'));
        download_to_textbox('libraries/codemirror/mode/xml/xml.js', $('.codemirror8'));
        download_to_textbox('libraries/codemirror/mode/css/css.js', $('.codemirror9'));
        download_to_textbox('libraries/codemirror/mode/htmlmixed/htmlmixed.js', $('.codemirror10'));
        download_to_textbox('libraries/codemirror/addon/edit/closetag.js', $('.codemirror11'));
        download_to_textbox('libraries/codemirror/addon/edit/matchbrackets.js', $('.codemirror12'));
        download_to_textbox('libraries/codemirror/addon/selection/active-line.js', $('.codemirror13'));
        download_to_textbox('libraries/codemirror/addon/fold/foldcode.js', $('.codemirror14'));
        download_to_textbox('libraries/codemirror/addon/fold/foldgutter.js', $('.codemirror15'));
        download_to_textbox('libraries/codemirror/addon/fold/brace-fold.js', $('.codemirror16'));
        download_to_textbox('libraries/codemirror/addon/fold/xml-fold.js', $('.codemirror17'));
        download_to_textbox('libraries/codemirror/addon/fold/comment-fold.js', $('.codemirror18'));
        download_to_textbox('libraries/codemirror/addon/search/search.js', $('.codemirror19'));
        download_to_textbox('libraries/codemirror/addon/search/searchcursor.js', $('.codemirror20'));
        download_to_textbox('libraries/codemirror/addon/dialog/dialog.js', $('.codemirror21'));
        download_to_textbox('libraries/codemirror/addon/hint/show-hint.js', $('.codemirror22'));
        download_to_textbox('libraries/codemirror/addon/hint/xml-hint.js', $('.codemirror23'));
        download_to_textbox('libraries/codemirror/addon/hint/html-hint.js', $('.codemirror24'));
        download_to_textbox('libraries/codemirror/addon/hint/css-hint.js', $('.codemirror25'));
        download_to_textbox('libraries/codemirror/addon/hint/javascript-hint.js', $('.codemirror26'));
        download_to_textbox('libraries/codemirror/addon/search/match-highlighter.js', $('.codemirror27'));
        download_to_textbox('libraries/codemirror/htmlhint.js', $('.codemirror28'));
        download_to_textbox('libraries/codemirror/csslint.js', $('.codemirror29'));
        download_to_textbox('libraries/codemirror/jshint.js', $('.codemirror30'));
        download_to_textbox('libraries/codemirror/addon/lint/lint.js', $('.codemirror31'));
        download_to_textbox('libraries/codemirror/addon/lint/html-lint.js', $('.codemirror32'));
        download_to_textbox('libraries/codemirror/addon/lint/css-lint.js', $('.codemirror33'));
        download_to_textbox('libraries/codemirror/addon/lint/javascript-lint.js', $('.codemirror34'));
        download_to_textbox('libraries/codemirror/inlet.min.js', $('.codemirror35'));
        download_to_textbox('libraries/codemirror/inlet.css', $('.codemirror36'));
        download_to_textbox('libraries/codemirror/emmet.js', $('.codemirror37'));
        download_to_textbox('libraries/codemirror/addon/lint/lint.css', $('.codemirror38'));
        download_to_textbox('libraries/codemirror/addon/dialog/dialog.css', $('.codemirror39'));
        download_to_textbox('libraries/codemirror/addon/hint/show-hint.css', $('.codemirror40'));
        download_to_textbox('libraries/codemirror/addon/search/jump-to-line.js', $('.codemirror41'));
        download_to_textbox('libraries/codemirror/markdown.js', $('.codemirror42'));
        download_to_textbox('libraries/codemirror/continuelist.js', $('.codemirror43'));
        download_to_textbox('libraries/codemirror/mode/haml/haml.js', $('.codemirror44'));
        download_to_textbox('libraries/codemirror/mode/jade/jade.js', $('.codemirror45'));
        download_to_textbox('libraries/codemirror/mode/sass/sass.js', $('.codemirror46'));
        download_to_textbox('libraries/codemirror/mode/livescript/livescript.js', $('.codemirror47'));
        download_to_textbox('libraries/codemirror/mode/coffeescript/coffeescript.js', $('.codemirror48'));
        download_to_textbox('libraries/codemirror/mode/ruby/ruby.js', $('.codemirror49'));
        download_to_textbox('libraries/codemirror/coffee-script.js', $('.codemirror50'));
        download_to_textbox('libraries/codemirror/coffeelint.js', $('.codemirror51'));
        download_to_textbox('libraries/codemirror/addon/lint/coffeescript-lint.js', $('.codemirror52'));
        download_to_textbox('libraries/codemirror/mode/stylus/stylus.js', $('.codemirror53'));

        // var grabCodemirror = [
        //   "zip.file('libraries/codemirror/lib/codemirror.css', $('.codemirror1').val());\n",
        //   "zip.file('libraries/codemirror/addon/fold/foldgutter.css', $('.codemirror2').val());\n",
        //   "zip.file('libraries/codemirror/lib/codemirror.js', $('.codemirror3').val());\n",
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
        //   "zip.file('libraries/codemirror/addon/lint/coffeescript-lint.js', $('.codemirror52').val());\n",
        //   "zip.file('libraries/codemirror/mode/stylus/stylus.js', $('.codemirror53').val());\n"
        // ];

        var grabCodemirror = "zip.file('libraries/codemirror/lib/codemirror.css', $('.codemirror1').val());\n\n      zip.file('libraries/codemirror/addon/fold/foldgutter.css', $('.codemirror2').val());\n\n      zip.file('libraries/codemirror/lib/codemirror.js', $('.codemirror3').val());\n\n      zip.file('libraries/codemirror/mode/javascript/javascript.js', $('.codemirror7').val());\n\n      zip.file('libraries/codemirror/mode/xml/xml.js', $('.codemirror8').val());\n\n      zip.file('libraries/codemirror/mode/css/css.js', $('.codemirror9').val());\n\n      zip.file('libraries/codemirror/mode/htmlmixed/htmlmixed.js', $('.codemirror10').val());\n\n      zip.file('libraries/codemirror/addon/edit/closetag.js', $('.codemirror11').val());\n\n      zip.file('libraries/codemirror/addon/edit/matchbrackets.js', $('.codemirror12').val());\n\n      zip.file('libraries/codemirror/addon/selection/active-line.js', $('.codemirror13').val());\n\n      zip.file('libraries/codemirror/addon/fold/foldcode.js', $('.codemirror14').val());\n\n      zip.file('libraries/codemirror/addon/fold/foldgutter.js', $('.codemirror15').val());\n\n      zip.file('libraries/codemirror/addon/fold/brace-fold.js', $('.codemirror16').val());\n\n      zip.file('libraries/codemirror/addon/fold/xml-fold.js', $('.codemirror17').val());\n\n      zip.file('libraries/codemirror/addon/fold/comment-fold.js', $('.codemirror18').val());\n\n      zip.file('libraries/codemirror/addon/search/search.js', $('.codemirror19').val());\n\n      zip.file('libraries/codemirror/addon/search/searchcursor.js', $('.codemirror20').val());\n\n      zip.file('libraries/codemirror/addon/dialog/dialog.js', $('.codemirror21').val());\n\n      zip.file('libraries/codemirror/addon/hint/show-hint.js', $('.codemirror22').val());\n\n      zip.file('libraries/codemirror/addon/hint/xml-hint.js', $('.codemirror23').val());\n\n      zip.file('libraries/codemirror/addon/hint/html-hint.js', $('.codemirror24').val());\n\n      zip.file('libraries/codemirror/addon/hint/css-hint.js', $('.codemirror25').val());\n\n      zip.file('libraries/codemirror/addon/hint/javascript-hint.js', $('.codemirror26').val());\n\n      zip.file('libraries/codemirror/addon/search/match-highlighter.js', $('.codemirror27').val());\n\n      zip.file('libraries/codemirror/htmlhint.js', $('.codemirror28').val());\n\n      zip.file('libraries/codemirror/csslint.js', $('.codemirror29').val());\n\n      zip.file('libraries/codemirror/jshint.js', $('.codemirror30').val());\n\n      zip.file('libraries/codemirror/addon/lint/lint.js', $('.codemirror31').val());\n\n      zip.file('libraries/codemirror/addon/lint/html-lint.js', $('.codemirror32').val());\n\n      zip.file('libraries/codemirror/addon/lint/css-lint.js', $('.codemirror33').val());\n\n      zip.file('libraries/codemirror/addon/lint/javascript-lint.js', $('.codemirror34').val());\n\n      zip.file('libraries/codemirror/inlet.min.js', $('.codemirror35').val());\n\n      zip.file('libraries/codemirror/inlet.css', $('.codemirror36').val());\n\n      zip.file('libraries/codemirror/emmet.js', $('.codemirror37').val());\n\n      zip.file('libraries/codemirror/addon/lint/lint.css', $('.codemirror38').val());\n\n      zip.file('libraries/codemirror/addon/dialog/dialog.css', $('.codemirror39').val());\n\n      zip.file('libraries/codemirror/addon/hint/show-hint.css', $('.codemirror40').val());\n\n      zip.file('libraries/codemirror/addon/search/jump-to-line.js', $('.codemirror41').val());\n\n      zip.file('libraries/codemirror/markdown.js', $('.codemirror42').val());\n\n      zip.file('libraries/codemirror/continuelist.js', $('.codemirror43').val());\n\n      zip.file('libraries/codemirror/mode/haml/haml.js', $('.codemirror44').val());\n\n      zip.file('libraries/codemirror/mode/jade/jade.js', $('.codemirror45').val());\n\n      zip.file('libraries/codemirror/mode/sass/sass.js', $('.codemirror46').val());\n\n      zip.file('libraries/codemirror/mode/livescript/livescript.js', $('.codemirror47').val());\n\n      zip.file('libraries/codemirror/mode/coffeescript/coffeescript.js', $('.codemirror48').val());\n\n      zip.file('libraries/codemirror/mode/ruby/ruby.js', $('.codemirror49').val());\n\n      zip.file('libraries/codemirror/coffee-script.js', $('.codemirror50').val());\n\n      zip.file('libraries/codemirror/coffeelint.js', $('.codemirror51').val());\n\n      zip.file('libraries/codemirror/addon/lint/coffeescript-lint.js', $('.codemirror52').val());\n      zip.file('libraries/codemirror/mode/stylus/stylus.js', $('.codemirror53').val());\n";

        $('.codemirror').trigger("change");
        $(".codemirrorzip").val(grabCodemirror);
      } else {
        $('.codemirror, .codemirrorzip').clear();
      }
      if ( $("#createjs").is(":checked") ) {
        $('.createjs').clear();
        download_to_textbox('libraries/createjs/createjs.min.js', $('.createjs1'));
        download_to_textbox('libraries/createjs/easeljs.min.js', $('.createjs2'));
        download_to_textbox('libraries/createjs/tweenjs.min.js', $('.createjs3'));
        download_to_textbox('libraries/createjs/soundjs.min.js', $('.createjs4'));
        download_to_textbox('libraries/createjs/preloadjs.min.js', $('.createjs5'));
        $('.createjs').trigger("change");
        $(".createjszip").val("zip.file('libraries/createjs/createjs.min.js', $('.createjs1').val());\nzip.file('libraries/createjs/easeljs.min.js', $('.createjs2').val());\nzip.file('libraries/createjs/tweenjs.min.js', $('.createjs3').val());\nzip.file('libraries/createjs/soundjs.min.js', $('.createjs4').val());\nzip.file('libraries/createjs/preloadjs.min.js', $('.createjs5').val());");
      } else {
        $('.createjs, .createjszip').clear();
      }
      if ( $("#d3").is(":checked") ) {
        $('.d3').clear();
        download_to_textbox('libraries/d3/d3.js', $('.d3'));
        $('.d3').trigger("change");
        $(".d3zip").val("zip.file('libraries/d3/d3.js', $(\".d3\").val());");
      } else {
        $('.d3, .d3zip').clear();
      }
      if ( $("#dojo").is(":checked") ) {
        $('.dojo').clear();
        download_to_textbox('libraries/dojo/dojo.js', $('.dojo'));
        $('.dojo').trigger("change");
        $(".dojozip").val("zip.file('libraries/dojo/dojo.js', $(\".dojo\").val());");
      } else {
        $('.dojo, .dojozip').clear();
      }
      if ( $("#enhance").is(":checked") ) {
        $('.enhance').clear();
        download_to_textbox('libraries/enhance/enhance.js', $('.enhance'));
        $('.enhance').trigger("change");
        $(".enhancezip").val("zip.file('libraries/enhance/enhance.js', $('.enhance').val());");
      } else {
        $('.enhance, .enhancezip').clear();
      }
      if ( $("#fabric").is(":checked") ) {
        $('.fabric').clear();
        download_to_textbox('libraries/fabric/fabric.min.js', $('.fabric'));
        $('.fabric').trigger("change");
        $(".fabriczip").val("zip.file('libraries/fabric/fabric.min.js', $(\".fabric\").val());");
      } else {
        $('.fabric, .fabriczip').clear();
      }
      if ( $("#foundation").is(":checked") ) {
        $('.foundation').clear();
        download_to_textbox('libraries/foundation/foundation.min.css', $('.foundation1'));
        download_to_textbox('libraries/foundation/foundation.min.js', $('.foundation2'));
        $('.foundation').trigger("change");
        $(".fabriczip").val("zip.file('libraries/foundation/foundation.min.css', $(\".foundation1\").val());\nzip.file('libraries/foundation/foundation.min.js', $(\".foundation2\").val());");
      } else {
        $('.foundation, .foundationzip').clear();
      }
      if ( $("#handlebars").is(":checked") ) {
        $('.handlebars').clear();
        download_to_textbox('libraries/handlebars/handlebars.min.js', $('.handlebars'));
        $('.handlebars').trigger("change");
        $(".handlebarszip").val("zip.file('libraries/handlebars/handlebars.min.js', $(\".handlebars\").val());");
      } else {
        $('.handlebars, .handlebarszip').clear();
      }
      if ( $("#hintcss").is(":checked") ) {
        $('.hintcss').clear();
        download_to_textbox('libraries/hintCSS/hint.min.css', $('.hintcss'));
        $('.hintcss').trigger("change");
        $(".hintcsszip").val("zip.file('libraries/hintCSS/hint.min.css', $(\".hintcss\").val());");
      } else {
        $('.hintcss, .hintcsszip').clear();
      }
      if ( $("#immutable").is(":checked") ) {
        $('.immutable').clear();
        download_to_textbox('libraries/immutable/immutable.min.js', $('.immutable'));
        $('.immutable').trigger("change");
        $(".immutablezip").val("zip.file('libraries/immutable/immutable.min.js', $('.immutable').val());");
      } else {
        $('.immutable, .immutablezip').clear();
      }
      if ( $("#jarallax").is(":checked") ) {
        $('.jarallax').clear();
        download_to_textbox('libraries/jarallax/jarallax.js', $('.jarallax'));
        $('.jarallax').trigger("change");
        $(".jarallaxzip").val("zip.file('libraries/jarallax/jarallax.js', $(\".jarallax\").val());");
      } else {
        $('.jarallax, .jarallaxzip').clear();
      }
      if ( $("#jquery").is(":checked") ) {
        $('.jquery').clear();
        download_to_textbox('libraries/jquery/jquery.js', $('.jquery1'));
        download_to_textbox('libraries/jquery/jquery-migrate-1.2.1.min.js', $('.jquery2'));
        $('.jquery').trigger("change");
        $(".jqueryzip").val("zip.file('libraries/jquery/jquery.js', $(\".jquery1\").val());\nzip.file('libraries/jquery/jquery-migrate-1.2.1.min.js', $(\".jquery2\").val());");
      } else {
        $('.jquery, .jqueryzip').clear();
      }
      if ( $("#jqueryui").is(":checked") ) {
        $('.jqueryui').clear();
        download_to_textbox('libraries/jqueryui/jqueryui.css', $('.jqueryui1'));
        download_to_textbox('libraries/jqueryui/jqueryui.min.js', $('.jqueryui2'));
        download_to_textbox('libraries/jqueryui/jquery.ui.touch-punch.min.js', $('.jqueryui3'));
        $('.jqueryui').trigger("change");
        $(".jqueryuizip").val("zip.file('libraries/jqueryui/jqueryui.css', $(\".jqueryui1\").val());\nzip.file('libraries/jqueryui/jqueryui.min.js', $(\".jqueryui2\").val());\nzip.file('libraries/jqueryui/jquery.ui.touch-punch.min.js', $(\".jqueryui3\").val());");
      } else {
        $('.jqueryui, .jqueryuizip').clear();
      }
      if ( $("#jquerytools").is(":checked") ) {
        $('.jquerytools').clear();
        download_to_textbox('libraries/jquerytools/jquery.tools.min.js', $('.jquerytools'));
        $('.jquerytools').trigger("change");
        $(".jquerytoolszip").val("zip.file('libraries/jquerytools/jquery.tools.min.js', $(\".jquerytools\").val());");
      } else {
        $('.jquerytools, .jquerytoolszip').clear();
      }
      if ( $("#jszip").is(":checked") ) {
        $('.jszip').clear();
        download_to_textbox('libraries/jszip/jszip.min.js', $('.jszip1'));
        download_to_textbox('libraries/jszip/jszip-utils.js', $('.jszip2'));
        download_to_textbox('libraries/jszip/FileSaver.js', $('.jszip3'));
        download_to_textbox('libraries/jszip/Blob.js', $('.jszip4'));
        $('.jszip').trigger("change");
        $(".jszipzip").val("zip.file('libraries/jszip/jszip.min.js', $(\".jszip1\").val());\nzip.file('libraries/jszip/jszip-utils.js', $(\".jszip2\").val());\nzip.file('libraries/jszip/FileSaver.js', $(\".jszip3\").val());\nzip.file('libraries/jszip/Blob.js', $(\".jszip4\").val());");
      } else {
        $('.jszip, .jszipzip').clear();
      }
      if ( $("#jqxsplitter").is(":checked") ) {
        $('.jqxsplitter').clear();

        download_to_textbox('libraries/jqwidgets/styles/jqx.base.css', $('.jqwidgets1'));
        download_to_textbox('libraries/jqwidgets/styles/jqx.android.css', $('.jqwidgets2'));
        download_to_textbox('libraries/jqwidgets/styles/jqx.arctic.css', $('.jqwidgets3'));
        download_to_textbox('libraries/jqwidgets/styles/jqx.black.css', $('.jqwidgets4'));
        download_to_textbox('libraries/jqwidgets/styles/jqx.blackberry.css', $('.jqwidgets5'));
        download_to_textbox('libraries/jqwidgets/styles/jqx.bootstrap.css', $('.jqwidgets6'));
        download_to_textbox('libraries/jqwidgets/styles/jqx.classic.css', $('.jqwidgets7'));
        download_to_textbox('libraries/jqwidgets/styles/jqx.darkblue.css', $('.jqwidgets8'));
        download_to_textbox('libraries/jqwidgets/styles/jqx.energyblue.css', $('.jqwidgets9'));
        download_to_textbox('libraries/jqwidgets/styles/jqx.fresh.css', $('.jqwidgets10'));
        download_to_textbox('libraries/jqwidgets/styles/jqx.highcontrast.css', $('.jqwidgets11'));
        download_to_textbox('libraries/jqwidgets/styles/jqx.metro.css', $('.jqwidgets12'));
        download_to_textbox('libraries/jqwidgets/styles/jqx.metrodark.css', $('.jqwidgets13'));
        download_to_textbox('libraries/jqwidgets/styles/jqx.mobile.css', $('.jqwidgets14'));
        download_to_textbox('libraries/jqwidgets/styles/jqx.office.css', $('.jqwidgets15'));
        download_to_textbox('libraries/jqwidgets/styles/jqx.orange.css', $('.jqwidgets16'));
        download_to_textbox('libraries/jqwidgets/styles/jqx.shinyblack.css', $('.jqwidgets17'));
        download_to_textbox('libraries/jqwidgets/styles/jqx.summer.css', $('.jqwidgets18'));
        download_to_textbox('libraries/jqwidgets/styles/jqx.ui-darkness.css', $('.jqwidgets19'));
        download_to_textbox('libraries/jqwidgets/styles/jqx.ui-le-frog.css', $('.jqwidgets20'));
        download_to_textbox('libraries/jqwidgets/styles/jqx.ui-lightness.css', $('.jqwidgets21'));
        download_to_textbox('libraries/jqwidgets/styles/jqx.ui-overcast.css', $('.jqwidgets22'));
        download_to_textbox('libraries/jqwidgets/styles/jqx.ui-redmond.css', $('.jqwidgets23'));
        download_to_textbox('libraries/jqwidgets/styles/jqx.ui-smoothness.css', $('.jqwidgets24'));
        download_to_textbox('libraries/jqwidgets/styles/jqx.ui-start.css', $('.jqwidgets25'));
        download_to_textbox('libraries/jqwidgets/styles/jqx.ui-sunny.css', $('.jqwidgets26'));
        download_to_textbox('libraries/jqwidgets/styles/jqx.web.css', $('.jqwidgets27'));
        download_to_textbox('libraries/jqwidgets/styles/jqx.windowsphone.css', $('.jqwidgets28'));
        download_to_textbox('libraries/jqwidgets/jqxcore.js', $('.jqwidgets29'));
        download_to_textbox('libraries/jqwidgets/jqxsplitter.js', $('.jqwidgets30'));

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
        download_to_textbox('libraries/kinetic/kinetic.js', $('.kinetic'));
        $('.kinetic').trigger("change");
        $(".kineticzip").val("zip.file('libraries/kinetic/kinetic.js', $(\".kinetic\").val());");
      } else {
        $('.kinetic, .kineticzip').clear();
      }
      if ( $("#knockout").is(":checked") ) {
        $('.knockout').clear();
        download_to_textbox('libraries/knockout/knockout.js', $('.knockout'));
        $('.knockout').trigger("change");
        $(".knockoutzip").val("zip.file('libraries/knockout/knockout.js', $(\".knockout\").val());");
      } else {
        $('.knockout, .knockoutzip').clear();
      }
      if ( $("#immutable").is(":checked") ) {
        $('.immutable').clear();
        download_to_textbox('libraries/immutable/lodash.core.js', $('.lodash'));
        $('.lodash').trigger("change");
        $(".lodashzip").val("zip.file('libraries/immutable/lodash.core.js', $('.lodash').val());");
      } else {
        $('.lodash, .lodashzip').clear();
      }
      if ( $("#mdl").is(":checked") ) {
        $('.mdl').clear();
        download_to_textbox('libraries/mdl/material.min.css', $('.mdl1'));
        download_to_textbox('libraries/mdl/material.min.js', $('.mdl2'));
        $('.mdl1, .mdl2').trigger("change");
        $(".mdlzip").val("zip.file('libraries/mdl/material.min.css', $('.mdl1').val());\n  zip.file('libraries/mdl/material.min.js', $('.mdl2').val());");
      } else {
        $('.mdl, .mdlzip').clear();
      }
      if ( $("#moment").is(":checked") ) {
        $('.moment').clear();
        download_to_textbox('libraries/moment/moment.js', $('.moment'));
        download_to_textbox('libraries/moment/moment-with-locales.js', $('.moment'));
        $('.moment').trigger("change");
        $(".momentzip").val("zip.file('libraries/moment/moment.js', $(\".moment1\").val());\nzip.file('libraries/moment/moment-with-locales.js', $(\".moment2\").val());");
      } else {
        $('.moment, .momentzip').clear();
      }
      if ( $("#momenttimezone").is(":checked") ) {
        $('.momenttimezone').clear();
        download_to_textbox('libraries/moment-timezone/moment-timezone-with-data-2012-2022.js', $('.momenttimezone1'));
        download_to_textbox('libraries/moment-timezone/moment-timezone-with-data.js', $('.momenttimezone2'));
        download_to_textbox('libraries/moment-timezone/moment-timezone.js', $('.momenttimezone3'));
        $('.momenttimezone').trigger("change");
        $(".momenttimezonezip").val("zip.file('libraries/moment/moment.js', $(\".momenttimezone1\").val());\nzip.file('libraries/moment/moment.js', $(\".momenttimezone2\").val());\nzip.file('libraries/moment/moment.js', $(\".momenttimezone3\").val());");
      } else {
        $('.momenttimezone, .momenttimezonezip').clear();
      }
      if ( $("#modernizer").is(":checked") ) {
        $('.modernizer').clear();
        download_to_textbox('libraries/modernizer/modernizer.js', $('.modernizer'));
        $('.modernizer').trigger("change");
        $(".modernizerzip").val("zip.file('libraries/modernizer/modernizer.js', $(\".modernizer\").val());");
      } else {
        $('.modernizer, .modernizerzip').clear();
      }
      if ( $("#mootools").is(":checked") ) {
        $('.mootools').clear();
        download_to_textbox('libraries/mootools/mootools-yui-compressed.js', $('.mootools'));
        $('.mootools').trigger("change");
        $(".mootoolszip").val("zip.file('libraries/mootools/mootools-yui-compressed.js', $(\".mootools\").val());");
      } else {
        $('.mootools, .mootoolszip').clear();
      }
      if ( $("#normalize").is(":checked") ) {
        $('.normalize').clear();
        download_to_textbox('libraries/normalize/normalize.css', $('.normalize'));
        $('.normalize').trigger("change");
        $(".normalizezip").val("zip.file('libraries/normalize/normalize.css', $(\".normalize\").val());");
      } else {
        $('.normalize, .normalizezip').clear();
      }
      if ( $("#paperjs").is(":checked") ) {
        $('.paperjs').clear();
        download_to_textbox('libraries/paperjs/paperjs.js', $('.paperjs'));
        $('.paperjs').trigger("change");
        $(".paperjszip").val("zip.file('libraries/paperjs/paperjs.js', $(\".paperjs\").val());");
      } else {
        $('.paperjs, .paperjszip').clear();
      }
      if ( $("#polyui").is(":checked") ) {
        $('.polyui').clear();
        download_to_textbox('libraries/polyui/polyui.css', $('.polyui'));
        $('.polyui').trigger("change");
        $(".polyuizip").val("zip.file('libraries/polyui/polyui.css', $(\".polyui\").val());");
      } else {
        $('.polyui, .polyuizip').clear();
      }
      if ( $("#prefixfree").is(":checked") ) {
        $('.prefixfree').clear();
        download_to_textbox('libraries/prefixfree/prefixfree.min.js', $('.prefixfree'));
        $('.prefixfree').trigger("change");
        $(".prefixfreezip").val("zip.file('libraries/prefixfree/prefixfree.min.js', $(\".prefixfree\").val());");
      } else {
        $('.prefixfree, .prefixfreezip').clear();
      }
      if ( $("#processingjs").is(":checked") ) {
        $('.processingjs').clear();
        download_to_textbox('libraries/processingjs/processingjs.js', $('.processingjs'));
        $('.processingjs').trigger("change");
        $(".processingjszip").val("zip.file('libraries/processingjs/processingjs.js', $(\".processingjs\").val());");
      } else {
        $('.processingjs, .processingjsszip').clear();
      }
      if ( $("#prototypejs").is(":checked") ) {
        $('.prototypejs').clear();
        download_to_textbox('libraries/prototypejs/prototypejs.js', $('.prototypejs'));
        $('.prototypejs').trigger("change");
        $(".prototypejszip").val("zip.file('libraries/prototypejs/prototypejs.js', $(\".prototypejs\").val());");
      } else {
        $('.prototypejs, .prototypejszip').clear();
      }
      if ( $("#qooxdoo").is(":checked") ) {
        $('.qooxdoo').clear();
        download_to_textbox('libraries/qooxdoo/qooxdoo.js', $('.qooxdoo'));
        $('.qooxdoo').trigger("change");
        $(".qooxdooszip").val("zip.file('libraries/qooxdoo/qooxdoo.js', $(\".qooxdoo\").val());");
      } else {
        $('.qooxdoo, .qooxdooszip').clear();
      }
      if ( $("#react").is(":checked") ) {
        $('.react').clear();
        download_to_textbox('libraries/react/react-with-addons.js', $('.react1'));
        download_to_textbox('libraries/react/react-dom.js', $('.react2'));
        $('.react1, .react2').trigger("change");
        $(".reactzip").val("zip.file('libraries/react/react-with-addons.js', $('.react1').val());\n  zip.file('libraries/react/react-dom.js', $('.react2').val());");
      } else {
        $('.react, .reactzip').clear();
      }
      if ( $("#raphael").is(":checked") ) {
        $('.raphael').clear();
        download_to_textbox('libraries/raphael/raphael.js', $('.raphael'));
        $('.raphael').trigger("change");
        $(".raphaelzip").val("zip.file('libraries/raphael/raphael.js', $(\".raphael\").val());");
      } else {
        $('.raphael, .raphaelzip').clear();
      }
      if ( $("#requirejs").is(":checked") ) {
        $('.requirejs').clear();
        download_to_textbox('libraries/require/require.js', $('.requirejs'));
        $('.requirejs').trigger("change");
        $(".requirejszip").val("zip.file('libraries/require/require.js', $(\".requirejs\").val());");
      } else {
        $('.requirejs, .requirejszip').clear();
      }
      if ( $("#showdown").is(":checked") ) {
        $('.showdown').clear();
        download_to_textbox('libraries/showdown/Showdown.min.js', $('.showdown'));
        $('.showdown').trigger("change");
        $(".showdownzip").val("zip.file('libraries/showdown/Showdown.min.js', $(\".showdown\").val());");
      } else {
        $('.showdown, .showdownzip').clear();
      }
      if ( $("#scriptaculous").is(":checked") ) {
        $('.scriptaculous').clear();
        download_to_textbox('libraries/scriptaculous/scriptaculous.js', $('.scriptaculous'));
        $('.scriptaculous').trigger("change");
        $(".scriptaculouszip").val("zip.file('libraries/scriptaculous/scriptaculous.js', $(\".scriptaculous\").val());");
      } else {
        $('.scriptaculous, .scriptaculouszip').clear();
      }
      if ( $("#smoothscroll").is(":checked") ) {
        $('.smoothscroll').clear();
        download_to_textbox('libraries/snap-svg/snap-svg.js', $('.smoothscroll'));
        $('.smoothscroll').trigger("change");
        $(".smoothscrollzip").val("zip.file('libraries/SmoothScroll/SmoothScroll.js', $(\".smoothscroll\").val());");
      } else {
        $('.smoothscroll, .smoothscrollzip').clear();
      }
      if ( $("#snapsvg").is(":checked") ) {
        $('.snapsvg').clear();
        download_to_textbox('libraries/snap-svg/snap-svg.js', $('.snapsvg'));
        $('.snapsvg').trigger("change");
        $(".snapsvgzip").val("zip.file('libraries/snap-svg/snap-svg.js', $(\".snapsvg\").val());");
      } else {
        $('.snapsvg, .snapsvgzip').clear();
      }
      if ( $("#svgjs").is(":checked") ) {
        $('.svgjs').clear();
        download_to_textbox('libraries/svg-svg/svg-svg.js', $('.svgjs'));
        $('.svgjs').trigger("change");
        $(".svgjszip").val("zip.file('libraries/svg-svg/svg-svg.js', $(\".svgjs\").val());");
      } else {
        $('.svgjs, .svgjszip').clear();
      }
      if ( $("#sweetalert2").is(":checked") ) {
        $('.sweetalert').clear();
        download_to_textbox('libraries/sweetalert2/sweetalert2.min.css', $('.sweetalert1'));
        download_to_textbox('libraries/sweetalert2/sweetalert2.min.js', $('.sweetalert2'));
        $('.sweetalert').trigger("change");
        $(".sweetalertzip").val("zip.file('libraries/sweetalert2/sweetalert2.min.css', $(\".sweetalert1\").val());\nzip.file('libraries/sweetalert2/sweetalert2.min.js', $(\".sweetalert2\").val());");
      } else {
        $('.sweetalert, .sweetalertzip').clear();
      }
      if ( $("#threejs").is(":checked") ) {
        $('.threejs').clear();
        download_to_textbox('libraries/threejs/three.min.js', $('.threejs'));
        $('.threejs').trigger("change");
        $(".threejszip").val("zip.file('libraries/threejs/three.min.js', $(\".threejs\").val());");
      } else {
        $('.threejs, .threejszip').clear();
      }
      if ( $("#uikit").is(":checked") ) {
        $('.uikit').clear();
        download_to_textbox('libraries/uikit/css/uikit.css', $('.uikit1'));
        download_to_textbox('libraries/uikit/js/uikit.js', $('.uikit2'));
        download_to_textbox('libraries/uikit/js/uikit-icons.js', $('.uikit3'));
        $('.uikit').trigger("change");
        $(".uikitzip").val("zip.file('libraries/uikit/css/uikit.css', $('.uikit1').val());\n  zip.file('libraries/uikit/js/uikit.js', $('.uikit2').val());\n  zip.file('libraries/uikit/js/uikit-icons.js', $('.uikit3').val());");
      } else {
        $('.uikit, .uikitzip').clear();
      }
      if ( $("#underscorejs").is(":checked") ) {
        $('.underscorejs').clear();
        download_to_textbox('libraries/underscore/underscore.js', $('.underscorejs'));
        $('.underscorejs').trigger("change");
        $(".underscorejszip").val("zip.file('libraries/underscore/underscore.js', $(\".underscorejs\").val());");
      } else {
        $('.underscorejs, .underscorejszip').clear();
      }
      if ( $("#vue").is(":checked") ) {
        $('.vue').clear();
        download_to_textbox('libraries/vue/vue.js', $('.vue'));
        $('.vue').trigger("change");
        $(".vuezip").val("zip.file('libraries/vue/vue.js', $('.vue').val());");
      } else {
        $('.vue, .vuezip').clear();
      }
      if ( $("#webfontloader").is(":checked") ) {
        $('.webfontloader').clear();
        download_to_textbox('libraries/webfont/webfont.js', $('.webfontloader'));
        $('.webfontloader').trigger("change");
        $(".webfontloaderzip").val("zip.file('libraries/webfont/webfont.js', $(\".webfontloader\").val());");
      } else {
        $('.webfontloader, .webfontloaderzip').clear();
      }
      if ( $("#yui").is(":checked") ) {
        $('.yui').clear();
        download_to_textbox('libraries/yui/yui.js', $('.yui'));
        $('.yui').trigger("change");
        $(".yuizip").val("zip.file('libraries/yui/yui.js', $(\".yui\").val());");
      } else {
        $('.yui, .yuizip').clear();
      }
      if ( $("#zepto").is(":checked") ) {
        $('.zepto').clear();
        download_to_textbox('libraries/zepto/zepto.js', $('.zepto'));
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
    },
    openWeave = function(selector) {
      var data = {
        "files": JSON.parse($(selector).nextAll('textarea').val())
      };
      
      var htmlVal       = data.files.files["index.html"];
      var jadeVal       = data.files.files["index.jade"];
      var cssVal        = data.files.files["index.css"];
      var stylusVal     = data.files.files["index.styl"];
      var lessVal       = data.files.files["index.less"];
      var scssVal       = data.files.files["index.scss"];
      var sassVal       = data.files.files["index.sass"];
      var jsVal         = data.files.files["index.js"];
      var coffeeVal     = data.files.files["index.coffee"];
      var typescriptVal = data.files.files["index.ts"];
      var babelVal      = data.files.files["index.jsx"];
      var mdVal         = data.files.files["README.md"];
      var jsonSets      = data.files.files["settings.json"].content;
      var jsonLibs      = data.files.files["libraries.json"].content;

      // Return font settings from json
      var siteTitle      = JSON.parse(jsonSets).siteTitle;
      var WeaveVersion   = JSON.parse(jsonSets).version;
      var editorFontSize = JSON.parse(jsonSets).editorFontSize;
      var WeaveDesc      = JSON.parse(jsonSets).description;
      var WeaveAuthor    = JSON.parse(jsonSets).author;
      
      $("[data-action=sitetitle]").val(siteTitle);
      $("[data-value=version]").val(WeaveVersion);
      $("[data-editor=fontSize]").val(editorFontSize);
      $("[data-action=sitedesc]").val(WeaveDesc);
      $("[data-action=siteauthor]").val(WeaveAuthor);
      storeValues();

      // Return settings from the json
      $(".metaboxes input.heading").trigger("keyup");
      $(".addlibrary-tablets input.check:checked").trigger('click');

      // Return libraries from json
      $.each(JSON.parse(jsonLibs), function(name, value) {
        $(".ldd-submenu #" + name).prop("checked", value).trigger("keyup");
      });

      // Set checked libraries into preview
      $("#jquery").trigger("keyup");

      // Return the editor's values
      if (mdVal) {
        mdEditor.setValue(mdVal.content);
      }
      if (htmlVal) {
        htmlEditor.setValue(htmlVal.content);
        $("#html-preprocessor").val("none").trigger("change");
      }
      if (jadeVal) {
        htmlEditor.setValue(jadeVal.content);
        $("#html-preprocessor").val("jade").trigger("change");
      }
      if (!htmlVal && !jadeVal) {
        htmlEditor.setValue("");
      }
      if (!htmlVal && !jadeVal && mdVal) {
        var selectEditor = document.getElementById("selectEditor");
        if (!selectEditor.checked) {
          $("#selectEditor").trigger("click");
          // Change grid to only show markdown
          $("#splitContainer").jqxSplitter({
            height: "auto",
            width: "100%",
            orientation: "vertical",
            showSplitBar: true,
            panels: [{ size: "50%",collapsible:false },
                     { size: "50%" }]
          });
          $("#leftSplitter").jqxSplitter({
            width: "100%",
            height: "100%",
            orientation: "horizontal",
            showSplitBar: true,
            panels: [{ size: "50%",collapsible:false },
                     { size: "0%" }]
          }).jqxSplitter("collapse");
          $("#rightSplitter").jqxSplitter({
            width: "100%",
            height: "100%",
            orientation: "horizontal",
            showSplitBar: true,
            panels: [{ size: "0%",collapsible:false },
                     { size: "50%" }]
          });
        }
      }
      if (cssVal) {
        cssEditor.setValue(cssVal.content);
        $("#css-preprocessor").val("none").trigger("change");
      }
      if (stylusVal) {
        cssEditor.setValue(stylusVal.content);
        $("#css-preprocessor").val("stylus").trigger("change");
      }
      if (lessVal) {
        cssEditor.setValue(lessVal.content);
        $("#css-preprocessor").val("less").trigger("change");
      }
      if (scssVal) {
        cssEditor.setValue(scssVal.content);
        $("#css-preprocessor").val("scss").trigger("change");
      }
      if (sassVal) {
        cssEditor.setValue(sassVal.content);
        $("#css-preprocessor").val("sass").trigger("change");
      }
      if (!cssVal && !stylusVal && !lessVal && !scssVal && !sassVal) {
        cssEditor.setValue("");
      }
      if (jsVal) {
        jsEditor.setValue(jsVal.content);
        $("#js-preprocessor").val("none").trigger("change");
      }
      if (coffeeVal) {
        jsEditor.setValue(coffeeVal.content);
        $("#js-preprocessor").val("coffeescript").trigger("change");
      }
      if (typescriptVal) {
        jsEditor.setValue(typescriptVal.content);
        $("#js-preprocessor").val("typescript").trigger("change");
      }
      if (babelVal) {
        jsEditor.setValue(babelVal.content);
        $("#js-preprocessor").val("babel").trigger("change");
      }
      if (!jsVal && !coffeeVal && !typescriptVal && !babelVal) {
        jsEditor.setValue("");
      }

      setTimeout(function() {
        mdEditor.setOption("paletteHints", "true");
        htmlEditor.setOption("paletteHints", "true");
        cssEditor.setOption("paletteHints", "true");
        jsEditor.setOption("paletteHints", "true");
      }, 300);
      return false;
    },
    handleWeaves = function() {
      $(".savedweave").on('click', function() {
        $("input[name=menubar].active").trigger("click");
        openWeave(this);
      });
      $(".delweave").on('click', function() {
        $(this).parent().remove();
        if (!$("[data-saved=libraries]").html()) {
          $("[data-saved=libraries]").text("No weave's have been saved");
        }
        localStorage.setItem("savedWeaves", $("[data-saved=libraries]").html());
      });
    };

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
};

// IntelliSense with Tern
function getURL(url, c) {
  var xhr = new XMLHttpRequest();
  xhr.open("get", url, true);
  xhr.send();
  xhr.onreadystatechange = function() {
    if (xhr.readyState != 4) return;
    if (xhr.status < 400) return c(null, xhr.responseText);
    var e = new Error(xhr.responseText || "No response");
    e.status = xhr.status;
    c(e);
  };
}

getURL("https://ternjs.net/defs/ecma5.json", function(err, code) {
  if (err) throw new Error("Request for ecma5.json: " + err);
  server = new CodeMirror.TernServer({defs: [JSON.parse(code)]});
  jsEditor.on("cursorActivity", function(cm) { server.updateArgHints(cm); });
});

// Initialize Editors
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
    "Ctrl-Q": function(cm){ cm.foldCode(cm.getCursor()); },
    "Ctrl-'": function(){ applyLowercase(); },
    "Ctrl-\\": function(){ applyUppercase(); },
    "Ctrl-I": function(){ applyDuplication(); },
    "Cmd-'": function(){ applyLowercase(); },
    "Cmd-\\": function(){ applyUppercase(); },
    "Cmd-I": function(){ applyDuplication(); },
    "Shift-Ctrl-'": function(){ applyMinify(); },
    "Shift-Ctrl-\\": function(){ applyBeautify(); },
    "Shift-Cmd-'": function(){ applyMinify(); },
    "Shift-Cmd-\\": function(){ applyBeautify(); },
    "Cmd-L": function(){ $("[data-action=gotoline]").trigger("click"); },
    "Ctrl-L": function(){ $("[data-action=gotoline]").trigger("click"); },
    "Alt-Delete": function(cm){ cm.execCommand("delWordAfter"); },
    "Alt-Shift-Cmd-[": function(cm){ 
      for (var l = cm.firstLine(); l <= cm.lastLine(); ++l) {
        cm.foldCode({line: l, ch: 0}, null, "fold");
      }
    },
    "Alt-Shift-Ctrl-[": function(cm){ 
      for (var l = cm.firstLine(); l <= cm.lastLine(); ++l) {
        cm.foldCode({line: l, ch: 0}, null, "fold");
      }
    },
    "Alt-Shift-Cmd-]": function(cm){ 
      for (var l = cm.firstLine(); l <= cm.lastLine(); ++l) {
        cm.foldCode({line: l, ch: 0}, null, "unfold");
      }
    },
    "Alt-Shift-Ctrl-]": function(cm){ 
      for (var l = cm.firstLine(); l <= cm.lastLine(); ++l) {
        cm.foldCode({line: l, ch: 0}, null, "unfold");
      }
    }
  },
  value: "<!-- comment -->\nhello world!",
  paletteHints: true
});
Inlet(htmlEditor);
emmetCodeMirror(htmlEditor);
var cssEditor = CodeMirror(document.getElementById("cssEditor"), {
  mode: "css",
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
    "Ctrl-Q": function(cm){ cm.foldCode(cm.getCursor()); },
    "Ctrl-'": function(){ applyLowercase(); },
    "Ctrl-\\": function(){ applyUppercase(); },
    "Ctrl-I": function(){ applyDuplication(); },
    "Cmd-'": function(){ applyLowercase(); },
    "Cmd-\\": function(){ applyUppercase(); },
    "Cmd-I": function(){ applyDuplication(); },
    "Shift-Ctrl-'": function(){ applyMinify(); },
    "Shift-Ctrl-\\": function(){ applyBeautify(); },
    "Shift-Cmd-'": function(){ applyMinify(); },
    "Shift-Cmd-\\": function(){ applyBeautify(); },
    "Cmd-L": function(){ $("[data-action=gotoline]").trigger("click"); },
    "Ctrl-L": function(){ $("[data-action=gotoline]").trigger("click"); },
    "Alt-Delete": function(cm){ cm.execCommand("delWordAfter"); },
    "Alt-Shift-Cmd-[": function(cm){ 
      for (var l = cm.firstLine(); l <= cm.lastLine(); ++l) {
        cm.foldCode({line: l, ch: 0}, null, "fold");
      }
    },
    "Alt-Shift-Ctrl-[": function(cm){ 
      for (var l = cm.firstLine(); l <= cm.lastLine(); ++l) {
        cm.foldCode({line: l, ch: 0}, null, "fold");
      }
    },
    "Alt-Shift-Cmd-]": function(cm){ 
      for (var l = cm.firstLine(); l <= cm.lastLine(); ++l) {
        cm.foldCode({line: l, ch: 0}, null, "unfold");
      }
    },
    "Alt-Shift-Ctrl-]": function(cm){ 
      for (var l = cm.firstLine(); l <= cm.lastLine(); ++l) {
        cm.foldCode({line: l, ch: 0}, null, "unfold");
      }
    }
  },
  paletteHints: true
});
Inlet(cssEditor);
emmetCodeMirror(cssEditor);
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
  extraKeys: {
    "Ctrl-Q": function(cm){ cm.foldCode(cm.getCursor()); },
    "Ctrl-'": function(){ applyLowercase(); },
    "Ctrl-\\": function(){ applyUppercase(); },
    "Ctrl-I": function(){ applyDuplication(); },
    "Cmd-'": function(){ applyLowercase(); },
    "Cmd-\\": function(){ applyUppercase(); },
    "Cmd-I": function(){ applyDuplication(); },
    "Shift-Ctrl-'": function(){ applyMinify(); },
    "Shift-Ctrl-\\": function(){ applyBeautify(); },
    "Shift-Cmd-'": function(){ applyMinify(); },
    "Shift-Cmd-\\": function(){ applyBeautify(); },
    "Ctrl-Space": "autocomplete",
    "Cmd-L": function(){ $("[data-action=gotoline]").trigger("click"); },
    "Ctrl-L": function(){ $("[data-action=gotoline]").trigger("click"); },
    "Alt-Delete": function(cm){ cm.execCommand("delWordAfter"); },
    "Alt-Shift-Cmd-[": function(cm){ 
      for (var l = cm.firstLine(); l <= cm.lastLine(); ++l) {
        cm.foldCode({line: l, ch: 0}, null, "fold");
      }
    },
    "Alt-Shift-Ctrl-[": function(cm){ 
      for (var l = cm.firstLine(); l <= cm.lastLine(); ++l) {
        cm.foldCode({line: l, ch: 0}, null, "fold");
      }
    },
    "Alt-Shift-Cmd-]": function(cm){ 
      for (var l = cm.firstLine(); l <= cm.lastLine(); ++l) {
        cm.foldCode({line: l, ch: 0}, null, "unfold");
      }
    },
    "Alt-Shift-Ctrl-]": function(cm){ 
      for (var l = cm.firstLine(); l <= cm.lastLine(); ++l) {
        cm.foldCode({line: l, ch: 0}, null, "unfold");
      }
    },
    "Cmd-/": function(cm){ 
      for (var line = cm.getCursor("to").line; line >= cm.getCursor("from").line; line--) {
        cm.replaceRange("// ", {line: line, ch: 0});
      }
    },
    "Ctrl-/": function(cm){ 
      for (var line = cm.getCursor("to").line; line >= cm.getCursor("from").line; line--) {
        cm.replaceRange("// ", {line: line, ch: 0});
      }
    }
  },
  mode: {name: "javascript", globalVars: false},
  paletteHints: true
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
  dragDrop: true,
  gutters: ["CodeMirror-linenumbers"],
  extraKeys: {
    "Enter": "newlineAndIndentContinueMarkdownList",
    "Ctrl-Q": function(cm){ cm.foldCode(cm.getCursor()); },
    "Ctrl-'": function(){ applyLowercase(); },
    "Ctrl-\\": function(){ applyUppercase(); },
    "Ctrl-I": function(){ applyDuplication(); },
    "Cmd-'": function(){ applyLowercase(); },
    "Cmd-\\": function(){ applyUppercase(); },
    "Cmd-I": function(){ applyDuplication(); },
    "Shift-Ctrl-'": function(){ applyMinify(); },
    "Shift-Ctrl-\\": function(){ applyBeautify(); },
    "Shift-Cmd-'": function(){ applyMinify(); },
    "Shift-Cmd-\\": function(){ applyBeautify(); },
    "Cmd-L": function(){ $("[data-action=gotoline]").trigger("click"); },
    "Ctrl-L": function(){ $("[data-action=gotoline]").trigger("click"); },
    "Alt-Delete": function(cm){ cm.execCommand("delWordAfter"); },
    "Alt-Shift-Cmd-[": function(cm){ 
      for (var l = cm.firstLine(); l <= cm.lastLine(); ++l) {
        cm.foldCode({line: l, ch: 0}, null, "fold");
      }
    },
    "Alt-Shift-Ctrl-[": function(cm){ 
      for (var l = cm.firstLine(); l <= cm.lastLine(); ++l) {
        cm.foldCode({line: l, ch: 0}, null, "fold");
      }
    },
    "Alt-Shift-Cmd-]": function(cm){ 
      for (var l = cm.firstLine(); l <= cm.lastLine(); ++l) {
        cm.foldCode({line: l, ch: 0}, null, "unfold");
      }
    },
    "Alt-Shift-Ctrl-]": function(cm){ 
      for (var l = cm.firstLine(); l <= cm.lastLine(); ++l) {
        cm.foldCode({line: l, ch: 0}, null, "unfold");
      }
    }
  }
});

if ( localStorage.getItem("htmlData")) {
  htmlEditor.setValue(localStorage.getItem("htmlData"));
}
if ( localStorage.getItem("cssData")) {
  cssEditor.setValue(localStorage.getItem("cssData"));
}
if ( localStorage.getItem("jsData")) {
  jsEditor.setValue(localStorage.getItem("jsData"));
}
if ( localStorage.getItem("mdData")) {
  mdEditor.setValue(localStorage.getItem("mdData"));
}

// Initialize Open and Close for HTML editor
var openHTML = CodeMirror(document.getElementById("openHTML"), {
  mode: "text/html",
  value: "<!DOCTYPE html>\n<html>\n  <head>\n    <title>"
});
var sitedesc = ( document.querySelector("[data-action=sitedesc]").value === "" ? "" : "    <meta name=\"description\" content=\""+ document.querySelector("[data-action=sitedesc]").value +"\">\n" );
var siteauthor = ( document.querySelector("[data-action=siteauthor]").value === "" ? "" : "    <meta name=\"author\" content=\""+ document.querySelector("[data-action=siteauthor]").value +"\">\n" );
var closeHTML = CodeMirror(document.getElementById("closeHTML"), {
  mode: "text/html",
  value: "</title>\n    <meta charset=\"utf-8\">\n    <meta name=\"viewport\" content=\"initial-scale=1.0\">\n" + sitedesc + siteauthor + "    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=9\" />\n"
});
var closeRefs = CodeMirror(document.getElementById("closeRefs"), {
  mode: "text/html",
  value: "  </head>\n  <body>\n"
});
var closeFinal = CodeMirror(document.getElementById("closeFinal"), {
  mode: "text/html",
  value: "\n  </body>\n</html>"
});

// Render Chosen CSS Preprocessor
function cssPreProcessor(cssSelected) {
  cssSelected = $("#css-preprocessor  option:selected").val();

  if (cssSelected == "none") {
    cssContent = cssEditor.getValue();
    $("#preview").contents().find("#b8c770cc").html(cssContent);
  } else if (cssSelected == "stylus") {
    var cssVal = cssEditor.getValue();
    stylus(cssVal).render(function(err, out) {
      if(err !== null) {
        console.error("something went wrong");
      } else {
        cssContent = out;
        $("#preview").contents().find("#b8c770cc").html(cssContent);
      }
    });
  } else if (cssSelected == "less") {
    var cssVal = cssEditor.getValue();
    less.render(cssVal, function (e, output) {
      cssContent = output.css;
      $("#preview").contents().find("#b8c770cc").html(cssContent);
    });
  } else if (cssSelected == "scss" || cssSelected == "sass") {
    var cssVal = cssEditor.getValue();

    sass.compile(cssVal, function(result) {
      cssContent = result.text;
      $("#preview").contents().find("#b8c770cc").html(cssContent);
    });
  }
}

// Live preview
function updatePreview() {
  $(".preview-editor").empty();
  var frame = document.createElement("iframe");
  frame.setAttribute("id", "preview");
  frame.setAttribute("sandbox", "allow-forms allow-modals allow-pointer-lock allow-popups allow-same-origin allow-scripts");
  document.querySelector(".preview-editor").appendChild(frame);
  var previewFrame = document.getElementById("preview");
  var preview =  previewFrame.contentDocument ||  previewFrame.contentWindow.document;
  var heading = openHTML.getValue() + document.querySelector("[data-action=sitetitle]").value + closeHTML.getValue() + document.querySelector("[data-action=library-code]").value + "    <link rel=\"stylesheet\" href=\"libraries/font-awesome/font-awesome.css\">\n" + "    <link rel=\"stylesheet\" href=\"libraries/font-awesome/macset.css\">\n" + "<script src=\"    lib/screenlog.js\"></script>";
  preview.open();
  var htmlSelected = $("#html-preprocessor option:selected").val();
  var jsSelected   = $("#js-preprocessor   option:selected").val();
  
  cssPreProcessor();
  
  if ( jsSelected == "none") {
    jsContent = "<script>screenLog.init({ autoScroll: false });\n\n" + jsEditor.getValue() + "</script>";
  } else if ( jsSelected == "coffeescript") {
    jsContent = "<script>screenLog.init({ autoScroll: false });</script><script>" + CoffeeScript.compile(jsEditor.getValue(), { bare: true }) + "</script>";
  } else if ( jsSelected == "typescript") {
    jsContent = "<script>screenLog.init({ autoScroll: false });</script><script type='text/typescript'>" + jsEditor.getValue() + "</script>\n    <script src='lib/typescript.min.js'></script>\n    <script src='lib/typescript.compile.min.js'></script>";
  } else if ( jsSelected == "babel") {
    var result = Babel.transform(jsEditor.getValue(), {
      presets: ['latest', 'stage-2', 'react']
    });
    jsContent = "<script>screenLog.init({ autoScroll: false });\n\n" + result.code + "</script>";
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
function markdownPreview() {
  $(".preview-editor").empty();
  var frame = document.createElement("iframe");
  frame.setAttribute("id", "preview");
  frame.setAttribute("sandbox", "allow-forms allow-modals allow-pointer-lock allow-popups allow-same-origin allow-scripts");
  document.querySelector(".preview-editor").appendChild(frame);
  var mdconverter = new Showdown.converter(),
      previewFrame = document.getElementById("preview"),
      preview =  previewFrame.contentDocument ||  previewFrame.contentWindow.document;

  preview.open();
  preview.write( mdconverter.makeHtml( mdEditor.getValue() ) );
  preview.close();
}
markdownPreview();
updatePreview();

var cancel = setTimeout(function() {
  updatePreview();
}, 300);

// Toggle Auto Update Preview
var checkedPrev = JSON.parse(localStorage.getItem("autoUpdate"));
// If checkedPrev === null then the use has never been here before.
// Make checkedPrev default to true
checkedPrev = checkedPrev === null ? true : false;
var changePrev = document.getElementById("changePrev");
changePrev.checked = checkedPrev;
(changePrev.checked) ? $("#runeditor").hide() : $("#runeditor").show();

$("#changePrev").on("change", function() {
  (this.checked) ? localStorage.setItem("autoUpdate", "true") : localStorage.setItem("autoUpdate", "false");
  callPrev();
  (this.checked) ? $("#runeditor").hide() : $("#runeditor").show();
  $("input[name=menubar].active").trigger("click");
}).trigger("change");

function callPrev() {
  htmlEditor.on("change", function() {
    if (changePrev.checked) {
      clearTimeout(cancel);
      setTimeout(function() {
        updatePreview();
      }, 300);
      localStorage.setItem("htmlData", htmlEditor.getValue());

      setTimeout(function() {
        htmlEditor.setOption("paletteHints", "true");
      }, 300);
      return false;
    } else {
      localStorage.setItem("htmlData", htmlEditor.getValue());

      setTimeout(function() {
        htmlEditor.setOption("paletteHints", "true");
      }, 300);
    }
  });
  cssEditor.on("change", function() {
    cssPreProcessor();
    $("#preview").contents().find("#b8c770cc").html(cssContent);
    localStorage.setItem("cssData", cssEditor.getValue());

    setTimeout(function() {
      cssEditor.setOption("paletteHints", "true");
    }, 300);
    return false;
  });
  jsEditor.on("change", function() {
    if (changePrev.checked) {
      clearTimeout(cancel);
      setTimeout(function() {
        updatePreview();
      }, 300);
      localStorage.setItem("jsData", jsEditor.getValue());

      setTimeout(function() {
        jsEditor.setOption("paletteHints", "true");
      }, 300);
      return false;
    } else {
      localStorage.setItem("jsData", jsEditor.getValue());

      setTimeout(function() {
        jsEditor.setOption("paletteHints", "true");
      }, 300);
    }
  });
  return false;
}

mdEditor.on("change", function() {
  markdownPreview();
  localStorage.setItem("mdData", mdEditor.getValue());

  setTimeout(function() {
    mdEditor.setOption("paletteHints", "true");
  }, 300);
});

// Don't add to code, replace with new drop file's code
htmlEditor.on("drop", function() {
  htmlEditor.setValue("");
});
cssEditor.on("drop", function() {
  cssEditor.setValue("");
});
jsEditor.on("drop", function() {
  jsEditor.setValue("");
});
mdEditor.on("drop", function() {
  mdEditor.setValue("");
});

// Run Preview Button Click
document.getElementById("runeditor").onclick = function() {
  clearTimeout(cancel);
  setTimeout(function() {
    updatePreview();
  }, 300);
};

responsiveUI();
loadFiles();

// Checks Internet Connection
window.addEventListener("online", function() {
  checkStatus();
  document.querySelector("[data-action=newdocument]").removeAttribute("style");
});
window.addEventListener("offline", function() {
  checkStatus();
  document.querySelector("[data-action=newdocument]").style.display = "block";
  document.querySelector("[data-action=newdocument]").style.width = "100%";
});
if (navigator.onLine) {
  document.querySelector("[data-action=newdocument]").removeAttribute("style");
} else {
  document.querySelector("[data-action=newdocument]").style.display = "block";
  document.querySelector("[data-action=newdocument]").style.width = "100%";
}
checkStatus();

// Clear Input Values - JQuery Plugin
(function($) {
  $.fn.clear = function() {
    $(this).val("");
  };
}) (jQuery);

function displayPreview(file) {
  var reader = new FileReader();

  reader.onload = function(e) {
    var img = new Image();
    var img16 = new Image();
    var img32 = new Image();
    var img64 = new Image();
    img.src = e.target.result;
    img16.src = e.target.result;
    img32.src = e.target.result;
    img64.src = e.target.result;
    img16.onload = function() {
      // x, y, width, height
      ctx16.clearRect(0, 0, 16, 16);
      ctx16.drawImage(img16, 0, 0, 16, 16);
    };
    img32.onload = function() {
      // x, y, width, height
      ctx32.clearRect(0, 0, 32, 32);
      ctx32.drawImage(img32, 0, 0, 32, 32);
    };
    img64.onload = function() {
      // x, y, width, height
      ctx64.clearRect(0, 0, 64, 64);
      ctx64.drawImage(img64, 0, 0, 64, 64);
    };
    img.onload = function() {
      // x, y, width, height
      ctx.clearRect(0, 0, 128, 128);
      ctx.drawImage(img, 0, 0, 128, 128);
    };
  };
  reader.readAsDataURL(file);
  return false;
}
storeValues();

// Save as a Gist Online
//document.querySelector("[data-action=save-gist]").onclick = function() {
//  $("input[name=menubar].active").trigger("click");
//  
//  // Return checked libraries
//  var arr = {};
//  $(".ldd-submenu input[type=checkbox]").each(function() {
//    var id = this.id;
//    arr[id] = (this.checked ? true : false);
//  });
//
//  // check if description and markdown editor have a value
//  if ( !document.querySelector("[data-action=sitedesc]").value) {
//     document.querySelector("[data-action=sitedesc]").value = "Saved from kodeWeave!";
//  }
//
//  // Return user settings
//  var sArr = {
//    "siteTitle": document.querySelector("[data-action=sitetitle]").value,
//    "editorFontSize": document.querySelector("[data-editor=fontSize]").value,
//    "description": document.querySelector("[data-action=sitedesc]").value,
//    "author": document.querySelector("[data-action=siteauthor]").value
//  };
//
//  var files = {};
//	if (htmlEditor.getValue()) {
//      var htmlSelected = $("#html-preprocessor option:selected").val();
//
//      if ( htmlSelected == "none") {
//        yourHTML = htmlEditor.getValue();
//        files["index.html"] = htmlEditor.getValue() ? { content: yourHTML } : null;
//      } else if ( htmlSelected == "jade") {
//        yourHTML = htmlEditor.getValue();
//        files["index.jade"] = htmlEditor.getValue() ? { content: yourHTML } : null;
//      }
//	}
//	if (cssEditor.getValue()) {
//      cssSelected = $("#css-preprocessor option:selected").val();
//
//      if ( cssSelected == "none") {
//        yourCSS = cssEditor.getValue();
//        files["index.css"] = cssEditor.getValue() ? { content: yourCSS } : null;
//      } else if ( cssSelected == "stylus") {
//        yourCSS = cssEditor.getValue();
//        files["index.styl"] = cssEditor.getValue() ? { content: yourCSS } : null;
//      } else if ( cssSelected == "less") {
//        yourCSS = cssEditor.getValue();
//        files["index.less"] = cssEditor.getValue() ? { content: yourCSS } : null;
//      } else if ( cssSelected == "scss") {
//        yourCSS = cssEditor.getValue();
//        files["index.scss"] = cssEditor.getValue() ? { content: yourCSS } : null;
//      } else if ( cssSelected == "sass") {
//        yourCSS = cssEditor.getValue();
//        files["index.sass"] = cssEditor.getValue() ? { content: yourCSS } : null;
//      }
//	}
//	if (jsEditor.getValue()) {
//      var jsSelected = $("#js-preprocessor option:selected").val();
//
//      if ( jsSelected == "none") {
//        yourJS = jsEditor.getValue();
//        files["index.js"] = jsEditor.getValue() ? { content: yourJS } : null;
//      } else if ( jsSelected == "coffeescript") {
//        yourJS = jsEditor.getValue();
//        files["index.coffee"] = jsEditor.getValue() ? { content: yourJS } : null;
//      } else if ( jsSelected == "typescript") {
//        yourJS = jsEditor.getValue();
//        files["index.ts"] = jsEditor.getValue() ? { content: yourJS } : null;
//      } else if ( jsSelected == "babel") {
//        yourJS = jsEditor.getValue();
//        files["index.jsx"] = jsEditor.getValue() ? { content: yourJS } : null;
//      }
//	}
//	if (mdEditor.getValue()) {
//		files["README.md"] = mdEditor.getValue() ? { content: mdEditor.getValue() } : null;
//	}
//	files["libraries.json"] = { "content": JSON.stringify(arr) };
//	files["settings.json"] = { "content": JSON.stringify(sArr) };
//
//  data = {
//    "description": document.querySelector("[data-action=sitedesc]").value,
//    "public": true,
//    "files": files
//  };
//  
//  if (!mdEditor.getValue().trim()) {
//    $("#mdurl").prop("checked", false);
//    hasMD = "";
//  } else {
//    hasMD = "md,";
//  }
//  if (!htmlEditor.getValue().trim()) {
//    $("#htmlurl").prop("checked", false);
//    hasHTML = "";
//  } else {
//    hasHTML = "html,";
//  }
//  if (!cssEditor.getValue().trim()) {
//    $("#cssurl").prop("checked", false);
//    hasCSS = "";
//  } else {
//    hasCSS = "css,";
//  }
//  if (!jsEditor.getValue().trim()) {
//    $("#jsurl").prop("checked", false);
//    hasJS = "";
//  } else {
//    hasJS = "js,";
//  }
//  // editEmbed = "edit,";
//  // darkUI = "dark,";
//  // seeThrough = "transparent,";
//   hasResult = "result";
//  // showEditors = hasMD + hasHTML + hasCSS + hasJS + editEmbed + darkUI + seeThrough + hasResult;
//   showEditors = hasMD + hasHTML + hasCSS + hasJS + hasResult;
//
//  // Post on Github via JQuery Ajax
//  $.ajax({
//    url: "https://api.github.com/gists",
//    type: "POST",
//    dataType: "json",
//    data: JSON.stringify(data)
//  }).success(function(e) {
//    urlStr = e.html_url.split("https://gist.github.com/").join("");
//    hash = urlStr.replace(/#/g,"");
//    
//    embedProject = e.html_url.split("https://gist.github.com/").join("");
//    document.querySelector("[data-output=projectURL]").value = "https://michaelsboost.github.io/kodeWeave/editor/#" + embedProject;
//    document.querySelector("[data-output=projectString]").value = embedProject;
//    document.querySelector("[data-output=projectURL]").onclick = function() {
//      this.select(true);
//    };
//
//    // Toggle Editor's Visibility for Embed
//    $("[data-target=editorURL]").on("change", function() {
//      if (document.getElementById("mdurl").checked) {
//        hasMD = "md,";
//      } else {
//        hasMD = "";
//      }
//      if (document.getElementById("htmlurl").checked) {
//        hasHTML = "html,";
//      } else {
//        hasHTML = "";
//      }
//      if (document.getElementById("cssurl").checked) {
//        hasCSS = "css,";
//      } else {
//        hasCSS = "";
//      }
//      if (document.getElementById("jsurl").checked) {
//        hasJS = "js,";
//      } else {
//        hasJS = "";
//      }
//      if (document.getElementById("resulturl").checked) {
//        hasResult = "result";
//      } else {
//        hasResult = "";
//      }
//      if (document.getElementById("jsurl").checked && !document.getElementById("resulturl").checked) {
//        hasJS = "js";
//      }
//      if (document.getElementById("cssurl").checked && !document.getElementById("jsurl").checked && !document.getElementById("resulturl").checked) {
//        hasCSS = "css";
//      }
//      if (document.getElementById("htmlurl").checked && !document.getElementById("cssurl").checked && !document.getElementById("jsurl").checked && !document.getElementById("resulturl").checked) {
//        hasHTML = "html";
//      }
//      if (document.getElementById("mdurl").checked && !document.getElementById("htmlurl").checked && !document.getElementById("cssurl").checked && !document.getElementById("jsurl").checked && !document.getElementById("resulturl").checked) {
//        hasMD = "md";
//      }
//      if (document.getElementById("resulturl").checked) {
//        hasResult = "result";
//      } else {
//        hasResult = "";
//      }
//      if (document.getElementById("norerun").checked) {
//        noRerun = "norerun,";
//      } else {
//        noRerun = "";
//      }
//      if (document.getElementById("transparentembed").checked) {
//        seeThrough = "transparent,";
//      } else {
//        seeThrough = "";
//      }
//      if (document.getElementById("darkembed").checked) {
//        darkUI = "dark,";
//      } else {
//        darkUI = "";
//      }
//      if (document.getElementById("editembed").checked) {
//        editEmbed = "edit,";
//      } else {
//        editEmbed = "";
//      }
//      showEditors = hasMD + hasHTML + hasCSS + hasJS + editEmbed + darkUI + noRerun + seeThrough + hasResult;
//
//      document.getElementById("clearSharePreview").innerHTML = "";
//      var shareFrame = document.createElement("iframe");
//      shareFrame.setAttribute("id", "shareWeavePreview");
//      shareFrame.setAttribute("sandbox", "allow-forms allow-modals allow-pointer-lock allow-popups allow-same-origin allow-scripts");
//      shareFrame.style.width = "calc(100% + 1.5em)";
//      shareFrame.style.height = "300px";
//      document.getElementById("clearSharePreview").appendChild(shareFrame);
//      var previewWeave = document.getElementById("shareWeavePreview");
//      previewWeave.src = "https://michaelsboost.github.io/kodeWeave/embed/#" + embedProject + "?" + showEditors;
//      document.querySelector("[data-output=embedProject]").value = "<iframe width=\"100%\" height=\"300\" src=\"https://michaelsboost.github.io/kodeWeave/embed/#" + embedProject + "?" + showEditors + "\" allowfullscreen=\"allowfullscreen\" frameborder=\"0\"></iframe>";
//    });
//    
//    document.getElementById("clearSharePreview").innerHTML = "";
//    var shareFrame = document.createElement("iframe");
//    shareFrame.setAttribute("id", "shareWeavePreview");
//    shareFrame.setAttribute("sandbox", "allow-forms allow-modals allow-pointer-lock allow-popups allow-same-origin allow-scripts");
//    shareFrame.style.width = "calc(100% + 1.5em)";
//    shareFrame.style.height = "300px";
//    document.getElementById("clearSharePreview").appendChild(shareFrame);
//    var previewWeave = document.getElementById("shareWeavePreview");
//    previewWeave.src = "https://michaelsboost.github.io/kodeWeave/embed/#" + embedProject + "?" + showEditors;
//    document.querySelector("[data-output=embedProject]").value = "<iframe width=\"100%\" height=\"300\" src=\"https://michaelsboost.github.io/kodeWeave/embed/#" + embedProject + "?" + showEditors + "\" allowfullscreen=\"allowfullscreen\" frameborder=\"0\"></iframe>";
//    document.querySelector("[data-output=embedProject]").onclick = function() {
//      this.select(true);
//    };
//
//    $(".share-facebook").attr("href", "https://www.facebook.com/sharer/sharer.php?u=https%3A//michaelsboost.github.io/kodeWeave/editor/%23" + hash);
//    $(".share-twitter").attr("href", "https://twitter.com/home?status=Checkout%20my%20"+ document.querySelector("[data-action=sitetitle]").value.split(" ").join("%20") +"%20%23weave%20on%20%23kodeWeave%20%23kodeWeaveShare%20-%20https%3A//michaelsboost.github.io/kodeWeave/e/%23" + hash);
//    $(".share-gplus").attr("href", "https://plus.google.com/share?url=https%3A//michaelsboost.github.io/kodeWeave/editor/%23" + hash);
//    $(".share-linkedin-square").attr("href", "https://www.linkedin.com/shareArticle?mini=true&url=https%3A//michaelsboost.github.io/kodeWeave/editor/%23"+ hash +"&title=Checkout%20my%20%23weave%20on%20%23kodeWeave%3A%20&summary=&source=");
//    $("[data-action=socialdialog]").fadeIn();
//
//    // Successfully saved weave. 
//    // Ask to support open source software.
//    alertify.message("<div class=\"grid\"><div class=\"centered grid__col--12 tc\"><h2>Help keep this free!</h2><a href=\"https://snaptee.co/t/2nezt/?r=fb&teeId=2nezt\" target=\"_blank\"><img src=\"assets/model-2.jpg\" width=\"100%\"></a><a class=\"btn--success\" href=\"https://snaptee.co/t/2nezt/?r=fb&teeId=2nezt\" target=\"_blank\" style=\"display: block;\">Buy Now</a></div></div>");
//  }).error(function(e) {
//    console.warn("Error: Could not save weave!", e);
//    alertify.error("Error: Could not save weave!");
//  });
//};

// Save weave for offline usage
document.querySelector("[data-action=save-weave]").onclick = function() {
  $("input[name=menubar].active").trigger("click");
  
  // Return checked libraries
  var arr = {};
  $(".ldd-submenu input[type=checkbox]").each(function() {
    var id = this.id;
    arr[id] = (this.checked ? true : false);
  });

  // check if description and markdown editor have a value
  if ( !document.querySelector("[data-action=sitedesc]").value) {
     document.querySelector("[data-action=sitedesc]").value = "Saved from kodeWeave!";
  }

  // Return user settings
  var sArr = {
    "siteTitle": document.querySelector("[data-action=sitetitle]").value,
    "editorFontSize": document.querySelector("[data-editor=fontSize]").value,
    "description": document.querySelector("[data-action=sitedesc]").value,
    "author": document.querySelector("[data-action=siteauthor]").value
  };

  var files = {};
	if (htmlEditor.getValue()) {
      var htmlSelected = $("#html-preprocessor option:selected").val();

      if ( htmlSelected == "none") {
        yourHTML = htmlEditor.getValue();
        files["index.html"] = htmlEditor.getValue() ? { content: yourHTML } : null;
      } else if ( htmlSelected == "jade") {
        yourHTML = htmlEditor.getValue();
        files["index.jade"] = htmlEditor.getValue() ? { content: yourHTML } : null;
      }
	}
	if (cssEditor.getValue()) {
      cssSelected = $("#css-preprocessor option:selected").val();

      if ( cssSelected == "none") {
        yourCSS = cssEditor.getValue();
        files["index.css"] = cssEditor.getValue() ? { content: yourCSS } : null;
      } else if ( cssSelected == "stylus") {
        yourCSS = cssEditor.getValue();
        files["index.styl"] = cssEditor.getValue() ? { content: yourCSS } : null;
      } else if ( cssSelected == "less") {
        yourCSS = cssEditor.getValue();
        files["index.less"] = cssEditor.getValue() ? { content: yourCSS } : null;
      } else if ( cssSelected == "scss") {
        yourCSS = cssEditor.getValue();
        files["index.scss"] = cssEditor.getValue() ? { content: yourCSS } : null;
      } else if ( cssSelected == "sass") {
        yourCSS = cssEditor.getValue();
        files["index.sass"] = cssEditor.getValue() ? { content: yourCSS } : null;
      }
	}
	if (jsEditor.getValue()) {
      var jsSelected = $("#js-preprocessor option:selected").val();

      if ( jsSelected == "none") {
        yourJS = jsEditor.getValue();
        files["index.js"] = jsEditor.getValue() ? { content: yourJS } : null;
      } else if ( jsSelected == "coffeescript") {
        yourJS = jsEditor.getValue();
        files["index.coffee"] = jsEditor.getValue() ? { content: yourJS } : null;
      } else if ( jsSelected == "typescript") {
        yourJS = jsEditor.getValue();
        files["index.ts"] = jsEditor.getValue() ? { content: yourJS } : null;
      } else if ( jsSelected == "babel") {
        yourJS = jsEditor.getValue();
        files["index.jsx"] = jsEditor.getValue() ? { content: yourJS } : null;
      }
	}
	if (mdEditor.getValue()) {
		files["README.md"] = mdEditor.getValue() ? { content: mdEditor.getValue() } : null;
	}
	files["libraries.json"] = { "content": JSON.stringify(arr) };
	files["settings.json"] = { "content": JSON.stringify(sArr) };

  data = {
    "files": files
  };
  
  if ($("[data-saved=libraries]").text() === "No weave's have been saved") {
    $("[data-saved=libraries]").empty();
  }
  $("[data-saved=libraries]").append('<div data-contain="weave" style="padding: 0 1em;"><a class="savedweave fl">'+ document.querySelector("[data-action=sitetitle]").value +'</a><a class="delweave fr"><i class="fa fa-times"></i></a><textarea class="hide">'+ JSON.stringify(data) +'</textarea></div>');
  
  localStorage.setItem("savedWeaves", $("[data-saved=libraries]").html());
  handleWeaves();
};
handleWeaves();

// Save Checked Libraries for LocalStorage
var textarea = document.querySelector("[data-action=library-code]");
if (localStorage.getItem("checkedLibraries")) {
 textarea.value = localStorage.getItem("checkedLibraries");

 var lsStored = JSON.parse(localStorage.getItem('checkedInputs')) || [];
 for (var j = 0, jLen = lsStored.length; j < jLen; j++) {
   $('#' + lsStored[j]).prop('checked', true);
 }
}

// Search Libraries
$("[data-search=libraries]").on("keyup change", function(e) {
  if(this.value.toLowerCase()) {
    $("[data-clear=search]").show();
    $(".ldd-submenu ul > div").hide();
    $(".ldd-submenu ul").attr('style', '');
    $(".ldd-submenu ul").css({
      'float': 'none',
      'border': '0'
    });
    $(".ldd-submenu ul > div."+ this.value.charAt(0).toLowerCase()).css('display', 'inline-block');
  } else {
    $("[data-clear=search]").hide();
    $(".ldd-submenu ul").attr('style', '');
    $(".ldd-submenu ul > div").attr('style', '');
  }
}).trigger('change');
$("[data-clear=search]").click(function() {
  $("[data-search=libraries]").val('').trigger('change');
});

// Add libraries to autocomplete search
$("#libraries").empty();
$.each($("[type=checkbox].check"), function(id, value) {
  $("#libraries").append('<option value="'+ $(this).next().text() +'">'+ $(this).next().text() +'</option>')
});

// Show preview dimensions
$("[data-toggle=dimensions]").click(function() {
  if ($("[data-toggle=previewdimensions]").is(":visible")) {
    $("[data-toggle=previewdimensions]").addClass('hide');
    $(this).find(".fa").removeClass('fa-eye-slash').addClass('fa-eye')
  } else {
    $("[data-toggle=previewdimensions]").removeClass('hide');
    $("[data-output=dimensions]").text($(".preview-editor").css('width') + ", " + $(".preview-editor").css('height'));
    $(this).find(".fa").removeClass('fa-eye').addClass('fa-eye-slash')
  }
});
$('#splitContainer, #rightSplitter').on('collapsed expanded resize', function() {
  if ($("[data-toggle=previewdimensions]").is(":visible")) {
    $("[data-output=dimensions]").text($(".preview-editor").css('width') + ", " + $(".preview-editor").css('height'));
  }
});
$(window).resize(function() {
  if ($("[data-toggle=previewdimensions]").is(":visible")) {
    $("[data-output=dimensions]").text($(".preview-editor").css('width') + ", " + $(".preview-editor").css('height'));
  }
});

// Add/Remove Libraries
$("[data-action=check]").on("change keyup", function() {
  var value = $(this).parent().nextAll("div").children(".libsources:first").val() + "\n";
  checkedLibs();

  if ( $(this).prop("checked") === true ) {
    textarea.value = textarea.value + value;
  } else {
    textarea.value = textarea.value.replace( value, "");
  }

  if (!changePrev.checked) {
    $("#runeditor").trigger("click");
  }

  var checked = $("[type=checkbox].check:checked");
  var lsChecked = [];
  for (var i = 0, iLen = checked.length; i < iLen; i++) {
    lsChecked.push($(checked[i]).attr('id'));
  }
  localStorage.setItem("checkedLibraries", textarea.value);
  localStorage.setItem("checkedInputs", JSON.stringify(lsChecked));
});
$("#jquery").trigger("keyup");

shortcutKeys();
initGenerators();
checkedLibs();
charGeneration();
initdataURLGrabber();
miscellaneous();
newDocument();
preprocessors();

// Buy kodeWeave T-Shirt Ad
if (navigator.onLine) {
  alertify.message("<div class=\"grid\"><div class=\"centered grid__col--12 tc\"><h2>Help keep this free!</h2><a href=\"https://snaptee.co/t/0rtzt?msg=31&r=tw\" target=\"_blank\"><img src=\"assets/model-1.jpg\" width=\"100%\"></a><a class=\"btn--success\" href=\"https://snaptee.co/t/0rtzt?msg=31&r=tw\" target=\"_blank\" style=\"display: block;\">Buy Now</a></div></div>");
}

// Scroll Character Menu
(function() {
  function scrollMenu(e) {
    e = window.event || e;
    var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
    document.getElementById('charmenu').scrollLeft -= (delta*40); // Multiplied by 40
    return false;
  }
  if (document.getElementById('charmenu').addEventListener) {
    // IE9, Chrome, Safari, Opera
    document.getElementById('charmenu').addEventListener('mousewheel', scrollMenu, false);
    // Firefox
    document.getElementById('charmenu').addEventListener('DOMMouseScroll', scrollMenu, false);
  } else {
    // IE 6/7/8
    document.getElementById('charmenu').attachEvent('onmousewheel', scrollMenu);
  }
})();
