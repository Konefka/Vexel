using Supabase.Gotrue;
using Supabase.Postgrest.Responses;
using Vexel.tables;

namespace Vexel
{
    public class AccountService
    {
        private readonly Supabase.Client _client;

        public AccountService(Supabase.Client client)
        {
            _client = client;
        }

        public async Task<string> SignUp(AccountDto dto)
        {
            try
            {
                Session? signUpResponse = await _client.Auth.SignUp(dto.Email, dto.Password);

                await _client.Auth.SetSession(signUpResponse!.AccessToken!, signUpResponse.RefreshToken!);

                await _client.From<Account>().Upsert(new Account { Id = Guid.Parse(_client.Auth.CurrentUser!.Id!)});

                await UpdateLastSeenAt(Guid.Parse(signUpResponse.User!.Id!));

                return _client.Auth.CurrentSession!.AccessToken!;
            }
            catch (Supabase.Gotrue.Exceptions.GotrueException ex)
            {
                return CheckTypeOfAuthException(ex);
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        public async Task<string> SignIn(AccountDto dto)
        {
            try
            {
                Session? signInResponse = await _client.Auth.SignInWithPassword(dto.Email, dto.Password);

                await _client.Auth.SetSession(signInResponse!.AccessToken!, signInResponse.RefreshToken!);

                await UpdateLastSeenAt(Guid.Parse(signInResponse.User!.Id!));

                return _client.Auth.CurrentSession!.AccessToken!;
            }
            catch (Supabase.Gotrue.Exceptions.GotrueException ex)
            {
                return CheckTypeOfAuthException(ex);
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        public string? SignOut()
        {
            try
            {
                _client.Auth.SignOut();

                return null;
            }
            catch (Supabase.Gotrue.Exceptions.GotrueException ex)
            {
                return CheckTypeOfAuthException(ex);
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        async Task UpdateLastSeenAt(Guid userId)
        {
            await _client
                .From<Account>()
                .Where(x => x.Id == userId)
                .Set(x => x.LastSeenAt, DateTimeOffset.UtcNow)
                .Update();
        }

        string CheckTypeOfAuthException(Supabase.Gotrue.Exceptions.GotrueException ex)
        {
            switch (ex.StatusCode)
            {
                case 400:
                    if (ex.Message.Contains("validation_failed"))
                    {
                        return "Wpisz poprawny email.";
                    }
                    else if (ex.Message.Contains("invalid_credentials"))
                    {
                        return "Login lub hasło są nie poprawne.";
                    }

                    break;

                case 422:
                    if (ex.Message.Contains("user_already_exists"))
                    {
                        return "Email już istnieje. Zaloguj się!";
                    }
                    else if (ex.Message.Contains("weak_password"))
                    {
                        return "Hasło musi mieć przynajmniej 6 znaków.";
                    }

                    break;

                case 521:
                    return "Sorry, the providers' db servers are unavailable.";
            }

            return ex.Message;
        }
    }
}