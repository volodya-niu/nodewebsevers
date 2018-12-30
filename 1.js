var WebSocketServer = require('websocket').server;
var http = require('http');
//创建服务器
var server = http.createServer(function (request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
server.listen(3000, function () {
    console.log((new Date()) + ' Server is listening on port 3000');
});
//创建websocket 服务器
wsServer = new WebSocketServer({
    httpServer: server,

});
//websocket建立连接
wsServer.on('request', function (request) {
    //当前的连接
    var connection = request.accept(null, request.origin);

    setInterval(function () {
        connection.sendUTF('服务端发送消息' + (Math.random()*10))
    }, 1000)

    console.log((new Date()) + '已经建立连接');
//监听当前连接 发送message时候
    connection.on('message', function (message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            connection.sendUTF(message.utf8Data);
        } else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            connection.sendBytes(message.binaryData);
        }
    });
    //监听当前连接 发送close 关闭时候 触发
    connection.on('close', function (reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + '断开连接');
    });
});