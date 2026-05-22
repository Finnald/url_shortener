using System.ComponentModel.DataAnnotations;

public class ShortLink
{
    [Key]
    public string? Code { get; set; }
    public string? Link { get; set; }
    public string? UserId { get; set; }
    public DateTime DateCreated { get; set; }
}