using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
//using Newtonsoft.Json;
using SoProd_Testing.Data.Entities.Internal;

namespace SoProd_Testing.Data.Entities
{
    public class TestDefinition
    {
        public TestDefinition()
        {
            this.FlowIds = string.Empty; // new List<int>();
            this.UserCount = 0;
            this.Scenarios = string.Empty;
            this.PreDelay = 0;
            this.PostDelay = 1000;
            this.BetweenDelay = 0;
            this.GlobalCycles = 1;
            this.CyclesPerUser = 1;
            this.UserRequestsCount = new Dictionary<int, int>();
        }

        public int Id { get; set; }
        public string FlowIds { get; set; }
        public string Scenarios { get; set; }
        public int UserCount { get; set; }
        public int PreDelay { get; set; }
        public int PostDelay { get; set; }
        public int BetweenDelay { get; set; }
        public int GlobalCycles { get; set; }
        public int CyclesPerUser { get; set; }
        public string Category { get; set; }

        public int TestUserTypeInt { get; set; }

        [NotMapped]
        public TestUserType TestUserType
        {
            get
            {
                return (TestUserType)TestUserTypeInt;
            }
        }

        public bool Active { get; set; }
        public string Name { get; set; }
        public DateTime? LastProcessedDate { get; set; }
        public DateTime? StartDate { get; set; }
        public string Version { get; set; }
        //public int UsersNumber { get; set; }
        public int MaxErrorCodes { get; set; }
        public string BaseAddress { get; set; }

        [NotMapped]
        public List<int> FlowIdsList
        {
            get
            {
                if (string.IsNullOrEmpty(this.FlowIds))
                {
                    return new List<int>();
                }
                return this.FlowIds.Split(',').Select(x => int.Parse(x.Trim())).ToList();
            }
        }
        [NotMapped]
        public List<string> ScenariosList
        {
            get
            {
                if (string.IsNullOrEmpty(this.Scenarios))
                {
                    return new List<string>();
                }
                return this.Scenarios.Split(',').Select(x => $"[{x.Trim()}]").ToList();
            }
        }

        #region internal helpers
        [NotMapped]
        public Dictionary<int, int> UserRequestsCount { get; set; }
        [NotMapped]
        public string CsvExport { get; set; }
        [NotMapped]
        public int MaxRequestsNumber => UserCount * CyclesPerUser * ScenariosList.Count * GlobalCycles;
        //[NotMapped]
        //public bool CanRun => RequestsNumber < MaxRequestsNumber && RequestsErrorNumber < MaxErrorCodes;

        #endregion


    }
}
