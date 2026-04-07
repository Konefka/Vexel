using Newtonsoft.Json.Linq;
using Supabase.Gotrue;
using Supabase.Postgrest;
using Supabase.Postgrest.Responses;
using Vexel.Models;

namespace Vexel.Services
{
    public class AccountService
    {
        private readonly Supabase.Client _client;

        public AccountService(Supabase.Client client)
        {
            _client = client;
        }

        public record AuthResult(bool Success, string? Token, string? Error);
        public record UpdateResult(bool Success, string? Error);

        public async Task<AuthResult> SignUpDB(AccountDto dto)
        {
            try
            {
                Session? signUpResponse = await _client.Auth.SignUp(dto.Email, dto.Password);

                return new AuthResult(true, signUpResponse!.AccessToken, null);
            }
            catch (Supabase.Gotrue.Exceptions.GotrueException ex)
            {
                return new AuthResult(false, null, CheckTypeOfAuthException(ex));
            }
            catch (Exception ex)
            {
                return new AuthResult(false, null, ex.Message);
            }
        }

        public async Task<AuthResult> SignInDB(AccountDto dto)
        {
            try
            {
                Session? signInResponse = await _client.Auth.SignInWithPassword(dto.Email, dto.Password);

                return new AuthResult(true, signInResponse!.AccessToken, null);
            }
            catch (Supabase.Gotrue.Exceptions.GotrueException ex)
            {
                return new AuthResult(false, null, CheckTypeOfAuthException(ex));
            }
            catch (Exception ex)
            {
                return new AuthResult(false, null, ex.Message);
            }
        }

        public AuthResult SignOutDB()
        {
            try
            {
                _client.Auth.SignOut();

                return new AuthResult(false, null, null);
            }
            catch (Supabase.Gotrue.Exceptions.GotrueException ex)
            {
                return new AuthResult(false, null, CheckTypeOfAuthException(ex));
            }
            catch (Exception ex)
            {
                return new AuthResult(false, null, ex.Message);
            }
        }

        public async Task<Accounts?> GetUserByIdDB(Guid userId)
        {
            ModeledResponse<Accounts> response = await _client
                .From<Accounts>()
                .Select(x => new object[] { x.Id, x.Name, x.DisplayName! })
                .Where(x => x.Id == userId)
                .Get();

            return response.Models.FirstOrDefault();
        }

        public async Task<UpdateResult> SetUsernameDB(Guid userId, string username)
        {
            try
            {
                await _client
                    .From<Accounts>()
                    .Where(x => x.Id == userId)
                    .Set(x => x.Name, username)
                    .Update();

                return new UpdateResult(true, null);
            }
            catch (Exception)
            {
                return new UpdateResult(false, "This username is taken");
            }
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