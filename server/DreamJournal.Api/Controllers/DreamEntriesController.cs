using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using DreamJournal.Api.Models;

namespace DreamJournal.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DreamEntriesController : ControllerBase
    {
        private static readonly List<DreamEntry> DreamEntries = new()
        {
            new DreamEntry { Id = 1, Date = DateTime.UtcNow.AddDays(-1), Title = "Flying in the sky", Description = "I was flying over mountains and rivers.", Mood = "Excited" },
            new DreamEntry { Id = 2, Date = DateTime.UtcNow.AddDays(-2), Title = "Lost in a maze", Description = "I couldn't find my way out of a complex maze.", Mood = "Anxious" }
        };
        private static int _nextId = 3;

        [HttpGet]
        public ActionResult<IEnumerable<DreamEntry>> GetDreamEntries()
        {
            return Ok(DreamEntries.OrderByDescending(e => e.Date));
        }

        [HttpGet("{id}")]
        public ActionResult<DreamEntry> GetDreamEntry(int id)
        {
            var entry = DreamEntries.FirstOrDefault(e => e.Id == id);
            if (entry == null)
            {
                return NotFound();
            }
            return Ok(entry);
        }

        [HttpPost]
        public ActionResult<DreamEntry> CreateDreamEntry(DreamEntry dreamEntry)
        {
            dreamEntry.Id = _nextId++;
            DreamEntries.Add(dreamEntry);
            return CreatedAtAction(nameof(GetDreamEntry), new { id = dreamEntry.Id }, dreamEntry);
        }

        [HttpPut("{id}")]
        public ActionResult UpdateDreamEntry(int id, DreamEntry updatedEntry)
        {
            var entry = DreamEntries.FirstOrDefault(e => e.Id == id);
            if (entry == null)
            {
                return NotFound();
            }

            entry.Date = updatedEntry.Date;
            entry.Title = updatedEntry.Title;
            entry.Description = updatedEntry.Description;
            entry.Mood = updatedEntry.Mood;

            return NoContent();
        }

        [HttpDelete("{id}")]
        public ActionResult DeleteDreamEntry(int id)
        {
            var entry = DreamEntries.FirstOrDefault(e => e.Id == id);
            if (entry == null)
            {
                return NotFound();
            }

            DreamEntries.Remove(entry);
            return NoContent();
        }
    }
}
