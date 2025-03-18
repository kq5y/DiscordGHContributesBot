# DiscordGHContributesBot

![image](https://github.com/user-attachments/assets/c16d1162-262d-4beb-841c-ad21a40b5d40)

A script that uses Google Apps Script to *nicely* notify a Discord channel of a specific user's number of Github contributions in a day.

## Usage

1. Create a script and specify the following script properties:
  - `DISCORD_URL`: Discord webhook url
  - `GH_TOKEN`: Github personal access token (classic, read:user)
  - `GH_USERNAME`: Target github username

2. Create a Time-driven, Date-based timer, and a Trigger with the time set to 12-1am.
