namespace InvenTrack.Models;

public class Order{
    public int Id {get; set;}
    public DateTime OrderDate {get; set;} = DateTime.UtcNow;
    public int CustomerId {get; set;}
    public Customer? Customer {get; set;}
    public string Status {get; set;} = "Pending";
    public ICollection<OrderItem> OrderItems {get; set;} = new List<OrderItem>();
}