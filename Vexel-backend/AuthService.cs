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

        public async Task<string?> Register(AccountDto dto)
        {
            try
            {
                var usernames = await _client.From<Account>()
                    .Where(x => x.Name == dto.Username)
                    .Get();

                if (usernames.Model != null)
                    return "Ten username jest zajęty";

                await _client.Auth.SignUp(dto.Email, dto.Password);

                var loginResponse = await _client.Auth.SignInWithPassword(dto.Email, dto.Password);

                await _client.Auth.SetSession(loginResponse!.AccessToken!, loginResponse.RefreshToken!);

                var account = new Account { Id = Guid.Parse(_client.Auth.CurrentUser!.Id!), Name = dto.Username, Status = "offline" };

                ModeledResponse<Account> response = await _client.From<Account>().Insert(account);

                return loginResponse.AccessToken;
            }
            catch (Supabase.Postgrest.Exceptions.PostgrestException ex)
            {
                if (ex.Message.Contains("\"code\":\"23505\""))
                {
                    //return await Login(dto);
                }

                return ex.Message;
            }
            catch (Supabase.Gotrue.Exceptions.GotrueException ex)
            {
                if (ex.Message.Contains("\"code\":\"23505\""))
                {
                    //return await Login(dto);
                }

                return ex.Message;
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        public async Task<string?> Login(AccountDto dto)
        {
            try
            {
                Session? signInResponse = await _client.Auth.SignInWithPassword(dto.Email, dto.Password);

                if (signInResponse!.User == null)
                    return "Złe hasło";

                await _client.Auth.SetSession(signInResponse!.AccessToken!, signInResponse.RefreshToken!);

                return signInResponse.AccessToken;
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }
    }
}
