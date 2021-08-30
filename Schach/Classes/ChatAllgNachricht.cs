using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Schach.Classes
{
    public class ChatAllgNachricht
    {
        public int Id { get; set; }
        public DateTime Datum { get; set; }
        public string NachrichtVon { get; set; }
        public string Nachricht { get; set; }

        public ChatAllgNachricht(DateTime datum, string nachrichtVon, string nachricht, int id) {
            Datum = datum;
            Nachricht = nachricht;
            NachrichtVon = nachrichtVon;
            Id = id;
        }
    }
}