using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SoProd.Web.Models
{
    public class TestDefinitionViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int UserCount { get; set; }
        public string Version { get; set; }
        public string BaseAddress { get; set; }
        //public int MaxErrorCodes { get; set; }
    }

    public class TestResultViewModel
    {
        public int Id { get; set; }
        public Guid Identifier { get; set; }
        public double TimeEllapsed { get; set; }
        public DateTime StartDate { get; set; }
        public string Version { get; set; }
        public int RequestsNumber { get; set; }
        public int RequestsOK { get; set; }
        public int RequestsError { get; set; }
        public int TotalRequests { get; set; }
        public double? AvgRequestTime { get; set; }
        public double RequestPercentage { get; set; }
        public double? MaxRequestTime { get; set; }
    }

    public class TestResultExecutionStatsViewModel
    {
        public string Endpoint { get; set; }
        public int RequestsNumber { get; set; }
        public double AvgRequestTime { get; set; }
        public double RequestPercentage { get; set; }
        public double MaxRequestTime { get; set; }
    }
}