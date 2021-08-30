using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Schach.Models
{
    /// <summary>
    /// Enthält alle Werte die für die Ausführung des Spiels gesetzt werden müssen
    /// </summary>
    public class SpielenWerteModel
    {
        public int SpielId { get; set; }
        public string SpielerAmZug { get; set; }
        public string EigeneFarbeDesSpielers { get; set; }
        public string NameSpielerWeiss { get; set; }
        public string NameSpielerSchwarz { get; set; }
    }
}