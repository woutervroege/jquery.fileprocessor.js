<?php
/*
    * @package jquery.fileprocessor.js
    * @copyright (©) 2013 Wouter Vroege <wouter AT woutervroege DOT nl>
    * @author Wouter Vroege <wouter AT woutervroege DOT nl>
*/

function getFileData($str) {
    list($type, $data) = explode(',', $str);
    return $data;
}

function base64_to_jpeg($data, $fileName) {
    $file = fopen("uploads/" . $fileName, "w") or die("can't open file");
    fwrite($file, base64_decode($data));
    fclose($file);
}

$fileName = strip_tags($_POST['name']);
$mimeType = strip_tags($_POST['type']);
$data = getFileData(strip_tags($_POST['data']));
base64_to_jpeg($data, $fileName);
?>