<?php

function get_post($name, $default) {
  if (isset($_POST[$name])) {
    return $_POST[$name];
  }
  return $default;
}

?>
