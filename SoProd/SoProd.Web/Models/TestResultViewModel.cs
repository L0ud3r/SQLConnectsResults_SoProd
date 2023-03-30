using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SoProd.Web.Models
{
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
        public string Scenarios { get; set; }

    }
}