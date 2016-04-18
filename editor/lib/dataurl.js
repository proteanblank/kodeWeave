var logo     = $("[data-action=dataurloutput]"),
    imgUrl   = $("[data-url=dataurlimgurl]"),
    holder   = document.getElementById("dataurlholder"),
    JSimgUrl = document.querySelector("[data-url=dataurlimgurl]");

// Save Site Title Value for LocalStorage
if ( localStorage.getItem("dataURL")) {
  imgUrl.val(localStorage.getItem("dataURL"));
  logo.attr("src", localStorage.getItem("dataURL"));
  $(".checkdataurl").removeClass("hide");
}

function displayDURL(file) {
  var reader = new FileReader();

  reader.onload = function(e) {
    var img = new Image();
    img.src = e.target.result;
    img.onload = function() {
      var dataUrl = e.target.result;
      logo.attr("src", dataUrl);
      imgUrl.val( logo.attr("src") );
      localStorage.setItem("dataURL", imgUrl.val());
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
holder.ondragover = function () {
  this.className = "block fn txtcenter pointer hover";
  return false;
};
holder.ondragend = function () {
  this.className = "block fn txtcenter pointer";
  return false;
};
holder.ondrop = function(e) {
  this.className = "block fn txtcenter pointer";
  e.preventDefault();
  var file = e.dataTransfer.files[0];
  displayDURL(file);
  $(".checkdataurl").removeClass("hide");
};

// Insert DataURL into Active Editor
$("[data-action=dataURLtoEditor]").click(function() {
  if ( activeEditor.val() === "htmlEditor" ) {
    htmlEditor.replaceSelection(imgUrl.val());
    htmlEditor.focus();
  } else if ( activeEditor.val() === "cssEditor" ) {
    cssEditor.replaceSelection(imgUrl.val());
    cssEditor.focus();
  } else if ( activeEditor.val() === "jsEditor" ) {
    jsEditor.replaceSelection(imgUrl.val());
    jsEditor.focus();
  } else if ( activeEditor.val() === "mdEditor" ) {
    mdEditor.replaceSelection(imgUrl.val());
    mdEditor.focus();
  }
  $("#dataurl").trigger("click");
});