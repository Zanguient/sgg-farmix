﻿using iTextSharp.text;
using iTextSharp.text.html.simpleparser;
using iTextSharp.text.pdf;
using sgg_farmix_acceso_datos.Helper;
using sgg_farmix_acceso_datos.Model;
using sgg_farmix_helper;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using static iTextSharp.text.Font;

namespace sgg_farmix_acceso_datos.DAOs
{
    public class BovinoManager : IManager<Bovino>
    {
        private SqlServerConnection connection;
        public Bovino Create(Bovino entity)
        {
            connection = new SqlServerConnection();
            DbTransaction transaction = connection.BeginTransaction();
            try
            {
                var parametros = new Dictionary<string, object>
                {
                    {"@numCaravana", entity.numCaravana },
                    {"@apodo", (entity.apodo == null ? null : entity.apodo) },
                    {"@descripcion", (entity.descripcion == null ? null : entity.descripcion) },
                    {"@fechaNac", entity.fechaNacimiento },
                    {"@genero", entity.genero },
                    {"@peso", entity.peso },
                    { "@idCategoria", entity.idCategoria },
                    { "@idRaza", entity.idRaza },
                    { "@idRodeo", entity.idRodeo },
                    { "@idEstado", entity.idEstado },
                    { "@borrado", 0 },
                    { "@codigoCampo", entity.codigoCampo },
                    { "@enfermo", entity.enfermo }
                };
                if (entity.pesoAlNacer != 0)
                    parametros.Add("@pesoAlNacer", entity.pesoAlNacer);
                if (entity.idBovinoMadre != 0)
                    parametros.Add("@idBovinoMadre", entity.idBovinoMadre);
                if (entity.idBovinoPadre != 0)
                    parametros.Add("@idBovinoPadre", entity.idBovinoPadre);
                if (entity.idEstablecimientoOrigen != 0)
                    parametros.Add("@idEstabOrigen", entity.idEstablecimientoOrigen);

                entity.idBovino = connection.Execute("spRegistrarBovino", parametros, System.Data.CommandType.StoredProcedure, transaction);
                if (entity.idBovino == 0)
                    throw new ArgumentException("Create Bovino Error");
                else if (entity.idBovino == -1)
                    throw new ArgumentException("Bovino ya existe");
                else if (entity.idBovino > 0 && entity.idNacimiento > 0)
                {
                    parametros = new Dictionary<string, object>()
                    {
                        {"@idNacimiento", entity.idNacimiento }
                    };
                    var delete = connection.Execute("spDeleteNacimiento", parametros, System.Data.CommandType.StoredProcedure, transaction);
                }
                var fechaHora = DateTime.Now.ToString("yyyyMMddHHmmss");
                var parametrosEvento = new Dictionary<string, object>
                {
                    {"@cant", entity.cantAlimento },
                    {"@idTipoEvento", 4 },
                    {"@fechaHora", fechaHora },
                    {"@idAlimento", entity.idAlimento }
                };
                var idEvento = connection.Execute("spRegistrarEvento", parametrosEvento, System.Data.CommandType.StoredProcedure, transaction);
                if (idEvento == 0)
                    throw new ArgumentException("Create Evento Error");
                parametrosEvento = new Dictionary<string, object>
                {
                    {"@idBovino", entity.idBovino },
                    {"@idEvento", idEvento },
                    {"@idTipoEvento", 4 },
                    {"@fechaHora", fechaHora },
                    {"@cantAlimento", entity.cantAlimento }
                };
                var insert = connection.Execute("spRegistrarEventosXBovino", parametrosEvento, System.Data.CommandType.StoredProcedure, transaction);
                if (insert == 0)
                    throw new ArgumentException("Create EventosXBovino Error");
                //parametros = null;
                parametrosEvento = new Dictionary<string, object>
                {
                    {"@codigoCampo", entity.codigoCampo },
                    {"@idRodeoDestino", entity.idRodeo },
                    {"@idTipoEvento", 3 },
                    {"@fechaHora", fechaHora }
                };
                idEvento = connection.Execute("spRegistrarEvento", parametrosEvento, System.Data.CommandType.StoredProcedure, transaction);
                parametrosEvento = new Dictionary<string, object>
                {
                    {"@idBovino", entity.idBovino },
                    {"@idEvento", idEvento },
                    {"@idTipoEvento", 3 },
                    {"@fechaHora", fechaHora },
                    {"@idRodeoDestino", entity.idRodeo }
                };
                insert = connection.Execute("spRegistrarEventosXBovino", parametrosEvento, System.Data.CommandType.StoredProcedure, transaction);
                if (insert == 0)
                    throw new ArgumentException("Create EventosXBovino Error");
                if (idEvento == 0)
                    throw new ArgumentException("Create Evento Error");
                connection.Commit(transaction);
                return entity;
            }
            catch (Exception ex)
            {
                connection.Rollback(transaction);
                throw;
            }
            finally
            {
                connection.Close();
                connection = null;
                transaction = null;
            }
        }

