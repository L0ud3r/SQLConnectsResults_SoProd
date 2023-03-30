using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SoProd_Testing.Data.Entities.Internal
{
    public enum TestUserType
    {
        CREATE = 0,
        EXISTING = 1,
        EXISTING_WITH_EVENTS = 2, //1 month +
        EXISTING_WITH_WORKERS = 3,
    }
}
