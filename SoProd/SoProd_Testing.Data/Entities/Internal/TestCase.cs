using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace SoProd_Testing.Data.Entities.Internal
{
    [Serializable]
    public class TestCase
    {
        public int RecordId;
        public int FlowId;
        public string EPJ;
        public int? QualificationId;
        public int? EventTypeId;

        public int UserId;
        public string UserAuthToken;
        public int DeltaInterval;
        public string BaseAddress;

        public bool CreatedUser = true;
        public Dictionary<string, string> CleanUpData;
        [NonSerialized]
        public HttpClient client = null;
    }
}
