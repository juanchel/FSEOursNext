package edu.cmu.sv.ws.ssnoc.rest;

import edu.cmu.sv.ws.ssnoc.data.dao.DAOFactory;
import edu.cmu.sv.ws.ssnoc.data.po.MemoryPO;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
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

