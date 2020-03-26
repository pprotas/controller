import ControllerAsClient from './classes/ControllerAsClient';
import ControllerAsServer from './classes/ControllerAsServer';
import readlineSync from 'readline-sync';
import * as url from 'url';

var controller: ControllerAsClient | ControllerAsServer | undefined = undefined;

var answer = readlineSync.question("Do you want to start the controller as (1) client or (2) server?\n");

if (answer === "1") {
  var ip = readlineSync.question("What is the ip?\n");
  controller = new ControllerAsClient(new url.URL(ip));
}
else if (answer === "2") {
  var port = readlineSync.question("What port?\n");
  controller = new ControllerAsServer(Number.parseInt(port));
}

controller!.listen();
