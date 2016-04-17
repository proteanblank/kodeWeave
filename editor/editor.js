// Clear Input Values - JQuery Plugin
(function($) {
  $.fn.clear = function() {
    $(this).val("")
  }
}) (jQuery);

var loader = $("#load"),
    c16 = $("[data-action=n16]"),
    c32 = $("[data-action=n32]"),
    c64 = $("[data-action=n64]"),
    canvas = $("[data-action=holder]"),
    ctx16 = c16[0].getContext("2d"),
    ctx32 = c32[0].getContext("2d"),
    ctx64 = c64[0].getContext("2d"),
    ctx = canvas[0].getContext("2d"),
    holder = document.getElementById("holder"),
    myarray = [],
    current = 1,
    activeEditor = $("[data-action=activeEditor]"),
    storeValues = function() {
      // Save Site Title Value for LocalStorage
      if ( localStorage.getItem("siteTitle")) {
        $("[data-action=sitetitle]").val(localStorage.getItem("siteTitle"))
      }
      $("[data-action=sitetitle]").on("keyup change", function() {
        localStorage.setItem("siteTitle", this.value)
      })

      // Save App Version for LocalStorage
      if ( localStorage.getItem("appVersion")) {
        $("[data-value=version]").val(localStorage.getItem("appVersion"))
      }
      $("[data-value=version]").on("keyup change", function() {
        localStorage.setItem("appVersion", this.value)
      })
      // Save FontSize for LocalStorage
      if ( localStorage.getItem("fontSize")) {
        $("[data-editor=fontSize]").val(localStorage.getItem("fontSize"))
        $(".CodeMirror").css("font-size", localStorage.getItem("fontSize") + "px")
      }
      $("[data-editor=fontSize]").on("keyup change", function() {
        $(".CodeMirror").css("font-size", this.value + "px")
        localStorage.setItem("fontSize", this.value)
      })

      // Save Description for LocalStorage
      if ( localStorage.getItem("saveDesc")) {
        $("[data-action=sitedesc]").val(localStorage.getItem("saveDesc"))
      }
      $("[data-action=sitedesc]").on("keyup change", function() {
        localStorage.setItem("saveDesc", this.value)
      })
      // Save Author for LocalStorage
      if ( localStorage.getItem("saveAuthor")) {
        $("[data-action=siteauthor]").val(localStorage.getItem("saveAuthor"))
      }
      $("[data-action=siteauthor]").on("keyup change", function() {
        localStorage.setItem("saveAuthor", this.value)
      })
      // Save Preprocessors
      if ( localStorage.getItem("htmlPreprocessorVal")) {
        $("#html-preprocessor").val(localStorage.getItem("htmlPreprocessorVal"))
      }
      if ( localStorage.getItem("cssPreprocessorVal")) {
        $("#css-preprocessor").val(localStorage.getItem("cssPreprocessorVal"))
      }
      if ( localStorage.getItem("jsPreprocessorVal")) {
        $("#js-preprocessor").val(localStorage.getItem("jsPreprocessorVal"))
      }
    },
    checkedLibs = function() {
      if ( $("#alertify").is(":checked") ) {
        $('.alertifyjs').clear()
        download_to_textbox('libraries/alertifyjs/css/alertify.min.css', $('.alertifyjs1'))
        download_to_textbox('libraries/alertifyjs/css/themes/default.min.css', $('.alertifyjs2'))
        download_to_textbox('libraries/alertifyjs/alertify.min.js', $('.alertifyjs3'))
        download_to_textbox('libraries/alertifyjs/css/alertify.rtl.min.css', $('.alertifyjs4'))
        download_to_textbox('libraries/alertifyjs/css/themes/bootstrap.min.css', $('.alertifyjs5'))
        download_to_textbox('libraries/alertifyjs/css/themes/bootstrap.rtl.min.css', $('.alertifyjs6'))
        download_to_textbox('libraries/alertifyjs/css/themes/default.rtl.min.css', $('.alertifyjs7'))
        download_to_textbox('libraries/alertifyjs/css/themes/semantic.min.css', $('.alertifyjs8'))
        download_to_textbox('libraries/alertifyjs/css/themes/semantic.rtl.min.css', $('.alertifyjs9'))

        $(".alertifyzip").val("zip.file('libraries/alertifyjs/css/alertify.min.css', $(\".alertifyjs1\").val());\n    zip.file('libraries/alertifyjs/css/themes/default.min.css', $(\".alertifyjs2\").val());\n    zip.file('libraries/alertifyjs/alertify.min.js', $(\".alertifyjs3\").val());\n    zip.file('libraries/alertifyjs/css/alertify.rtl.min.css', $(\".alertifyjs4\").val());\n    zip.file('libraries/alertifyjs/css/themes/bootstrap.min.css', $(\".alertifyjs5\").val());\n    zip.file('libraries/alertifyjs/css/themes/bootstrap.rtl.min.css', $(\".alertifyjs6\").val());\n    zip.file('libraries/alertifyjs/css/themes/default.rtl.min.css', $(\".alertifyjs7\").val());\n    zip.file('libraries/alertifyjs/css/themes/semantic.min.css', $(\".alertifyjs8\").val());\n    zip.file('libraries/alertifyjs/css/themes/semantic.rtl.min.css', $(\".alertifyjs9\").val());")
      } else {
        $('.alertifyjs, .alertifyzip').clear()
      }

      if ( $("#angular").is(":checked") ) {
        $('.angularjs').clear()
        download_to_textbox('libraries/angular/angular.min.js', $('.angularjs'))
        $(".angularzip").val("zip.file('libraries/angular/angular.min.js', $(\".angularjs\").val());")
      } else {
        $('.angularjs, .angularzip').clear()
      }

      if ( $("#bootstrap").is(":checked") ) {
        $('.bootstrap').clear()
        download_to_textbox('libraries/bootstrap/bootstrap.css', $('.bootstrap1'))
        download_to_textbox('libraries/bootstrap/bootstrap.js', $('.bootstrap2'))
        $('.bootstrap1, .bootstrap2').trigger("change")
        $(".bootstrapzip").val("zip.file('libraries/bootstrap/bootstrap.css', $('.bootstrap1').val());\n  zip.file('libraries/bootstrap/bootstrap.js', $('.bootstrap2').val());")
      } else {
        $('.bootstrap, .bootstrapzip').clear()
      }

      if ( $("#chartjs").is(":checked") ) {
        $('.chartjs').clear()
        download_to_textbox('libraries/chartjs/chart.min.js', $('.chartjs'))
        $('.chartjs').trigger("change")
        $(".chartjszip").val("zip.file('libraries/chartjs/chart.min.js', $('.chartjs').val());")
      } else {
        $('.chartjs, .chartjszip').clear()
      }
      if ( $("#codemirror").is(":checked") ) {
        $('.codemirror').clear()

        download_to_textbox('libraries/codemirror/lib/codemirror.css', $('.codemirror1'))
        download_to_textbox('libraries/codemirror/addon/fold/foldgutter.css', $('.codemirror2'))
        download_to_textbox('libraries/codemirror/lib/codemirror.js', $('.codemirror3'))
        download_to_textbox('libraries/codemirror/javascripts/code-completion.js', $('.codemirror4'))
        download_to_textbox('libraries/codemirror/javascripts/css-completion.js', $('.codemirror5'))
        download_to_textbox('libraries/codemirror/javascripts/html-completion.js', $('.codemirror6'))
        download_to_textbox('libraries/codemirror/mode/javascript/javascript.js', $('.codemirror7'))
        download_to_textbox('libraries/codemirror/mode/xml/xml.js', $('.codemirror8'))
        download_to_textbox('libraries/codemirror/mode/css/css.js', $('.codemirror9'))
        download_to_textbox('libraries/codemirror/mode/htmlmixed/htmlmixed.js', $('.codemirror10'))
        download_to_textbox('libraries/codemirror/addon/edit/closetag.js', $('.codemirror11'))
        download_to_textbox('libraries/codemirror/addon/edit/matchbrackets.js', $('.codemirror12'))
        download_to_textbox('libraries/codemirror/addon/selection/active-line.js', $('.codemirror13'))
        download_to_textbox('libraries/codemirror/addon/fold/foldcode.js', $('.codemirror14'))
        download_to_textbox('libraries/codemirror/addon/fold/foldgutter.js', $('.codemirror15'))
        download_to_textbox('libraries/codemirror/addon/fold/brace-fold.js', $('.codemirror16'))
        download_to_textbox('libraries/codemirror/addon/fold/xml-fold.js', $('.codemirror17'))
        download_to_textbox('libraries/codemirror/addon/fold/comment-fold.js', $('.codemirror18'))
        download_to_textbox('libraries/codemirror/addon/search/search.js', $('.codemirror19'))
        download_to_textbox('libraries/codemirror/addon/search/searchcursor.js', $('.codemirror20'))
        download_to_textbox('libraries/codemirror/addon/dialog/dialog.js', $('.codemirror21'))
        download_to_textbox('libraries/codemirror/addon/hint/show-hint.js', $('.codemirror22'))
        download_to_textbox('libraries/codemirror/addon/hint/xml-hint.js', $('.codemirror23'))
        download_to_textbox('libraries/codemirror/addon/hint/html-hint.js', $('.codemirror24'))
        download_to_textbox('libraries/codemirror/addon/hint/css-hint.js', $('.codemirror25'))
        download_to_textbox('libraries/codemirror/addon/hint/javascript-hint.js', $('.codemirror26'))
        download_to_textbox('libraries/codemirror/addon/search/match-highlighter.js', $('.codemirror27'))
        download_to_textbox('libraries/codemirror/htmlhint.js', $('.codemirror28'))
        download_to_textbox('libraries/codemirror/csslint.js', $('.codemirror29'))
        download_to_textbox('libraries/codemirror/jshint.js', $('.codemirror30'))
        download_to_textbox('libraries/codemirror/addon/lint/lint.js', $('.codemirror31'))
        download_to_textbox('libraries/codemirror/addon/lint/html-lint.js', $('.codemirror32'))
        download_to_textbox('libraries/codemirror/addon/lint/css-lint.js', $('.codemirror33'))
        download_to_textbox('libraries/codemirror/addon/lint/javascript-lint.js', $('.codemirror34'))
        download_to_textbox('libraries/codemirror/inlet.min.js', $('.codemirror35'))
        download_to_textbox('libraries/codemirror/inlet.css', $('.codemirror36'))
        download_to_textbox('libraries/codemirror/emmet.js', $('.codemirror37'))
        download_to_textbox('libraries/codemirror/addon/lint/lint.css', $('.codemirror38'))
        download_to_textbox('libraries/codemirror/addon/dialog/dialog.css', $('.codemirror39'))
        download_to_textbox('libraries/codemirror/addon/hint/show-hint.css', $('.codemirror40'))
        download_to_textbox('libraries/codemirror/addon/search/goto-line.js', $('.codemirror41'))
        download_to_textbox('libraries/codemirror/markdown.js', $('.codemirror42'))
        download_to_textbox('libraries/codemirror/continuelist.js', $('.codemirror43'))
        download_to_textbox('libraries/codemirror/mode/haml/haml.js', $('.codemirror44'))
        download_to_textbox('libraries/codemirror/mode/jade/jade.js', $('.codemirror45'))
        download_to_textbox('libraries/codemirror/mode/sass/sass.js', $('.codemirror46'))
        download_to_textbox('libraries/codemirror/mode/livescript/livescript.js', $('.codemirror47'))
        download_to_textbox('libraries/codemirror/mode/coffeescript/coffeescript.js', $('.codemirror48'))
        download_to_textbox('libraries/codemirror/mode/ruby/ruby.js', $('.codemirror49'))
        download_to_textbox('libraries/codemirror/coffee-script.js', $('.codemirror50'))
        download_to_textbox('libraries/codemirror/coffeelint.js', $('.codemirror51'))
        download_to_textbox('libraries/codemirror/addon/lint/coffeescript-lint.js', $('.codemirror52'))
        download_to_textbox('libraries/codemirror/mode/stylus/stylus.js', $('.codemirror53'))

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
        //   "zip.file('libraries/codemirror/addon/search/goto-line.js', $('.codemirror41').val());\n",
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

        var grabCodemirror = "zip.file('libraries/codemirror/lib/codemirror.css', $('.codemirror1').val());\n\n      zip.file('libraries/codemirror/addon/fold/foldgutter.css', $('.codemirror2').val());\n\n      zip.file('libraries/codemirror/lib/codemirror.js', $('.codemirror3').val());\n\n      zip.file('libraries/codemirror/javascripts/code-completion.js', $('.codemirror4').val());\n\n      zip.file('libraries/codemirror/javascripts/css-completion.js', $('.codemirror5').val());\n\n      zip.file('libraries/codemirror/javascripts/html-completion.js', $('.codemirror6').val());\n\n      zip.file('libraries/codemirror/mode/javascript/javascript.js', $('.codemirror7').val());\n\n      zip.file('libraries/codemirror/mode/xml/xml.js', $('.codemirror8').val());\n\n      zip.file('libraries/codemirror/mode/css/css.js', $('.codemirror9').val());\n\n      zip.file('libraries/codemirror/mode/htmlmixed/htmlmixed.js', $('.codemirror10').val());\n\n      zip.file('libraries/codemirror/addon/edit/closetag.js', $('.codemirror11').val());\n\n      zip.file('libraries/codemirror/addon/edit/matchbrackets.js', $('.codemirror12').val());\n\n      zip.file('libraries/codemirror/addon/selection/active-line.js', $('.codemirror13').val());\n\n      zip.file('libraries/codemirror/addon/fold/foldcode.js', $('.codemirror14').val());\n\n      zip.file('libraries/codemirror/addon/fold/foldgutter.js', $('.codemirror15').val());\n\n      zip.file('libraries/codemirror/addon/fold/brace-fold.js', $('.codemirror16').val());\n\n      zip.file('libraries/codemirror/addon/fold/xml-fold.js', $('.codemirror17').val());\n\n      zip.file('libraries/codemirror/addon/fold/comment-fold.js', $('.codemirror18').val());\n\n      zip.file('libraries/codemirror/addon/search/search.js', $('.codemirror19').val());\n\n      zip.file('libraries/codemirror/addon/search/searchcursor.js', $('.codemirror20').val());\n\n      zip.file('libraries/codemirror/addon/dialog/dialog.js', $('.codemirror21').val());\n\n      zip.file('libraries/codemirror/addon/hint/show-hint.js', $('.codemirror22').val());\n\n      zip.file('libraries/codemirror/addon/hint/xml-hint.js', $('.codemirror23').val());\n\n      zip.file('libraries/codemirror/addon/hint/html-hint.js', $('.codemirror24').val());\n\n      zip.file('libraries/codemirror/addon/hint/css-hint.js', $('.codemirror25').val());\n\n      zip.file('libraries/codemirror/addon/hint/javascript-hint.js', $('.codemirror26').val());\n\n      zip.file('libraries/codemirror/addon/search/match-highlighter.js', $('.codemirror27').val());\n\n      zip.file('libraries/codemirror/htmlhint.js', $('.codemirror28').val());\n\n      zip.file('libraries/codemirror/csslint.js', $('.codemirror29').val());\n\n      zip.file('libraries/codemirror/jshint.js', $('.codemirror30').val());\n\n      zip.file('libraries/codemirror/addon/lint/lint.js', $('.codemirror31').val());\n\n      zip.file('libraries/codemirror/addon/lint/html-lint.js', $('.codemirror32').val());\n\n      zip.file('libraries/codemirror/addon/lint/css-lint.js', $('.codemirror33').val());\n\n      zip.file('libraries/codemirror/addon/lint/javascript-lint.js', $('.codemirror34').val());\n\n      zip.file('libraries/codemirror/inlet.min.js', $('.codemirror35').val());\n\n      zip.file('libraries/codemirror/inlet.css', $('.codemirror36').val());\n\n      zip.file('libraries/codemirror/emmet.js', $('.codemirror37').val());\n\n      zip.file('libraries/codemirror/addon/lint/lint.css', $('.codemirror38').val());\n\n      zip.file('libraries/codemirror/addon/dialog/dialog.css', $('.codemirror39').val());\n\n      zip.file('libraries/codemirror/addon/hint/show-hint.css', $('.codemirror40').val());\n\n      zip.file('libraries/codemirror/addon/search/goto-line.js', $('.codemirror41').val());\n\n      zip.file('libraries/codemirror/markdown.js', $('.codemirror42').val());\n\n      zip.file('libraries/codemirror/continuelist.js', $('.codemirror43').val());\n\n      zip.file('libraries/codemirror/mode/haml/haml.js', $('.codemirror44').val());\n\n      zip.file('libraries/codemirror/mode/jade/jade.js', $('.codemirror45').val());\n\n      zip.file('libraries/codemirror/mode/sass/sass.js', $('.codemirror46').val());\n\n      zip.file('libraries/codemirror/mode/livescript/livescript.js', $('.codemirror47').val());\n\n      zip.file('libraries/codemirror/mode/coffeescript/coffeescript.js', $('.codemirror48').val());\n\n      zip.file('libraries/codemirror/mode/ruby/ruby.js', $('.codemirror49').val());\n\n      zip.file('libraries/codemirror/coffee-script.js', $('.codemirror50').val());\n\n      zip.file('libraries/codemirror/coffeelint.js', $('.codemirror51').val());\n\n      zip.file('libraries/codemirror/addon/lint/coffeescript-lint.js', $('.codemirror52').val());\n      zip.file('libraries/codemirror/mode/stylus/stylus.js', $('.codemirror53').val());\n"

        $('.codemirror').trigger("change")
        $(".codemirrorzip").val(grabCodemirror)
      } else {
        $('.codemirror, .codemirrorzip').clear()
      }
      if ( $("#createjs").is(":checked") ) {
        $('.createjs').clear()
        download_to_textbox('libraries/createjs/createjs.min.js', $('.createjs1'))
        download_to_textbox('libraries/createjs/easeljs.min.js', $('.createjs2'))
        download_to_textbox('libraries/createjs/tweenjs.min.js', $('.createjs3'))
        download_to_textbox('libraries/createjs/soundjs.min.js', $('.createjs4'))
        download_to_textbox('libraries/createjs/preloadjs.min.js', $('.createjs5'))
        $('.createjs').trigger("change")
        $(".createjszip").val("zip.file('libraries/createjs/createjs.min.js', $('.createjs1').val());\nzip.file('libraries/createjs/easeljs.min.js', $('.createjs2').val());\nzip.file('libraries/createjs/tweenjs.min.js', $('.createjs3').val());\nzip.file('libraries/createjs/soundjs.min.js', $('.createjs4').val());\nzip.file('libraries/createjs/preloadjs.min.js', $('.createjs5').val());")
      } else {
        $('.createjs, .createjszip').clear()
      }
      if ( $("#d3").is(":checked") ) {
        $('.d3').clear()
        download_to_textbox('libraries/d3/d3.js', $('.d3'))
        $('.d3').trigger("change")
        $(".d3zip").val("zip.file('libraries/d3/d3.js', $(\".d3\").val());")
      } else {
        $('.d3, .d3zip').clear()
      }
      if ( $("#dojo").is(":checked") ) {
        $('.dojo').clear()
        download_to_textbox('libraries/dojo/dojo.js', $('.dojo'))
        $('.dojo').trigger("change")
        $(".dojozip").val("zip.file('libraries/dojo/dojo.js', $(\".dojo\").val());")
      } else {
        $('.dojo, .dojozip').clear()
      }
      if ( $("#fabric").is(":checked") ) {
        $('.fabric').clear()
        download_to_textbox('libraries/fabric/fabric.min.js', $('.fabric'))
        $('.fabric').trigger("change")
        $(".fabriczip").val("zip.file('libraries/fabric/fabric.min.js', $(\".fabric\").val());")
      } else {
        $('.fabric, .fabriczip').clear()
      }
      if ( $("#jquery").is(":checked") ) {
        $('.jquery').clear()
        download_to_textbox('libraries/jquery/jquery.js', $('.jquery'))
        $('.jquery').trigger("change")
        $(".jqueryzip").val("zip.file('libraries/jquery/jquery.js', $(\".jquery\").val());")
      } else {
        $('.jquery, .jqueryzip').clear()
      }
      if ( $("#jqueryui").is(":checked") ) {
        $('.jqueryui').clear()
        download_to_textbox('libraries/jqueryui/jqueryui.css', $('.jqueryui1'))
        download_to_textbox('libraries/jqueryui/jqueryui.min.js', $('.jqueryui2'))
        download_to_textbox('libraries/jqueryui/jquery.ui.touch-punch.min.js', $('.jqueryui3'))
        $('.jqueryui').trigger("change")
        $(".jqueryuizip").val("zip.file('libraries/jqueryui/jqueryui.css', $(\".jqueryui1\").val());\nzip.file('libraries/jqueryui/jqueryui.min.js', $(\".jqueryui2\").val());\nzip.file('libraries/jqueryui/jquery.ui.touch-punch.min.js', $(\".jqueryui3\").val());")
      } else {
        $('.jqueryui, .jqueryuizip').clear()
      }
      if ( $("#jquerytools").is(":checked") ) {
        $('.jquerytools').clear()
        download_to_textbox('libraries/jquerytools/jquery.tools.min.js', $('.jquerytools'))
        $('.jquerytools').trigger("change")
        $(".jquerytoolszip").val("zip.file('libraries/jquerytools/jquery.tools.min.js', $(\".jquerytools\").val());")
      } else {
        $('.jquerytools, .jquerytoolszip').clear()
      }
      if ( $("#jszip").is(":checked") ) {
        $('.jszip').clear()
        download_to_textbox('libraries/jszip/jszip.min.css', $('.jszip1'))
        download_to_textbox('libraries/jszip/jszip-utils.js', $('.jszip2'))
        download_to_textbox('libraries/jszip/FileSaver.js', $('.jszip3'))
        download_to_textbox('libraries/jszip/Blob.js', $('.jszip4'))
        $('.jszip').trigger("change")
        $(".jszipzip").val("zip.file('libraries/jszip/jszip.min.js', $(\".jszip1\").val());\nzip.file('libraries/jszip/jszip-utils.js', $(\".jszip2\").val());\nzip.file('libraries/jszip/FileSaver.js', $(\".jszip3\").val());\nzip.file('libraries/jszip/Blob.js', $(\".jszip4\").val());")
      } else {
        $('.jszip, .jszipzip').clear()
      }
      if ( $("#jqxsplitter").is(":checked") ) {
        $('.jqxsplitter').clear()

        download_to_textbox('libraries/jqwidgets/styles/jqx.base.css', $('.jqwidgets1'))
        download_to_textbox('libraries/jqwidgets/styles/jqx.android.css', $('.jqwidgets2'))
        download_to_textbox('libraries/jqwidgets/styles/jqx.arctic.css', $('.jqwidgets3'))
        download_to_textbox('libraries/jqwidgets/styles/jqx.black.css', $('.jqwidgets4'))
        download_to_textbox('libraries/jqwidgets/styles/jqx.blackberry.css', $('.jqwidgets5'))
        download_to_textbox('libraries/jqwidgets/styles/jqx.bootstrap.css', $('.jqwidgets6'))
        download_to_textbox('libraries/jqwidgets/styles/jqx.classic.css', $('.jqwidgets7'))
        download_to_textbox('libraries/jqwidgets/styles/jqx.darkblue.css', $('.jqwidgets8'))
        download_to_textbox('libraries/jqwidgets/styles/jqx.energyblue.css', $('.jqwidgets9'))
        download_to_textbox('libraries/jqwidgets/styles/jqx.fresh.css', $('.jqwidgets10'))
        download_to_textbox('libraries/jqwidgets/styles/jqx.highcontrast.css', $('.jqwidgets11'))
        download_to_textbox('libraries/jqwidgets/styles/jqx.metro.css', $('.jqwidgets12'))
        download_to_textbox('libraries/jqwidgets/styles/jqx.metrodark.css', $('.jqwidgets13'))
        download_to_textbox('libraries/jqwidgets/styles/jqx.mobile.css', $('.jqwidgets14'))
        download_to_textbox('libraries/jqwidgets/styles/jqx.office.css', $('.jqwidgets15'))
        download_to_textbox('libraries/jqwidgets/styles/jqx.orange.css', $('.jqwidgets16'))
        download_to_textbox('libraries/jqwidgets/styles/jqx.shinyblack.css', $('.jqwidgets17'))
        download_to_textbox('libraries/jqwidgets/styles/jqx.summer.css', $('.jqwidgets18'))
        download_to_textbox('libraries/jqwidgets/styles/jqx.ui-darkness.css', $('.jqwidgets19'))
        download_to_textbox('libraries/jqwidgets/styles/jqx.ui-le-frog.css', $('.jqwidgets20'))
        download_to_textbox('libraries/jqwidgets/styles/jqx.ui-lightness.css', $('.jqwidgets21'))
        download_to_textbox('libraries/jqwidgets/styles/jqx.ui-overcast.css', $('.jqwidgets22'))
        download_to_textbox('libraries/jqwidgets/styles/jqx.ui-redmond.css', $('.jqwidgets23'))
        download_to_textbox('libraries/jqwidgets/styles/jqx.ui-smoothness.css', $('.jqwidgets24'))
        download_to_textbox('libraries/jqwidgets/styles/jqx.ui-start.css', $('.jqwidgets25'))
        download_to_textbox('libraries/jqwidgets/styles/jqx.ui-sunny.css', $('.jqwidgets26'))
        download_to_textbox('libraries/jqwidgets/styles/jqx.web.css', $('.jqwidgets27'))
        download_to_textbox('libraries/jqwidgets/styles/jqx.windowsphone.css', $('.jqwidgets28'))
        download_to_textbox('libraries/jqwidgets/jqxcore.js', $('.jqwidgets29'))
        download_to_textbox('libraries/jqwidgets/jqxsplitter.js', $('.jqwidgets30'))

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

        var jqxsplitter = "zip.file('libraries/jqwidgets/styles/jqx.base.css', $('.jqwidgets1').val());\n\n      zip.file('libraries/jqwidgets/styles/jqx.android.css', $('.jqwidgets2').val());\n\n      zip.file('libraries/jqwidgets/styles/jqx.arctic.css', $('.jqwidgets3').val());\n\n      zip.file('libraries/jqwidgets/styles/jqx.black.css', $('.jqwidgets4').val());\n\n      zip.file('libraries/jqwidgets/styles/jqx.blackberry.css', $('.jqwidgets5').val());\n\n      zip.file('libraries/jqwidgets/styles/jqx.bootstrap.css', $('.jqwidgets6').val());\n\n      zip.file('libraries/jqwidgets/styles/jqx.classic.css', $('.jqwidgets7').val());\n\n      zip.file('libraries/jqwidgets/styles/jqx.darkblue.css', $('.jqwidgets8').val());\n\n      zip.file('libraries/jqwidgets/styles/jqx.energyblue.css', $('.jqwidgets9').val());\n\n      zip.file('libraries/jqwidgets/styles/jqx.fresh.css', $('.jqwidgets10').val());\n\n      zip.file('libraries/jqwidgets/styles/jqx.highcontrast.css', $('.jqwidgets11').val());\n\n      zip.file('libraries/jqwidgets/styles/jqx.metro.css', $('.jqwidgets12').val());\n\n      zip.file('libraries/jqwidgets/styles/jqx.metrodark.css', $('.jqwidgets13').val());\n\n      zip.file('libraries/jqwidgets/styles/jqx.mobile.css', $('.jqwidgets14').val());\n\n      zip.file('libraries/jqwidgets/styles/jqx.office.css', $('.jqwidgets15').val());\n\n      zip.file('libraries/jqwidgets/styles/jqx.orange.css', $('.jqwidgets16').val());\n\n      zip.file('libraries/jqwidgets/styles/jqx.shinyblack.css', $('.jqwidgets17').val());\n\n      zip.file('libraries/jqwidgets/styles/jqx.summer.css', $('.jqwidgets18').val());\n\n      zip.file('libraries/jqwidgets/styles/jqx.ui-darkness.css', $('.jqwidgets19').val());\n\n      zip.file('libraries/jqwidgets/styles/jqx.ui-le-frog.css', $('.jqwidgets20').val());\n\n      zip.file('libraries/jqwidgets/styles/jqx.ui-lightness.css', $('.jqwidgets21').val());\n\n      zip.file('libraries/jqwidgets/styles/jqx.ui-overcast.css', $('.jqwidgets22').val());\n\n      zip.file('libraries/jqwidgets/styles/jqx.ui-redmond.css', $('.jqwidgets23').val());\n\n      zip.file('libraries/jqwidgets/styles/jqx.ui-smoothness.css', $('.jqwidgets24').val());\n\n      zip.file('libraries/jqwidgets/styles/jqx.ui-start.css', $('.jqwidgets25').val());\n\n      zip.file('libraries/jqwidgets/styles/jqx.ui-sunny.css', $('.jqwidgets26').val());\n\n      zip.file('libraries/jqwidgets/styles/jqx.web.css', $('.jqwidgets27').val());\n\n      zip.file('libraries/jqwidgets/styles/jqx.windowsphone.css', $('.jqwidgets28').val());\n\n      zip.file('libraries/jqwidgets/jqxcore.js', $('.jqwidgets29').val());\n\n      zip.file('libraries/jqwidgets/jqxsplitter.js', $('.jqwidgets30').val());\n"

        $('.jqxsplitter').trigger("change")
        $(".jqxsplitterzip").val(jqxsplitter)
      } else {
        $('.jqxsplitter, .jqxsplitterzip').clear()
      }
      if ( $("#kinetic").is(":checked") ) {
        $('.kinetic').clear()
        download_to_textbox('libraries/kinetic/kinetic.js', $('.kinetic'))
        $('.kinetic').trigger("change")
        $(".kineticzip").val("zip.file('libraries/kinetic/kinetic.js', $(\".kinetic\").val());")
      } else {
        $('.kinetic, .kineticzip').clear()
      }
      if ( $("#knockout").is(":checked") ) {
        $('.knockout').clear()
        download_to_textbox('libraries/knockout/knockout.js', $('.knockout'))
        $('.knockout').trigger("change")
        $(".knockoutzip").val("zip.file('libraries/knockout/knockout.js', $(\".knockout\").val());")
      } else {
        $('.knockout, .knockoutzip').clear()
      }
      if ( $("#modernizer").is(":checked") ) {
        $('.modernizer').clear()
        download_to_textbox('libraries/modernizer/modernizer.js', $('.modernizer'))
        $('.modernizer').trigger("change")
        $(".modernizerzip").val("zip.file('libraries/modernizer/modernizer.js', $(\".modernizer\").val());")
      } else {
        $('.modernizer, .modernizerzip').clear()
      }
      if ( $("#mootools").is(":checked") ) {
        $('.mootools').clear()
        download_to_textbox('libraries/mootools/mootools-yui-compressed.js', $('.mootools'))
        $('.mootools').trigger("change")
        $(".mootoolszip").val("zip.file('libraries/mootools/mootools-yui-compressed.js', $(\".mootools\").val());")
      } else {
        $('.mootools, .mootoolszip').clear()
      }
      if ( $("#normalize").is(":checked") ) {
        $('.normalize').clear()
        download_to_textbox('libraries/normalize/normalize.css', $('.normalize'))
        $('.normalize').trigger("change")
        $(".normalizezip").val("zip.file('libraries/normalize/normalize.css', $(\".normalize\").val());")
      } else {
        $('.normalize, .normalizezip').clear()
      }
      if ( $("#paperjs").is(":checked") ) {
        $('.paperjs').clear()
        download_to_textbox('libraries/paperjs/paperjs.js', $('.paperjs'))
        $('.paperjs').trigger("change")
        $(".paperjszip").val("zip.file('libraries/paperjs/paperjs.js', $(\".paperjs\").val());")
      } else {
        $('.paperjs, .paperjszip').clear()
      }
      if ( $("#polyui").is(":checked") ) {
        $('.polyui').clear()
        download_to_textbox('libraries/polyui/polyui.css', $('.polyui'))
        $('.polyui').trigger("change")
        $(".polyuizip").val("zip.file('libraries/polyui/polyui.css', $(\".polyui\").val());")
      } else {
        $('.polyui, .polyuizip').clear()
      }
      if ( $("#prefixfree").is(":checked") ) {
        $('.prefixfree').clear()
        download_to_textbox('libraries/prefixfree/prefixfree.min.js', $('.prefixfree'))
        $('.prefixfree').trigger("change")
        $(".prefixfreezip").val("zip.file('libraries/prefixfree/prefixfree.min.js', $(\".prefixfree\").val());")
      } else {
        $('.prefixfree, .prefixfreezip').clear()
      }
      if ( $("#processingjs").is(":checked") ) {
        $('.processingjs').clear()
        download_to_textbox('libraries/processingjs/processingjs.js', $('.processingjs'))
        $('.processingjs').trigger("change")
        $(".processingjszip").val("zip.file('libraries/processingjs/processingjs.js', $(\".processingjs\").val());")
      } else {
        $('.processingjs, .processingjsszip').clear()
      }
      if ( $("#prototypejs").is(":checked") ) {
        $('.prototypejs').clear()
        download_to_textbox('libraries/prototypejs/prototypejs.js', $('.prototypejs'))
        $('.prototypejs').trigger("change")
        $(".prototypejszip").val("zip.file('libraries/prototypejs/prototypejs.js', $(\".prototypejs\").val());")
      } else {
        $('.prototypejs, .prototypejszip').clear()
      }
      if ( $("#qooxdoo").is(":checked") ) {
        $('.qooxdoo').clear()
        download_to_textbox('libraries/qooxdoo/qooxdoo.js', $('.qooxdoo'))
        $('.qooxdoo').trigger("change")
        $(".qooxdooszip").val("zip.file('libraries/qooxdoo/qooxdoo.js', $(\".qooxdoo\").val());")
      } else {
        $('.qooxdoo, .qooxdooszip').clear()
      }
      if ( $("#raphael").is(":checked") ) {
        $('.raphael').clear()
        download_to_textbox('libraries/raphael/raphael.js', $('.raphael'))
        $('.raphael').trigger("change")
        $(".raphaelzip").val("zip.file('libraries/raphael/raphael.js', $(\".raphael\").val());")
      } else {
        $('.raphael, .raphaelzip').clear()
      }
      if ( $("#requirejs").is(":checked") ) {
        $('.requirejs').clear()
        download_to_textbox('libraries/require/require.js', $('.requirejs'))
        $('.requirejs').trigger("change")
        $(".requirejszip").val("zip.file('libraries/require/require.js', $(\".requirejs\").val());")
      } else {
        $('.requirejs, .requirejszip').clear()
      }
      if ( $("#showdown").is(":checked") ) {
        $('.showdown').clear()
        download_to_textbox('libraries/showdown/Showdown.min.js', $('.showdown'))
        $('.showdown').trigger("change")
        $(".showdownzip").val("zip.file('libraries/showdown/Showdown.min.js', $(\".showdown\").val());")
      } else {
        $('.showdown, .showdownzip').clear()
      }
      if ( $("#scriptaculous").is(":checked") ) {
        $('.scriptaculous').clear()
        download_to_textbox('libraries/scriptaculous/scriptaculous.js', $('.scriptaculous'))
        $('.scriptaculous').trigger("change")
        $(".scriptaculouszip").val("zip.file('libraries/scriptaculous/scriptaculous.js', $(\".scriptaculous\").val());")
      } else {
        $('.scriptaculous, .scriptaculouszip').clear()
      }
      if ( $("#snapsvg").is(":checked") ) {
        $('.snapsvg').clear()
        download_to_textbox('libraries/snap-svg/snap-svg.js', $('.snapsvg'))
        $('.snapsvg').trigger("change")
        $(".snapsvgzip").val("zip.file('libraries/snap-svg/snap-svg.js', $(\".snapsvg\").val());")
      } else {
        $('.snapsvg, .snapsvgzip').clear()
      }
      if ( $("#svgjs").is(":checked") ) {
        $('.svgjs').clear()
        download_to_textbox('libraries/svg-svg/svg-svg.js', $('.svgjs'))
        $('.svgjs').trigger("change")
        $(".svgjszip").val("zip.file('libraries/svg-svg/svg-svg.js', $(\".svgjs\").val());")
      } else {
        $('.svgjs, .svgjszip').clear()
      }
      if ( $("#threejs").is(":checked") ) {
        $('.threejs').clear()
        download_to_textbox('libraries/threejs/three.min.js', $('.threejs'))
        $('.threejs').trigger("change")
        $(".threejszip").val("zip.file('libraries/threejs/three.min.js', $(\".threejs\").val());")
      } else {
        $('.threejs, .threejszip').clear()
      }
      if ( $("#underscorejs").is(":checked") ) {
        $('.underscorejs').clear()
        download_to_textbox('libraries/underscore/underscore.js', $('.underscorejs'))
        $('.underscorejs').trigger("change")
        $(".underscorejszip").val("zip.file('libraries/underscore/underscore.js', $(\".underscorejs\").val());")
      } else {
        $('.underscorejs, .underscorejszip').clear()
      }
      if ( $("#webfontloader").is(":checked") ) {
        $('.webfontloader').clear()
        download_to_textbox('libraries/webfont/webfont.js', $('.webfontloader'))
        $('.webfontloader').trigger("change")
        $(".webfontloaderzip").val("zip.file('libraries/webfont/webfont.js', $(\".webfontloader\").val());")
      } else {
        $('.webfontloader, .webfontloaderzip').clear()
      }
      if ( $("#yui").is(":checked") ) {
        $('.yui').clear()
        download_to_textbox('libraries/yui/yui.js', $('.yui'))
        $('.yui').trigger("change")
        $(".yuizip").val("zip.file('libraries/yui/yui.js', $(\".yui\").val());")
      } else {
        $('.yui, .yuizip').clear()
      }
      if ( $("#zepto").is(":checked") ) {
        $('.zepto').clear()
        download_to_textbox('libraries/zepto/zepto.js', $('.zepto'))
        $('.zepto').trigger("change")
        $(".zeptozip").val("zip.file('libraries/zepto/zepto.js', $(\".zepto\").val());")
      } else {
        $('.zepto, .zeptozip').clear()
      }

      // Update JSZip (Applied dynamically from HTML div )
      $("[data-action=ziplibs]").val(function() {
        return $.map($(".jszipcode"), function (el) {
          return el.value
        }).join("")
      })
    },
    download_to_textbox = function (url, el) {
      return $.get(url, null, function (data) {
        el.val(data)
      }, "text")
    },
    download_to_editor = function (url, el) {
      return $.get(url, null, function (data) {
        el.setValue(data)
      }, "text")
    }

