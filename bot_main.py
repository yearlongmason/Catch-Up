import discord
from discord import app_commands
import typing
import os
import dotenv

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


# making a slash command
@tree.command(
    name="quote",
    description="Say something cool, something inspiring!!!",
)
@app_commands.describe(arg = "What is the Quote?")
async def first_command(interaction: discord.Interaction, arg: str):
    await interaction.response.send_message(f"\"{arg}\" - {interaction.user}")

client.run(token=TOKEN)
