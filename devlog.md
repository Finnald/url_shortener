# Devlog hehe
## Project details
- Making a Link shortener webapp, hosted in Azure
- React front end, using a C# api for the backend
### Features
- The idea is that users will be able to take a link, paste it in and convert it to a shortened link. 
- Would be good to have optional login, with unauthenticated users being able to create super temporary links that last an hour
- Logged in users can create 10 permanent links and are able to customise them
- Users will log in with google auth
- short link deletion
- would be cool to have an ai safety analysis of a link
## From creation up to now
- Have created the C# api, db and started front end
- DB is hosted in azure, but will likely need to make something local for testing purposes -_-
- Haven't deployed anything else to azure, since the free subscription is so limited
- using ai to prototype front end
## 19/05/2026
- Spent a lot of time trying to get a local db solution working
- flip flopped between in memory and just hosting a local server
- also looked into docker, but wasn't working on work network :P
- fiddled around with local db stuff until I gave up and found out I was missing a line in appsettings.json (facepalm)
```"AllowedHosts": "*",```
- was not present in the development appsettings
- looking at google oauth, but after reading a reddit thread, clerk seemed like a better option
- 90% sure nick works there
- Got clerk working, despite the docs. Mostly good but left out needing the publishable key :\
- Played around with clerk for a while bcoz cool
### Todo 20/05/2026
- add deletion in api ✅
- look into jwt, tokens and sessions
- differentiate between users (logged in vs not) and display user links
- modularise main page, components ✅