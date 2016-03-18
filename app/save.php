<?php
  $filename = $_GET["filename"];
  $fp = fopen("anon/".$filename, "wb");
  if (!$fp) {
    echo getcwd();
    exit;
  } else {
    $outputstring = $_GET["outputstring"];
    fwrite($fp, $outputstring);
    echo "Message inserted";
  }
  $fp.close();
?>
