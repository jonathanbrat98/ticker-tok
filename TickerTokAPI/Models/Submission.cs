using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace TickerTokApi.Models
{
    public class Submission
    {
        [BsonId]
        public ObjectId Id { get; set; }
        public string Uid { get; set; }
        public string Email { get; set; }
        public string Ticker { get; set; }
        public decimal OpeningPrice { get; set; }
        public DateTime Timestamp { get; set; }
    }
} 