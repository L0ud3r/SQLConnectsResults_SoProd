namespace SoProd_Testing.Data.Migrations
{
    using SoProd_Testing.Data;
    using SoProd_Testing.Data.Entities;
    using SoProd_Testing.Data.Entities.Internal;
    using System;
    using System.Collections.Generic;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<SoProdTestingContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(SoProd_Testing.Data.SoProdTestingContext context)
        {
            //  This method will be called after migrating to the latest version.

            //  You can use the DbSet<T>.AddOrUpdate() helper extension method
            //  to avoid creating duplicate seed data.

            List<TestDefinition> testDefinitions = new List<TestDefinition>();
            var baseAddress = "https://soprod-ppd.solocalms.fr";
            context.TestDefinitions.AddOrUpdate(x => new { x.FlowIds, x.Scenarios }, new TestDefinition() { Id = 1, Active = true, Name = "HeartBeat", GlobalCycles = 0, CyclesPerUser = 0, BetweenDelay = 0, PreDelay = 60000, PostDelay = 30000, UserCount = 300, TestUserTypeInt = (int)TestUserType.CREATE, MaxErrorCodes = 50, BaseAddress = baseAddress, FlowIds = "", Scenarios = "HEARTBEAT" });
            context.TestDefinitions.AddOrUpdate(x => new { x.FlowIds, x.Scenarios }, new TestDefinition() { Id = 2, Active = true, Name = "Opeator run", GlobalCycles = 5, CyclesPerUser = 5, BetweenDelay = 0, PreDelay = 1000, PostDelay = 1000, UserCount = 50, TestUserTypeInt = (int)TestUserType.CREATE, MaxErrorCodes = 50, BaseAddress = baseAddress, FlowIds = "44,59,93,71", Scenarios = "OPERATOR_RECORD,HEARTBEAT,GET_ALERTS,GET_EVENTS" });
            context.TestDefinitions.AddOrUpdate(x => new { x.FlowIds, x.Scenarios }, new TestDefinition() { Id = 3, Active = true, Name = "Team Leader", GlobalCycles = 0, CyclesPerUser = 0, BetweenDelay = 0, PreDelay = 30000, PostDelay = 30000, UserCount = 5, TestUserTypeInt = (int)TestUserType.EXISTING_WITH_WORKERS, MaxErrorCodes = 50, BaseAddress = baseAddress, FlowIds = "", Scenarios = "GET_ALL_TEAMS,MY_TEAM" });

            //context.TestDefinitions.AddRange(testDefinitions);

            base.Seed(context);
        }
    }
}
