
using glass.Server.Models;
using glass.Server.Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BCrypt.Net;
using System.Diagnostics;
using dotenv.net;
using MongoDB.Driver;

namespace glass.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MongoDbController : ControllerBase
    {
        private readonly MongoDbService _mongoDbService;
        private readonly string? _secret;

        public MongoDbController(MongoDbService mongoDbService)
        {
            _mongoDbService = mongoDbService;

            // load .env variables
            DotEnv.Load();
            // set the JWT secret
            _secret = Environment.GetEnvironmentVariable("JWT_SECRET");

            // Throw an exception if the API key is missing
            if (string.IsNullOrEmpty(_secret))
            {
                throw new InvalidOperationException("JWT secret variable is not set in .env file.");
            }
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            // did we get both a username and a password submitted (front end validation should force this anyhow)
            if (string.IsNullOrWhiteSpace(dto.Username) || string.IsNullOrWhiteSpace(dto.Password))
                return BadRequest("Username and password are required");

            var existing = await _mongoDbService.GetUserByUsernameAsync(dto.Username);
            if (existing != null)
                return BadRequest("That username is already taken. Sorry!");

            var user = new UserModel
            {
                Username = dto.Username,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Locations = new List<string>() // empty for now
            };

            await _mongoDbService.InsertUserAsync(user);

            string token;
            try
            {
                token = GenerateJwtToken(user);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "JWT generation failed");
            }

            // user was created, now return a token
            return Ok(new { token });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var user = await _mongoDbService.GetUserByUsernameAsync(dto.Username);
            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                return Unauthorized("Invalid credentials");

            string token;
            try
            {
                token = GenerateJwtToken(user);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "JWT generation failed");
            }

            return Ok(new { token });
        }

        public class AddLocationRequest
        {
            required public string  Id { get; set; }
        }

        [HttpPost("addLocation")]
        public async Task<IActionResult> AddLocationToUser([FromBody] string locationId)
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            if (string.IsNullOrEmpty(token))
                return Unauthorized();

            var user = await _mongoDbService.GetUserFromTokenAsync(token);
            if (user == null)
                return Unauthorized();

            if (user.Locations == null)
                user.Locations = new List<string>();

            if (user.Locations.Contains(locationId))
                return Conflict("This location is already saved on your account!.");

            user.Locations.Add(locationId);

            // Update user in DB
            var filter = Builders<UserModel>.Filter.Eq(u => u.Id, user.Id);
            var update = Builders<UserModel>.Update.Set(u => u.Locations, user.Locations);

            await _mongoDbService._users.UpdateOneAsync(filter, update);

            return Ok();
        }

        // still untested
        [HttpPost("deleteLocation")]
        public async Task<IActionResult> RemoveLocationFromUser([FromBody] string locationId)
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            if (string.IsNullOrEmpty(token))
                return Unauthorized();

            var user = await _mongoDbService.GetUserFromTokenAsync(token);
            if (user == null)
                return Unauthorized();

            if (user.Locations == null || !user.Locations.Contains(locationId))
                return Conflict("This location is not saved on this user account.");

            var filter = Builders<UserModel>.Filter.Eq(u => u.Id, user.Id);
            var update = Builders<UserModel>.Update.Pull(u => u.Locations, locationId);

            await _mongoDbService._users.UpdateOneAsync(filter, update);

            return Ok();
        }

        [HttpGet("locations")]
        public async Task<IActionResult> GetUserLocations()
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            if (string.IsNullOrEmpty(token))
                return Unauthorized("Authorization token is missing.");

            var user = await _mongoDbService.GetUserFromTokenAsync(token);
            if (user == null)
                return Unauthorized("Invalid token or user not found.");

            return Ok(user.Locations ?? new List<string>());
        }

        private string GenerateJwtToken(UserModel user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            // used ! to say that the _secret variable is not going to be null here as I have already checked for null when the variable was initialized in the constructor
            // constructor = set up variables when creating a class so that the class is ready to be used later.
            var key = Convert.FromBase64String(_secret!); ; 

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
            new Claim(ClaimTypes.Name, user.Username),
            new Claim("userId", user.Id),
        }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }


    }
}
