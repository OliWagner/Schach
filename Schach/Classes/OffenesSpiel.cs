using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Schach.Classes
{
    public class OffenesSpiel
    {
        public OffenesSpiel(int partieId, string istDran, string werte)
        {
            IstDran = istDran;
            PartieId = partieId;
            Werte = werte;
        }
        public int PartieId { get; set; }
        public string IstDran { get; set; }
        public string Werte { get; set; }
    }

    public class OffenesSpielDarstellung {
        public OffenesSpielDarstellung(string nameGegner, int partieId, DateTime datum) {
            NameGegner = nameGegner;
            PartieId = partieId;
            SpielDatum = datum.ToString("dd.MM. - HH:mm");
        }
        public string NameGegner { get; set; }
        public int PartieId { get; set; }
        public string SpielDatum { get; set; }
    }
}