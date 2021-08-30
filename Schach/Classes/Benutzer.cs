using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Schach.Classes
{
    public class Benutzer
    {
        public string Guid { get; set; }
        public string Mailadresse { get; set; }
        public string Passwort { get; set; }
        public bool IstAktiv { get; set; }

        public Benutzer(string guid, string mailadresse, string passwort, bool istaktiv) {
            Guid = guid;
            Mailadresse = mailadresse;
            Passwort = passwort;
            IstAktiv = istaktiv;
        }
    }
}