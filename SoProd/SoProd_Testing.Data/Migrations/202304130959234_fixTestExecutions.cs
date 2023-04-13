namespace SoProd_Testing.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class fixTestExecutions : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.TestResultExecutions", "EndDate", c => c.DateTime(nullable: false));
            AddColumn("dbo.TestResultExecutions", "EndPoint", c => c.String());
            AddColumn("dbo.TestResultExecutions", "Response", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.TestResultExecutions", "Response");
            DropColumn("dbo.TestResultExecutions", "EndPoint");
            DropColumn("dbo.TestResultExecutions", "EndDate");
        }
    }
}
