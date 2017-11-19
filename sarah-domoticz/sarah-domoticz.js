
var request = require('request');

module.exports = function(RED) {
    function sarahdomoticz(config) {
        RED.nodes.createNode(this,config);

		this.host = config.host;
		this.port = config.port;
		
        var node = this;

		
		

		node.on('input', function(msg) {
			var url = "http://"+node.host+":"+node.port+"/";
			
			//Récupération des paramètres provenant du fichier grammar/sarah-domoticz.xml retourné par win-sarah
			var action = msg.payload.options.action;
			var command = msg.payload.options.command;
			var device = msg.payload.options.device;
			var type = msg.payload.options.type;
			var tts = msg.payload.options.tts;

			//teste si la variable commande est une action ou une demande de status
			switch(command){
				
				case "switch":
					if(action&&device&&type){
						url = url+'json.htm?type=command&param='+command+type+'&idx='+device+'&switchcmd='+action;
						msg.speak = "c'est fait"
					}
					
					else{
						msg.speak = "Il semble que la configuration soit invalide";
					}
					
					break;
				
				case "status":
					if (type == "scene"){
						url = url+'json.htm?type=scenes';
					}
					
					else {
					url = url+'json.htm?type=devices&rid='+device;
					}
			}

			//effectue la requete http à domoticz 
			request(url, function (error, response, body) {
				
				node.status({});
				if (error) {

					if (error.code === 'ETIMEDOUT') {

						setTimeout(function () {
						node.status({
							fill: "red",
							shape: "ring",
							text: "common.notification.errors.no-response"
						});
						}, 2);
						
						msg.speak = "Domoticz est injoignable";
					
					} 
							
					else {

						node.error(error, msg);
						msg.payload = error.toString() + " : " + url;
						msg.statusCode = error.code;
						//node.send(msg);
						node.status({
						fill: "red",
						shape: "ring",
						text: error.code
						});
						
						msg.speak = "Domoticz erreur "+error.code;
							
					} 
						
				}
				
				else {

					if (command == "status"){
						
						var body = JSON.parse(body);
						
						msg.resultat = body
						
						switch (type){
							
							case "light":
								status = body.result[0].Status
								
								if (status == "On"){
									
									status = "allumée"
								}
								if (status == "Off"){
									status = "éteinte"
								}
								
								msg.speak = 'la lumière est '+status;
							break;
							
							case "scene":
								
								status = body.result.find(search_scene).Status
								
								if (status == "On"){
									
									status = "allumée"
								}
								if (status == "Off"){
									status = "éteinte"
								}
								
								msg.speak = 'la lumière est '+status;
						
							break;
							
							case undefined:
								if (action == "temp"){
									temp = body.result[0].Temp;
									msg.speak = 'La température '+tts+' est de '+temp+' degré';            
								}
								if (action == "humidity"){
									humidity = body.result[0].Humidity;
									msg.speak = 'L\'humidité '+tts+' est de '+humidity+' %';            
								}
							break;   
		
						}
						
					}
				
				}
				
				node.send(msg);

			});
			
			function search_scene(scene) {
				return scene.idx === device;
			}
        });
    }
	

    RED.nodes.registerType("sarah-domoticz",sarahdomoticz);
}



