namespace DreamJournal.Api.Models {
    public class DreamEntry
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; } = string.Empty;
        public string Mood { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;

        // Navigation property
        public User? User { get; set; }
    }
}