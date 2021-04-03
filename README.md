## Introduction
- QuoteBot is a discord bot that stores and retrieves quotes for a server.
- Entering a quote in the format `"<quote>" - <author>` will passively store a quote.

## Commands
---
- **`>>rquote`** - Randomly retrieves a quote from the server's collection of quotes
  - **Optional:** `name` - Author of the quote
  - **Usage:** `>>rquote <name>`
---
- **`>>scanchannel`** - Processes messages starting from last message sent in channel to identify quotes. By default, it will scan the last 100 messages.
  - **Optional:** `count` - Number of messages to scan
  - **Usage:** `>>scanchannel <count>`
### Notes
- The default prefix for quoteBot is `>>`. 
