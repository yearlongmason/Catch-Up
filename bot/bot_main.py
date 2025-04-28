import discord
from discord import app_commands
import typing
import os
import dotenv
import api_connector

# getting token
dotenv.load_dotenv()
TOKEN: typing.Final[str] = os.getenv('DISCORD_TOKEN')

# setting up bot
intents : discord.Intents = discord.Intents.default()
intents.message_content = True 
intents.reactions = True
intents.members = True
client: discord.client = discord.Client(intents=intents)
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
@app_commands.describe(quote = "What is the Quote?", 
                       author = "Author")
async def quote(interaction: discord.Interaction, 
                quote: str, author: str):
    author = author.title()
    if len(quote) >= 280:
        await interaction.response.send_message(f"Quote is above character limit!!! (280)")
        return 
    await interaction.response.send_message(f"\"{quote}\" - {author}")
    api_connector.insert_quote(quote, interaction.guild_id, author)

@quote.autocomplete("author")
async def quote_autocompletion(
    interaction: discord.Interaction,
    current: str
) -> typing.List[app_commands.Choice[str]]:
    data = []
    for choice in interaction.guild.members:
        if not choice.global_name:
            continue
        if current.lower() in str(choice.global_name).lower():
            data.append(app_commands.Choice(name=choice.global_name, value=choice.global_name))
    
            
    return data


# get server id command
@tree.command(
    name="getserverid",
    description="Get the server id of your server"
)
@app_commands.describe()
async def get_server_id(interaction: discord.Interaction):
    await interaction.response.send_message(f"{interaction.guild_id}")


# get random quote command
@tree.command(
    name="getrandomquote",
    description="Get a random quote from your server"
)
@app_commands.describe()
async def get_random_quote(interaction: discord.Interaction):
    await interaction.response.send_message(f'{api_connector.get_random_quote(interaction.guild_id)}')


# get link to website  command
@tree.command (
        name="getlinktowebsite",
        description="Get the link to the website to view quotes!"
)
@app_commands.describe()
async def get_website_link(interaction: discord.Interaction):
    await interaction.response.send_message("https://catchupquotes.pythonanywhere.com/")


# getting message from reply and mention,  
@client.event
async def on_message(message):
    if client.user in message.mentions and message.reference:
        if  message.reference.cached_message.content:
            await message.channel.send(f"\"{message.reference.cached_message.content}\" - {message.reference.cached_message.author}")
            api_connector.insert_quote(message.reference.cached_message.content, message.channel.guild.id, message.reference.cached_message.author)
        else:
            await message.channel.send("Could not find message, most likely becuase I was bot added to the server when this message was sent!")

client.run(token=TOKEN)
