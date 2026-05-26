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
- fiddled around with local db stuff until I gave up and found out I was missing a line in appsettings.json (facepalm)\
```"AllowedHosts": "*",```
- was not present in the development appsettings
- looking at google oauth, but after reading a reddit thread, clerk seemed like a better option
- 90% sure nick works there
- Got clerk working, despite the docs. Mostly good but left out needing the publishable key :\
- Played around with clerk for a while bcoz cool
### Todo 20/05/2026
- add deletion in api ✅
- look into jwt, tokens and sessions 🔁
- differentiate between users (logged in vs not) and display user links ✅
- modularise main page, components ✅
## 20/05/2026
- added deletion, was fairly easy
- need to switch to EF at some point, cant keep using sql haha
- played around with components, helped to reduce clutter on main home page
- looked a bit into dealing with clerk tokens, will tackle at some point
- added a section where user's links will go (not public)
- wanting to add some validation for link adding
- had troubles with clerk in components, have decided to leave the header in App for now
### Todo 21/05/2026
- use tokens to authenticate user ✅
- add link validation on front and back ends
- cleanup current code with validations and dealing with fetch requests better (wait for response)
- MAYBE: switch to Entity Framework for db interaction
## 21/05/2026
- ok so authentication with clerk is simultaneously a nightmare and the easiest thing ever
- you should still auth the user on requests that are user based but clerk seems really reliable at making sure the user is always correct
- brain feeling a bit fried ngl
### Todo 22/05/2026
- add link validation on front end ✅
- link validation back end
- show when fetch requests are running with loading ✅
- MAYBE: switch to Entity Framework for db interaction 
## 22/05/2026
- Yesterday was a bit of a doozy figuring out how clerk handles sessions
- will probably be trying to do input validation today
- added some light link verification but its not hugely good at this point
- only front end validation at the moment and even that's a bit bare
- now have some feedback for when reloads are happening and will refresh the correct link table
- removed redundant components (UserLinks and PublicLinks) as they could be combined into one and just pass through the values needed to each
- started switching to EF
## 25/05/2026
- busy weekend, busy monday
- efcore hugely improved code readability
- takes something like this:
```app.MapGet("/all/v1", () =>
{
    using var conn = new SqlConnection(connectionString);

    var cmd = new SqlCommand(
        $"SELECT * FROM ShortLinks WHERE userId IS NULL ORDER BY dateCreated DESC;",
        conn
        );
    cmd.Connection.Open();

    // returns the results
    ArrayList results = new ArrayList();
    using (SqlDataReader reader = cmd.ExecuteReader())
    {
        while (reader.Read())
        {
            var record = new ShortLink
            {
                Link = reader[1].ToString(),
                Code = reader[0].ToString()

            };
            results.Add(record);
        }
        string jsonString = JsonSerializer.Serialize(results);
    }

    return Results.Ok(results.ToArray());
});
```
- and turns it into this:
```app.MapGet("/all", async (ShortLinkContext db) =>
{
    try
    {
        var publicLinks = await db.ShortLinks.ToListAsync();
        return Results.Ok(publicLinks);
    }
    catch (Exception e)
    {
        return Results.BadRequest(e);
    }
});
```
- much, much cleaner (and more secure)
### What was done 25/05/2026
- switched from sql queries to efcore
- some minor ui changes
## 26/05/2026
- Looking into routing, seems weird compared to Svelte
- Should be relatively easy to set up a redirect page
### Tasks 26/05/2026
- Make functional routing for links ✅
- remove deletion from public links
- reload public and user links on adding a link
- add 24 hour link deletion for public links