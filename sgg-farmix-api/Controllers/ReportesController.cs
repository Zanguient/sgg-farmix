﻿using Newtonsoft.Json;
using sgg_farmix_acceso_datos.DAOs;
using sgg_farmix_acceso_datos.Model;
using sgg_farmix_helper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace sgg_farmix_api.Controllers
{
    public class ReportesController : ApiController
    {
        [Route("api/Reportes/Bovinos")]
        [HttpGet]
        [AutorizationToken]
        public IEnumerable<ReporteBovinos> GetList(long codigoCampo)
        {
            try
            {
                return new BovinoManager().GetReporte(codigoCampo);
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(new HttpResponseMessage(HttpStatusCode.NotFound)
                {
                    Content = new StringContent(string.Format("Error: {0}", ex.Message)),
                    ReasonPhrase = (ex.GetType() == typeof(ArgumentException) ? ex.Message : "Get_Error")
                });
            }
        }
    }
}