## Introduction
- QuoteBot is a discord bot that retrieves and passively stores quotes for a server.
- Entering a quote in the format `"<quote>" - <author>` in any channel will store a quote for that server.

## Commands
---
- **`>>rquote`** - Randomly retrieves a quote from the server's collection of quotes
  - **Optional:** `name` - Author of the quote
  - **Usage:** `>>rquote <name>`
---
- **`>>scanchannel`** - Processes messages starting from last message sent in channel to identify quotes. 
  - **Optional:** `count` - Number of messages to scan. If no argument is given, scans last 100 messages
  - **Usage:** `>>scanchannel <count>`
### Notes
- The default prefix for quoteBot is `>>`.
- A demo bot can be added to your server [here](https://discord.com/api/oauth2/authorize?client_id=772278723645800468&permissions=8&scope=bot) 
