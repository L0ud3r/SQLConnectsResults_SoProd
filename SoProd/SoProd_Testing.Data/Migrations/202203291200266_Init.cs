namespace SoProd_Testing.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Init : DbMigration
    {
        public override void Up()
        {
            //CreateTable(
            //    "dbo.TestDefinitions",
            //    c => new
            //        {
            //            Id = c.Int(nullable: false, identity: true),
            //            FlowIds = c.String(),
            //            Scenarios = c.String(),
            //            UserCount = c.Int(nullable: false),
            //            PreDelay = c.Int(nullable: false),
            //            PostDelay = c.Int(nullable: false),
            //            BetweenDelay = c.Int(nullable: false),
            //            GlobalCycles = c.Int(nullable: false),
            //            CyclesPerUser = c.Int(nullable: false),
            //            Category = c.String(),
            //            TestUserTypeInt = c.Int(nullable: false),
            //            Active = c.Boolean(nullable: false),
            //            Name = c.String(),
            //            LastProcessedDate = c.DateTime(),
            //            StartDate = c.DateTime(),
            //            Version = c.String(),
            //            MaxErrorCodes = c.Int(nullable: false),
            //            WavesNumber = c.Int(nullable: false),
            //            UserRequestNumber = c.Int(nullable: false),
            //            BaseAddress = c.String(),
            //        })
            //    .PrimaryKey(t => t.Id);
            
            //CreateTable(
            //    "dbo.TestResultExecutions",
            //    c => new
            //        {
            //            Id = c.Int(nullable: false, identity: true),
            //            TestResultId = c.Int(nullable: false),
            //            StartDate = c.DateTime(nullable: false),
            //            URL = c.String(),
            //            UserId = c.Int(nullable: false),
            //            ServerName = c.String(),
            //            StatusCode = c.Int(nullable: false),
            //            TimeEllapsed = c.Double(nullable: false),
            //        })
            //    .PrimaryKey(t => t.Id)
            //    .ForeignKey("dbo.TestResults", t => t.TestResultId, cascadeDelete: true)
            //    .Index(t => t.TestResultId);
            
            //CreateTable(
            //    "dbo.TestResults",
            //    c => new
            //        {
            //            Id = c.Int(nullable: false, identity: true),
            //            TestDefinitionId = c.Int(nullable: false),
            //            Identifier = c.Guid(nullable: false),
            //            StartDate = c.DateTime(nullable: false),
            //            Version = c.String(),
            //            UsersNumber = c.Int(nullable: false),
            //            RequestsNumber = c.Int(nullable: false),
            //            RequestsOK = c.Int(nullable: false),
            //            RequestsError = c.Int(nullable: false),
            //            TimeEllapsed = c.Double(nullable: false),
            //        })
            //    .PrimaryKey(t => t.Id)
            //    .ForeignKey("dbo.TestDefinitions", t => t.TestDefinitionId, cascadeDelete: true)
            //    .Index(t => t.TestDefinitionId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.TestResultExecutions", "TestResultId", "dbo.TestResults");
            DropForeignKey("dbo.TestResults", "TestDefinitionId", "dbo.TestDefinitions");
            DropIndex("dbo.TestResults", new[] { "TestDefinitionId" });
            DropIndex("dbo.TestResultExecutions", new[] { "TestResultId" });
            DropTable("dbo.TestResults");
            DropTable("dbo.TestResultExecutions");
            DropTable("dbo.TestDefinitions");
        }
    }
}
