$(window).load(function() {
  // Splitter Theme
  $("#mainSplitter, #splitContainer, #leftSplitter, #rightSplitter").jqxSplitter({
    theme: "metro"
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
        "height": "330px",
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
    if ( $(this).height() < 330 ) {
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
})


// Choose Grid Scheme
$(".grid-alignment").click(function() {
  $("#htmlEditor, #cssEditor, #jsEditor").css("style", "")
  $(".jqx-widget-content").css("visibility", "visible")
  if ( $(".is-squared").is(":visible") ) {
    $(this).addClass("is-horizontal").removeClass("is-squared")
    $('#splitContainer').jqxSplitter({
      height: "auto",
      width: "100%",
      orientation: 'horizontal',
      showSplitBar: true,
      panels: [{ size: '50%',collapsible:false },
               { size: '50%' }]
    })
    $('#leftSplitter').jqxSplitter({
      height: '100%',
      width: '100%',
      orientation: 'vertical',
      showSplitBar: true,
      panels: [{ size: '50%',collapsible:false },
               { size: '50%'}]
    })
    $('#rightSplitter').jqxSplitter({
      height: '100%',
      width: '100%',
      orientation: 'vertical',
      showSplitBar: true,
      panels: [{ size: '50%'},
               { size: '50%',collapsible:false }]
    })
    return false
  }
  if ( $(".is-horizontal").is(":visible") ) {
    $(this).addClass("is-vertical").removeClass("is-horizontal")
    $('#splitContainer').jqxSplitter({
      height: "auto",
      width: "100%",
      orientation: 'horizontal',
      showSplitBar: true,
      panels: [{ size: '50%',collapsible:false },
               { size: '50%' }]
    })
    $('#leftSplitter').jqxSplitter({
      height: '100%',
      width: '100%',
      orientation: 'horizontal',
      showSplitBar: true,
      panels: [{ size: '50%',collapsible:false },
               { size: '50%'}]
    })
    $('#rightSplitter').jqxSplitter({
      height: '100%',
      width: '100%',
      orientation: 'horizontal',
      showSplitBar: true,
      panels: [{ size: '50%'},
               { size: '50%',collapsible:false}]
    })
    return false
  }
  if ( $(".is-vertical").is(":visible") ) {
    $(this).addClass("is-squared").removeClass("is-vertical")
    $('#splitContainer').jqxSplitter({
      height: "auto",
      width: "100%",
      orientation: 'vertical',
      showSplitBar: true,
      panels: [{ size: '50%',collapsible:false },
               { size: '50%' }]
    })
    $('#leftSplitter').jqxSplitter({
      height: '100%',
      width: '100%',
      orientation: 'vertical',
      showSplitBar: true,
      panels: [{ size: '50%',collapsible:false },
               { size: '50%'}]
    })
    $('#rightSplitter').jqxSplitter({
      height: '100%',
      width: '100%',
      orientation: 'vertical',
      showSplitBar: true,
      panels: [{ size: '50%'},
               { size: '50%'}]
    })
    return false
  }
})
$("header a:not(.skip, .dialog a)").on("click", function() {
  $(this).not(".dialog a").toggleClass("active")
  $(this).next(":not([data-action=download-zip], #collaborate, .grid-alignment)").not(".dialog a").toggleClass("hide")

  if ( $("[data-action=tools].active").is(":visible") || $(".add-source.active").is(":visible") || $("[data-action=download].active").is(":visible") || $(".open-demos.active").is(":visible")) {
    $("header a:not(#collaborate, .grid-alignment)").not(".dialog a").not(this).removeClass("active").next().addClass("hide")
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
