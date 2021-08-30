using Newtonsoft.Json;
using Schach.Classes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Schach.Controllers
{
    public class ChatController : Controller
    {
        public ActionResult NachrichtEintragen(string spielId, string nachricht, string nachrichtVon)
        {
            DbConnector.InsertChatNachricht(spielId, nachricht, nachrichtVon);

            return Content("ok", "text/plain");
        }

        public ActionResult NachrichtenAbrufen(string spielId)
        {
            List<ChatNachricht> liste = DbConnector.ReadChatNachrichten(Int32.Parse(spielId));
            return Content(JsonConvert.SerializeObject(liste), "text/json");
        }

        public ActionResult NachrichtAllgEintragen(string nachricht, string nachrichtVon)
        {
            int id = DbConnector.InsertAllgChatNachricht(nachricht, nachrichtVon);
            return Content(id.ToString(), "text/plain");
        }

        public ActionResult NachrichtenAllgAbrufen(string id)
        {
            List<ChatAllgNachricht> liste = DbConnector.ReadAllgChatNachrichten(Int32.Parse(id));
            return Content(JsonConvert.SerializeObject(liste), "text/json");
        }
    }
}


