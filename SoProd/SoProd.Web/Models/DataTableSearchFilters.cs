using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SoProd_Web.Models.RecordSearch
{
    public class DataTableSearch
    {
        public string value { get; set; }
        public bool regex { get; set; }
    }

    public class DataTableOrder
    {
        public int column { get; set; }
        public string dir { get; set; }
    }

    public class DataTableColumns
    {
        public int data { get; set; }
        public string name { get; set; }
        public bool searchable { get; set; }
        public bool orderable { get; set; }
    }

    public class DataTableSearchFilters
    {
        public int start { get; set; }
        public int length { get; set; }
        public int draw { get; set; }
        public IList<DataTableColumns> columns { get;set;}
        public IList<DataTableOrder> order { get; set; }
        public DataTableSearch search { get; set; }
    }

    public class DataTableLazyLoad
    {
        public int index { get; set; }
        public string name { get; set; }
        public string type { get; set; }
    }
}