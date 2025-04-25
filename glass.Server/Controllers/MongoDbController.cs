
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

        [HttpPost("insert-test-user")]
        public async Task<IActionResult> TestConnect()
        {
            var password = "testpass";
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(password); // ✅ Hash the password

            var newUser = new UserModel
            {
                Username = "testuser",
                PasswordHash = hashedPassword, // ✅ Use PasswordHash now
                Locations = new List<string> { "12345", "67890" }
            };

            await _mongoDbService.InsertUserAsync(newUser);

            return Ok("User inserted successfully!");
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            var existing = await _mongoDbService.GetUserByUsernameAsync(dto.Username);
            if (existing != null)
                return BadRequest("Username already taken");

            var user = new UserModel
            {
                Username = dto.Username,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Locations = new List<string>() // empty for now
            };

            await _mongoDbService.InsertUserAsync(user);
            return Ok("Registered successfully");
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
                Debug.WriteLine("#################################: " + token);
            }
            catch (Exception ex)
            {
                Debug.WriteLine("JWT generation error: " + ex.Message);
                return StatusCode(500, "JWT generation failed");
            }

            return Ok(new { token });
            //return Ok();
        }

        private string GenerateJwtToken(UserModel user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            // used ! to say that the _secret variable is not going to be null here as I have already checked for null whenthe variable was initialized in the constructor
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
