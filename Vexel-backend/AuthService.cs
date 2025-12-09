using Supabase.Gotrue;
using Supabase.Postgrest.Responses;
using Vexel.tables;

namespace Vexel
{
    public class AuthService
    {
        private readonly Supabase.Client _client;

        public AuthService(Supabase.Client client)
        {
            _client = client;
        }

        public async Task<string> Register(AccountDto dto)
        {
            try
            {
                Session? signUpSession = await _client.Auth.SignUp(dto.Email, dto.Password);

                await _client.Auth.SetSession(signUpSession!.AccessToken!, signUpSession.RefreshToken!);

                await _client.From<Account>().Insert(new Account { Id = Guid.Parse(_client.Auth.CurrentUser!.Id!), Status = default! });

                return _client.Auth.CurrentSession!.AccessToken!;
            }
            catch (Supabase.Gotrue.Exceptions.GotrueException ex) when (ex.StatusCode == 422 && ex.Message.Contains("user_already_exists"))
            {
                return "Email już istnieje. Zaloguj się!";
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        public async Task<string> Login(AccountDto dto)
        {
            try
            {
                Session? signInResponse = await _client.Auth.SignInWithPassword(dto.Email, dto.Password);

                if (signInResponse!.User == null)
                    return "Złe hasło";

                await _client.Auth.SetSession(signInResponse!.AccessToken!, signInResponse.RefreshToken!);

                return signInResponse.AccessToken!;
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }
    }
}
