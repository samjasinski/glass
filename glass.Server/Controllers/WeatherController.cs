using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace YourNamespace.Controllers
{
    [Route("api/locations")]
    [ApiController]
    public class WeatherController : ControllerBase
    {
        private readonly HttpClient _httpClient;
        private const string API_KEY = "ZTUxNjgxYTg1ZGM4NWFjODljMGQzMT";

        public WeatherController(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        [HttpGet("geo")]
        public async Task<IActionResult> GetLocationByGeo([FromQuery] double? lat, [FromQuery] double? lon)
        {
            if (!lat.HasValue || !lon.HasValue)
            {
                return BadRequest(new { error = "Latitude and Longitude are required" });
            }

            // Construct the URL with query parameters for lat, lon, range, and units
            var url = $"https://api.willyweather.com.au/v2/{API_KEY}/search.json?lat={lat.Value}&lng={lon.Value}&range=500&units=distance:km";

            try
            {
                // Send the GET request to the WillyWeather API
                var response = await _httpClient.GetAsync(url);
                var responseBody = await response.Content.ReadAsStringAsync();

                // Return the response if successful, otherwise return error code
                return response.IsSuccessStatusCode
                    ? Ok(JsonSerializer.Deserialize<object>(responseBody))
                    : StatusCode((int)response.StatusCode, responseBody);
            }
            catch (Exception ex)
            {
                // Handle exceptions, such as network errors
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

            var url = $"https://api.willyweather.com.au/v2/{API_KEY}/search.json?query={locationname}&limit=10";

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
