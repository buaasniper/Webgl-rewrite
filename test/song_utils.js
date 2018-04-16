var my_multiple = function(a, b) {
  a = math.matrix(a);
  b = math.matrix(b);
  return math.multiply(a, b);
}

var my_add = function(a, b) {
  a = math.matrix(a);
  b = math.matrix(b);
  return math.add(a, b);
}

var my_divide = function(a, b) {
  a = math.matrix(a);
  b = math.matrix(b);
  return math.divide(a, b);
}

var my_subtract = function(a, b) {
  a = math.matrix(a);
  b = math.matrix(b);
  return math.subtract(a, b);
}

var set_values = function(values, js_str) {
  js_str_lines = js_str.split('\n');
  var var_re = RegExp('var ([a-zA-Z$_][a-zA-Z0-9$_]*) = (.*);');
  var res = "";
  for (var line in js_str_lines) {
    cur_line = js_str_lines[line];
    res_line = cur_line;
    if (cur_line.match(var_re)) {
      val = var_re.exec(cur_line);
      if (val[1] in values) {
        res_line = res_line.replace(val[2], JSON.stringify(values[val[1]]));
      }
    }
    res += res_line + '\n';
  }
  return res;
}
