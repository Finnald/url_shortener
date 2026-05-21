using Clerk.BackendAPI.Helpers.Jwks;
using Clerk.BackendAPI.Models.Components;
using System;
using System.Net.Http;
using System.Threading.Tasks;

public class UserAuthentication
{
    public static async Task<bool> IsAuthenticatedAsync(HttpRequest request)
    {
        DotNetEnv.Env.Load();

        Console.WriteLine(request);
        var options = new AuthenticateRequestOptions(
            secretKey: Environment.GetEnvironmentVariable("CLERK_SECRET_KEY"),
            authorizedParties: new string[] { "http://localhost:5173" }
        );

        var requestState = await AuthenticateRequest.AuthenticateRequestAsync(request, options);

        Console.WriteLine(requestState.IsAuthenticated);

        return requestState.IsAuthenticated;
    }
}