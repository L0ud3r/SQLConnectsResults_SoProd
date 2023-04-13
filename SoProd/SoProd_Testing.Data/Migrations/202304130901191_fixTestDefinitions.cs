namespace SoProd_Testing.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class fixTestDefinitions : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.TestDefinitions", "AllThreadsReady", c => c.Boolean(nullable: false));
            AddColumn("dbo.TestDefinitions", "ThreadsReadyDate", c => c.DateTime());
            AddColumn("dbo.TestDefinitions", "Running", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.TestDefinitions", "Running");
            DropColumn("dbo.TestDefinitions", "ThreadsReadyDate");
            DropColumn("dbo.TestDefinitions", "AllThreadsReady");
        }
    }
}
