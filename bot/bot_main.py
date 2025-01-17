import discord
from discord import app_commands
import typing
import os
import dotenv
import sql_connector

# getting token
dotenv.load_dotenv()
TOKEN: typing.Final[str] = os.getenv('DISCORD_TOKEN')

# setting up bot
intents : discord.Intents = discord.Intents.default()
intents.message_content = True 
client: discord.Client = discord.Client(intents=intents)
tree: app_commands.CommandTree = app_commands.CommandTree(client)


# Starting up bot
@client.event
async def on_ready() -> None:
    # syncing up slash commands
    try:
        synced_commands = await tree.sync()
        print(f"Synced {len(synced_commands)} commands")
    except Exception as e:
        print(f"An error with syncing app commands has occured: ", e)

    # everything is good!
    print(f'{client.user} is now running')


# quote command
@tree.command(
    name="quote",
    description="Say something cool, something inspiring!!!",
)
@app_commands.describe(arg = "What is the Quote?")
async def quote(interaction: discord.Interaction, arg: str):
    await interaction.response.send_message(f"\"{arg}\" - {interaction.user}")
    sql_connector.insert_quote(arg, interaction.guild_id, interaction.user)


# get server id command
@tree.command(
    name="getserverid",
    description="Get the server id of your server"
)
@app_commands.describe()
async def get_server_id(interaction: discord.Interaction):
    await interaction.response.send_message(f"{interaction.guild_id}")


# trying to get bot to respond to its @
#on_reaction_add(reaction, user)
@client.event
async def on_message(message):
    await message.channel.send('Response')

client.run(token=TOKEN)




