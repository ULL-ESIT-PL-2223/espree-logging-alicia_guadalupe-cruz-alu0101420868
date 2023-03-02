const arrowFunction = (a) => {
  const abc = function(a, b, c) {};
  abc(4, 5, 6);
  const def = function(d, e, f) {};
  def(7, 8, 9);
}
arrowFunction(1, 2, 3);