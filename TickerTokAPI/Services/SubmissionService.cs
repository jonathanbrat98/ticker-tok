using MongoDB.Driver;
using TickerTokApi.Models;

namespace TickerTokApi.Services
{
    public class SubmissionService
    {
        private readonly IMongoCollection<Submission> _submissions;

        public SubmissionService(IConfiguration config)
        {
            var client = new MongoClient("mongodb://localhost:27017");
            var database = client.GetDatabase("tickertok");
            _submissions = database.GetCollection<Submission>("submissions");
        }

        public virtual async Task AddSubmissionAsync(Submission submission)
        {
            await _submissions.InsertOneAsync(submission);
        }
    }
} 