function displayPreview(file) {
  var reader = new FileReader()

  reader.onload = function(e) {
    var img = new Image()
    var img16 = new Image()
    var img32 = new Image()
    var img64 = new Image()
    img.src = e.target.result
    img16.src = e.target.result
    img32.src = e.target.result
    img64.src = e.target.result
    img16.onload = function() {
      // x, y, width, height
      ctx16.clearRect(0, 0, 16, 16)
      ctx16.drawImage(img16, 0, 0, 16, 16)
    }
    img32.onload = function() {
      // x, y, width, height
      ctx32.clearRect(0, 0, 32, 32)
      ctx32.drawImage(img32, 0, 0, 32, 32)
    }
    img64.onload = function() {
      // x, y, width, height
      ctx64.clearRect(0, 0, 64, 64)
      ctx64.drawImage(img64, 0, 0, 64, 64)
    }
    img.onload = function() {
      // x, y, width, height
      ctx.clearRect(0, 0, 128, 128)
      ctx.drawImage(img, 0, 0, 128, 128)
    }
  }
  reader.readAsDataURL(file)
  return false
}
storeValues()

// Load Files
$(window).load(function() {
  /**
   * Chooser (Drop Box)
   * https://www.dropbox.com/developers/dropins/chooser/js
   */
  options = {
      success: function(file) {
        if (file[0].link.toLowerCase().substring(file[0].link.length - 5) === ".html") {
          download_to_editor(file[0].link, htmlEditor)
        } else if (file[0].link.toLowerCase().substring(file[0].link.length - 5) === ".jade") {
          download_to_editor(file[0].link, htmlEditor)
        } else if (file[0].link.toLowerCase().substring(file[0].link.length - 4) === ".css") {
          download_to_editor(file[0].link, cssEditor)
        } else if (file[0].link.toLowerCase().substring(file[0].link.length - 3) === ".js") {
          download_to_editor(file[0].link, jsEditor)
        } else if (file[0].link.toLowerCase().substring(file[0].link.length - 7) === ".coffee") {
          download_to_editor(file[0].link, jsEditor)
        } else if (file[0].link.toLowerCase().substring(file[0].link.length - 3) === ".md") {
          download_to_editor(file[0].link, mdEditor)
        } else if (file[0].link.toLowerCase().substring(file[0].link.length - 4) === ".svg") {
          download_to_editor(file[0].link, htmlEditor)
        } else {
          alertify.error("Sorry kodeWeave does not support that file type!")
        }
        window.close()
      },
      cancel: function() {
        //optional
      },
      linkType: "direct", // "preview" or "direct"
      multiselect: false, // true or false
      extensions: [".html", ".jade", ".css", ".js", ".coffee", ".md", ".svg"]
  };

  $("[data-action=open-dropbox]").click(function() {
    Dropbox.choose(options)
  })

  TogetherJS.hub.on("togetherjs.hello togetherjs.hello-back", function() {
    TogetherJS.reinitialize()
  })

  // Load Files Into Editor
  $("#loadfile").on("change", function() {
    loadfile(this)
  })

  if (window.File && window.FileReader && window.FileList && window.Blob) {
    function loadfile(input) {
      var reader = new FileReader()
      reader.onload = function(e) {
          // var path = input.value.replace(/.*(\/|\\)/, '')
          var path = input.value
          if (path.toLowerCase().substring(path.length - 5) === ".html") {
            htmlEditor.setValue( e.target.result )
          } else if (path.toLowerCase().substring(path.length - 5) === ".jade") {
            htmlEditor.setValue( e.target.result )
          } else if (path.toLowerCase().substring(path.length - 4) === ".css") {
            cssEditor.setValue( e.target.result )
          } else if (path.toLowerCase().substring(path.length - 3) === ".js") {
            jsEditor.setValue( e.target.result )
          } else if (path.toLowerCase().substring(path.length - 7) === ".coffee") {
            jsEditor.setValue( e.target.result )
          } else if (path.toLowerCase().substring(path.length - 3) === ".md") {
            mdEditor.setValue( e.target.result )
          } else if (path.toLowerCase().substring(path.length - 3) === ".svg") {
            htmlEditor.setValue( e.target.result )
          } else {
            alertify.error("Sorry kodeWeave does not support that file type!")
          }
        }
      $("input[name=menubar].active").trigger("click")
      reader.readAsText(input.files[0])
    }
  } else {
    alertify.error("The File APIs are not fully supported in this browser.")
  }

  singleFileDownload()
})

