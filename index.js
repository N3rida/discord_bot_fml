require('dotenv').config();
const Crafty = require('./Crafty_obj.js')
const { 	Client,
					GatewayIntentBits,
					CommandInteraction} = require('discord.js');

//main

const crafty_login = process.env.CRAFTY_LOGIN;
const crafty_password = process.env.CRAFTY_PASSWORD;
const crafty_adress = process.env.CRAFTY_ADRESS;
const crafty_port = process.env.CRAFTY_PORT;
const crafty = new Crafty(crafty_login,crafty_password,crafty_adress,crafty_port);
crafty.token = process.env.CRAFTY_TOKEN

const client = new Client(
	{ intents: [GatewayIntentBits.Guilds,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMembers
	] 
	});

client.login(process.env.DISCORD_TOKEN);

client.on('ready', async () => {
	console.log("Bot ready !!!");
	try{
		await crafty.updateServers();
	} catch (error) {
		console.log(error);
		client.user.setStatus('dnd');
	}
});

client.on('interactionCreate', async (interaction) => {
	if (!interaction.isChatInputCommand()) return;
	
	if (client.user.status == 'dnd'){
		try{
			await crafty.updateServers();
		} catch (error) {
			console.log(error);
			client.user.setStatus('dnd');
			return;
		};
		client.user.setStatus('online');
	};

	switch (interaction.commandName){
	case 'ping': 
		await interaction.reply('Pong!');
		break;

	case 'craftystart':
		const server_id = interaction.options.get("server-id").value;
		try{
			await crafty.actionServer("start_server",server_id);
		} catch(error) {
			console.log(error);
		}
		await interaction.reply("ok !")
		break;

	case 'craftylist':
		const nb_serv = crafty.game_servers.length;
		let response_string = "Name  ID \n";
		for (let i = 0; i < nb_serv; i++){
			actual_serv = crafty.game_servers[i];
			response_string += `${actual_serv.server_name}	${actual_serv.server_id}\n`;
		};
		try {
			await interaction.reply(`${response_string}`);
		} catch (error){
			console.log(error);
		};
		break;

	default:
		await interaction.reply(`Unkwnon command: ${interaction.commandName}`)
  }
});