        public string ValidarCaravana(long numCaravana, long codigoCampo)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@numCaravana", numCaravana },
                    {"@codigoCampo", codigoCampo }
                };
                var resultado = connection.Execute("spValidarCaravana", parametros, System.Data.CommandType.StoredProcedure);
                if (resultado == 1) //existe ese numero de caravana ya en el sistema para ese campo
                    return "1";
                else
                    return "0";
            }
            catch (Exception ex)
            {
                throw;
            }
            finally
            {
                connection.Close();
                connection = null;
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

        public Bovino Get(long id, long codigoCampo)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@idBovino", id },
                    {"@codigoCampo", codigoCampo }
                };
                var bovino = connection.GetArray<Bovino>("spObtenerDatosBovino", parametros, System.Data.CommandType.StoredProcedure).FirstOrDefault();
                return bovino;
            }
            catch (Exception ex)
            {
                throw;
            }
            finally
            {
                connection.Close();
                connection = null;
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
                    //{"@fechaMuerte", entity.fechaMuerte },
                    {"@idCatego", entity.idCategoria },
                    {"@idRaza", entity.idRaza },
                    {"@idRodeo", entity.idRodeo },
                    {"@idEstado", entity.idEstado },
                    {"@idAlimento", entity.idAlimento },
                    {"@cantAlimento", entity.cantAlimento },
                    {"@codigoCampo", entity.codigoCampo },
                    {"@enfermo", entity.enfermo }
                };
                if (entity.pesoAlNacer != 0)
                    parametros.Add("@pesoAlNacer", entity.pesoAlNacer);
                if (entity.idBovinoMadre != 0)
                    parametros.Add("@idBovinoMadre", entity.idBovinoMadre);
                if (entity.idBovinoPadre != 0)
                    parametros.Add("@idBovinoPadre", entity.idBovinoPadre);
                if (entity.idEstablecimientoOrigen != 0)
                    parametros.Add("@idEstabOrigen", entity.idEstablecimientoOrigen);

                var update = connection.Execute("spModificarBovino", parametros, System.Data.CommandType.StoredProcedure);
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
                connection = null;
            }
        }

        public int Borrar(long id, long codigoCampo)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@idBovino", id },
                    {"@codigoCampo", codigoCampo }
                };
                var update = connection.Execute("spDeleteBovino", parametros, System.Data.CommandType.StoredProcedure);
                if (update == 0)
                    throw new ArgumentException("Baja de bovino por muerte error");
                return 1;
            }
            catch (Exception ex)
            {
                throw;
            }
            finally
            {
                connection.Close();
                connection = null;
            }
        }

        public IEnumerable<BovinoItem> GetList(BovinoFilter filter)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@idCatego", filter.idCategoria },
                    {"@genero", filter.genero },
                    {"@idRaza", filter.idRaza },
                    {"@idRodeo", filter.idRodeo },
                    {"@idEstado", filter.idEstado },
                    {"@peso", filter.peso },
                    {"@accionPeso", (filter.accionPeso == "0" ? null : filter.accionPeso) },
                    {"@idCampo", filter.codigoCampo },
                    {"@periodo", filter.periodo }
                };
                if (filter.numCaravana != 0)
                    parametros.Add("@numCaravana", filter.numCaravana.ToString());
                var lista = connection.GetArray<BovinoItem>("spObtenerListaBovinos", parametros, System.Data.CommandType.StoredProcedure);
                return lista.ToList();
            }
            catch (Exception ex)
            {
                throw;
            }
            finally
            {
                connection.Close();
                connection = null;
            }
        }

        public BovinoDetalle GetDetalle(long id)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@idBovino", id }
                };
                var bovino = connection.GetArray<BovinoDetalle>("spObtenerDetalleBovino", parametros, System.Data.CommandType.StoredProcedure).FirstOrDefault();
                return bovino;
            }
            catch (Exception ex)
            {
                throw;
            }
            finally
            {
                connection.Close();
                connection = null;
            }
        }

        public BovinoHeaderEliminar GetDetalleBaja(long id)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@idBovino", id }
                };
                var bovino = connection.GetArray<BovinoHeaderEliminar>("spObtenerHeaderBaja", parametros, System.Data.CommandType.StoredProcedure).FirstOrDefault();
                return bovino;
            }
            catch (Exception ex)
            {
                throw;
            }
            finally
            {
                connection.Close();
                connection = null;
            }
        }

        public void DeleteMuerte(long id, string fechaMuerte, long codigoCampo)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@idBovino", id },
                    {"@fechaMuerte", fechaMuerte },
                    {"@codigoCampo", codigoCampo }
                };
                var update = connection.Execute("spBajaBovinoMuerte", parametros, System.Data.CommandType.StoredProcedure);
                if (update == 0)
                    throw new ArgumentException("Baja de bovino por muerte error");
            }
            catch (Exception ex)
            {
                throw;
            }
            finally
            {
                connection.Close();
                connection = null;
            }
        }

        public void DeleteVenta(Venta entity)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@idBovino", entity.idBovino},
                    {"@idEstabDestino", entity.idEstablecimientoDestino},
                    {"@monto", entity.monto},
                    {"@codigoCampo", entity.codigoCampo }
                };
                entity.idVenta = connection.Execute("spRegistrarVenta", parametros, System.Data.CommandType.StoredProcedure);
                if (entity.idVenta == 0)
                    throw new ArgumentException("Create Bovino Error");
            }
            catch (Exception ex)
            {
                throw;
            }
            finally
            {
                connection.Close();
                connection = null;
            }
        }

        public IEnumerable<TagBovino> GetTags(long codigoCampo)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>{
                    { "@codigoCampo", codigoCampo}
                };
                var listaTags = connection.GetArray<TagBovino>("spGetTagsBovinos", parametros, System.Data.CommandType.StoredProcedure);
                return listaTags;
            }
            catch (Exception ex)
            {
                throw;
            }
            finally
            {
                connection.Close();
                connection = null;
            }
        }

        public bool EscribirTag(long idBovino)
        {
            try
            {
                bool ban = true;
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@idBovino", idBovino }
                };
                var si = connection.Execute("spActualizarEscritoTag", parametros, System.Data.CommandType.StoredProcedure);
                if (si == 0)
                {
                    ban = false;
                    throw new ArgumentException("Update Error");
                }
                else if (si == -1)
                {
                    ban = false;
                    throw new ArgumentException("Bovino no existe");
                }
                return ban;
            }
            catch (Exception ex)
            {
                throw;
            }
            finally
            {
                connection.Close();
                connection = null;
            }
        }

        public Bovino Get(long id)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<Provincia> GetProvincias()
        {
            try
            {
                connection = new SqlServerConnection();
                var lista = connection.GetArray<Provincia>("spObtenerListaProvincias", null, System.Data.CommandType.StoredProcedure);
                return lista.ToList();
            }
            catch (Exception ex)
            {
                throw;
            }
            finally
            {
                connection.Close();
                connection = null;
            }
        }

        public IEnumerable<Localidad> GetLocalidades()
        {
            try
            {
                connection = new SqlServerConnection();
                var lista = connection.GetArray<Localidad>("spObtenerListaLocalidades", null, System.Data.CommandType.StoredProcedure);
                return lista.ToList();
            }
            catch (Exception ex)
            {
                throw;
            }
            finally
            {
                connection.Close();
                connection = null;
            }
        }

        public ResultadoValidacionCampo ValidarCantidadBovinos(long campo)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@codigoCampo", campo }
                };
                var resultado = connection.GetArray<ResultadoValidacionCampo>("spValidarCantidadBovinosXAdmin", parametros, System.Data.CommandType.StoredProcedure);
                return resultado.First();
            }
            catch (Exception ex)
            {
                throw;
            }
            finally
            {
                connection.Close();
                connection = null;
            }
        }

        public IEnumerable<ReporteBovinos> GetReporte(long codigoCampo, string periodo)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@codigoCampo", codigoCampo },
                    {"@periodo", periodo }
                };
                var lista = connection.GetArray<ReporteBovinos>("spObtenerDatosReporteBovinos", parametros, System.Data.CommandType.StoredProcedure);
                return lista.ToList();
            }
            catch (Exception ex)
            {
                throw;
            }
            finally
            {
                connection.Close();
                connection = null;
            }
        }

        public int CreateNacimiento(string fecha, List<long> madres, long idToro, long codigoCampo)
        {
            connection = new SqlServerConnection();
            try
            {
                var parametros = new Dictionary<string, object>
                {
                    {"@fechaNacimiento", fecha },
                    {"@codigoCampo", codigoCampo },
                    {"@idBovinoMadre", null },
                    {"@idBovinoPadre", null }
                };
                for (int i = 0; i < madres.Count(); i++)
                {
                    parametros["@idBovinoMadre"] = madres.ElementAt(i);
                    if (idToro != 0)
                        parametros["@idBovinoPadre"] = idToro;
                    var insert = connection.Execute("spRegistrarNacimiento", parametros, System.Data.CommandType.StoredProcedure);
                    if (insert == 0)
                        throw new ArgumentException("Create Nacimiento Error");
                }
                return 1;
            }
            catch (Exception ex)
            {
                throw;
            }
            finally
            {
                connection.Close();
                connection = null;
            }
        }

        public Bovino GetDatosBovinoNacido(long idNac)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@idNacimiento", idNac }
                };
                var bovino = connection.GetArray<Bovino>("spObtenerBovinoNacido", parametros, System.Data.CommandType.StoredProcedure).FirstOrDefault();
                return bovino;
            }
            catch (Exception ex)
            {
                throw;
            }
            finally
            {
                connection.Close();
                connection = null;
            }
        }

        public Documento ReporteBovinosExportarPDF(string campo, long codigoCampo, string periodo)
        {
            FileStream fs;
            Document doc = null;
            PdfWriter writer;
            try
            {
                doc = new Document();
                // Verifico el directorio
                string filePath = System.IO.Path.Combine(HttpRuntime.AppDomainAppPath, "Archivos\\");
                if (!Directory.Exists(filePath)) Directory.CreateDirectory(filePath);

                var fecha = DateTime.Now.ToString("dd-MM-yyyy");
                // Nombre del archivo
                string fileName = string.Format("{0}-{1}-{2}.pdf", "ReporteBovinos", campo, fecha);
                // Generación del PDF
                fs = new FileStream(System.IO.Path.Combine(filePath, fileName), FileMode.Create, FileAccess.Write, FileShare.None);

                writer = PdfWriter.GetInstance(doc, fs);
                doc.Open();
                string pathImg1 = System.IO.Path.Combine(HttpRuntime.AppDomainAppPath, "Archivos\\logo_farmix.jpg");
                Image image1;
                if (Image.GetInstance(pathImg1) != null)
                {
                    image1 = Image.GetInstance(pathImg1);
                    image1.ScalePercent(24F);
                    image1.Alignment = Element.ALIGN_CENTER;
                    doc.Add(image1);
                }
                //añadimos linea negra abajo de las imagenes para separar.
                doc.Add(new Paragraph(new Chunk(new iTextSharp.text.pdf.draw.LineSeparator(2.0F, 100.0F, BaseColor.BLACK, Element.ALIGN_LEFT, 1))));
                doc.Add(new Paragraph(" "));
                //Inicio datos
                var lista = GetReporte(codigoCampo, periodo);
                Font fuente1 = new Font(FontFamily.TIMES_ROMAN, 12.0f, Font.BOLD, BaseColor.BLACK);
                Font fuente2 = new Font(FontFamily.TIMES_ROMAN, 14.0f, Font.BOLD, BaseColor.BLACK);
                Rectangle rect = PageSize.LETTER;
                List<IElement> ie;
                float pageWidth = rect.Width;
                string html = "";
                html = @"
                            <html><head></head><body>
                            <table>
                            <tr><td><b>Reporte Bovinos</b></td></tr>
                            <tr><td>Campo: <b>" + campo + @"</b></td></tr>                   
                            </table>
                            </body></html>";
                ie = HTMLWorker.ParseToList(new StringReader(html), null);
                foreach (IElement element in ie)
                {
                    PdfPTable table1 = element as PdfPTable;

                    if (table1 != null)
                    {
                        table1.SetWidthPercentage(new float[] { (float)1 * pageWidth }, rect);
                    }
                    doc.Add(element);
                }
                doc.Add(new Paragraph(" "));
                if (lista.Count() > 0)
                {
                    html = @"
                            <html><head></head><body>
                            <table border='1'>
                            <thead>
                            <tr>
                            <th>Orden</th>
                            <th>Caravana</th>       
                            <th>Sexo</th>        
                            <th>Raza</th>         
                            <th>Categoría</th>          
                            <th>Edad</th>           
                            <th>Peso(Kg)</th>            
                            <th>Estado</th>             
                            <th>Enfermo</th>              
                            <th>Rodeo</th>               
                            </tr>               
                            </thead>
                            <tbody>";
                    foreach (var item in lista)
                    {
                        html += @"<tr><td>" + item.nroOrden + @"</td><td>" + item.numCaravana + @"</td><td>" + item.sexo + @"</td><td>" + item.raza + @"</td><td>" + item.categoria + @"</td><td>" + item.anos + @", " + item.meses + @"</td><td>" + item.peso + @"</td><td>" + item.estado + @"</td><td>" + item.enfermo + @"</td><td>" + item.rodeo + @"</td></tr>";
                    }
                    html += @"</tbody></table>
                            </body></html> ";
                    ie = HTMLWorker.ParseToList(new StringReader(html), null);
                    foreach (IElement element in ie)
                    {
                        PdfPTable table = element as PdfPTable;

                        if (table != null)
                        {
                            table.SetWidthPercentage(new float[] { (float).08 * pageWidth, (float).12 * pageWidth, (float).1 * pageWidth, (float).12 * pageWidth, (float).12 * pageWidth, (float).07 * pageWidth, (float).12 * pageWidth, (float).12 * pageWidth, (float).1 * pageWidth, (float).1 * pageWidth }, rect);
                        }
                        doc.Add(element);
                    }
                }
                doc.Close();
                return new Documento() { nombre = fileName };
            }
            catch (Exception ex)
            {
                doc.Close();
                throw ex;
            }
            finally
            {
                fs = null;
                doc = null;
                writer = null;
            }
        }

        public Documento ReporteBovinosExportarExcel(string campo, long codigoCampo, string periodo)
        {
            DataTable tabla = new DataTable();
            try
            {
                var lista = GetReporte(codigoCampo, periodo);
                tabla.Columns.Add("Orden");
                tabla.Columns.Add("Caravana");
                tabla.Columns.Add("Sexo");
                tabla.Columns.Add("Raza");
                tabla.Columns.Add("Categoría");
                tabla.Columns.Add("Edad");
                tabla.Columns.Add("Peso (Kg)");
                tabla.Columns.Add("Estado");
                tabla.Columns.Add("Enfermo");
                tabla.Columns.Add("Rodeo");
                foreach (var item in lista)
                {
                    DataRow row = tabla.NewRow();
                    row["orden"] = item.nroOrden;
                    row["caravana"] = item.numCaravana;
                    row["sexo"] = item.sexo;
                    row["raza"] = item.raza;
                    row["categoría"] = item.categoria;
                    row["edad"] = item.anos + "," + item.meses;
                    row["peso (kg)"] = item.peso;
                    row["estado"] = item.estado;
                    row["enfermo"] = item.enfermo;
                    row["rodeo"] = item.rodeo;

                    tabla.Rows.Add(row);
                }
                var archivo = StaticFunctions.ExportToExcel(tabla, campo, "ReportesBovino");
                return new Documento() { nombre = archivo };
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {

            }
        }
    }
}
