function test() {
  var serverConnector = new ServerConnector('123', 1);
  serverConnector.pictures['test']  = "123";
  serverConnector.pictures['test_1']  = "123_1";
  serverConnector.sendToServer();
}
