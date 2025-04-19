using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using dotenv.net;

namespace YourNamespace.Controllers
{
    [Route("api/locations")]
    [ApiController]
    public class WillyWeatherController : ControllerBase
    {
        private readonly HttpClient _httpClient;
        private readonly string? _apiKey; // API key stored here

        public WillyWeatherController(HttpClient httpClient)
        {
            _httpClient = httpClient;

            // Load environment variables from the .env file
            DotEnv.Load();

            // Retrieve the API key from environment variables
            _apiKey = Environment.GetEnvironmentVariable("WILLY_WEATHER_API_KEY");

            // Throw an exception if the API key is missing
            if (string.IsNullOrEmpty(_apiKey))
            {
                throw new InvalidOperationException("API_KEY environment variable is not set.");
            }
        }

        [HttpGet("geo")]
        public async Task<IActionResult> GetLocationByGeo([FromQuery] double? lat, [FromQuery] double? lon)
        {
            if (!lat.HasValue || !lon.HasValue)
            {
                return BadRequest(new { error = "Latitude and Longitude are required" });
            }

            // Use _apiKey instead of API_KEY here
            var url = $"https://api.willyweather.com.au/v2/{_apiKey}/search.json?lat={lat.Value}&lng={lon.Value}&range=500&units=distance:km";

            try
            {
                var response = await _httpClient.GetAsync(url);
                var responseBody = await response.Content.ReadAsStringAsync();

                return response.IsSuccessStatusCode
                    ? Ok(JsonSerializer.Deserialize<object>(responseBody))
                    : StatusCode((int)response.StatusCode, responseBody);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Error fetching data from Willy Weather API", details = ex.Message });
            }
        }

        [HttpGet("name")]
        public async Task<IActionResult> GetLocationByName([FromQuery] string? locationname)
        {
            if (string.IsNullOrWhiteSpace(locationname))
            {
                return BadRequest(new { error = "A valid location name is required" });
            }

            // Use _apiKey instead of API_KEY here
            var url = $"https://api.willyweather.com.au/v2/{_apiKey}/search.json?query={locationname}&limit=10";

            try
            {
                var response = await _httpClient.GetAsync(url);
                var responseBody = await response.Content.ReadAsStringAsync();
                return response.IsSuccessStatusCode ? Ok(JsonSerializer.Deserialize<object>(responseBody)) : StatusCode((int)response.StatusCode, responseBody);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Error fetching data from Willy Weather API", details = ex.Message });
            }
        }

        [HttpGet]
        public IActionResult Test() => Ok("Hello, world!");
    }
}
