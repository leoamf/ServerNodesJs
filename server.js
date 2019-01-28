const http = require('http');
var SerialPort = require('serialport');
const Delimiter = require('@serialport/parser-delimiter');

const port = 3000;
var valorSensor = 0;
const requestHandler = (request, response) => {
    if (!request.url.includes('favicon')){
        console.log(request.url);
        if(request.url.includes('on')){
            response.end('LIGA');
            sendBySerial('L');
        }
        else if (request.url.includes('off')){
            response.end('DESLIGA');
            sendBySerial('D');
        }
        else if (request.url.includes('valor')) {
            response.end(valorSensor);

        }


    }
}

const server = http.createServer(requestHandler);

server.listen(port, (err) => {
    if(err){
        return console.log('Erro:' + err);
    }
    
    console.log(`Servidor executando na porta ${port}`);

});

var serialPort = new SerialPort('COM3', {
    baudRate : 9600,
});

var parser = serialPort.pipe(new Delimiter({delimiter: '\n'}));

parser.on('data', function(buffer){
    console.log('teste recepcao', buffer.toString('utf8'));
    valorSensor = buffer;
});

function sendBySerial(data){
    serialPort.write(data, (err)=>{
        if(err){
        console.log('Erro ao enviar', err );
        }
    });
}
