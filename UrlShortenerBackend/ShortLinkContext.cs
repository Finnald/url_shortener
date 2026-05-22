using Microsoft.EntityFrameworkCore;

public class ShortLinkContext : DbContext
{
    public ShortLinkContext(DbContextOptions<ShortLinkContext> options) : base(options) { }

    public DbSet<ShortLink> ShortLinks { get; set; }
}