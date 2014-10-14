package edu.cmu.sv.ws.ssnoc.rest;

import edu.cmu.sv.ws.ssnoc.common.utils.ConverterUtils;
import edu.cmu.sv.ws.ssnoc.data.dao.DAOFactory;
import edu.cmu.sv.ws.ssnoc.data.dao.IMessageDAO;
import edu.cmu.sv.ws.ssnoc.data.po.MessagePO;
import edu.cmu.sv.ws.ssnoc.dto.Message;
import edu.cmu.sv.ws.ssnoc.dto.TestResult;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.sql.ResultSet;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
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
    public TestResult endTest () {

        TestResult tr = null;
        try {
            tr = DAOFactory.getInstance().getMessageDAO().getTestResult();

        } catch (Exception e) {
            handleException(e);
        } finally {

        }

        return tr;
    }

    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    @Path("/get/")
    public List<Message> testGet () {
        List<Message> messages = null;

        try {
            List<MessagePO> messagePOs = DAOFactory.getInstance().getMessageDAO().testLoadWallMessages();

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

    @POST
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    @Path("/post/{userName}")
    public Response postOnWall (@PathParam("userName") String userName, Message m) {

        Message resp = new Message();
        m.setPublic(true);
        m.setAuthor(userName);

        Date date = new Date();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
        String ts = sdf.format(date);

        m.setTimestamp(ts);

        try {
            IMessageDAO dao = DAOFactory.getInstance().getMessageDAO();
            MessagePO po = ConverterUtils.convert(m);
            dao.testSave(po);
            resp = ConverterUtils.convert(po);
        } catch (Exception e) {
            handleException(e);
        }

        return created(resp);
    }
}

