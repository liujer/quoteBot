## Introduction
- QuoteBot is a discord bot that stores and retrieves quotes for a server.
- Entering a quote in the format `"<quote>" - <author>` will passively store a quote.

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
