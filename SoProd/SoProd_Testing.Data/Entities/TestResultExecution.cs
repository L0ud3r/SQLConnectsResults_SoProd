using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SoProd_Testing.Data.Entities
{
    public class TestResultExecution
    {
        public int Id { get; set; }
        public int TestResultId { get; set; }

        public DateTime StartDate { get; set; }
        public string URL { get; set; }
        //public string ResponseURL { get; set; }
        public int UserId { get; set; }
        public string ServerName { get; set; }
        public int StatusCode { get; set; }
        public double TimeEllapsed { get; set; } // in seconds

        public virtual TestResult TestResult { get; set; }


    }
}
