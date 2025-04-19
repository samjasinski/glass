// TestController.cs
using glass.Server.Models;
using glass.Server.Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace glass.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MongoDbController : ControllerBase
    {
        private readonly MongoDbService _mongoDbService;

        public MongoDbController(MongoDbService mongoDbService)
        {
            _mongoDbService = mongoDbService;
        }

        [HttpPost("insert-test-user")]
        public async Task<IActionResult> TestConnect()
        {
            var newUser = new UserModel
            {
                Username = "testuser",
                Password = "testpass",
                Locations = new List<string> { "12345", "67890" }
            };

            await _mongoDbService.InsertUserAsync(newUser);

            return Ok("User inserted successfully!");
        }
    }
}
