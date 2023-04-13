namespace SoProd_Testing.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class removeUnusedPropertiesFromTestDefinition : DbMigration
    {
        public override void Up()
        {
            //DropColumn("dbo.TestDefinitions", "WavesNumber");
            //DropColumn("dbo.TestDefinitions", "UserRequestNumber");
        }
        
        public override void Down()
        {
            AddColumn("dbo.TestDefinitions", "UserRequestNumber", c => c.Int(nullable: false));
            AddColumn("dbo.TestDefinitions", "WavesNumber", c => c.Int(nullable: false));
        }
    }
}
