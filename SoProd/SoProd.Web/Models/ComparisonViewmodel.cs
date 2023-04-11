using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SoProd.Web.Models
{
    public class ComparisonResultListViewModel
    {
        public ComparisonCalculus comparison1 { get; set; }
        public ComparisonCalculus comparison2 { get; set; }
    }

    public class ComparisonCalculus
    {
        public double AvgRequest { get; set; }
        public int TotalRequest { get; set; }
        public int UsersNumber { get; set; }
        public double PercentRequest { get; set; }
        public double MaxRequest { get; set; }
        public int TestsCount { get; set; }
    }

    public class ComparisonResultViewmodel
    {
        public int TotalCount { get; set; }
        public string Name { get; set; }
        public DateTime StartDate { get; set; }
        public string Version { get; set; }
        public string TestType { get; set; }
        public string BaseAddress { get; set; }
        public double AvgRequest { get; set; }
        public int TotalRequest { get; set; }
        public int UsersNumber { get; set; }
        public double PercentRequest { get; set; }
        public double MaxRequest { get; set; }
    }
    public class ComparisonViewmodel
    {
        public string Version1 { get; set; }
        public DateTime Date1 { get; set; }
        public string Version2 { get; set; }
        public DateTime Date2 { get; set; }
    }
}