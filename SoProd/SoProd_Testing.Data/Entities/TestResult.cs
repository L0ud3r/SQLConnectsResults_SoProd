using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SoProd_Testing.Data.Entities
{
    public class TestResult
    {
        public int Id { get; set; }
        public int TestDefinitionId { get; set; }
        public Guid Identifier { get; set; }
        public DateTime StartDate { get; set; }
        public string Version { get; set; }
        public int UsersNumber { get; set; }
        public int RequestsNumber { get; set; }
        public int RequestsOK { get; set; }
        public int RequestsError { get; set; }
        public double TimeEllapsed { get; set; } // in seconds
        public string BaseAddress { get; set; }
        public virtual TestDefinition TestDefinition { get; set; }
    }
}
