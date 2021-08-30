using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Schach.Classes
{
    public class ChatAllgNachricht
    {
        public DateTime Datum { get; set; }
        public string NachrichtVon { get; set; }
        public string Nachricht { get; set; }

        public ChatAllgNachricht(DateTime datum, string nachrichtVon, string nachricht) {
            Datum = datum;
            Nachricht = nachricht;
            NachrichtVon = nachrichtVon;
        }
    }
}