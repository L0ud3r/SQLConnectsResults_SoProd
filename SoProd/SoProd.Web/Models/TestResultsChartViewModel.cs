using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SoProd.Web.Models
{
    public class TestResultsChartViewModel
    {
        public string Version { get; set; }
        public int RequestsNumber { get; set; }
        public int RequestsOK { get; set; }
        public double PercentRequest { get; set; }
        public double MaxRequest { get; set; }
        public int TestsCount { get; set; }
    }
}