var hash = window.location.hash.substring(1)
if (window.location.hash) {
  localStorage.clear()
  function loadgist(gistid) {
    $.ajax({
      url: "https://api.github.com/gists/" + gistid,
      type: "GET",
      dataType: "jsonp",
      jsonp: "callback"
    }).success(function(gistdata) {
      var htmlVal        = gistdata.data.files["index.html"]
      var jadeVal        = gistdata.data.files["index.jade"]
      var cssVal         = gistdata.data.files["index.css"]
      var stylusVal      = gistdata.data.files["index.styl"]
      var jsVal          = gistdata.data.files["index.js"]
      var coffeeVal      = gistdata.data.files["index.coffee"]
      var mdVal      = gistdata.data.files["README.md"]
      var settings   = gistdata.data.files["settings.json"].content
      var libraries  = gistdata.data.files["libraries.json"].content
      var jsonSets   = JSON.parse(settings)
      var jsonLibs   = JSON.parse(libraries)

      // Return font settings from json
      var siteTitle        = jsonSets.siteTitle
      var WeaveVersion     = jsonSets.version
      var editorFontSize   = jsonSets.editorFontSize
      var WeaveDesc        = jsonSets.description
      var WeaveAuthor      = jsonSets.author

      $("[data-action=sitetitle]").val(siteTitle)
      $("[data-value=version]").val(WeaveVersion)
      $("[data-editor=fontSize]").val(editorFontSize)
      $("[data-action=sitedesc]").val(WeaveDesc)
      $("[data-action=siteauthor]").val(WeaveAuthor)
      storeValues()

      // Return settings from the json
      $(".metaboxes input.heading").trigger("keyup")

      // Return libraries from json
      $.each(jsonLibs, function(name, value) {
        $(".ldd-submenu #" + name).prop("checked", value).trigger("keyup")
      })

      // Set checked libraries into preview
      $("#jquery").trigger("keyup")

      // Return the editor's values
      if (!mdVal) {
        mdEditor.setValue("")
      } else {
        mdEditor.setValue(mdVal.content)
      }
      if (!htmlVal) {
        if (!jadeVal) {
          htmlEditor.setValue("")
        } else {
          htmlEditor.setValue(jadeVal.content)
          $("#html-preprocessor").val("jade").change()
        }
      } else {
        htmlEditor.setValue(htmlVal.content)
        $("#html-preprocessor").val("none").change()
      }
      if (!jadeVal) {
        if (!htmlVal) {
          htmlEditor.setValue("")
        } else {
          htmlEditor.setValue(htmlVal.content)
          $("#html-preprocessor").val("none").change()
        }
      } else {
        htmlEditor.setValue(jadeVal.content)
        $("#html-preprocessor").val("jade").change()
      }
      if (!cssVal) {
        if (!stylusVal) {
          cssEditor.setValue("")
        } else {
          cssEditor.setValue(stylusVal.content)
          $("#css-preprocessor").val("stylus").change()
        }
      } else {
        cssEditor.setValue(cssVal.content)
        $("#css-preprocessor").val("none").change()
      }
      if (!stylusVal) {
        if (!cssVal) {
          cssEditor.setValue("")
        } else {
          cssEditor.setValue(cssVal.content)
          $("#css-preprocessor").val("none").change()
        }
      } else {
        cssEditor.setValue(stylusVal.content)
        $("#css-preprocessor").val("stylus").change()
      }
      if (!jsVal) {
        if (!coffeeVal) {
          jsEditor.setValue("")
        } else {
          jsEditor.setValue(coffeeVal.content)
          $("#js-preprocessor").val("coffeescript").change()
        }
      } else {
        jsEditor.setValue(jsVal.content)
        $("#js-preprocessor").val("none").change()
      }
      if (!coffeeVal) {
        if (!jsVal) {
          jsEditor.setValue("")
        } else {
          jsEditor.setValue(jsVal.content)
          $("#js-preprocessor").val("none").change()
        }
      } else {
        jsEditor.setValue(coffeeVal.content)
        $("#js-preprocessor").val("coffeescript").change()
      }
      
      setTimeout(function() {
        mdEditor.setOption("paletteHints", "true")
        htmlEditor.setOption("paletteHints", "true")
        cssEditor.setOption("paletteHints", "true")
        jsEditor.setOption("paletteHints", "true")
      }, 300)
    }).error(function(e) {
      // ajax error
      console.warn("Error: Could not load weave!", e)
      alertify.error("Error: Could not load weave!")
    })
  }

  loadgist(hash)
} {
  setTimeout(function() {
    mdEditor.setOption("paletteHints", "true")
    htmlEditor.setOption("paletteHints", "true")
    cssEditor.setOption("paletteHints", "true")
    jsEditor.setOption("paletteHints", "true")
  }, 300)
}

