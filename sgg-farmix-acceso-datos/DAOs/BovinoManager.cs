﻿using sgg_farmix_acceso_datos.Helper;
using sgg_farmix_acceso_datos.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace sgg_farmix_acceso_datos.DAOs
{
    public class BovinoManager : IManager<Bovino>
    {
        private SqlServerConnection connection;
        public Bovino Create(Bovino entity)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@numCaravana", entity.numCaravana },
                    {"@apodo", (entity.apodo == null ? null : entity.apodo) },
                    {"@descripcion", (entity.descripcion == null ? null : entity.descripcion) },
                    {"@fechaNac", entity.fechaNacimiento },
                    {"@genero", entity.genero },
                    {"@peso", entity.peso },
                    {"@pesoAlNacer", (entity.pesoAlNacer == 0 ? 0 : entity.pesoAlNacer) },                   
                    { "@idCategoria", entity.idCategoria },
                    { "@idRaza", entity.idRaza },
                    { "@idRodeo", entity.idRodeo },
                    { "@idEstado", entity.idEstado },
                    { "@borrado", 0 }
            };
                if(entity.idBovinoMadre != 0)
                    parametros.Add("@idBovinoMadre", entity.idBovinoMadre);
                if(entity.idBovinoPadre != 0)                   
                    parametros.Add("@idBovinoPadre", entity.idBovinoPadre);
                if (entity.idEstablecimientoOrigen != 0)
                    parametros.Add("@idEstabOrigen", entity.idEstablecimientoOrigen);
                
                entity.idBovino = connection.Execute("spRegistrarBovino", parametros, System.Data.CommandType.StoredProcedure);
                if (entity.idBovino == 0)
                    throw new ArgumentException("Create Bovino Error");
                else if (entity.idBovino == 1)
                    throw new ArgumentException("Bovino ya existe");
                return entity;
            }
            catch (Exception ex)
            {
                throw;
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

        public IEnumerable<Bovino> Get(Bovino entity)
        {
            throw new NotImplementedException();
        }

        public Bovino Get(long id)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@idBovino", id }
                };
                var bovino = connection.GetObject<Bovino>("", parametros, System.Data.CommandType.StoredProcedure);
                return bovino;
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

        public Bovino GetFilter()
        {
            throw new NotImplementedException();
        }

        public Bovino Update(long id, Bovino entity)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@idBovino", id },
                    {"@numCaravana", entity.numCaravana },
                    {"@apodo", entity.apodo },
                    {"@desc", entity.descripcion },
                    {"@fechaNac", entity.fechaNacimiento },
                    {"@genero", entity.genero },
                    {"@peso", entity.peso },
                    {"@pesoNacer", entity.pesoAlNacer },
                    {"@fechaMuerte", entity.fechaMuerte },
                    {"idCatego", entity.idCategoria },
                    {"@idRodeo", entity.idRodeo },
                    {"@idEstabOrigen", entity.idEstablecimientoOrigen },
                    {"@idEstado", entity.idEstado }
                };
                var update = connection.Execute("", parametros, System.Data.CommandType.StoredProcedure);
                if (update == 0)
                {
                    throw new ArgumentException("Update bovino error");
                }
                return entity;
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

        public int Borrar(long id)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@idBovino", id },
                    {"borrado", 1 }
                };
                var borrado = connection.Execute("", parametros, System.Data.CommandType.StoredProcedure);
                if (borrado == 0)
                    throw new ArgumentException("Delete bovino error");
                return borrado;
            }
            catch (Exception)
            {
                return 0;
            }
            finally
            {
                connection.Close();
            }
        }

        public IEnumerable<Bovino> GetList(BovinoFilter filter)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {

                };
                var lista = connection.GetArray<Bovino>("", parametros, System.Data.CommandType.StoredProcedure);
                return lista.ToList();
            }
            catch (Exception)
            {
                return null;
            }
            finally
            {
                connection.Close();
            }
        }
    }
}
