using MongoDB.Driver;
using glass.Server.Models;
using glass.Server.Settings;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Http;

namespace glass.Server.Services
{
    public class MongoDbService
    {
        public readonly IMongoCollection<UserModel> _users;
        private readonly string _jwtSecretKey = Environment.GetEnvironmentVariable("JWT_SECRET")!; // Same key you use for generating JWT tokens

        public MongoDbService(MongoDbSettings settings)
        {
            var mongoSettings = MongoClientSettings.FromConnectionString(settings.ConnectionString);
            mongoSettings.ServerApi = new ServerApi(ServerApiVersion.V1);

            var client = new MongoClient(mongoSettings);
            var database = client.GetDatabase(settings.DatabaseName);

            _users = database.GetCollection<UserModel>("Users");
        }

        // Example: Get all users
        public async Task<List<UserModel>> GetUsersAsync()
        {
            return await _users.Find(_ => true).ToListAsync();
        }

        public async Task<UserModel> GetUserByUsernameAsync(string username)
        {
            return await _users.Find(u => u.Username == username).FirstOrDefaultAsync();
        }

        public async Task InsertUserAsync(UserModel user)
        {
            await _users.InsertOneAsync(user);
        }

        // Validate and decode JWT token
        public ClaimsPrincipal ValidateToken(string token)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.ASCII.GetBytes(_jwtSecretKey);

                var validationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateLifetime = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key)
                };

                var principal = tokenHandler.ValidateToken(token, validationParameters, out var validatedToken);

                return principal;
            }
            catch (Exception)
            {
                // Token is invalid
                return null;
            }
        }

        // Method to retrieve user from token claims (if valid)
        public async Task<UserModel> GetUserFromTokenAsync(string token)
        {
            var principal = ValidateToken(token);
            if (principal == null)
                return null;

            // Extract the userId from claims (assuming it's stored as "userId")
            var userIdClaim = principal.FindFirst("userId");
            if (userIdClaim == null)
                return null;

            // Use userId to fetch the user from the database
            return await _users.Find(u => u.Id == userIdClaim.Value).FirstOrDefaultAsync();
        }
    }
}