using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Schach.Classes
{
    public class ChatNachricht
    {
        public int SpielId { get; set; }
        public string NachrichtVon { get; set; }
        public string Nachricht { get; set; }

        public ChatNachricht(int spielId, string nachrichtVon, string nachricht) {
            SpielId = spielId;
            Nachricht = nachricht;
            NachrichtVon = nachrichtVon;
        }
    }
}