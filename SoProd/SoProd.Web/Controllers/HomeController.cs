using Microsoft.AspNetCore.Mvc;
using SoProd.Web.Models;
using SoProd_Testing.Data;
using SoProd_Testing.Data.Entities;
using SoProd_Web.Models.RecordSearch;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Core.Objects;
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
            using (var context = new SoProdTestingContext())
            {
                List<TestResultViewModel> list = await GetResults();

                return View(list);
            }
        }

        //ADICIONAR PARAMETROS DE SEARCH (FILTERS)
        public async Task<JsonResult> GetResultsJson(DataTableSearchFilters dtFilters)
        {
            using (var context = new SoProdTestingContext())
            {
                context.Configuration.LazyLoadingEnabled = false;

                List<TestResultViewModel> list = new List<TestResultViewModel>();

                var resultList = await context.TestResults.OrderBy(x => x.Id).Skip(dtFilters.start).Take(dtFilters.length)
                .Select(x => new TestResultViewModel
                {
                    Id = x.Id,
                    Identifier = x.Identifier,
                    StartDate = x.StartDate,
                    TimeEllapsed = x.TimeEllapsed,
                    Version = x.Version,
                    RequestsNumber = x.TestResultExecutions.Count(),
                    AvgRequestTime = x.TestResultExecutions.Average(tr => tr.TimeEllapsed),
                }).ToListAsync();

                var resultsCount = await context.TestResults.CountAsync();

                //foreach (var result in resultList)
                //{
                //    TestResultViewModel resultViewModel = new TestResultViewModel();

                //    resultViewModel.Id = result.Id;
                //    resultViewModel.Identifier = result.Identifier;
                //    resultViewModel.TimeEllapsed = result.TimeEllapsed;
                //    resultViewModel.StartDate = result.StartDate;
                //    resultViewModel.Version = result.Version;
                //    resultViewModel.RequestsOK = result.RequestsOK;
                //    resultViewModel.RequestsError = result.RequestsError;
                //    resultViewModel.RequestsNumber = result.RequestsNumber;

                //    var executions = await context.TestResultExecutions.Where((x => x.TestResultId == result.Id)).ToListAsync();
                //    var okExecutions = executions.Where(x => x.StatusCode == 200).ToList();

                //    if (executions != null && executions.Any()) resultViewModel.TotalRequests = executions.Count;
                //    else resultViewModel.TotalRequests = 0;

                //    if (okExecutions.Any())
                //    {
                //        resultViewModel.AvgRequestTime = okExecutions.Select(x => x.TimeEllapsed).Average();

                //        double totalOKs = okExecutions.Count();
                //        resultViewModel.RequestPercentage = resultViewModel.TotalRequests > 0 ? (totalOKs / resultViewModel.TotalRequests) * 100 : 0;

                //        resultViewModel.MaxRequestTime = okExecutions.Select(x => x.TimeEllapsed).Max();
                //    }
                //    else
                //    {
                //        resultViewModel.AvgRequestTime = -1;
                //        resultViewModel.RequestPercentage = -1;
                //        resultViewModel.MaxRequestTime = -1;
                //    }

                //    list.Add(resultViewModel);
                //}

                return Json(new { iTotal = resultsCount, iTotalDisplay = resultList.Count, aaData = resultList, draw = dtFilters.draw }, JsonRequestBehavior.AllowGet);
            }
        }

        public async Task<List<TestResultViewModel>> GetResults()
        {
            using (var context = new SoProdTestingContext())
            {
                List<TestResultViewModel> list = new List<TestResultViewModel>();
                var resultList = await context.TestResults.Take(10).ToListAsync();

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

                    list.Add(resultViewModel);
                }

                return list;
            }
        }

        public async Task<JsonResult> SearchResults(string version)
        {
            using (var context = new SoProdTestingContext())
            {
                List<TestResultViewModel> list = new List<TestResultViewModel>();
                var results = await context.TestResults.Take(10).ToListAsync(); ;

                context.Configuration.LazyLoadingEnabled = false;
                if (version != null && version != "")
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

        public async Task<List<ComparisonResultViewmodel>> GetResultsInfo(List<TestResult> testResults)
        {
            using (var context = new SoProdTestingContext())
            {
                context.Database.CommandTimeout = 1500;
                var ids = testResults.Select(tr => tr.Id);
                string version = testResults[0].Version;

                var data = await (from t in context.TestResults
                                  join d in context.TestDefinitions on t.TestDefinitionId equals d.Id
                                  join te in context.TestResultExecutions on t.Id equals te.TestResultId
                                  where ids.Contains(t.Id)
                                  group new { t, d, te } by new
                                  {
                                      t.UsersNumber,
                                      d.Name,
                                      t.StartDate,
                                      t.BaseAddress,
                                      Version = (version != null && t.Version.Contains(version)) ? version : "UNKNOWN",
                                      TestType = t.Version.Contains("Filters") ? "Filters Search" :
                                                 t.Version.Contains("(Search)") ? "Search" :
                                                 t.Version.Contains("Operator") ? "Operator" :
                                                 t.Version.Contains("Record") ? "Record" :
                                                 "UNKNOWN"
                                  } into g
                                  where g.Select(x => x.t.Id).Distinct().Count() >= 1
                                  select new ComparisonResultViewmodel()
                                  {
                                      TotalCount = g.Select(x => x.t.Id).Distinct().Count(),
                                      Name = g.Key.Name,
                                      StartDate = g.Key.StartDate,
                                      Version = g.Key.Version,
                                      TestType = g.Key.TestType,
                                      BaseAddress = g.Key.BaseAddress,
                                      AvgRequest = g.Where(x => x.te.StatusCode == 200).Average(x => x.te.TimeEllapsed),
                                      TotalRequest = g.Count(),
                                      UsersNumber = g.Key.UsersNumber,
                                      PercentRequest = g.Where(x => x.te.StatusCode == 200).Count() * 100.0 / g.Count(),
                                      MaxRequest = g.Where(x => x.te.StatusCode == 200).Max(x => x.te.TimeEllapsed)
                                  }).ToListAsync();
                return data;
            }
        }

        public async Task<List<TestResult>> GetData2(string version, DateTime date)
        {
            using (var context = new SoProdTestingContext())
            {
                context.Configuration.LazyLoadingEnabled = false;

                if (date != null && DateTime.Compare(date, new DateTime(1, 1, 1, 0, 0, 0)) == 0)
                {
                    var data = await context.TestResults.Where(x => x.Version.Contains(version)).ToListAsync();

                    return data;
                }
                else
                {
                    var data = await context.TestResults.Where(x => x.Version.Contains(version) && DbFunctions.TruncateTime(x.StartDate) == date.Date).ToListAsync();

                    return data;
                }
            }
        }

        [HttpPost]
        public async Task<JsonResult> GetDataToJson(string version, DateTime date)
        {
            using (var context = new SoProdTestingContext())
            {
                context.Configuration.LazyLoadingEnabled = false;

                if (date == null || DateTime.Compare(date, new DateTime(1, 1, 1, 0, 0, 0)) == 0)
                {
                    var data = await context.TestResults.Where(x => x.Version == version).ToListAsync();

                    var jsonObject = Json(new { testResults = data }, JsonRequestBehavior.AllowGet);
                    jsonObject.MaxJsonLength = Int32.MaxValue;

                    return jsonObject;
                }
                else
                {
                    var data = await context.TestResults.Where(x => x.Version == version && DbFunctions.TruncateTime(x.StartDate) == date.Date).ToListAsync();

                    var jsonObject = Json(new { testResults = data }, JsonRequestBehavior.AllowGet);
                    jsonObject.MaxJsonLength = Int32.MaxValue;

                    return jsonObject;
                }
            }
        }

        public async Task<List<TestResult>> IdsToList(List<int> Ids)
        {
            using (var context = new SoProdTestingContext())
            {
                context.Configuration.LazyLoadingEnabled = false;

                var data = await context.TestResults.Where(x => Ids.Contains(x.Id)).ToListAsync();

                return data;
            }
        }

        [HttpPost]
        public async Task<JsonResult> Compare(List<int> listIds1, List<int> listIds2)
        {
            using (var context = new SoProdTestingContext())
            {
                context.Configuration.LazyLoadingEnabled = false;
                ComparisonResultListViewModel result = new ComparisonResultListViewModel();
                ComparisonCalculus c1 = new ComparisonCalculus();
                ComparisonCalculus c2 = new ComparisonCalculus();
                List<TestResult> listResults1 = new List<TestResult>();
                List<TestResult> listResults2 = new List<TestResult>();


                c1.MaxRequest = -1;
                double c1TotalAvg = 0.0;
                double c1TotalPercentage = 0.0;

                c2.MaxRequest = -1;
                double c2TotalAvg = 0.0;
                double c2TotalPercentage = 0.0;


                listResults1 = await IdsToList(listIds1);
                listResults2 = await IdsToList(listIds2);

                var compare1 = await GetResultsInfo(listResults1);
                var compare2 = await GetResultsInfo(listResults2);

                foreach (var compare in compare1)
                {
                    c1.UsersNumber += compare.UsersNumber;
                    c1.TestsCount++;
                    c1.TotalRequest += compare.TotalRequest;
                    if (c1.MaxRequest < compare.MaxRequest) c1.MaxRequest = compare.MaxRequest;
                    c1TotalAvg += compare.AvgRequest;
                    c1TotalPercentage += compare.PercentRequest;
                }

                c1.AvgRequest = c1TotalAvg / compare1.Count;
                c1.PercentRequest = c1TotalPercentage / compare1.Count;

                foreach (var compare in compare2)
                {
                    c2.UsersNumber += compare.UsersNumber;
                    c2.TestsCount++;
                    c2.TotalRequest += compare.TotalRequest;
                    if (c2.MaxRequest < compare.MaxRequest) c2.MaxRequest = compare.MaxRequest;
                    c2TotalAvg += compare.AvgRequest;
                    c2TotalPercentage += compare.PercentRequest;
                }

                c2.AvgRequest = c2TotalAvg / compare2.Count;
                c2.PercentRequest = c2TotalPercentage / compare2.Count;

                if (compare1.Count == 0)
                {
                    c1.AvgRequest = 0.0;
                    c1.PercentRequest = 0.0;
                    c1.TestsCount = 0;
                    c1.UsersNumber = 0;
                    c1.MaxRequest = 0.0;
                    c1.TotalRequest = 0;
                }

                if (compare2.Count == 0)
                {
                    c2.AvgRequest = 0.0;
                    c2.PercentRequest = 0.0;
                    c2.TestsCount = 0;
                    c2.UsersNumber = 0;
                    c2.MaxRequest = 0.0;
                    c2.TotalRequest = 0;
                }

                result.comparison1 = c1;
                result.comparison2 = c2;

                return Json(new { result = "OK", resultComparison = result }, JsonRequestBehavior.AllowGet);
            }
        }
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