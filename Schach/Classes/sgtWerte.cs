using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Schach.Classes
{
    public sealed class sgtWerte
    {
        private static readonly object padlock = new object();
        private static sgtWerte instance = null;

        //Werte
        private string Spieler { get; set; }
        private string SpielerGuid { get; set; }
        private int SpielId { get; set; }

        private sgtWerte()
        {

        }

        public static sgtWerte Instance
        {
            get
            {
                if (instance == null)
                {
                    lock (padlock)
                    {
                        if (instance == null)
                        {
                            instance = new sgtWerte();
                        }
                    }
                }
                return instance;
            }
        }

        public void SetSpieler(string name)
        {
            Spieler = name;
        }

        public void SetSpielerGuid(string guid)
        {
            SpielerGuid = guid;
        }

        public void SetSpielId(int id)
        {
            SpielId = id;
        }

        public string GetSpieler()
        {
            return Spieler;
        }

        public string GetSpielerGuid()
        {
            return SpielerGuid;
        }

        public int GetSpielId()
        {
           return SpielId;
        }


    }
}