using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Schach.Classes
{
    public class Zug
    {
        public string SpielerHatGezogen { get; set; }
        public string Zuhg { get; set; }
        public string Figur { get; set; }

        public Zug(string spielerHatGezogen, string zug, string figur)
        {
            SpielerHatGezogen = spielerHatGezogen;
            Zuhg = zug;
            Figur = figur;
        }
    }
}