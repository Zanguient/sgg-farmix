﻿using sgg_farmix_acceso_datos.Helper;
using sgg_farmix_acceso_datos.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace sgg_farmix_acceso_datos.DAOs
{
    public class RodeoManager : IManager<Rodeo>
    {
        private SqlServerConnection connection;
        public Rodeo Create(Rodeo entity)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<Rodeo> GetList()
        {
            try
            {
                connection = new SqlServerConnection();
                var lista = connection.GetArray<Rodeo>("spGetRodeos", null, System.Data.CommandType.StoredProcedure);
                return lista;
            }
            catch (Exception ex)
            {
                return null;
            }
            finally
            {
                connection.Close();
            }
        }

        public void Delete(long id)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<Rodeo> Get(Rodeo entity)
        {
            throw new NotImplementedException();
        }

        public Rodeo Get(long id)
        {
            throw new NotImplementedException();
        }

        public Rodeo GetFilter()
        {
            throw new NotImplementedException();
        }

        public Rodeo Update(long id, Rodeo entity)
        {
            throw new NotImplementedException();
        }
    }
}