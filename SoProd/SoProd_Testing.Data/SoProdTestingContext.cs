using SoProd_Testing.Data.Entities;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Validation;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SoProd_Testing.Data
{
    class TestingContext
    {
        static void Main(string[] args)
        {
            //using (var db = new SoProdTestingContext())
            //{
            //    // Create and save a new TestResult
            //    var testResult = new TestResult { Identifier = Guid.NewGuid(), StartDate = DateTime.Now };
            //    db.TestResults.Add(testResult);
            //    db.SaveChanges();

            //    var query = from b in db.TestResults
            //                orderby b.Id
            //                select b;

            //    Console.WriteLine("All TestResults in the database:");
            //    foreach (var item in query)
            //    {
            //        Console.WriteLine(item.Identifier);
            //    }

            //    Console.WriteLine("Press any key to exit...");
            //    Console.ReadKey();
            //}
        }
    }

    //public class SoProdTestingDbConfiguration : DbConfiguration
    //{
    //    public SoProdTestingDbConfiguration()
    //    {
    //    }
    //}

    //[DbConfigurationType(typeof(SoProdTestingDbConfiguration))]
    public class SoProdTestingContext : DbContext
    {
        public SoProdTestingContext()
            : base("name=SoProdTestingContainer")
        {
        }
        public DbSet<TestResult> TestResults { get; set; }
        public DbSet<TestResultExecution> TestResultExecutions { get; set; }
        public DbSet<TestDefinition> TestDefinitions { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            
        }

        public bool Save(object obj = null, bool lazy = false)
        {
            try
            {
                if (obj != null)
                {
                    this.Entry(obj).State = EntityState.Modified;
                }
                if (!lazy)
                {
                        this.SaveChanges();
                }
                return true;
            }
            catch (DbEntityValidationException ex)
            {
                string fullError = "";
                foreach (var eve in ex.EntityValidationErrors)
                {
                    fullError += string.Format("Entity of type \"{0}\" in state \"{1}\" has the following validation errors:\n",
                        eve.Entry.Entity.GetType().Name, eve.Entry.State);
                    foreach (var ve in eve.ValidationErrors)
                    {
                        fullError += string.Format("  - Property: \"{0}\", Value: \"{1}\", Error: \"{2}\"\n",
                        ve.PropertyName,
                        eve.Entry.CurrentValues.GetValue<object>(ve.PropertyName),
                        ve.ErrorMessage);
                    }
                }
                //Utils.Log(fullError);
            }
            catch// (Exception e)
            {
                //          Utils.Log(e);
                throw;
            }
            return false;
        }
    }

}