// Setup Preprocessors
$(".settings").on("click", function() {
  $("input[name=menubar].active").trigger("click")
  $(".preprocessor").addClass("hide")
  if ($(this).hasClass("htmlSetting")) {
    $(".html-preprocessor").removeClass("hide")
  } else if ($(this).hasClass("cssSetting")) {
    $(".css-preprocessor").removeClass("hide")
  } else if ($(this).hasClass("jsSetting")) {
    $(".js-preprocessor").removeClass("hide")
  }
  if ($("#html-preprocessor").val() == "none") {
    if (!htmlEditor.getValue) {
      $(".html-preprocessor-convert").addClass("hide")
    }
  } else if ($("#html-preprocessor").val() == "jade") {
    if (!htmlEditor.getValue) {
      $(".html-preprocessor-convert").addClass("hide")
    }
  }
  if ($("#js-preprocessor").val() == "none") {
    if (!jsEditor.getValue) {
      $(".js-preprocessor-convert").addClass("hide")
    }
  } else if ($("#js-preprocessor").val() == "coffeescript") {
    if (!jsEditor.getValue) {
      $(".js-preprocessor-convert").addClass("hide")
    }
  }
  $("[data-action=preprocessors]").fadeIn()
})
$(".confirm-preprocessor").click(function() {
  // Default fadeout speed is 400ms
  $("[data-action=preprocessors]").fadeOut()
  // Hiding all other preprocessors at 400ms
  // Delay only works with animating methods
  // Using setTimeout as an alternative:
  setTimeout(function() {
    $(".preprocessor").addClass("hide")
  }, 400)
})
// Preprocessors (Doesn't compile to preview)
$("#html-preprocessor").on("change", function() {
  var valueSelected = this.value
  localStorage.setItem("htmlPreprocessorVal", this.value)
  if ( valueSelected == "none") {
    htmlEditor.setOption("mode", "text/html")
    htmlEditor.setOption("gutters", ["CodeMirror-lint-markers", "CodeMirror-linenumbers", "CodeMirror-foldgutter"])
    // htmlEditor.refresh()
  } else if ( valueSelected == "jade") {
    htmlEditor.setOption("mode", "text/x-jade")
    htmlEditor.setOption("gutters", ["CodeMirror-linenumbers", "CodeMirror-foldgutter"])
    // htmlEditor.refresh()
  } else {
    htmlEditor.setOption("mode", "text/html")
    htmlEditor.setOption("gutters", ["CodeMirror-lint-markers", "CodeMirror-linenumbers", "CodeMirror-foldgutter"])
    // htmlEditor.refresh()
  }
  updatePreview()
}).trigger("change")
$("#css-preprocessor").on("change", function() {
  var valueSelected = this.value
  localStorage.setItem("cssPreprocessorVal", this.value)
  if ( valueSelected == "none") {
    cssEditor.setOption("mode", "text/css")
    cssEditor.setOption("gutters", ["CodeMirror-lint-markers", "CodeMirror-linenumbers", "CodeMirror-foldgutter"])
    // cssEditor.refresh()
  } else if ( valueSelected == "stylus") {
    cssEditor.setOption("mode", "text/x-styl")
    cssEditor.setOption("gutters", ["CodeMirror-linenumbers", "CodeMirror-foldgutter"])
    setTimeout(function() {
      $(".CodeMirror-lint-mark-error, .CodeMirror-lint-mark-error-metro").removeClass("CodeMirror-lint-mark-error CodeMirror-lint-mark-error-metro")
      $(".CodeMirror-lint-mark-warning, .CodeMirror-lint-mark-warning-metro").removeClass("CodeMirror-lint-mark-warning CodeMirror-lint-mark-warning-metro")
    }, 300)
    // cssEditor.refresh()
  } else {
    cssEditor.setOption("mode", "text/css")
    cssEditor.setOption("gutters", ["CodeMirror-lint-markers", "CodeMirror-linenumbers", "CodeMirror-foldgutter"])
    // cssEditor.refresh()
  }
  updatePreview()
}).trigger("change")
$("#js-preprocessor").on("change", function() {
  var valueSelected = this.value
  localStorage.setItem("jsPreprocessorVal", this.value)
  if ( valueSelected == "none") {
    jsEditor.setOption("mode", "text/javascript")
    jsEditor.setOption("lint", false)
    jsEditor.setOption("lint", true)
    // jsEditor.refresh()
    $(".jsvalidator").show()
  } else if ( valueSelected == "coffeescript") {
    jsEditor.setOption("mode", "text/x-coffeescript")
    jsEditor.setOption("lint", false)
    jsEditor.setOption("lint", true)
    // jsEditor.refresh()
  } else {
    $(".jsvalidator").show()
    jsEditor.setOption("mode", "text/javascript")
    jsEditor.setOption("lint", false)
    jsEditor.setOption("lint", true)
    // jsEditor.refresh()
  }
  updatePreview()
}).trigger("change")

// Compile preprocessors to preview
$(".html-preprocessor-convert").click(function() {
  var options = {
      pretty: true
  }
  if ($("#html-preprocessor").val() == "none") {
    Html2Jade.convertHtml(htmlEditor.getValue(), {selectById: true}, function (err, jadeString) {
      if(err) {
        console.error(err)
      } else {
        htmlEditor.setValue(jadeString)
        htmlEditor.execCommand("selectAll")
        htmlEditor.execCommand("indentLess")
        htmlEditor.execCommand("indentLess")
        htmlEditor.setCursor({line: 0 , ch : 0 })
        htmlEditor.execCommand("deleteLine")
        htmlEditor.execCommand("deleteLine")
        htmlEditor.execCommand("deleteLine")
      }
    })
    $("#html-preprocessor").val("jade").change()
  } else if ($("#html-preprocessor").val() == "jade") {
    $("#html-preprocessor").val("none").change()
    var htmlContent = jade.render(htmlEditor.getValue(), options)
    htmlEditor.setValue(htmlContent)
    beautifyHTML()
  }
})
$(".css-preprocessor-convert").click(function() {
  if ($("#css-preprocessor").val() == "none") {
    var css = cssEditor.getValue()
    var converter = new Css2Stylus.Converter(css)
    converter.processCss()
    cssEditor.setValue(converter.getStylus())
    $("#css-preprocessor").val("stylus").change()
    cssEditor.setOption("lint", false)
    cssEditor.refresh()
  } else if ($("#css-preprocessor").val() == "stylus") {
    var cssContent = cssEditor.getValue()
    stylus(cssContent).render(function(err, out) {
      if(err != null) {
        console.error("something went wrong")
      } else {
        cssEditor.setValue(out)
      }
    })
    $("#css-preprocessor").val("none").change()
    beautifyCSS()
  }
})
$(".js-preprocessor-convert").click(function() {
  if ($("#js-preprocessor").val() == "none") {
    var jsContent = js2coffee.build(jsEditor.getValue()).code;
    jsEditor.setValue(jsContent)
    $("#js-preprocessor").val("coffeescript").change()
  } else if ($("#js-preprocessor").val() == "coffeescript") {
    $("#js-preprocessor").val("none").change()
    var jsContent = CoffeeScript.compile(jsEditor.getValue(), { bare: true })
    jsEditor.setValue(jsContent)
    beautifyJS()
  }
})

