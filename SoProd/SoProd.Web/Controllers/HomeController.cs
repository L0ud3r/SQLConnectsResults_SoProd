using SoProd.Web.Models;
using SoProd_Testing.Data;
using SoProd_Testing.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SoProd.Web.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            using (var context = new SoProdTestingContext()) {
                List<TestResultViewModel> list = new List<TestResultViewModel>();
                var resultList = context.TestResults.ToList();

                foreach(var result in resultList)
                {
                    TestResultViewModel resultViewModel = new TestResultViewModel();

                    resultViewModel.Id = result.TestDefinitionId;
                    resultViewModel.Identifier = result.Identifier;
                    resultViewModel.TimeEllapsed = result.TimeEllapsed;

                    list.Add(resultViewModel);
                }

                return View(list);
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