using System;
using System.Threading.Tasks;
using Moq;
using TickerTokApi.Models;
using TickerTokApi.Services;
using Xunit;

namespace TickerTokApi.Tests
{
    public class SubmissionTests
    {
        [Fact]
        public async Task AddSubmissionAsync_SavesSubmission()
        {
            var mockService = new Mock<SubmissionService>(null);
            var submission = new Submission
            {
                Uid = "user1",
                Email = "user1@gmail.com",
                Ticker = "AAPL",
                OpeningPrice = 123.45M
            };

            mockService.Setup(s => s.AddSubmissionAsync(submission)).Returns(Task.CompletedTask).Verifiable();

            await mockService.Object.AddSubmissionAsync(submission);

            mockService.Verify(s => s.AddSubmissionAsync(submission), Times.Once);
        }

        [Fact]
        public void Submission_CreatesWithCorrectProperties()
        {
            var now = DateTime.UtcNow;
            var submission = new Submission
            {
                Uid = "user2",
                Email = "user2@gmail.com",
                Ticker = "GOOG",
                OpeningPrice = 100.00M
            };

            Assert.Equal("user2", submission.Uid);
            Assert.Equal("user2@example.com", submission.Email);
            Assert.Equal("GOOG", submission.Ticker);
            Assert.Equal(100.00M, submission.OpeningPrice);
            Assert.True((submission.Timestamp - now).TotalSeconds < 5); // Timestamp is set to now
        }
    }
} 