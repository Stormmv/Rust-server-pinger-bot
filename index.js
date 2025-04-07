require('dotenv').config();
const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
const Gamedig = require('gamedig');

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

// Function to ping the Rust server
async function updateServerStatus() {
  try {
    const state = await Gamedig.query({
      type: 'rust',
      host: process.env.RUST_SERVER_IP,
      port: parseInt(process.env.RUST_SERVER_PORT)
    });

    const players = state.players.length;
    const maxPlayers = state.maxplayers;

    client.user.setActivity(`${players}/${maxPlayers} online`, {
      type: ActivityType.Playing
    });

    console.log(`Updated status: ${players}/${maxPlayers} online`);
  } catch (error) {
    console.error('Failed to query server:', error.message);

    client.user.setActivity(`Server offline`, {
      type: ActivityType.Watching
    });
  }
}

// Run status update every 30 seconds
client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  updateServerStatus();
  setInterval(updateServerStatus, 30 * 1000);
});

client.login(process.env.DISCORD_TOKEN);
