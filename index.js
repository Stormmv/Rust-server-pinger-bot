require('dotenv').config();
const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
const Gamedig = require('gamedig');

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

async function updateServerStatus() {
  try {
    const state = await Gamedig.GameDig.query({
      type: 'rust',
      host: process.env.RUST_SERVER_IP,
      port: parseInt(process.env.RUST_SERVER_PORT)
    });

    const players = state.players.length;
    const maxPlayers = state.maxplayers;

    client.user.setActivity(`${players}/${maxPlayers} online`, {
      type: ActivityType.Playing
    });

    console.log(`Updated: ${players}/${maxPlayers} online`);
  } catch (error) {
    console.error('Query failed:', error.message);

    client.user.setActivity(`Server offline`, {
      type: ActivityType.Watching
    });
  }
}

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  updateServerStatus();
  setInterval(updateServerStatus, 30 * 1000); // every 30 seconds
});

client.login(process.env.DISCORD_TOKEN);
