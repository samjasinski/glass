using MongoDB.Driver;
using glass.Server.Models;
using glass.Server.Settings;

namespace glass.Server.Services
{
    public class MongoDbService
    {
        private readonly IMongoCollection<UserModel> _usersCollection;

        public MongoDbService(MongoDbSettings settings)
        {
            var mongoSettings = MongoClientSettings.FromConnectionString(settings.ConnectionString);
            mongoSettings.ServerApi = new ServerApi(ServerApiVersion.V1);

            var client = new MongoClient(mongoSettings);
            var database = client.GetDatabase(settings.DatabaseName);

            _usersCollection = database.GetCollection<UserModel>("Users");
        }

        // Example: Get all users
        public async Task<List<UserModel>> GetUsersAsync()
        {
            return await _usersCollection.Find(_ => true).ToListAsync();
        }

        public async Task InsertUserAsync(UserModel user)
        {
            await _usersCollection.InsertOneAsync(user);
        }
    }
}
