﻿using Newtonsoft.Json;
using Schach.Classes;
using Schach.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Schach.Controllers
{
    public class HomeController : Controller
    {
        private Benutzer AktiverSpieler { get; set; }
        // GET: Schach
        public ActionResult Index()
        {
            Session["Spieler"] = "a";
            Session["SpielerGuid"] = "a";
            Session["SpielId"] = "";
            return View();
        }

        public ActionResult Angemeldet()
        {
            if (Session["SpielerGuid"] == null || Session["SpielerGuid"].ToString().Equals("a")) {
                return RedirectToAction("Index");
            } else {
                return View();
            }
            
        }

        public ActionResult Spielen(int id)
        {

            if (Session["SpielerGuid"] == null || Session["SpielerGuid"].ToString().Equals("a"))
            {
                return RedirectToAction("Index");
            }
            else
            {
                Session["SpielId"] = id;

                DbConnector.SetSpielerSchwarzBestaetigt(id);

                SpielenWerteModel model = new SpielenWerteModel();
                model.EigeneFarbeDesSpielers = DbConnector.ErmittleFarbeSpieler(Session["SpielerGuid"].ToString(), id);
                //if (model.EigeneFarbeDesSpielers.Equals("W")) {
                //    DbConnector.InsertSpielstandStart(id);
                //}

                model.SpielerAmZug = "W";
                string[] beide = DbConnector.GetNamenMitspieler(id).Split(';');
                model.NameSpielerSchwarz = beide[1];
                model.NameSpielerWeiss = beide[0];
                model.SpielId = id;
                return View(model);
            }
        }

        public ActionResult SpielerAbrufen(string guid)
        {
            List<Benutzer> liste = DbConnector.ReadBenutzerData(guid);
            return Content(JsonConvert.SerializeObject(liste), "text/json");
        }

        public ActionResult Anmelden(SchachAnmeldungModel model)
        {
            Benutzer ben = DbConnector.BenutzerAnmelden(model.email, model.passwort);
            if (ben != null)
            {
                AktiverSpieler = ben;
                Session["Spieler"] = ben.Mailadresse;
                Session["SpielerGuid"] = ben.Guid;
                return Content(JsonConvert.SerializeObject(ben), "text/json");
            }
            return null;
        }

        public ActionResult GetAktiverSpieler()
        {
            return Content(JsonConvert.SerializeObject(AktiverSpieler), "text/json");
        }

        public ActionResult Registrieren(SchachAnmeldungModel model)
        {
            //DbConnector.InsertBenutzerData(model.email, model.passwort, Guid.NewGuid().ToString(), true);

            //return Content("Sie haben sich registriert und können nun loslegen.", "text/plain");
            return Content("Registrierung derzeit nicht möglich.", "text/plain");
        }

        public ActionResult PartieAnlegen(string spielerweiss, string spielerschwarz)
        {
            DbConnector.InsertPartie(spielerweiss, spielerschwarz);
            Session["SpielId"] = DbConnector.SchaueNachLetzterPartieId();
            return Content(DbConnector.SchaueNachLetzterPartieId().ToString(), "text/plain");
        }

        public ActionResult ZugEintragen(string spielerHatGezogen, string zugVon, string zugNach, string figur)
        {
            int spielId = Int32.Parse(Session["SpielId"].ToString());
            string zug = zugVon + "-" + zugNach;
            string returner = DbConnector.ZugEintragen(spielId, spielerHatGezogen, zug, figur);

            string shg = spielerHatGezogen.Equals("W") ? "S" : "W";
            //DbConnector.UdpdateSpielstand(spielId, zugVon, zugNach, shg);
            return Content(returner, "text/plain");
        }

        public ActionResult ZugAbfragen()
        {
            string spielId = Session["SpielId"].ToString();
            int _spielId = Int32.Parse(spielId);
            string zug = DbConnector.SchaueNachLetztemZug(_spielId);
            return Content(zug, "text/plain");
        }

        public ActionResult CheckAnnahmePartie(int id)
        {
            if (DbConnector.SchaueNachPartieBestaetigung(id))
            {
                return Content("true", "text/plain");
            }
            else {
                return Content("false", "text/plain");
            }
        }

        public ActionResult PartieNachschauen(string spielerschwarz)
        {
            int test = DbConnector.SchaueNachPartie(spielerschwarz);
            if (test != 0)
            {
                SpielerNachschauenResponseModel model = new SpielerNachschauenResponseModel();
                model.PartieId = test;
                model.Prosatext = "Es liegt eine Anfrage für ein Spiel vor.";
                //model.Herausforderer = DbConnector.ReadSingleBenutzerData(AktiverSpieler.Guid).Mailadresse;
                return Content(JsonConvert.SerializeObject(model), "text/json");
            }
            return Content("Nix", "text/plain");
        }

        public ActionResult LeseZuege(int partieId)
        {
            List<Zug> zuege = DbConnector.LeseZuege(partieId);
            if (zuege.Count > 0)
            {
                return Content(JsonConvert.SerializeObject(zuege), "text/json");
            }
            return Content("", "text/plain");
        }


    }
}