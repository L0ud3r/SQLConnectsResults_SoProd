﻿namespace SoProd_Testing.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class fixTestResultv3 : DbMigration
    {
        public override void Up()
        {
            //AddColumn("dbo.TestResults", "BaseAddress", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.TestResults", "BaseAddress");
        }
    }
}
