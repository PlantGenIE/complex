function set_matching_value(selectObj, v) {
  for(var i = 0; i < selectObj.length; i++) {
     if(selectObj.options[i].value == v)
     	selectObj.selectedIndex = i;
  }
}