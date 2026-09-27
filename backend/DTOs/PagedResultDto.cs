namespace InvenTrack.DTOs;

public class PagedResult<T>
{
    public int Count { get; set; }
    public bool HasNext { get; set; }
    public bool HasPrev { get; set; }
    public IEnumerable<T> Results { get; set; } = [];
}