require('dotenv').config();
const Crafty = require('./Crafty_obj.js');
const { 	Client,
					GatewayIntentBits,
					CommandInteraction} = require('discord.js');

//main
const client = new Client(
	{ intents: [GatewayIntentBits.Guilds,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMembers
	] 
	});
const crafty_login = process.env.CRAFTY_LOGIN ;
const crafty_password =  process.env.CRAFTY_PASSWORD;
const crafty_adress = process.env.CRAFTY_ADRESS;
const crafty_port = process.env.CRAFTY_PORT;

const crafty = new Crafty(crafty_login,crafty_password,crafty_adress,crafty_port);
client.login(process.env.DISCORD_TOKEN);

client.on('ready', async () => {
	console.log("Bot ready !!!");
	try{
		await crafty.updateServers()
		client.user.setActivity("Crafty online",{ type: 'PLAYING' });
		client.user.setStatus('online');
	} catch (error) {
		console.log(error)
		client.user.setActivity("Crafty offline",{ type: 'PLAYING' });
		client.user.setStatus('dnd');
	};
});

client.on('interactionCreate', async (interaction) => {
	if (!interaction.isChatInputCommand()) return;
	
	switch (interaction.commandName){
	case 'ping': 
		try{
			await crafty.updateServers()
			client.user.setActivity("Crafty online",{ type: 'PLAYING' });
			client.user.setStatus('online');
		} catch (error) {
			console.log(error)
			client.user.setActivity("Crafty offline",{ type: 'PLAYING' });
			client.user.setStatus('dnd');
		};
		await interaction.reply('Pong!');
		break;

	case 'craftylist':
		await interaction.reply("not implemented yet");
		break;

	case 'craftystart':
			const server_id = interaction.option.get('server-id').value;
			for (let i = 0; i < crafty.game_servers.length; i++){
				if (server_id === crafty.game_servers[i].server_id){
					await crafty.actionServer(start_server,server_id);
					await interaction.reply("Server started");
					break;
				};
			};
			await interaction.reply("Server not found");
			break;

	default:
		await interaction.reply(`Unknown command: ${interaction.commandName}`);
  };
});

