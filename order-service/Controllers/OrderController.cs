using Microsoft.AspNetCore.Mvc;

namespace GBB.Miyagi.OrderService.Controllers
{
    public class OrderController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
