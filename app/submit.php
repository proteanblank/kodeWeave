<?php
  $filename = $_GET["filename"];
  $outputstring = $_GET["outputstring"];
  file_put_contents($filename, $outputstring);
?>
