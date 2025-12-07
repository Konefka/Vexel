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
                {
                    return "Ten username jest zajęty";
                }

                Session? signUpResponse = await _client.Auth.SignUp(dto.Email, dto.Password);

                var account = new Account { Id = signUpResponse!.User!.Id!, Name = dto.Username };

                ModeledResponse<Account> response = await _client.From<Account>().Insert(account);

                return signUpResponse.AccessToken;
            }
            catch (Supabase.Postgrest.Exceptions.PostgrestException ex)
            {
                if (ex.Message.Contains("\"code\":\"23505\""))
                {
                    return await Login(dto);
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
                    return "Email nie został potwierdzony lub złe hasło";

                return signInResponse.AccessToken;
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }
    }
}
