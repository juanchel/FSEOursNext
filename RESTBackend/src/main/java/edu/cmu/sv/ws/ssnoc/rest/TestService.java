package edu.cmu.sv.ws.ssnoc.rest;

import edu.cmu.sv.ws.ssnoc.common.utils.ConverterUtils;
import edu.cmu.sv.ws.ssnoc.data.dao.DAOFactory;
import edu.cmu.sv.ws.ssnoc.data.po.MessagePO;
import edu.cmu.sv.ws.ssnoc.dto.Message;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by vinayvenkatesh on 10/12/14.
 */
@Path("/test")
public class TestService extends BaseService{
    @POST
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    @Path("/start/{seconds}")
    public Response start (@PathParam("seconds") String seconds) {
        List<Message> messages = null;

        try {
            DAOFactory.getInstance().getMessageDAO().startTest(Integer.parseInt(seconds));
        } catch (Exception e) {
            handleException(e);
        } finally {

        }

        return ok();
    }

    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    @Path("/end/")
    public TestResults end () {
        List<Message> messages = null;

        try {
            List<MessagePO> messagePOs = DAOFactory.getInstance().getMessageDAO().loadPrivateMessages(author, target);

            messages = new ArrayList<Message>();
            for (MessagePO po : messagePOs) {
                Message dto = ConverterUtils.convert(po);
                messages.add(dto);
            }
        } catch (Exception e) {
            handleException(e);
        } finally {

        }

        return messages;
    }

}

