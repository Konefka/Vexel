using Supabase.Gotrue;

namespace Vexel.Middleware
{
    public class SupabaseSessionMiddleware
    {
        private readonly RequestDelegate _next;

        public SupabaseSessionMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context, Supabase.Client supabase)
        {
            string? accessToken = context.Request.Cookies["access_token"];
            string? refreshToken = context.Request.Cookies["refresh_token"];

            if (!string.IsNullOrEmpty(accessToken) && !string.IsNullOrEmpty(refreshToken))
            {
                await supabase.Auth.SetSession(accessToken, refreshToken);
                Session? newSession = await supabase.Auth.RefreshSession();

                context.Response.Cookies.Delete("access_token");
                context.Response.Cookies.Delete("refresh_token");

                context.Response.Cookies.Append("access_token", newSession!.AccessToken!, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.None,
                    Expires = DateTimeOffset.UtcNow.AddHours(1),
                    Path = "/"
                });

                context.Response.Cookies.Append("refresh_token", newSession!.RefreshToken!, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.None,
                    Expires = DateTimeOffset.UtcNow.AddDays(14),
                    Path = "/"
                });
            }

            await _next(context);
        }

    }
}