// Save as a Gist Online
$("[data-action=save-gist]").click(function() {
  $("input[name=menubar].active").trigger("click")
  
  // Return checked libraries
  var arr = {}
  $(".ldd-submenu input[type=checkbox]").each(function() {
    var id = this.id;
    arr[id] = (this.checked ? true : false)
  })

  // check if description and markdown editor have a value
  if ( !$("[data-action=sitedesc]").val()) {
    $("[data-action=sitedesc]").val("Saved from kodeWeave!")
  }

  // Return user settings
  var sArr = {
    "siteTitle": $("[data-action=sitetitle]").val(),
    "version": $("[data-value=version]").val(),
    "editorFontSize": $("[data-editor=fontSize]").val(),
    "description": $("[data-action=sitedesc]").val(),
    "author": $("[data-action=siteauthor]").val()
  }

  var files = {}
	if (htmlEditor.getValue()) {
      var htmlSelected = $("#html-preprocessor option:selected").val()

      if ( htmlSelected == "none") {
        yourHTML = htmlEditor.getValue()
        files["index.html"] = htmlEditor.getValue() ? { content: yourHTML } : null
      } else if ( htmlSelected == "jade") {
        yourHTML = htmlEditor.getValue()
        // var options = {
        //     pretty: true
        // }
        // var yourHTML = jade.render(htmlEditor.getValue(), options)
        files["index.jade"] = htmlEditor.getValue() ? { content: yourHTML } : null
      }
	}
	if (cssEditor.getValue()) {
      var cssSelected = $("#css-preprocessor option:selected").val()

      if ( cssSelected == "none") {
        yourCSS = cssEditor.getValue()
        files["index.css"] = cssEditor.getValue() ? { content: yourCSS } : null
      } else if ( cssSelected == "stylus") {
        yourCSS = cssEditor.getValue()
        files["index.styl"] = cssEditor.getValue() ? { content: yourCSS } : null
      }
	}
	if (jsEditor.getValue()) {
    var jsSelected = $("#js-preprocessor option:selected").val()

    if ( jsSelected == "none") {
      yourJS = jsEditor.getValue()
      files["index.js"] = jsEditor.getValue() ? { content: yourJS } : null
    } else if ( jsSelected == "coffeescript") {
      yourJS = jsEditor.getValue()
      files["index.coffee"] = jsEditor.getValue() ? { content: yourJS } : null
    }
	}
	if (mdEditor.getValue()) {
		files["README.md"] = mdEditor.getValue() ? { content: mdEditor.getValue() } : null
	}
	files["libraries.json"] = { "content": JSON.stringify(arr) }
	files["settings.json"] = { "content": JSON.stringify(sArr) }

  data = {
    "description": $("[data-action=sitedesc]").val(),
    "public": true,
    "files": files
  }

  // Post on Github via JQuery Ajax
  $.ajax({
    url: "https://api.github.com/gists",
    type: "POST",
    dataType: "json",
    data: JSON.stringify(data)
  }).success(function(e) {
    window.location.hash = e.html_url.split("https://gist.github.com/").join("")
    hash = window.location.hash.replace(/#/g,"")
    
    embedProject = e.html_url.split("https://gist.github.com/").join("")
    $("[data-output=projectURL]").val("http://kodeweave.sourceforge.net/editor/#" + embedProject).click(function() {
      this.select(true)
    })
    $("[data-output=embedProject]").val("<iframe width=\"100%\" height=\"300\" src=\"http://kodeweave.sourceforge.net/embed/#" + embedProject + "\" allowfullscreen=\"allowfullscreen\" frameborder=\"0\"></iframe>").click(function() {
      this.select(true)
    })

    $(".share-facebook").attr("href", "https://www.facebook.com/sharer/sharer.php?u=http%3A//kodeweave.sourceforge.net/editor/%23" + hash)
    $(".share-twitter").attr("href", "https://twitter.com/home?status=Checkout%20my%20%23weave%20on%20%23kodeWeave%3A%20http%3A//kodeweave.sourceforge.net/editor/%23" + hash)
    $(".share-gplus").attr("href", "https://plus.google.com/share?url=http%3A//kodeweave.sourceforge.net/editor/%23" + hash)
    $(".share-instagram").attr("href", "https://www.linkedin.com/shareArticle?mini=true&url=http%3A//kodeweave.sourceforge.net/editor/%23"+ hash +"&title=Checkout%20my%20%23weave%20on%20%23kodeWeave%3A%20&summary=&source=")
    $("[data-action=socialdialog]").fadeIn()

    // Let user view gist
    alertify.success("Your weave is saved!")
  }).error(function(e) {
    console.warn("Error: Could not save weave!", e)
    alertify.error("Error: Could not save weave!")
  })
})
// Close share dialog
$("[data-action=social-cancel]").on("click", function() {
  $("[data-action=socialdialog]").fadeOut()
})

// Team up / Collaborate
$("#collaborate").click(function() {
  TogetherJS(this)
  return false
})

// Drag and drop image load
holder.ondragover = function() {
  this.className = "hover"
  return false
}
holder.ondragend = function() {
  this.className = ""
  return false
}
holder.ondrop = function(e) {
  this.className = ""
  e.preventDefault()
  var file = e.dataTransfer.files[0]
  desktopExport(file)
  $(".watch").removeClass("hide")
  $(".download-dialog").addClass("imagehasloaded")
  $("#imagehasloaded").prop("checked", true)
  return false
}

// Show Preloader
$("[data-action=download-as-win-app], [data-action=download-as-win32-app], [data-action=download-as-mac-app], [data-action=download-as-lin-app], [data-action=download-as-lin32-app], [data-action=app-confirm], [data-action=ext-confirm]").click(function() {
  $(".preloader").removeClass("hide")
})

var desktopExport = function(file) {
  displayPreview(file)

  var reader = new FileReader()

  reader.onload = function(e) {
    // Download as Windows App
    $("[data-action=download-as-win-app]").on("click", function() {
      $("input[name=menubar].active").trigger("click")

      JSZipUtils.getBinaryContent('zips/YourWinApp.zip', function(err, data) {
        if(err) {
          throw err // or handle err
        }

        var zip = new JSZip()
        renderYourHTML()
        renderYourCSS()
        renderYourJS()

        var appName = zip.folder( $("[data-action=sitetitle]").val().replace(/ /g, "-")  )
        appName.load(data)

        // Your Web App
        var grabString = "<script src=\"libraries/jquery/jquery.js\"></script\>",
            replaceString = "<script src=\"libraries/jquery/jquery.js\"></script\>\n    <script>\n      try {\n        $ = jQuery = module.exports;\n        // If you want module.exports to be empty, uncomment:\n        // module.exports = {};\n      } catch(e) {}\n    </script\>";

        var Img16 = c16[0].toDataURL("image/png")
        var Img32 = c32[0].toDataURL("image/png")
        var Img64 = c64[0].toDataURL("image/png")
        var Img128 = canvas[0].toDataURL("image/png")
        appName.file("resources/default_app/icons/16.png", Img16.split('base64,')[1],{base64: true})
        appName.file("resources/default_app/icons/32.png", Img32.split('base64,')[1],{base64: true})
        appName.file("resources/default_app/icons/64.png", Img64.split('base64,')[1],{base64: true})
        appName.file("resources/default_app/icons/128.png", Img128.split('base64,')[1],{base64: true})

        // check if css editor has a value
        if (cssEditor.getValue() !== "") {
          closeRefs.setValue($("[data-action=library-code]").val().split(grabString).join(replaceString) + "    <link rel=\"stylesheet\" href=\"libraries/font-awesome/font-awesome.css\" />\n    <link rel=\"stylesheet\" href=\"libraries/font-awesome/macset.css\" />\n    <link rel=\"stylesheet\" href=\"css/index.css\" />" + "\n  </head>\n  <body>\n\n")
          var htmlContent = openHTML.getValue() + $("[data-action=sitetitle]").val() + closeHTML.getValue() + closeRefs.getValue() + yourHTML + "\n    " + closeFinal.getValue()

          appName.file("resources/default_app/css/index.css", cssEditor.getValue())
          appName.file("resources/default_app/index.html", htmlContent)
        }
        // check if js editor has a value
        if ( jsEditor.getValue() !== "") {
          if (cssEditor.getValue() === "") {
            closeRefs.setValue($("[data-action=library-code]").val().split(grabString).join(replaceString) + "    <link rel=\"stylesheet\" href=\"libraries/font-awesome/font-awesome.css\" />\n    <link rel=\"stylesheet\" href=\"libraries/font-awesome/macset.css\" />" + "\n  </head>\n  <body>\n\n")
          } else {
            closeRefs.setValue($("[data-action=library-code]").val().split(grabString).join(replaceString) + "    <link rel=\"stylesheet\" href=\"libraries/font-awesome/font-awesome.css\" />\n    <link rel=\"stylesheet\" href=\"libraries/font-awesome/macset.css\" />\n    <link rel=\"stylesheet\" href=\"css/index.css\" />" + "\n  </head>\n  <body>\n\n")
          }
          var htmlContent = openHTML.getValue() + $("[data-action=sitetitle]").val() + closeHTML.getValue() + closeRefs.getValue() + yourHTML + "\n\n    <script src=\"js/index.js\"></script>" + closeFinal.getValue()

          appName.file("resources/default_app/js/index.js", yourJS)
          appName.file("resources/default_app/index.html", htmlContent)
        }
        // check if css and js editors have values
        if (cssEditor.getValue() !== "" && jsEditor.getValue() !== "") {
          closeRefs.setValue($("[data-action=library-code]").val().split(grabString).join(replaceString) + "    <link rel=\"stylesheet\" href=\"libraries/font-awesome/font-awesome.css\" />\n    <link rel=\"stylesheet\" href=\"libraries/font-awesome/macset.css\" />\n    <link rel=\"stylesheet\" href=\"css/index.css\" />" + "\n  </head>\n  <body>\n\n")
          htmlContent = openHTML.getValue() + $("[data-action=sitetitle]").val() + closeHTML.getValue() + closeRefs.getValue() + yourHTML + "\n\n    <script src=\"js/index.js\"></script>" + closeFinal.getValue()

          appName.file("resources/default_app/css/index.css", cssEditor.getValue())
          appName.file("resources/default_app/js/index.js", yourJS)
          appName.file("resources/default_app/index.html", htmlContent)
        }
        if (cssEditor.getValue() == "" && jsEditor.getValue() == "") {
          closeRefs.setValue($("[data-action=library-code]").val() + "    <link rel=\"stylesheet\" href=\"libraries/font-awesome/font-awesome.css\" />\n    <link rel=\"stylesheet\" href=\"libraries/font-awesome/macset.css\" />" + "\n  </head>\n  <body>\n\n")
          htmlContent = openHTML.getValue() + $("[data-action=sitetitle]").val() + closeHTML.getValue() + closeRefs.getValue() + yourHTML + "\n" + closeFinal.getValue()

          appName.file("resources/default_app/index.html", htmlContent)
        }
        // check if markdown editor has a value
        if ( mdEditor.getValue() !== "") {
          appName.file("resources/default_app/README.md", mdEditor.getValue())
        }


        appName.file("resources/default_app/package.json", "{\n  \"name\": \""+ $("[data-action=sitetitle]").val() +"\",\n  \"productName\": \""+ $("[data-action=sitetitle]").val() +"\",\n  \"version\": \"1.0.0\",\n  \"main\": \"default_app.js\",\n  \"license\": \"MIT\"\n}\n")
        eval( $("[data-action=ziplibs]").val().replace(/libraries/g,"resources/default_app/libraries").replace(/zip.file/g,"appName.file") )

        var content = zip.generate({type:"blob"})
        saveAs(content, $("[data-action=sitetitle]").val().split(" ").join("-") + "-win.zip")
        $(".preloader").addClass("hide")
        return false
      })
      return false
    })
    $("[data-action=download-as-win32-app]").on("click", function() {
      $("input[name=menubar].active").trigger("click")

      JSZipUtils.getBinaryContent('zips/YourWin32App.zip', function(err, data) {
        if(err) {
          throw err // or handle err
        }

        var zip = new JSZip(data)
        renderYourHTML()
        renderYourCSS()
        renderYourJS()

        // Your Web App
        var grabString = "<script src=\"libraries/jquery/jquery.js\"></script\>",
            replaceString = "<script src=\"libraries/jquery/jquery.js\"></script\>\n    <script>\n      try {\n        $ = jQuery = module.exports;\n        // If you want module.exports to be empty, uncomment:\n        // module.exports = {};\n      } catch(e) {}\n    </script\>";

        closeRefs.setValue($("[data-action=library-code]").val().split(grabString).join(replaceString) + "    <link rel=\"stylesheet\" href=\"libraries/font-awesome/font-awesome.css\" />\n    <link rel=\"stylesheet\" href=\"libraries/font-awesome/macset.css\" />\n    <link rel=\"stylesheet\" href=\"css/index.css\" />" + "\n  </head>\n  <body>\n\n")
        var htmlContent = openHTML.getValue() + $("[data-action=sitetitle]").val() + closeHTML.getValue() + closeRefs.getValue() + yourHTML + "\n\n    <script src=\"js/index.js\"></script>" + closeFinal.getValue()
        var Img16 = c16[0].toDataURL("image/png")
        var Img32 = c32[0].toDataURL("image/png")
        var Img64 = c64[0].toDataURL("image/png")
        var Img128 = canvas[0].toDataURL("image/png")
        zip.file("app/icons/16.png", Img16.split('base64,')[1],{base64: true})
        zip.file("app/icons/32.png", Img32.split('base64,')[1],{base64: true})
        zip.file("app/icons/64.png", Img64.split('base64,')[1],{base64: true})
        zip.file("app/icons/128.png", Img128.split('base64,')[1],{base64: true})

        // check if css editor has a value
        if (cssEditor.getValue() !== "") {
          closeRefs.setValue($("[data-action=library-code]").val().split(grabString).join(replaceString) + "    <link rel=\"stylesheet\" href=\"libraries/font-awesome/font-awesome.css\" />\n    <link rel=\"stylesheet\" href=\"libraries/font-awesome/macset.css\" />\n    <link rel=\"stylesheet\" href=\"css/index.css\" />" + "\n  </head>\n  <body>\n\n")
          var htmlContent = openHTML.getValue() + $("[data-action=sitetitle]").val() + closeHTML.getValue() + closeRefs.getValue() + yourHTML + "\n    " + closeFinal.getValue()

          zip.file("app/css/index.css", cssEditor.getValue())
          zip.file("app/index.html", htmlContent)
        }
        // check if js editor has a value
        if ( jsEditor.getValue() !== "") {
          if (jsEditor.getValue() === "") {
            closeRefs.setValue($("[data-action=library-code]").val().split(grabString).join(replaceString) + "    <link rel=\"stylesheet\" href=\"libraries/font-awesome/font-awesome.css\" />\n    <link rel=\"stylesheet\" href=\"libraries/font-awesome/macset.css\" />" + "\n  </head>\n  <body>\n\n")
          } else {
            closeRefs.setValue($("[data-action=library-code]").val().split(grabString).join(replaceString) + "    <link rel=\"stylesheet\" href=\"libraries/font-awesome/font-awesome.css\" />\n    <link rel=\"stylesheet\" href=\"libraries/font-awesome/macset.css\" />\n    <link rel=\"stylesheet\" href=\"css/index.css\" />" + "\n  </head>\n  <body>\n\n")
          }
          var htmlContent = openHTML.getValue() + $("[data-action=sitetitle]").val() + closeHTML.getValue() + closeRefs.getValue() + yourHTML + "\n\n    <script src=\"js/index.js\"></script>" + closeFinal.getValue()

          zip.file("app/js/index.js", yourJS)
          zip.file("app/index.html", htmlContent)
        }
        // check if css and js editors have values
        if (cssEditor.getValue() !== "" && jsEditor.getValue() !== "") {
          closeRefs.setValue($("[data-action=library-code]").val().split(grabString).join(replaceString) + "    <link rel=\"stylesheet\" href=\"libraries/font-awesome/font-awesome.css\" />\n    <link rel=\"stylesheet\" href=\"libraries/font-awesome/macset.css\" />\n    <link rel=\"stylesheet\" href=\"css/index.css\" />" + "\n  </head>\n  <body>\n\n")
          htmlContent = openHTML.getValue() + $("[data-action=sitetitle]").val() + closeHTML.getValue() + closeRefs.getValue() + yourHTML + "\n\n    <script src=\"js/index.js\"></script>" + closeFinal.getValue()

          zip.file("app/css/index.css", cssEditor.getValue())
          zip.file("app/js/index.js", yourJS)
          zip.file("app/index.html", htmlContent)
        }
        if (cssEditor.getValue() == "" && jsEditor.getValue() == "") {
          closeRefs.setValue($("[data-action=library-code]").val() + "    <link rel=\"stylesheet\" href=\"libraries/font-awesome/font-awesome.css\" />\n    <link rel=\"stylesheet\" href=\"libraries/font-awesome/macset.css\" />" + "\n  </head>\n  <body>\n\n")
          htmlContent = openHTML.getValue() + $("[data-action=sitetitle]").val() + closeHTML.getValue() + closeRefs.getValue() + yourHTML + "\n" + closeFinal.getValue()

          zip.file("index.html", htmlContent)
        }
        // check if markdown editor has a value
        if ( mdEditor.getValue() !== "") {
          zip.file("data/README.md", mdEditor.getValue())
        }

        eval( $("[data-action=ziplibs]").val().replace(/libraries/g,"app/libraries") )

        zip.file("package.json", '{\n  "main"  : "app/index.html",\n  "name"  : "'+ $("[data-action=sitetitle]").val() +'",\n  "window": {\n      "toolbar" : false,\n      "icon"    : "app/icons/128.png",\n      "width"   : 1000,\n      "height"  : 600,\n      "position": "center"\n  }\n}')

        var content = zip.generate({type:"blob"})
        saveAs(content, $("[data-action=sitetitle]").val().split(" ").join("-") + "-win32.zip")
        $(".preloader").addClass("hide")
        return false
      })
      return false
    })

    // Download as Mac App
    $("[data-action=download-as-mac-app]").on("click", function() {
      $("input[name=menubar].active").trigger("click")

      JSZipUtils.getBinaryContent('zips/YourMacApp.zip', function(err, data) {
        if(err) {
          throw err // or handle err
        }

        var zip = new JSZip(data)
        renderYourHTML()
        renderYourCSS()
        renderYourJS()

        // Your Web App
        var grabString = "<script src=\"libraries/jquery/jquery.js\"></script\>",
            replaceString = "<script src=\"libraries/jquery/jquery.js\"></script\>\n    <script>\n      try {\n        $ = jQuery = module.exports;\n        // If you want module.exports to be empty, uncomment:\n        // module.exports = {};\n      } catch(e) {}\n    </script\>";

        closeRefs.setValue($("[data-action=library-code]").val().split(grabString).join(replaceString) + "    <link rel=\"stylesheet\" href=\"libraries/font-awesome/font-awesome.css\" />\n    <link rel=\"stylesheet\" href=\"libraries/font-awesome/macset.css\" />\n    <link rel=\"stylesheet\" href=\"css/index.css\" />" + "\n  </head>\n  <body>\n\n")
        var htmlContent = openHTML.getValue() + $("[data-action=sitetitle]").val() + closeHTML.getValue() + closeRefs.getValue() + yourHTML + "\n\n    <script src=\"js/index.js\"></script>" + closeFinal.getValue()
        var Img16 = c16[0].toDataURL("image/png")
        var Img32 = c32[0].toDataURL("image/png")
        var Img64 = c64[0].toDataURL("image/png")
        var Img128 = canvas[0].toDataURL("image/png")
        zip.file("content/app/icons/16.png", Img16.split('base64,')[1],{base64: true})
        zip.file("content/app/icons/32.png", Img32.split('base64,')[1],{base64: true})
        zip.file("content/app/icons/64.png", Img64.split('base64,')[1],{base64: true})
        zip.file("content/app/icons/128.png", Img128.split('base64,')[1],{base64: true})

        // check if css editor has a value
        if (cssEditor.getValue() !== "") {
          closeRefs.setValue($("[data-action=library-code]").val().split(grabString).join(replaceString) + "    <link rel=\"stylesheet\" href=\"libraries/font-awesome/font-awesome.css\" />\n    <link rel=\"stylesheet\" href=\"libraries/font-awesome/macset.css\" />\n    <link rel=\"stylesheet\" href=\"css/index.css\" />" + "\n  </head>\n  <body>\n\n")
          var htmlContent = openHTML.getValue() + $("[data-action=sitetitle]").val() + closeHTML.getValue() + closeRefs.getValue() + yourHTML + "\n    " + closeFinal.getValue()

          zip.file("content/app/css/index.css", cssEditor.getValue())
          zip.file("content/app/index.html", htmlContent)
        }
        // check if js editor has a value
        if ( jsEditor.getValue() !== "") {
          if (jsEditor.getValue() === "") {
            closeRefs.setValue($("[data-action=library-code]").val().split(grabString).join(replaceString) + "    <link rel=\"stylesheet\" href=\"libraries/font-awesome/font-awesome.css\" />\n    <link rel=\"stylesheet\" href=\"libraries/font-awesome/macset.css\" />" + "\n  </head>\n  <body>\n\n")
          } else {
            closeRefs.setValue($("[data-action=library-code]").val().split(grabString).join(replaceString) + "    <link rel=\"stylesheet\" href=\"libraries/font-awesome/font-awesome.css\" />\n    <link rel=\"stylesheet\" href=\"libraries/font-awesome/macset.css\" />\n    <link rel=\"stylesheet\" href=\"css/index.css\" />" + "\n  </head>\n  <body>\n\n")
          }
          var htmlContent = openHTML.getValue() + $("[data-action=sitetitle]").val() + closeHTML.getValue() + closeRefs.getValue() + yourHTML + "\n\n    <script src=\"js/index.js\"></script>" + closeFinal.getValue()

          zip.file("content/app/js/index.js", yourJS)
          zip.file("content/app/index.html", htmlContent)
        }
        // check if css and js editors have values
        if (cssEditor.getValue() !== "" && jsEditor.getValue() !== "") {
          closeRefs.setValue($("[data-action=library-code]").val().split(grabString).join(replaceString) + "    <link rel=\"stylesheet\" href=\"libraries/font-awesome/font-awesome.css\" />\n    <link rel=\"stylesheet\" href=\"libraries/font-awesome/macset.css\" />\n    <link rel=\"stylesheet\" href=\"css/index.css\" />" + "\n  </head>\n  <body>\n\n")
          htmlContent = openHTML.getValue() + $("[data-action=sitetitle]").val() + closeHTML.getValue() + closeRefs.getValue() + yourHTML + "\n\n    <script src=\"js/index.js\"></script>" + closeFinal.getValue()

          zip.file("content/app/css/index.css", cssEditor.getValue())
          zip.file("content/app/js/index.js", yourJS)
          zip.file("content/app/index.html", htmlContent)
        }
        if (cssEditor.getValue() == "" && jsEditor.getValue() == "") {
          closeRefs.setValue($("[data-action=library-code]").val() + "    <link rel=\"stylesheet\" href=\"libraries/font-awesome/font-awesome.css\" />\n    <link rel=\"stylesheet\" href=\"libraries/font-awesome/macset.css\" />" + "\n  </head>\n  <body>\n\n")
          htmlContent = openHTML.getValue() + $("[data-action=sitetitle]").val() + closeHTML.getValue() + closeRefs.getValue() + yourHTML + "\n" + closeFinal.getValue()

          zip.file("content/index.html", htmlContent)
        }
        // check if markdown editor has a value
        if ( mdEditor.getValue() !== "") {
          zip.file("README.md", mdEditor.getValue())
        }

        eval( $("[data-action=ziplibs]").val().replace(/libraries/g,"content/app/libraries") )

        zip.file("package.json", '{\n  "main"  : "content/index.html",\n  "name"  : "'+ $("[data-action=sitetitle]").val() +'",\n  "window": {\n    "toolbar"    : false\n  }\n}')
        zip.file("content/index.html", '<!doctype html>\n<html>\n <head>\n    <title>'+ $("[data-action=sitetitle]").val() +'</title>\n    <style>\n      iframe {\n        position: absolute;\n        top: 0;\n        left: 0;\n        width: 100%;\n        height: 100%;\n        overflow: visible;\n        border: 0;\n      }\n    </style>\n  </head>\n <body>\n    <iframe src="app/index.html"></iframe>\n\n    <script src="js/main.js"></script>\n  </body>\n</html>')
        zip.file("content/js/main.js", 'document.addEventListener("DOMContentLoaded", function() {\n  // Load library\n  var gui = require("nw.gui");\n\n  // Reference to window\n  var win = gui.Window.get();\n\n  // Create menu container\n  var Menu = new gui.Menu({\n    type: "menubar"\n  });\n\n  //initialize default mac menu\n  Menu.createMacBuiltin("'+ $("[data-action=sitetitle]").val() +'");\n\n  // Get the root menu from the default mac menu\n  var windowMenu = Menu.items[2].submenu;\n\n  // Append new item to root menu\n  windowMenu.insert(\n    new gui.MenuItem({\n      type: "normal",\n      label: "Toggle Fullscreen",\n      key: "F",\n      modifiers: "cmd",\n      click : function () {\n        win.toggleFullscreen();\n      }\n    })\n  );\n\n  windowMenu.insert(\n    new gui.MenuItem({\n      type: "normal",\n      label: "Reload App",\n      key: "r",\n      modifiers: "cmd",\n      click : function () {\n        win.reload();\n      }\n    })\n  );\n\n  // Append Menu to Window\n  gui.Window.get().menu = Menu;\n});')

        var content = zip.generate({type:"blob"})
        saveAs(content, $("[data-action=sitetitle]").val().split(" ").join("-") + "-mac.zip")
        $(".preloader").addClass("hide")
        return false
      })
      return false
    })

    // Download as Linux App
    $("[data-action=download-as-lin-app]").on("click", function() {
      $("input[name=menubar].active").trigger("click")

      JSZipUtils.getBinaryContent('zips/YourLinApp.zip', function(err, data) {
        if(err) {
          throw err // or handle err
        }

        var zip = new JSZip()
        var appName = zip.folder( $("[data-action=sitetitle]").val().replace(/ /g, "-")  )
        appName.load(data)
        renderYourHTML()
        renderYourCSS()
        renderYourJS()

        // Your Web App
        var grabString = "<script src=\"libraries/jquery/jquery.js\"></script\>",
            replaceString = "<script src=\"libraries/jquery/jquery.js\"></script\>\n    <script>\n      try {\n        $ = jQuery = module.exports;\n        // If you want module.exports to be empty, uncomment:\n        // module.exports = {};\n      } catch(e) {}\n    </script\>";

        var Img16 = c16[0].toDataURL("image/png")
        var Img32 = c32[0].toDataURL("image/png")
        var Img64 = c64[0].toDataURL("image/png")
        var Img128 = canvas[0].toDataURL("image/png")
        appName.file("resources/default_app/icons/16.png", Img16.split('base64,')[1],{base64: true})
        appName.file("resources/default_app/icons/32.png", Img32.split('base64,')[1],{base64: true})
        appName.file("resources/default_app/icons/64.png", Img64.split('base64,')[1],{base64: true})
        appName.file("resources/default_app/icons/128.png", Img128.split('base64,')[1],{base64: true})

        // check if css editor has a value
        if (cssEditor.getValue() !== "") {
          closeRefs.setValue($("[data-action=library-code]").val().split(grabString).join(replaceString) + "    <link rel=\"stylesheet\" href=\"libraries/font-awesome/font-awesome.css\" />\n    <link rel=\"stylesheet\" href=\"libraries/font-awesome/macset.css\" />\n    <link rel=\"stylesheet\" href=\"css/index.css\" />" + "\n  </head>\n  <body>\n\n")
          var htmlContent = openHTML.getValue() + $("[data-action=sitetitle]").val() + closeHTML.getValue() + closeRefs.getValue() + yourHTML + "\n    " + closeFinal.getValue()

          appName.file("resources/default_app/css/index.css", cssEditor.getValue())
          appName.file("resources/default_app/index.html", htmlContent)
        }
        // check if js editor has a value
        if ( jsEditor.getValue() !== "") {
          if (cssEditor.getValue() === "") {
            closeRefs.setValue($("[data-action=library-code]").val().split(grabString).join(replaceString) + "    <link rel=\"stylesheet\" href=\"libraries/font-awesome/font-awesome.css\" />\n    <link rel=\"stylesheet\" href=\"libraries/font-awesome/macset.css\" />" + "\n  </head>\n  <body>\n\n")
          } else {
            closeRefs.setValue($("[data-action=library-code]").val().split(grabString).join(replaceString) + "    <link rel=\"stylesheet\" href=\"libraries/font-awesome/font-awesome.css\" />\n    <link rel=\"stylesheet\" href=\"libraries/font-awesome/macset.css\" />\n    <link rel=\"stylesheet\" href=\"css/index.css\" />" + "\n  </head>\n  <body>\n\n")
          }
          var htmlContent = openHTML.getValue() + $("[data-action=sitetitle]").val() + closeHTML.getValue() + closeRefs.getValue() + yourHTML + "\n\n    <script src=\"js/index.js\"></script>" + closeFinal.getValue()

          appName.file("resources/default_app/js/index.js", yourJS)
          appName.file("resources/default_app/index.html", htmlContent)
        }
        // check if css and js editors have values
        if (cssEditor.getValue() !== "" && jsEditor.getValue() !== "") {
          closeRefs.setValue($("[data-action=library-code]").val().split(grabString).join(replaceString) + "    <link rel=\"stylesheet\" href=\"libraries/font-awesome/font-awesome.css\" />\n    <link rel=\"stylesheet\" href=\"libraries/font-awesome/macset.css\" />\n    <link rel=\"stylesheet\" href=\"css/index.css\" />" + "\n  </head>\n  <body>\n\n")
          htmlContent = openHTML.getValue() + $("[data-action=sitetitle]").val() + closeHTML.getValue() + closeRefs.getValue() + yourHTML + "\n\n    <script src=\"js/index.js\"></script>" + closeFinal.getValue()

          appName.file("resources/default_app/css/index.css", cssEditor.getValue())
          appName.file("resources/default_app/js/index.js", yourJS)
          appName.file("resources/default_app/index.html", htmlContent)
        }
        if (cssEditor.getValue() == "" && jsEditor.getValue() == "") {
          closeRefs.setValue($("[data-action=library-code]").val() + "    <link rel=\"stylesheet\" href=\"libraries/font-awesome/font-awesome.css\" />\n    <link rel=\"stylesheet\" href=\"libraries/font-awesome/macset.css\" />" + "\n  </head>\n  <body>\n\n")
          htmlContent = openHTML.getValue() + $("[data-action=sitetitle]").val() + closeHTML.getValue() + closeRefs.getValue() + yourHTML + "\n" + closeFinal.getValue()

          appName.file("resources/default_app/index.html", htmlContent)
        }
        // check if markdown editor has a value
        if ( mdEditor.getValue() !== "") {
          appName.file("resources/default_app/README.md", mdEditor.getValue())
        }

        appName.file("resources/default_app/package.json", "{\n  \"name\": \""+ $("[data-action=sitetitle]").val() +"\",\n  \"productName\": \""+ $("[data-action=sitetitle]").val() +"\",\n  \"version\": \"1.0.0\",\n  \"main\": \"default_app.js\",\n  \"license\": \"MIT\"\n}\n")
        eval( $("[data-action=ziplibs]").val().replace(/libraries/g,"resources/default_app/libraries").replace(/zip.file/g,"appName.file") )

        zip.file("make.sh", "if [ -d ${HOME}/"+ $("[data-action=sitetitle]").val().replace(/ /g, "-") +" ]; then\n  typeset LP_FILE=${HOME}/"+ $("[data-action=sitetitle]").val().replace(/ /g, "-") +"/"+ $("[data-action=sitetitle]").val().replace(/ /g, "-") +".desktop\n\n  # Remove the target file if any\n  rm -f ${LP_FILE}\n  printf \"%s[Desktop Entry]\\nName="+ $("[data-action=sitetitle]").val() +"\\nPath=${HOME}/"+ $("[data-action=sitetitle]").val().replace(/ /g, "-") +"\\nActions=sudo\\nExec=./"+ $("[data-action=sitetitle]").val().replace(/ /g, "-") +"/electron\\nIcon=${HOME}/"+ $("[data-action=sitetitle]").val().replace(/ /g, "-") +"/resources/default_app/icons/128.png\\nTerminal=true\\nType=Application\\nStartupNotify=true > ${HOME}/"+ $("[data-action=sitetitle]").val().replace(/ /g, "-") +".desktop\" >> ${LP_FILE}\n\n  echo 'Your application and launcher are now located at ${HOME}/"+ $("[data-action=sitetitle]").val().replace(/ /g, "-") +"'\n  rm README.md\n  rm make.sh\n  cd ../\n  rmdir "+ $("[data-action=sitetitle]").val().replace(/ /g, "-") +"-lin\n  cd ${HOME}/"+ $("[data-action=sitetitle]").val().replace(/ /g, "-") +"/\n  chmod 775 electron\nfi\n\nif [ ! -d ${HOME}/"+ $("[data-action=sitetitle]").val().replace(/ /g, "-") +" ]; then\n  mv "+ $("[data-action=sitetitle]").val().replace(/ /g, "-") +" ${HOME}\n\n  typeset LP_FILE=${HOME}/"+ $("[data-action=sitetitle]").val().replace(/ /g, "-") +"/"+ $("[data-action=sitetitle]").val().replace(/ /g, "-") +".desktop\n\n  # Remove the target file if any\n  rm -f ${LP_FILE}\n  printf \"%s[Desktop Entry]\\nName="+ $("[data-action=sitetitle]").val() +"\\nPath=${HOME}/"+ $("[data-action=sitetitle]").val().replace(/ /g, "-") +"\\nActions=sudo\\nExec=./"+ $("[data-action=sitetitle]").val().replace(/ /g, "-") +"/electron\\nIcon=${HOME}/"+ $("[data-action=sitetitle]").val().replace(/ /g, "-") +"/resources/default_app/icons/128.png\\nTerminal=true\\nType=Application\\nStartupNotify=true > ${HOME}/"+ $("[data-action=sitetitle]").val().replace(/ /g, "-") +".desktop\" >> ${LP_FILE}\n\n  echo 'Your application and launcher are now located at ${HOME}/"+ $("[data-action=sitetitle]").val().replace(/ /g, "-") +"'\n  rm README.md\n  rm make.sh\n  cd ../\n  rmdir "+ $("[data-action=sitetitle]").val().replace(/ /g, "-") +"-lin\n  cd ${HOME}/"+ $("[data-action=sitetitle]").val().replace(/ /g, "-") +"/\n  chmod 775 electron\nfi\n\n# For Windows OS\n#if EXIST ${HOME}/"+ $("[data-action=sitetitle]").val().replace(/ /g, "-") +" (\n  #echo Yes\n#) ELSE (\n  #echo No\n#)\n")
        zip.file("README.md", "### Instructions\n 1. Extract the `"+ $("[data-action=sitetitle]").val().replace(/ /g, "-") +"-lin.zip` folder anywhere on your computer except the home folder. \n 2. Open a terminal and then navigate to "+ $("[data-action=sitetitle]").val().replace(/ /g, "-") +"'s directory and `run the make.sh file`.\n\n  **example**:\n  cd Downloads/"+ $("[data-action=sitetitle]").val().replace(/ /g, "-") +"-lin\n\n 3. This will move the "+ $("[data-action=sitetitle]").val().replace(/ /g, "-") +" sibling folder and it's decendants to your home directory and create an application launcher.\n")

        var content = zip.generate({type:"blob"})
        saveAs(content, $("[data-action=sitetitle]").val().split(" ").join("-") + "-lin.zip")
        $(".preloader").addClass("hide")
        return false
      })
      return false
    })
    $("[data-action=download-as-lin32-app]").on("click", function() {
      $("input[name=menubar].active").trigger("click")

      JSZipUtils.getBinaryContent('zips/YourLin32App.zip', function(err, data) {
        if(err) {
          throw err // or handle err
        }

        var zip = new JSZip(data)
        renderYourHTML()
        renderYourCSS()
        renderYourJS()

        // Your Web App
        var grabString = "<script src=\"libraries/jquery/jquery.js\"></script\>",
            replaceString = "<script src=\"libraries/jquery/jquery.js\"></script\>\n    <script>\n      try {\n        $ = jQuery = module.exports;\n        // If you want module.exports to be empty, uncomment:\n        // module.exports = {};\n      } catch(e) {}\n    </script\>";

        closeRefs.setValue($("[data-action=library-code]").val().split(grabString).join(replaceString) + "    <link rel=\"stylesheet\" href=\"libraries/font-awesome/font-awesome.css\" />\n    <link rel=\"stylesheet\" href=\"libraries/font-awesome/macset.css\" />\n    <link rel=\"stylesheet\" href=\"css/index.css\" />" + "\n  </head>\n  <body>\n\n")
        var htmlContent = openHTML.getValue() + $("[data-action=sitetitle]").val() + closeHTML.getValue() + closeRefs.getValue() + yourHTML + "\n\n    <script src=\"js/index.js\"></script>" + closeFinal.getValue()
        var Img16 = c16[0].toDataURL("image/png")
        var Img32 = c32[0].toDataURL("image/png")
        var Img64 = c64[0].toDataURL("image/png")
        var Img128 = canvas[0].toDataURL("image/png")
        zip.file("app/icons/16.png", Img16.split('base64,')[1],{base64: true})
        zip.file("app/icons/32.png", Img32.split('base64,')[1],{base64: true})
        zip.file("app/icons/64.png", Img64.split('base64,')[1],{base64: true})
        zip.file("app/icons/128.png", Img128.split('base64,')[1],{base64: true})

        // check if css editor has a value
        if (cssEditor.getValue() !== "") {
          closeRefs.setValue($("[data-action=library-code]").val().split(grabString).join(replaceString) + "    <link rel=\"stylesheet\" href=\"libraries/font-awesome/font-awesome.css\" />\n    <link rel=\"stylesheet\" href=\"libraries/font-awesome/macset.css\" />\n    <link rel=\"stylesheet\" href=\"css/index.css\" />" + "\n  </head>\n  <body>\n\n")
          var htmlContent = openHTML.getValue() + $("[data-action=sitetitle]").val() + closeHTML.getValue() + closeRefs.getValue() + yourHTML + "\n    " + closeFinal.getValue()

          zip.file("app/css/index.css", cssEditor.getValue())
          zip.file("app/index.html", htmlContent)
        }
        // check if js editor has a value
        if ( jsEditor.getValue() !== "") {
          if (jsEditor.getValue() === "") {
            closeRefs.setValue($("[data-action=library-code]").val().split(grabString).join(replaceString) + "    <link rel=\"stylesheet\" href=\"libraries/font-awesome/font-awesome.css\" />\n    <link rel=\"stylesheet\" href=\"libraries/font-awesome/macset.css\" />" + "\n  </head>\n  <body>\n\n")
          } else {
            closeRefs.setValue($("[data-action=library-code]").val().split(grabString).join(replaceString) + "    <link rel=\"stylesheet\" href=\"libraries/font-awesome/font-awesome.css\" />\n    <link rel=\"stylesheet\" href=\"libraries/font-awesome/macset.css\" />\n    <link rel=\"stylesheet\" href=\"css/index.css\" />" + "\n  </head>\n  <body>\n\n")
          }
          var htmlContent = openHTML.getValue() + $("[data-action=sitetitle]").val() + closeHTML.getValue() + closeRefs.getValue() + yourHTML + "\n\n    <script src=\"js/index.js\"></script>" + closeFinal.getValue()

          zip.file("app/js/index.js", yourJS)
          zip.file("app/index.html", htmlContent)
        }
        // check if css and js editors have values
        if (cssEditor.getValue() !== "" && jsEditor.getValue() !== "") {
          closeRefs.setValue($("[data-action=library-code]").val().split(grabString).join(replaceString) + "    <link rel=\"stylesheet\" href=\"libraries/font-awesome/font-awesome.css\" />\n    <link rel=\"stylesheet\" href=\"libraries/font-awesome/macset.css\" />\n    <link rel=\"stylesheet\" href=\"css/index.css\" />" + "\n  </head>\n  <body>\n\n")
          htmlContent = openHTML.getValue() + $("[data-action=sitetitle]").val() + closeHTML.getValue() + closeRefs.getValue() + yourHTML + "\n\n    <script src=\"js/index.js\"></script>" + closeFinal.getValue()

          zip.file("app/css/index.css", cssEditor.getValue())
          zip.file("app/js/index.js", yourJS)
          zip.file("app/index.html", htmlContent)
        }
        if (cssEditor.getValue() == "" && jsEditor.getValue() == "") {
          closeRefs.setValue($("[data-action=library-code]").val() + "    <link rel=\"stylesheet\" href=\"libraries/font-awesome/font-awesome.css\" />\n    <link rel=\"stylesheet\" href=\"libraries/font-awesome/macset.css\" />" + "\n  </head>\n  <body>\n\n")
          htmlContent = openHTML.getValue() + $("[data-action=sitetitle]").val() + closeHTML.getValue() + closeRefs.getValue() + yourHTML + "\n" + closeFinal.getValue()

          zip.file("index.html", htmlContent)
        }
        // check if markdown editor has a value
        if ( mdEditor.getValue() !== "") {
          zip.file("data/README.md", mdEditor.getValue())
        }

        eval( $("[data-action=ziplibs]").val().replace(/libraries/g,"app/libraries") )

        zip.file("package.json", '{\n  "main"  : "app/index.html",\n  "name"  : "'+ $("[data-action=sitetitle]").val() +'",\n  "window": {\n      "toolbar" : false,\n      "icon"    : "app/icons/128.png",\n      "width"   : 1000,\n      "height"  : 600,\n      "position": "center"\n  }\n}')

        var content = zip.generate({type:"blob"})
        saveAs(content, $("[data-action=sitetitle]").val().split(" ").join("-") + "-lin32.zip")
        $(".preloader").addClass("hide")
        return false
      })
      return false
    })

    // Download as Chrome App
    $("[data-action=download-as-chrome-app]").on("click", function() {
      $("input[name=menubar].active").trigger("click")
      $("[data-action=chromeappdialog]").fadeIn()
    })
    $("[data-action=app-cancel]").on("click", function() {
      $("[data-action=chromeappdialog]").fadeOut()
    })
    $("[data-action=app-confirm]").on("click", function() {
      if ( ($("[data-action=sitetitle]").val() === "") || ($("[data-action=app-descr]").val() === "") ) {
        alertify.error("Download failed! Please fill in all required fields.")
        $(".preloader").addClass("hide")
      } else {
        $("[data-action=chromeappdialog]").fadeOut()
        JSZipUtils.getBinaryContent("zips/font-awesome.zip", function(err, data) {
          if(err) {
            throw err // or handle err
          }

          var zip = new JSZip(data)
          var appName = zip.folder("app")
          appName.load(data)
          renderYourHTML()
          renderYourCSS()
          renderYourJS()

          // Your Web App
          // check if css editor has a value
          if (cssEditor.getValue() !== "") {
            closeRefs.setValue($("[data-action=library-code]").val() + "    <link rel=\"stylesheet\" href=\"libraries/font-awesome/font-awesome.css\" />\n    <link rel=\"stylesheet\" href=\"libraries/font-awesome/macset.css\" />\n    <link rel=\"stylesheet\" href=\"css/index.css\" />" + "\n  </head>\n  <body>\n\n")
            var htmlContent = openHTML.getValue() + $("[data-action=sitetitle]").val() + closeHTML.getValue() + closeRefs.getValue() + yourHTML + "\n    " + closeFinal.getValue()

            zip.file("app/css/index.css", cssEditor.getValue())
            zip.file("app/index.html", htmlContent)
          }
          // check if js editor has a value
          if ( jsEditor.getValue() !== "") {
            if (cssEditor.getValue() === "") {
              closeRefs.setValue($("[data-action=library-code]").val() + "    <link rel=\"stylesheet\" href=\"libraries/font-awesome/font-awesome.css\" />\n    <link rel=\"stylesheet\" href=\"libraries/font-awesome/macset.css\" />" + "\n  </head>\n  <body>\n\n")
            } else {
              closeRefs.setValue($("[data-action=library-code]").val() + "    <link rel=\"stylesheet\" href=\"libraries/font-awesome/font-awesome.css\" />\n    <link rel=\"stylesheet\" href=\"libraries/font-awesome/macset.css\" />\n    <link rel=\"stylesheet\" href=\"css/index.css\" />" + "\n  </head>\n  <body>\n\n")
            }
            var htmlContent = openHTML.getValue() + $("[data-action=sitetitle]").val() + closeHTML.getValue() + closeRefs.getValue() + yourHTML + "\n\n    <script src=\"js/index.js\"></script>" + closeFinal.getValue()

            zip.file("app/js/index.js", yourJS)
            zip.file("app/index.html", htmlContent)
          }
          // check if css and js editors have values
          if (cssEditor.getValue() !== "" && jsEditor.getValue() !== "") {
            closeRefs.setValue($("[data-action=library-code]").val() + "    <link rel=\"stylesheet\" href=\"libraries/font-awesome/font-awesome.css\" />\n    <link rel=\"stylesheet\" href=\"libraries/font-awesome/macset.css\" />\n    <link rel=\"stylesheet\" href=\"css/index.css\" />" + "\n  </head>\n  <body>\n\n")
            htmlContent = openHTML.getValue() + $("[data-action=sitetitle]").val() + closeHTML.getValue() + closeRefs.getValue() + yourHTML + "\n\n    <script src=\"js/index.js\"></script>" + closeFinal.getValue()

            zip.file("app/css/index.css", cssEditor.getValue())
            zip.file("app/js/index.js", yourJS)
            zip.file("app/index.html", htmlContent)
          }
          if (cssEditor.getValue() == "" && jsEditor.getValue() == "") {
            closeRefs.setValue($("[data-action=library-code]").val() + "    <link rel=\"stylesheet\" href=\"libraries/font-awesome/font-awesome.css\" />\n    <link rel=\"stylesheet\" href=\"libraries/font-awesome/macset.css\" />" + "\n  </head>\n  <body>\n\n")
            htmlContent = openHTML.getValue() + $("[data-action=sitetitle]").val() + closeHTML.getValue() + closeRefs.getValue() + yourHTML + "\n" + closeFinal.getValue()

            zip.file("app/index.html", htmlContent)
          }
          // check if markdown editor has a value
          if ( mdEditor.getValue() !== "") {
            zip.file("README.md", mdEditor.getValue())
          }

          var Img16 = c16[0].toDataURL("image/png")
          var Img32 = c32[0].toDataURL("image/png")
          var Img64 = c64[0].toDataURL("image/png")
          var Img128 = canvas[0].toDataURL("image/png")
          zip.file("assets/16.png", Img16.split('base64,')[1],{base64: true})
          zip.file("assets/32.png", Img32.split('base64,')[1],{base64: true})
          zip.file("assets/64.png", Img64.split('base64,')[1],{base64: true})
          zip.file("assets/128.png", Img128.split('base64,')[1],{base64: true})
          eval( $("[data-action=ziplibs]").val().replace(/libraries/g,"app/libraries") )
          zip.file("css/index.css", "html, body {\n  margin: 0;\n  padding: 0;\n  width: 100%;\n  height: 100%;\n}\n\nwebview, iframe {\n  width: 100%;\n  height: 100%;\n  border: 0;\n}")
          zip.file("index.html", "<!DOCTYPE html>\n<html>\n  <head>\n    <title>"+ $("[data-action=sitetitle]").val() +"</title>\n    <link rel=\"stylesheet\" href=\"css/index.css\" />\n  </head>\n  <body>\n    <iframe src=\"app/index.html\">\n      Your Chromebook does not support the iFrame html element.\n    </iframe>\n  </body>\n</html>")

          if ( $(".offline-mode").is(":checked") ) {
            zip.file("manifest.json", '{\n  "manifest_version": 2,\n  "name": "'+ $("[data-action=sitetitle]").val() +'",\n  "short_name": "'+ $("[data-action=sitetitle]").val() +'",\n  "description": "'+ $("[data-action=app-descr]").val() +'",\n  "version": "'+ $("[data-value=version]").val() +'",\n  "minimum_chrome_version": "38",\n  "offline_enabled": true,\n  "permissions": [ "storage", "fileSystem", "unlimitedStorage", "http://*/", "https://*/" ],\n  "icons": {\n    "16": "assets/16.png",\n    "32": "assets/32.png",\n    "64": "assets/64.png",\n    "128": "assets/128.png"\n  },\n\n  "app": {\n    "background": {\n      "scripts": ["background.js"]\n    }\n  }\n}\n')
            if ( $(".frame-mode").is(":checked") ) {
              zip.file("background.js", "/**\n * Listens for the app launching, then creates the window.\n *\n * @see http://developer.chrome.com/apps/app.runtime.html\n * @see http://developer.chrome.com/apps/app.window.html\n */\nchrome.app.runtime.onLaunched.addListener(function(launchData) {\n  chrome.app.window.create(\n    'app/index.html',\n    {\n      frame: 'none',\n      id: 'mainWindow',\n      innerBounds: {\n        'width': 800,\n        'height': 600\n      }\n    }\n  );\n});")
            } else {
              zip.file("background.js", "/**\n * Listens for the app launching, then creates the window.\n *\n * @see http://developer.chrome.com/apps/app.runtime.html\n * @see http://developer.chrome.com/apps/app.window.html\n */\nchrome.app.runtime.onLaunched.addListener(function(launchData) {\n  chrome.app.window.create(\n    'app/index.html',\n    {\n      id: 'mainWindow',\n      innerBounds: {\n        'width': 800,\n        'height': 600\n      }\n    }\n  );\n});")
            }
          } else {
            zip.file("manifest.json", '{\n  "manifest_version": 2,\n  "name": "'+ $("[data-action=sitetitle]").val() +'",\n  "short_name": "'+ $("[data-action=sitetitle]").val() +'",\n  "description": "'+ $("[data-action=app-descr]").val() +'",\n  "version": "'+ $("[data-value=version]").val() +'",\n  "minimum_chrome_version": "38",\n  "offline_enabled": false,\n  "permissions": [ "storage", "fileSystem", "unlimitedStorage", "http://*/", "https://*/" ],\n  "icons": {\n    "16": "assets/16.png",\n    "32": "assets/32.png",\n    "64": "assets/64.png",\n    "128": "assets/128.png"\n  },\n\n  "app": {\n    "background": {\n      "scripts": ["background.js"]\n    }\n  }\n}\n')
            if ( $(".frame-mode").is(":checked") ) {
              zip.file("background.js", "/**\n * Listens for the app launching, then creates the window.\n *\n * @see http://developer.chrome.com/apps/app.runtime.html\n * @see http://developer.chrome.com/apps/app.window.html\n */\nchrome.app.runtime.onLaunched.addListener(function(launchData) {\n  chrome.app.window.create(\n    'app/index.html',\n    {\n      frame: 'none',\n      id: 'mainWindow',\n      innerBounds: {\n        'width': 800,\n        'height': 600\n      }\n    }\n  );\n});")
            } else {
              zip.file("background.js", "/**\n * Listens for the app launching, then creates the window.\n *\n * @see http://developer.chrome.com/apps/app.runtime.html\n * @see http://developer.chrome.com/apps/app.window.html\n */\nchrome.app.runtime.onLaunched.addListener(function(launchData) {\n  chrome.app.window.create(\n    'app/index.html',\n    {\n      id: 'mainWindow',\n      innerBounds: {\n        'width': 800,\n        'height': 600\n      }\n    }\n  );\n});")
            }
          }

          // Your Web App
          var content = zip.generate({type:"blob"})
          saveAs(content, $("[data-action=sitetitle]").val().split(" ").join("-") + "-chromeapp.zip")
          $(".preloader").addClass("hide")
          $(".dialog-bg").fadeOut()
          return false
        })
      }
      return false
    })

    // Download as Chrome Extension
    $("[data-action=download-as-chrome-ext]").on("click", function() {
      $("input[name=menubar].active").trigger("click")
      $("[data-action=chromeextdialog]").fadeIn()
    })
    $("[data-action=ext-cancel]").on("click", function() {
      $("[data-action=chromeextdialog]").fadeOut()
    })
    $("[data-action=ext-confirm]").on("click", function() {
      if ( ($("[data-action=sitetitle]").val() === "") || ($("[data-action=ext-descr]").val() === "") ) {
        alertify.error("Download failed! Please fill in all required fields.")
        $(".preloader").addClass("hide")
      } else {
        $("[data-action=chromeextdialog]").fadeOut()
        JSZipUtils.getBinaryContent("zips/font-awesome.zip", function(err, data) {
          if(err) {
            throw err // or handle err
          }

          var zip = new JSZip(data)
          renderYourHTML()
          renderYourCSS()
          renderYourJS()

          // Your Web App
          // check if css editor has a value
          if (cssEditor.getValue() !== "") {
            closeRefs.setValue($("[data-action=library-code]").val() + "    <link rel=\"stylesheet\" href=\"libraries/font-awesome/font-awesome.css\" />\n    <link rel=\"stylesheet\" href=\"libraries/font-awesome/macset.css\" />\n    <link rel=\"stylesheet\" href=\"css/index.css\" />" + "\n  </head>\n  <body>\n\n")
            var htmlContent = openHTML.getValue() + $("[data-action=sitetitle]").val() + closeHTML.getValue() + closeRefs.getValue() + yourHTML + "\n    " + closeFinal.getValue()

            zip.file("css/index.css", yourCSS)
            zip.file("index.html", htmlContent)
          }
          // check if js editor has a value
          if ( jsEditor.getValue() !== "") {
            if (cssEditor.getValue() === "") {
              closeRefs.setValue($("[data-action=library-code]").val() + "    <link rel=\"stylesheet\" href=\"libraries/font-awesome/font-awesome.css\" />\n    <link rel=\"stylesheet\" href=\"libraries/font-awesome/macset.css\" />" + "\n  </head>\n  <body>\n\n")
            } else {
              closeRefs.setValue($("[data-action=library-code]").val() + "    <link rel=\"stylesheet\" href=\"libraries/font-awesome/font-awesome.css\" />\n    <link rel=\"stylesheet\" href=\"libraries/font-awesome/macset.css\" />\n    <link rel=\"stylesheet\" href=\"css/index.css\" />" + "\n  </head>\n  <body>\n\n")
            }
            var htmlContent = openHTML.getValue() + $("[data-action=sitetitle]").val() + closeHTML.getValue() + closeRefs.getValue() + yourHTML + "\n\n    <script src=\"js/index.js\"></script>" + closeFinal.getValue()

            zip.file("js/index.js", yourJS)
            zip.file("index.html", htmlContent)
          }
          // check if css and js editors have values
          if (cssEditor.getValue() !== "" && jsEditor.getValue() !== "") {
            closeRefs.setValue($("[data-action=library-code]").val() + "    <link rel=\"stylesheet\" href=\"libraries/font-awesome/font-awesome.css\" />\n    <link rel=\"stylesheet\" href=\"libraries/font-awesome/macset.css\" />\n    <link rel=\"stylesheet\" href=\"css/index.css\" />" + "\n  </head>\n  <body>\n\n")
            htmlContent = openHTML.getValue() + $("[data-action=sitetitle]").val() + closeHTML.getValue() + closeRefs.getValue() + yourHTML + "\n\n    <script src=\"js/index.js\"></script>" + closeFinal.getValue()

            zip.file("css/index.css", yourCSS)
            zip.file("js/index.js", yourJS)
            zip.file("index.html", htmlContent)
          }
          if (cssEditor.getValue() == "" && jsEditor.getValue() == "") {
            closeRefs.setValue($("[data-action=library-code]").val() + "    <link rel=\"stylesheet\" href=\"libraries/font-awesome/font-awesome.css\" />\n    <link rel=\"stylesheet\" href=\"libraries/font-awesome/macset.css\" />" + "\n  </head>\n  <body>\n\n")
            htmlContent = openHTML.getValue() + $("[data-action=sitetitle]").val() + closeHTML.getValue() + closeRefs.getValue() + yourHTML + "\n" + closeFinal.getValue()

            zip.file("index.html", htmlContent)
          }
          // check if markdown editor has a value
          if ( mdEditor.getValue() !== "") {
            zip.file("README.md", mdEditor.getValue())
          }

          var Img16 = c16[0].toDataURL("image/png")
          var Img32 = c32[0].toDataURL("image/png")
          var Img64 = c64[0].toDataURL("image/png")
          var Img128 = canvas[0].toDataURL("image/png")
          zip.file("assets/16.png", Img16.split('base64,')[1],{base64: true})
          zip.file("assets/32.png", Img32.split('base64,')[1],{base64: true})
          zip.file("assets/64.png", Img64.split('base64,')[1],{base64: true})
          zip.file("assets/128.png", Img128.split('base64,')[1],{base64: true})
          eval( $("[data-action=ziplibs]").val() )

          zip.file("manifest.json", "{\n  \"manifest_version\": 2,\n  \"name\": \""+ $("[data-action=sitetitle]").val() +"\",\n  \"short_name\": \""+ $("[data-action=sitetitle]").val() +"\",\n  \"description\": \""+ $("[data-action=ext-descr]").val() +"\",\n  \"version\": \""+ $("[data-value=version]").val() +"\",\n  \"minimum_chrome_version\": \"38\",\n  \"permissions\": [ \"storage\", \"unlimitedStorage\", \"http://*/\", \"https://*/\" ],\n  \"icons\": {\n    \"16\": \"assets/16.png\",\n    \"32\": \"assets/32.png\",\n    \"64\": \"assets/64.png\",\n    \"128\": \"assets/128.png\"\n  },\n\n  \"browser_action\": {\n    \"default_icon\": \"assets/128.png\",\n    \"default_title\": \""+ $("[data-action=sitetitle]").val() +"\",\n    \"default_popup\": \"index.html\"\n  },\n  \n  \"content_security_policy\": \"script-src 'self' 'unsafe-eval'; object-src 'self'\"\n}")

          // Your Web App
          var content = zip.generate({type:"blob"})
          saveAs(content, $("[data-action=sitetitle]").val().split(" ").join("-") + "-chromeext.zip")
          $(".preloader").addClass("hide")
          $(".dialog-bg").fadeOut()
          return false
        })
      }
      return false
    })
    return false
  }
  reader.readAsArrayBuffer(file)
  return false
}

// Check Application Fields (For Download)
$("#load").on("change", function(evt) {
  if ( $(this).val() === "" ) {
    $(".watch").addClass("hide")
  } else {
    $(".watch").removeClass("hide")
    var file = evt.target.files[0]
    desktopExport(file)
    $(".download-dialog").addClass("imagehasloaded")
    $("#imagehasloaded").prop("checked", true)
    return false
  }
})

// Download as zip
$("[data-action=download-zip]").on("click", function() {
  $("input[name=menubar].active").trigger("click")

  JSZipUtils.getBinaryContent("zips/font-awesome.zip", function(err, data) {
    if(err) {
      throw err // or handle err
    }

    var zip = new JSZip(data)
    renderYourHTML()
    renderYourCSS()
    renderYourJS()

    // check if css editor has a value
    if (cssEditor.getValue() !== "") {
      closeRefs.setValue($("[data-action=library-code]").val() + "    <link rel=\"stylesheet\" href=\"libraries/font-awesome/font-awesome.css\" />\n    <link rel=\"stylesheet\" href=\"libraries/font-awesome/macset.css\" />\n    <link rel=\"stylesheet\" href=\"css/index.css\" />" + "\n  </head>\n  <body>\n\n")
      var htmlContent = openHTML.getValue() + $("[data-action=sitetitle]").val() + closeHTML.getValue() + closeRefs.getValue() + yourHTML + "\n    " + closeFinal.getValue()

      zip.file("css/index.css", yourCSS)
      zip.file("index.html", htmlContent)
    }
    // check if js editor has a value

    if ( jsEditor.getValue() !== "") {
      if (cssEditor.getValue() === "") {
        closeRefs.setValue($("[data-action=library-code]").val() + "    <link rel=\"stylesheet\" href=\"libraries/font-awesome/font-awesome.css\" />\n    <link rel=\"stylesheet\" href=\"libraries/font-awesome/macset.css\" />" + "\n  </head>\n  <body>\n\n")
      } else {
        closeRefs.setValue($("[data-action=library-code]").val() + "    <link rel=\"stylesheet\" href=\"libraries/font-awesome/font-awesome.css\" />\n    <link rel=\"stylesheet\" href=\"libraries/font-awesome/macset.css\" />\n    <link rel=\"stylesheet\" href=\"css/index.css\" />" + "\n  </head>\n  <body>\n\n")
      }
      var htmlContent = openHTML.getValue() + $("[data-action=sitetitle]").val() + closeHTML.getValue() + closeRefs.getValue() + yourHTML + "\n\n    <script src=\"js/index.js\"></script>" + closeFinal.getValue()

      zip.file("js/index.js", yourJS)
      zip.file("index.html", htmlContent)
    }
    // check if css and js editors have values
    if (cssEditor.getValue() !== "" && jsEditor.getValue() !== "") {
      closeRefs.setValue($("[data-action=library-code]").val() + "    <link rel=\"stylesheet\" href=\"libraries/font-awesome/font-awesome.css\" />\n    <link rel=\"stylesheet\" href=\"libraries/font-awesome/macset.css\" />\n    <link rel=\"stylesheet\" href=\"css/index.css\" />" + "\n  </head>\n  <body>\n\n")
      htmlContent = openHTML.getValue() + $("[data-action=sitetitle]").val() + closeHTML.getValue() + closeRefs.getValue() + yourHTML + "\n\n    <script src=\"js/index.js\"></script>" + closeFinal.getValue()

      zip.file("css/index.css", yourCSS)
      zip.file("js/index.js", yourJS)
      zip.file("index.html", htmlContent)
    }
    if (cssEditor.getValue() == "" && jsEditor.getValue() == "") {
      closeRefs.setValue($("[data-action=library-code]").val() + "    <link rel=\"stylesheet\" href=\"libraries/font-awesome/font-awesome.css\" />\n    <link rel=\"stylesheet\" href=\"libraries/font-awesome/macset.css\" />" + "\n  </head>\n  <body>\n\n")
      htmlContent = openHTML.getValue() + $("[data-action=sitetitle]").val() + closeHTML.getValue() + closeRefs.getValue() + yourHTML + "\n" + closeFinal.getValue()

      zip.file("index.html", htmlContent)
    }
    // check if markdown editor has a value
    if ( mdEditor.getValue() !== "") {
      zip.file("README.md", mdEditor.getValue())
    }
    eval( $("[data-action=ziplibs]").val() )
    var content = zip.generate({type:"blob"})
    saveAs(content, $("[data-action=sitetitle]").val().split(" ").join("-") + ".zip")
    $(".preloader").addClass("hide")
    return false
  })
})

// Save Checked Libraries for LocalStorage
var textarea = $("[data-action=library-code]")
if (localStorage.getItem("checkedLibraries")) {
 textarea.val(localStorage.getItem("checkedLibraries"))

 var lsStored = JSON.parse(localStorage.getItem('checkedInputs')) || []
 for (var j = 0, jLen = lsStored.length; j < jLen; j++) {
   $('#' + lsStored[j]).prop('checked', true)
 }
}

// Add/Remove Libraries
$("[data-action=check]").on("change keyup", function() {
  var value = $(this).parent().nextAll("div").children(".libsources:first").val() + "\n"
  checkedLibs()

  var libsTextarea = $("[data-action=libstextarea]")

  if ( $(this).prop("checked") === true ) {
    textarea.val( textarea.val() + value )
  } else {
    textarea.val( textarea.val().replace( value, "") )
  }

  updatePreview()

  var checked = $("[type=checkbox].check:checked")
  var lsChecked = [];
  for (var i = 0, iLen = checked.length; i < iLen; i++) {
    lsChecked.push($(checked[i]).attr('id'))
  }
  localStorage.setItem("checkedLibraries", textarea.val())
  localStorage.setItem("checkedInputs", JSON.stringify(lsChecked))
})
$("#jquery").trigger("keyup")

// If textbox has a value...
// a clear icon will display to clear the input
$(".metaboxes .heading").not("input[type=number]").clearSearch()

shortcutKeys()
initGenerators()
fullscreenEditor()
checkedLibs()
appDemos()
charGeneration()

// $(window).on("beforeunload", function() {
//   return "Are you sure you wish to leave? All your changes maybe lost."
// })
