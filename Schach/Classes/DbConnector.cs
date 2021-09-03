using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace Schach.Classes
{
    public static class DbConnector
    {
        public static SqlConnection _con;
        public static string _conString = "Data Source='DESKTOP-8NB5DQG\\DATENBANK';Initial Catalog='Schach';User ID='sa';Password='95hjh11!';";
        //public static string _conString = "Data Source='EC2AMAZ-I6L5O2V\\SQLEXPRESS';Initial Catalog='Schach';User ID='sa';Password='95hjh11!';";

        //private static DbConnector instance = null;
        //private static readonly object padlock = new object();

        //private DbConnector()
        //{
            
        //}

        //public static DbConnector Instance
        //{
        //    get
        //    {
        //        if (instance == null)
        //        {
        //            lock (padlock)
        //            {
        //                if (instance == null)
        //                {
        //                    instance = new DbConnector();
        //                    Connect();
        //                }
        //            }
        //        }
        //        return instance;
        //    }
        //}
    

    #region Common
    private static bool Connect()
        {
            try
            {
                _con = new SqlConnection();
                _con.ConnectionString = _conString;
                _con.Open();
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public static void Close()
        {
            _con.Close();
            _con.Dispose();
        }
        #endregion

        public static List<OffenesSpielDarstellung> ReadOffeneSpiele(string guid) {
            List<OffenesSpielDarstellung> liste = new List<OffenesSpielDarstellung>();
            Connect();

            try
            {
                using (SqlCommand cmd = new SqlCommand())
                {

                    cmd.Connection = _con;
                    cmd.CommandType = CommandType.Text;
                    cmd.CommandText = "SELECT * FROM Partien where SpielerWeissGuid = '" + guid + "' or SpielerSchwarzGuid = '" + guid + "' order by id desc";

                    SqlDataAdapter da = new SqlDataAdapter(cmd);
                    DataTable dt = new DataTable();
                    da.Fill(dt);

                    foreach (DataRow row in dt.Rows)
                    {
                        string gegner = "";

                        if (row.Field<string>(1).ToString().Equals(guid))
                        {
                            string gu = row.Field<string>(2).ToString();
                            Benutzer tester = ReadSingleBenutzerData(gu);
                            gegner = tester.Mailadresse;
                        }
                        else {
                            string gu = row.Field<string>(1).ToString();
                            Benutzer tester = ReadSingleBenutzerData(gu);
                            gegner = tester.Mailadresse;
                        }
                        int aktId = row.Field<int>(0);
                        DateTime datetime = row.Field<DateTime>(5);

                        liste.Add(new OffenesSpielDarstellung(gegner, aktId, datetime));
                    }

                }
            }
            catch (Exception ex)
            {
                var test = 0;

            }

            Close();
            return liste;
        }

        public static OffenesSpiel ReadOffenesSpiel(int id)
        {
            Connect();

            try
            {
                using (SqlCommand cmd = new SqlCommand())
                {

                    cmd.Connection = _con;
                    cmd.CommandType = CommandType.Text;
                    cmd.CommandText = "SELECT PartieId, IstDran, Werte FROM StaendePartienWerte where PartieId = '" + id + "'";

                    SqlDataAdapter da = new SqlDataAdapter(cmd);
                    DataTable dt = new DataTable();
                    da.Fill(dt);


                    return new OffenesSpiel(id, dt.Rows[0].Field<string>(1).ToString(), dt.Rows[0].Field<string>(2).ToString()); 
                }
            }
            catch (Exception ex)
            {
                var test = 0;
            }

            Close();
            return null;
        }

        public static void InsertBenutzerData(string email, string passwort, string guid, bool istaktiv)
        {
            Connect();
            SqlCommand command = _con.CreateCommand();
            SqlTransaction transaction;
            // Start a local transaction.
            transaction = _con.BeginTransaction(IsolationLevel.ReadCommitted);
            // Must assign both transaction object and connection
            // to Command object for a pending local transaction
            command.Connection = _con;
            command.Transaction = transaction;

            try
            {
                command.CommandText = "Insert into Benutzer (guid, email, passwort, istaktiv) VALUES ('" + guid + "', '" + email + "', '" + passwort + "', '" + istaktiv + "')";
                command.ExecuteNonQuery();
                transaction.Commit();
            }
            catch (Exception e)
            {
                try
                {
                    transaction.Rollback();
                }
                catch (SqlException ex)
                {
                    if (transaction.Connection != null)
                    {
                        //Fehlerbehandlung.Error(ex.StackTrace.ToString(), ex.Message, "xx0024ax");
                    }
                }
                //Fehlerbehandlung.Error(e.StackTrace.ToString(), e.Message, "xx0024xx");
            }
            Close();
        }

        public static string ZugEintragen(int spielId, string spielerHatGezogen, string zug, string figur)
        {
            Connect();
            string returner = "";
            SqlCommand command = _con.CreateCommand();
            SqlTransaction transaction;
            // Start a local transaction.
            transaction = _con.BeginTransaction(IsolationLevel.ReadCommitted);
            // Must assign both transaction object and connection
            // to Command object for a pending local transaction
            command.Connection = _con;
            command.Transaction = transaction;

            try
            {
                command.CommandText = "Insert into Zuege (SpielId, SpielerHatGezogen, Zug, Figur) VALUES ('" + spielId + "', '" + spielerHatGezogen + "', '" + zug + "', '" + figur + "')";
                command.ExecuteNonQuery();
                transaction.Commit();
                returner = "ok";
            }
            catch (Exception e)
            {
                try
                {
                    transaction.Rollback();
                }
                catch (SqlException ex)
                {
                    if (transaction.Connection != null)
                    {
                        //Fehlerbehandlung.Error(ex.StackTrace.ToString(), ex.Message, "xx0024ax");
                    }
                }
                //Fehlerbehandlung.Error(e.StackTrace.ToString(), e.Message, "xx0024xx");
            }
            Close();
            return returner;
        }

        public static string SchaueNachLetztemZug(int spielId)
        {
            Connect();
            string returner = "";
            try
            {
                using (SqlCommand cmd = new SqlCommand())
                {

                    cmd.Connection = _con;
                    cmd.CommandType = CommandType.Text;
                    cmd.CommandText = "SELECT Zug, Figur FROM Zuege where SpielId = " + spielId + " order by id desc";

                    SqlDataAdapter da = new SqlDataAdapter(cmd);
                    DataTable dt = new DataTable();
                    da.Fill(dt);
                    returner = dt.Rows[0].Field<string>(0) + ";" + dt.Rows[0].Field<string>(1);
                }
            }
            catch (Exception ex)
            {
                var test = 0;

            }
            Close();
            return returner;
        }

        public static List<Zug> LeseZuege(int partieId)
        {
            Connect();
            List<Zug> liste = new List<Zug>();
            try
            {
                using (SqlCommand cmd = new SqlCommand())
                {

                    cmd.Connection = _con;
                    cmd.CommandType = CommandType.Text;
                    cmd.CommandText = "SELECT * FROM Zuege where SpielId = " + partieId;

                    SqlDataAdapter da = new SqlDataAdapter(cmd);
                    DataTable dt = new DataTable();
                    da.Fill(dt);

                    foreach (DataRow row in dt.Rows)
                    {
                        liste.Add(new Zug( row.Field<string>(1), row.Field<string>(2), row.Field<string>(3)));
                    }
                }
            }
            catch (Exception e)
            {
                int i = 0;
            }
            Close();
            return liste;
        }

        public static void DeletePartie(int spielId) {
            Connect();
            try
            {
                using (SqlCommand cmd = new SqlCommand())
                {
                    cmd.Connection = _con;
                    cmd.CommandType = CommandType.Text;
                    cmd.CommandText = "Delete from Partien where id = '" + spielId + "'";
                    cmd.ExecuteNonQuery();
                }
            }
            catch (Exception)
            {
                int i = 0;
            }
            Close();
        }

        /// <summary>
        /// Entfernen des Eintrags erfolgt nach 5 Minuten in der Funktion InsertChatNachricht
        /// </summary>
        /// <param name="spielId"></param>
        public static void InsertChatToDelete(int spielId) {
            Connect();
            try
            {
                using (SqlCommand cmd = new SqlCommand())
                {

                    cmd.Connection = _con;
                    cmd.CommandType = CommandType.Text;
                    cmd.CommandText = "Insert Into ChatsToDelete (Zeitstempel, SpielId) Values (getdate(), '" + spielId + "')";
                    cmd.ExecuteNonQuery();
                }
            }
            catch (Exception)
            {
                int test = 0;
            }
            Close();
        }

        public static void InsertPartie(string spielerweiss, string spielerschwarz)
        {
            Connect();

            try
            {
                SqlCommand command = _con.CreateCommand();
                SqlTransaction transaction;
                // Start a local transaction.
                transaction = _con.BeginTransaction(IsolationLevel.ReadCommitted);
                // Must assign both transaction object and connection
                // to Command object for a pending local transaction
                command.Connection = _con;
                command.Transaction = transaction;
                command.CommandText = "Insert into Partien (SpielerWeissGuid, SpielerSchwarzGuid, SpielerWeissBestaetigt, SpielerSchwarzBestaetigt, Datum) VALUES ('" + spielerweiss + "', '" + spielerschwarz + "', 'true', 'false', '" + DateTime.Now.ToLocalTime() + "');";
                command.ExecuteNonQuery();
                transaction.Commit();

                transaction = _con.BeginTransaction(IsolationLevel.ReadCommitted);
                // Must assign both transaction object and connection
                // to Command object for a pending local transaction
                command.Connection = _con;
                command.Transaction = transaction;
                command.CommandText = "Insert into StaendePartienWerte (PartieId, IstDran, Werte) VALUES ((SELECT CAST(max(id) as INT) from Partien), 'W', 'Start');";
                command.ExecuteNonQuery();
                transaction.Commit();
            }
            catch (Exception e)
            {
                int i = 0;
            }

            Close();
        }

        public static string UpdateSpielstand(int spielId, string istDran, string werte)
        {
            Connect();
            

            try
            {
                SqlCommand command = _con.CreateCommand();
                SqlTransaction transaction;
                // Start a local transaction.
                transaction = _con.BeginTransaction(IsolationLevel.ReadCommitted);
                // Must assign both transaction object and connection
                // to Command object for a pending local transaction
                command.Connection = _con;
                command.Transaction = transaction;
                command.CommandText = "UPDATE StaendePartienWerte SET IstDran = '" + istDran + "', Werte = '" + werte + "' Where PartieId = '" + spielId + "';";
                command.ExecuteNonQuery();
                transaction.Commit();
            }
            catch (Exception e)
            {
                return "error";
            }
            Close();
            return "ok";
        }

        public static int InsertAllgChatNachricht(string nachricht, string nachrichtVon)
        {
            Connect();
            SqlCommand command = _con.CreateCommand();
            SqlTransaction transaction;
            // Start a local transaction.
            transaction = _con.BeginTransaction(IsolationLevel.ReadCommitted);
            // Must assign both transaction object and connection
            // to Command object for a pending local transaction
            command.Connection = _con;
            command.Transaction = transaction;

            try
            {
                command.CommandText = "Insert into AllgChat (DatumZeit, Von, Nachricht) VALUES ('" + DateTime.Now + "', '" + nachrichtVon + "', '" + nachricht + "');";
                command.CommandText += "DELETE from Chats where SpielId in (Select SpielId from ChatsToDelete where datediff(minute, Zeitstempel, getdate())>= 1);";
                command.CommandText += "DELETE from AllgChat where datediff(hour, DatumZeit, getdate())>= 1;";
                command.CommandText += "DELETE from StaendePartienWerte where PartieId in (Select SpielId from ChatsToDelete where datediff(minute, Zeitstempel, getdate())>= 1);";
                command.CommandText += "DELETE from Zuege where SpielId in (Select SpielId from ChatsToDelete where datediff(minute, Zeitstempel, getdate())>= 1);";
                command.CommandText += "DELETE from ChatsToDelete where datediff(minute, Zeitstempel, getdate())>= 1;";
                
                command.ExecuteNonQuery();
                transaction.Commit();
            }
            catch (Exception e)
            {
                int test = 0;
            }
            using (SqlCommand cmd = new SqlCommand())
            {

                cmd.Connection = _con;
                cmd.CommandType = CommandType.Text;
                cmd.CommandText = " Select @@IDENTITY;";

                SqlDataAdapter da = new SqlDataAdapter(cmd);
                DataTable dt = new DataTable();
                da.Fill(dt);
                Close();

                int objint = Int32.Parse(dt.Rows[0].ItemArray[0].ToString());

                return objint;
            }
            
        }

        public static void InsertChatNachricht(string spielId, string nachricht, string nachrichtVon)
        {
            
            try
            {
                using (SqlCommand cmd = new SqlCommand())
                {
                    Connect();
                        cmd.Connection = _con;
                        cmd.CommandType = CommandType.Text;
                        cmd.CommandText += "Insert into Chats (SpielId, NachrichtVon, Nachricht) VALUES ('" + spielId + "', '" + nachrichtVon + "', '" + nachricht + "')";
                        cmd.ExecuteNonQuery();
                    Close();
                }
            }
            catch (Exception e)
            {
                int i = 0;
            }
        }

        public static void DeleteChatNachrichten(int spielId)
        {

            try
            {
                using (SqlCommand cmd = new SqlCommand())
                {
                    Connect();
                    cmd.Connection = _con;
                    cmd.CommandType = CommandType.Text;
                    cmd.CommandText = "DELETE from Chats where SpielId = '" + spielId + "';";
                    cmd.ExecuteNonQuery();
                    Close();
                }
            }
            catch (Exception e)
            {
                int i = 0;
            }
        }


        public static List<ChatAllgNachricht> ReadAllgChatNachrichten(int id)
        {
            Connect();
            List<ChatAllgNachricht> liste = new List<ChatAllgNachricht>();
            try
            {
                using (SqlCommand cmd = new SqlCommand())
                {

                    cmd.Connection = _con;
                    cmd.CommandType = CommandType.Text;
                    cmd.CommandText = "SELECT * FROM AllgChat where id > '" + id + "'  order by id desc";

                    SqlDataAdapter da = new SqlDataAdapter(cmd);
                    DataTable dt = new DataTable();
                    da.Fill(dt);

                    foreach (DataRow row in dt.Rows)
                    {
                        liste.Add(new ChatAllgNachricht(row.Field<DateTime>(1), row.Field<string>(2), row.Field<string>(3), row.Field<int>(0)));
                    }
                }
            }
            catch (Exception)
            {


            }
            Close();
            return liste;
        }

        public static int SchaueNachLetzterPartieId()
        {
            Connect();
            int returner = 0;
            try
            {
                using (SqlCommand cmd = new SqlCommand())
                {

                    cmd.Connection = _con;
                    cmd.CommandType = CommandType.Text;
                    cmd.CommandText = "SELECT * FROM Partien";

                    SqlDataAdapter da = new SqlDataAdapter(cmd);
                    DataTable dt = new DataTable();
                    da.Fill(dt);
                    int test = dt.Rows.Count - 1;
                    returner =  dt.Rows[test].Field<int>(0);
                }
            }
            catch (Exception ex)
            {
                var test = 0;

            }
            Close();
            return returner;
        }

        public static int SchaueNachPartie(string spielerGuid) {
            Connect();
            try
            {
                using (SqlCommand cmd = new SqlCommand())
                {

                    cmd.Connection = _con;
                    cmd.CommandType = CommandType.Text;
                    cmd.CommandText = "SELECT * FROM Partien where SpielerSchwarzGuid = '" + spielerGuid + "' AND SpielerSchwarzBestaetigt = 'false'";

                    SqlDataAdapter da = new SqlDataAdapter(cmd);
                    DataTable dt = new DataTable();
                    da.Fill(dt);

                    if(dt.Rows.Count > 0)
                    {
                        Close();
                        return dt.Rows[0].Field<int>(0);
                    }

                }
            }
            catch (Exception ex)
            {
                var test = 0;

            }
            Close();
            return 0;
        }

        public static bool SchaueNachPartieBestaetigung(int spielId)
        {
            Connect();
            bool returner = false;
            try
            {
                using (SqlCommand cmd = new SqlCommand())
                {

                    cmd.Connection = _con; 
                    cmd.CommandType = CommandType.Text;
                    cmd.CommandText = "SELECT * FROM Partien where id = '" + spielId + "' AND SpielerSchwarzBestaetigt = 'true'";

                    SqlDataAdapter da = new SqlDataAdapter(cmd);
                    DataTable dt = new DataTable();
                    da.Fill(dt);

                    returner = dt.Rows.Count > 0;

                }
            }
            catch (Exception ex)
            {
                var test = 0;

            }
            Close();
            return returner;
        }

        public static List<Benutzer> ReadBenutzerData()
        {
            Connect();
            List<Benutzer> liste = new List<Benutzer>();
            try
            {
                using (SqlCommand cmd = new SqlCommand())
                {
                    
                    cmd.Connection = _con;
                    cmd.CommandType = CommandType.Text;
                    cmd.CommandText = "SELECT * FROM Benutzer";

                    SqlDataAdapter da = new SqlDataAdapter(cmd);
                    DataTable dt = new DataTable();
                    da.Fill(dt);

                    foreach (DataRow row in dt.Rows)
                    {
                        liste.Add(new Benutzer(row.Field<string>(0), row.Field<string>(1), row.Field<string>(2), row.Field<bool>(3)));
                    }
                }
            }
            catch (Exception e)
            {
                int i = 0;
            }
            Close();
            return liste;
        }

        public static List<ChatNachricht> ReadChatNachrichten(int spielId)
        {
            Connect();
            List<ChatNachricht> liste = new List<ChatNachricht>();
            try
            {
                using (SqlCommand cmd = new SqlCommand())
                {

                    cmd.Connection = _con;
                    cmd.CommandType = CommandType.Text;
                    cmd.CommandText = "SELECT * FROM Chats where SpielId = '" + spielId +"' order by id desc";

                    SqlDataAdapter da = new SqlDataAdapter(cmd);
                    DataTable dt = new DataTable();
                    da.Fill(dt);

                    foreach (DataRow row in dt.Rows)
                    {
                        liste.Add(new ChatNachricht(row.Field<int>(1), row.Field<string>(2), row.Field<string>(3)));
                    }
                }
            }
            catch (Exception)
            {


            }
            Close();
            return liste;
        }

        public static List<Benutzer> ReadBenutzerData(string guid)
        {
            Connect();
            List<Benutzer> liste = new List<Benutzer>();
            try
            {
                using (SqlCommand cmd = new SqlCommand())
                {

                    cmd.Connection = _con;
                    cmd.CommandType = CommandType.Text;
                    cmd.CommandText = "SELECT * FROM Benutzer where guid != '" + guid + "' AND istAktiv = 'true'";

                    SqlDataAdapter da = new SqlDataAdapter(cmd);
                    DataTable dt = new DataTable();
                    da.Fill(dt);

                    foreach (DataRow row in dt.Rows)
                    {
                        liste.Add(new Benutzer(row.Field<string>(0), row.Field<string>(1), row.Field<string>(2), row.Field<bool>(3)));
                    }
                }
            }
            catch (Exception)
            {


            }
            Close();
            return liste;
        }

        public static Benutzer ReadSingleBenutzerData(string guid)
        {
            Connect();
            List<Benutzer> liste = new List<Benutzer>();
            try
            {
                using (SqlCommand cmd = new SqlCommand())
                {

                    cmd.Connection = _con;
                    cmd.CommandType = CommandType.Text;
                    cmd.CommandText = "SELECT * FROM Benutzer where guid = '" + guid + "'";

                    SqlDataAdapter da = new SqlDataAdapter(cmd);
                    DataTable dt = new DataTable();
                    da.Fill(dt);

                    Close();
                    return (new Benutzer(dt.Rows[0].Field<string>(0), dt.Rows[0].Field<string>(1), dt.Rows[0].Field<string>(2), dt.Rows[0].Field<bool>(3)));
                    
                }
            }
            catch (Exception e)
            {
                int i = 0;
            }
            Close();
            return null;
        }

        public static void BenutzerAbmelden(string guid)
        {  
            Connect();
            try
            {
                using (SqlCommand cmd = new SqlCommand())
                {
                    cmd.Connection = _con;
                    cmd.CommandType = CommandType.Text;
                    cmd.CommandText = "Update Benutzer Set istAktiv = 'false' Where guid = '" + guid + "'";
                    cmd.ExecuteNonQuery();
                }
            }
            catch (Exception e)
            {
                int i = 0;
            }
            Close();
            
        }

        public static Benutzer BenutzerAnmelden(string email, string passwort) {
            foreach (Benutzer user in ReadBenutzerData())
            {
                if (user.Mailadresse.Equals(email) && user.Passwort.Equals(passwort)) {
                    Connect();
                    
                    try
                    {
                        using (SqlCommand cmd = new SqlCommand())
                        {
                            cmd.Connection = _con;
                            cmd.CommandType = CommandType.Text;
                            cmd.CommandText = "Update Benutzer Set istAktiv = 'true' Where guid = '" + user.Guid + "'";
                            cmd.ExecuteNonQuery();
                        }
                    }
                    catch (Exception e)
                    {
                        int i = 0;
                    }
                    Close();
                    return user;
                }
            }
            return null;
        }

        public static string GetNamenMitspieler(int id) {
            Connect();
            try
            {
                using (SqlCommand cmd = new SqlCommand())
                {

                    cmd.Connection = _con;
                    cmd.CommandType = CommandType.Text;
                    cmd.CommandText = "SELECT * FROM Partien where id = '" + id + "'";

                    SqlDataAdapter da = new SqlDataAdapter(cmd);
                    DataTable dt = new DataTable();
                    da.Fill(dt);

                    string valWeiss = dt.Rows[0].Field<string>(1);
                    cmd.CommandText = "SELECT email FROM Benutzer where guid = '" + valWeiss + "'";
                    SqlDataAdapter da2 = new SqlDataAdapter(cmd);
                    DataTable dt2 = new DataTable();
                    da2.Fill(dt2);


                    string valSchwarz = dt.Rows[0].Field<string>(2);
                    cmd.CommandText = "SELECT email FROM Benutzer where guid = '" + valSchwarz + "'";
                    SqlDataAdapter da3 = new SqlDataAdapter(cmd);
                    DataTable dt3 = new DataTable();
                    da3.Fill(dt3);

                    Close();
                    return dt2.Rows[0].Field<string>(0) +";"+ dt3.Rows[0].Field<string>(0);     
                }
            }
            catch (Exception ex)
            {

                int test = 0;
            }

            Close();
            return "";
        }

        public static string ErmittleFarbeSpieler(string guid, int spielId)
        {
            Connect();
            try
            {
                using (SqlCommand cmd = new SqlCommand())
                {

                    cmd.Connection = _con;
                    cmd.CommandType = CommandType.Text;
                    cmd.CommandText = "SELECT * FROM Partien where id = '" + spielId + "'";

                    SqlDataAdapter da = new SqlDataAdapter(cmd);
                    DataTable dt = new DataTable();
                    da.Fill(dt);

                    string valWeiss = dt.Rows[0].Field<string>(1);
                    string valSchwarz = dt.Rows[0].Field<string>(2);
                    Close();
                    return guid.Equals(valSchwarz) ? "S" : "W";
                }
            }
            catch (Exception ex)
            {

                int test = 0;
            }

            Close();
            return "";
        }

        public static void SetSpielerSchwarzBestaetigt(int id) {
            Connect();
            try
            {
                using (SqlCommand cmd = new SqlCommand())
                {

                    cmd.Connection = _con;
                    cmd.CommandType = CommandType.Text;
                    cmd.CommandText = "Update Partien Set SpielerSchwarzBestaetigt = 'true'  where id = '" + id + "'";
                    cmd.ExecuteNonQuery();
                }
            }
            catch (Exception ex)
            {
                int test = 0;
            }
            Close();
        }

    }
}