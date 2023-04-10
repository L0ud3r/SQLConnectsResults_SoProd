using Microsoft.AspNetCore.Mvc;
using SoProd.Web.Models;
using SoProd_Testing.Data;
using SoProd_Testing.Data.Entities;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace SoProd.Web.Controllers
{
    public class HomeController : Controller
    {
        public async Task<ActionResult> Index()
        {
            using (var context = new SoProdTestingContext()) {
                List<TestResultViewModel> list = new List<TestResultViewModel>();

                var resultList = await context.TestResults.Take(10).ToListAsync();
                //var resultList = await context.TestResults.ToListAsync();

                foreach (var result in resultList)
                {
                    TestResultViewModel resultViewModel = new TestResultViewModel();

                    resultViewModel.Id = result.Id;
                    resultViewModel.Identifier = result.Identifier;
                    resultViewModel.TimeEllapsed = result.TimeEllapsed;
                    resultViewModel.StartDate = result.StartDate;
                    resultViewModel.Version = result.Version;
                    resultViewModel.RequestsOK = result.RequestsOK;
                    resultViewModel.RequestsError = result.RequestsError;
                    resultViewModel.RequestsNumber = result.RequestsNumber;

                    var executions = await context.TestResultExecutions.Where((x => x.TestResultId == result.Id)).ToListAsync();
                    var okExecutions =  executions.Where(x => x.StatusCode == 200).ToList();

                    if (executions != null && executions.Any()) resultViewModel.TotalRequests = executions.Count;
                    else resultViewModel.TotalRequests = 0;

                    if (okExecutions.Any())
                    {
                        resultViewModel.AvgRequestTime = okExecutions.Select(x => x.TimeEllapsed).Average();

                        double totalOKs = okExecutions.Count();
                        resultViewModel.RequestPercentage = resultViewModel.TotalRequests > 0 ? (totalOKs / resultViewModel.TotalRequests) * 100 : 0;

                        resultViewModel.MaxRequestTime = okExecutions.Select(x => x.TimeEllapsed).Max();
                    }
                    else
                    {
                        resultViewModel.AvgRequestTime = -1;
                        resultViewModel.RequestPercentage = -1;
                        resultViewModel.MaxRequestTime = -1;
                    }

                    //VERSION do REquests para comparar + data por lista

                    list.Add(resultViewModel);
                }

                return View(list);
            }
        }

        public async Task<JsonResult> SearchResults(string version)
        {
            using (var context = new SoProdTestingContext())
            {
                List<TestResultViewModel> list = new List<TestResultViewModel>();
                var results = await context.TestResults.Take(10).ToListAsync(); ;

                context.Configuration.LazyLoadingEnabled = false;
                if(version != null && version != "")
                {
                    results = await context.TestResults.AsNoTracking().Where(x => x.Version == version).ToListAsync();
                }

                foreach (var result in results)
                {
                    TestResultViewModel resultViewModel = new TestResultViewModel();

                    resultViewModel.Id = result.Id;
                    resultViewModel.Identifier = result.Identifier;
                    resultViewModel.TimeEllapsed = result.TimeEllapsed;
                    resultViewModel.StartDate = result.StartDate;
                    resultViewModel.Version = result.Version;
                    resultViewModel.RequestsOK = result.RequestsOK;
                    resultViewModel.RequestsError = result.RequestsError;
                    resultViewModel.RequestsNumber = result.RequestsNumber;

                    var executions = await context.TestResultExecutions.Where((x => x.TestResultId == result.Id)).ToListAsync();
                    var okExecutions = executions.Where(x => x.StatusCode == 200).ToList();

                    if (executions != null && executions.Any()) resultViewModel.TotalRequests = executions.Count;
                    else resultViewModel.TotalRequests = 0;

                    if (okExecutions.Any())
                    {
                        resultViewModel.AvgRequestTime = okExecutions.Select(x => x.TimeEllapsed).Average();

                        double totalOKs = okExecutions.Count();
                        resultViewModel.RequestPercentage = resultViewModel.TotalRequests > 0 ? (totalOKs / resultViewModel.TotalRequests) * 100 : 0;

                        resultViewModel.MaxRequestTime = okExecutions.Select(x => x.TimeEllapsed).Max();
                    }
                    else
                    {
                        resultViewModel.AvgRequestTime = -1;
                        resultViewModel.RequestPercentage = -1;
                        resultViewModel.MaxRequestTime = -1;
                    }

                    //VERSION do REquests para comparar + data por lista

                    list.Add(resultViewModel);
                }

                return Json(new { result = "OK", results = list }, JsonRequestBehavior.AllowGet);
            }
        }

        public async Task<JsonResult> GetResultExecutions(int id)
        {
            using (var context = new SoProdTestingContext())
            {
                context.Configuration.LazyLoadingEnabled = false;
                var results = await context.TestResultExecutions.AsNoTracking().Where(x => x.TestResultId == id).ToListAsync();


                return Json(new { result = "OK", results = results }, JsonRequestBehavior.AllowGet);
            }
        }

        public async Task<JsonResult> GetVersions()
        {
            using (var context = new SoProdTestingContext())
            {
                context.Configuration.LazyLoadingEnabled = false;
                var themes = await context.TestResults.AsNoTracking().Where(x => x.Version != null).Select(x => x.Version).Distinct().ToListAsync();

                return Json(new { result = "OK", themes = themes }, JsonRequestBehavior.AllowGet);
            }
        }

        //public async Task<JsonResult> GetThemes(int flowId = -1)
        //{
        //    using (var context = new SoProdTestingContext())
        //    {
        //        List<string[]> list = new List<string[]>();
        //        var data = await context.TestResults.Distinct.ToListAsync();

        //        foreach (var item in data)
        //        {
        //            list.Add(new string[] { Languages.Get("All"), item.Version, item.Version });
        //        }

        //        return Json(new
        //        {
        //            data = list
        //        });
        //    }
        //}

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}