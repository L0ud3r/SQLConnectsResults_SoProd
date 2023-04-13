namespace SoProd_Testing.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class addTestVersion : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.TestVersions",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                        Active = c.Boolean(nullable: false),
                        StartDate = c.DateTime(nullable: false),
                        EndDate = c.DateTime(),
                        CommitHash = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            AddColumn("dbo.TestResults", "TestVersionId", c => c.Int());
            CreateIndex("dbo.TestResults", "TestVersionId");
            AddForeignKey("dbo.TestResults", "TestVersionId", "dbo.TestVersions", "Id");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.TestResults", "TestVersionId", "dbo.TestVersions");
            DropIndex("dbo.TestResults", new[] { "TestVersionId" });
            DropColumn("dbo.TestResults", "TestVersionId");
            DropTable("dbo.TestVersions");
        }
    }
}
