using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SoProd_Testing.Data.Entities
{
    public class TestVersion
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool Active { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string CommitHash { get; set; }

        public virtual ICollection<TestResult> TestResults { get; set; }
    }
}
