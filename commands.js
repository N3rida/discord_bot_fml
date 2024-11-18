import { REST, Routes } from 'discord.js';
import dotenv from 'dotenv'
dotenv.config()
const commands = [
  {
    name: 'ping',
    description: 'Replies with Pong!',
  },
  {
    name: 'craftystart',
    description: 'Usage /serverStart <server>',
    options: [
      {
        name: 'server-id',
        type: 3,
        description: 'ID of the server you want to start',
        required: true,
      },
    ],
  },
  {
    name: 'craftylist',
    description: 'List the server available',
  },
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

try {
  console.log("Trying to upadate commands");
  await rest.put(Routes.applicationCommands(process.env.APP_ID), { body: commands });
  console.log("Commands updated");
} catch (error) {
  console.error(error);
  throw new Error(error);
}
