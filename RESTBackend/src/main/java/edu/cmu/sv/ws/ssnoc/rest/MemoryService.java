package edu.cmu.sv.ws.ssnoc.rest;

import edu.cmu.sv.ws.ssnoc.common.utils.ConverterUtils;
import edu.cmu.sv.ws.ssnoc.data.dao.DAOFactory;
import edu.cmu.sv.ws.ssnoc.data.dao.IMessageDAO;
import edu.cmu.sv.ws.ssnoc.data.po.MemoryPO;
import edu.cmu.sv.ws.ssnoc.data.po.MessagePO;
import edu.cmu.sv.ws.ssnoc.dto.Message;
import edu.cmu.sv.ws.ssnoc.dto.TestResult;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.io.File;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Path("/memory")
public class MemoryService extends BaseService{

    @POST
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    @Path("/start")
    public Response start () {
        try {
            DAOFactory.getInstance().getMemoryDAO().start();
        } catch (Exception e) {
            handleException(e);
        } finally {

        }

        return ok();
    }

    @POST
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    @Path("/save")
    public Response save () {
        try {
            DAOFactory.getInstance().getMemoryDAO().save();
        } catch (Exception e) {
            handleException(e);
        } finally {

        }

        return ok();
    }

    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    @Path("/end")
    public List<MemoryPO> endTest () {

        List<MemoryPO> memory = null;
        try {
            memory = DAOFactory.getInstance().getMemoryDAO().end();

        } catch (Exception e) {
            handleException(e);
        } finally {

        }

        return memory;
    }

}

