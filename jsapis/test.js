function test() {
  var serverConnector = new ServerConnector('123', 2);
  serverConnector.updatePicture('0', 'aedfukdisuf');
  for (var i = 0;i < 10000;++ i);
  serverConnector.updatePicture('1', 'aedfukdisuf1');
}
