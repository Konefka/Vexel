using Supabase.Gotrue;
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

        public record AuthResult(bool Success, string? accessToken, string? refreshToken, string? Error);
        public record UpdateResult(bool Success, string? Error);

        public async Task<AuthResult> SignUpDB(AccountDto dto)
        {
            try
            {
                Session? signUpResponse = await _client.Auth.SignUp(dto.Email, dto.Password);

                return new AuthResult(true, signUpResponse!.AccessToken, signUpResponse!.RefreshToken, null);
            }
            catch (Supabase.Gotrue.Exceptions.GotrueException ex)
            {
                return new AuthResult(false, null, null, CheckTypeOfAuthException(ex));
            }
            catch (Exception ex)
            {
                return new AuthResult(false, null, null, ex.Message);
            }
        }

        public async Task<AuthResult> SignInDB(AccountDto dto)
        {
            try
            {
                Session? signInResponse = await _client.Auth.SignInWithPassword(dto.Email, dto.Password);

                return new AuthResult(true, signInResponse!.AccessToken, signInResponse!.RefreshToken, null);
            }
            catch (Supabase.Gotrue.Exceptions.GotrueException ex)
            {
                return new AuthResult(false, null, null, CheckTypeOfAuthException(ex));
            }
            catch (Exception ex)
            {
                return new AuthResult(false, null, null, ex.Message);
            }
        }

        public AuthResult SignOutDB()
        {
            try
            {
                _client.Auth.SignOut();

                return new AuthResult(true, null, null, null);
            }
            catch (Supabase.Gotrue.Exceptions.GotrueException ex)
            {
                return new AuthResult(false, null, null, CheckTypeOfAuthException(ex));
            }
            catch (Exception ex)
            {
                return new AuthResult(false, null, null, ex.Message);
            }
        }

        public async Task<Accounts?> GetUserByIdDB(Guid userId)
        {
            ModeledResponse<Accounts> response = await _client
                .From<Accounts>()
                .Select(x => new object[] { x.Id, x.Name!, x.DisplayName! })
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
                    .Set(x => x.Name!, username)
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
            return (ex.StatusCode, ex.Message) switch
            {
                (400, var msg) when msg.Contains("validation_failed")
                    => "Please enter a valid email address.",

                (400, var msg) when msg.Contains("invalid_credentials")
                    => "Incorrect email or password.",

                (422, var msg) when msg.Contains("user_already_exists")
                    => "An account with this email already exists. Please log in instead.",

                (422, var msg) when msg.Contains("weak_password")
                    => "Password must be at least 6 characters long.",

                (521, _)
                    => "Sorry, the provider's database servers are currently unavailable.",

                _ => ex.Message
            };
        }
    }
}