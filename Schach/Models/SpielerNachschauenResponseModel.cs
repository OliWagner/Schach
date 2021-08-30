using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Schach.Models
{
    public class SpielerNachschauenResponseModel
    {
        public string Prosatext { get; set; }
        public string Herausforderer { get; set; }
        public int PartieId { get; set; }
    }
}