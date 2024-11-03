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
    await tree.sync(guild=discord.Object(id=1291817041052827649))
    print(f'{client.user} is now running')


# making a slash command
@tree.command(
    name="sayhello",
    description="Testing",
)
async def first_command(interaction: discord.Interaction):
    await interaction.response.send_message("Hello!")


client.run(token=TOKEN)

