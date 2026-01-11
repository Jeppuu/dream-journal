using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using DreamJournal.Api.Models;
using DreamJournal.Api.Repositories;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace DreamJournal.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DreamEntriesController : ControllerBase
    {
        private readonly IDreamEntryRepository _dreamEntryRepository;

        public DreamEntriesController(IDreamEntryRepository dreamEntryRepository)
        {
            _dreamEntryRepository = dreamEntryRepository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<DreamEntry>>> GetDreamEntries()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var entries = await _dreamEntryRepository.GetAllForUserAsync(userId);
            return Ok(entries);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<DreamEntry>> GetDreamEntry(int id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var entry = await _dreamEntryRepository.GetByIdAsync(id);
            if (entry == null || entry.UserId != userId)
            {
                return NotFound();
            }
            return Ok(entry);
        }

        [HttpPost]
        public async Task<ActionResult<DreamEntry>> CreateDreamEntry(DreamEntry dreamEntry)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            dreamEntry.Date = DateTime.UtcNow;
            dreamEntry.UserId = userId;
            await _dreamEntryRepository.AddAsync(dreamEntry);
            return CreatedAtAction(nameof(GetDreamEntry), new { id = dreamEntry.Id }, dreamEntry);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateDreamEntry(int id, DreamEntry updatedEntry)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var entry = await _dreamEntryRepository.GetByIdAsync(id);
            if (entry == null || entry.UserId != userId)
            {
                return NotFound();
            }

            entry.Date = updatedEntry.Date;
            entry.Description = updatedEntry.Description;
            entry.Mood = updatedEntry.Mood;

            await _dreamEntryRepository.UpdateAsync(entry);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteDreamEntry(int id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var entry = await _dreamEntryRepository.GetByIdAsync(id);
            if (entry == null || entry.UserId != userId)
            {
                return NotFound();
            }

            await _dreamEntryRepository.DeleteAsync(id);
            return NoContent();
        }
    }
}
