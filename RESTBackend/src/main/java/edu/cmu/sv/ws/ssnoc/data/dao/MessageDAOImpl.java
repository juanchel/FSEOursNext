package edu.cmu.sv.ws.ssnoc.data.dao;

import java.sql.Connection;
import java.sql.Timestamp;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import edu.cmu.sv.ws.ssnoc.common.logging.Log;
import edu.cmu.sv.ws.ssnoc.data.SQL;
import edu.cmu.sv.ws.ssnoc.data.po.MessagePO;
import edu.cmu.sv.ws.ssnoc.data.po.UserPO;

/**
 * DAO implementation for saving User information in the H2 database.
 *
 */
public class MessageDAOImpl extends BaseDAOImpl implements IMessageDAO {
    /**
     * This method will save the information of the user into the database.
     *
     * @param messagePO
     *            - User information to be saved.
     */
    public void save(MessagePO messagePO){
        Log.enter(messagePO);
        if (messagePO == null) {
            Log.warn("Inside save method with messagePO == NULL");
            return;
        }

        if(messagePO.getPublic()) {
            try (Connection conn = getConnection();
                 PreparedStatement stmt = conn.prepareStatement(SQL.POST_ON_WALL)) {
                stmt.setString(1, messagePO.getContent());
                stmt.setString(2, messagePO.getAuthor());
                stmt.setTimestamp(3, Timestamp.valueOf(messagePO.getTimestamp()));
                int rowCount = stmt.executeUpdate();
                Log.trace("Statement executed, and " + rowCount + " rows inserted.");
            } catch (SQLException e) {
                handleException(e);
            } finally {
                Log.exit();
            }
        }
        else
        {
            try (Connection conn = getConnection();
                 PreparedStatement stmt = conn.prepareStatement(SQL.SEND_PRIVATE_MESSAGE)) {
                stmt.setString(1, messagePO.getContent());
                stmt.setString(2, messagePO.getAuthor());
                stmt.setString(3, messagePO.getTarget());
                stmt.setString(4, messagePO.getTimestamp());
                int rowCount = stmt.executeUpdate();
                Log.trace("Statement executed, and " + rowCount + " rows inserted.");
            } catch (SQLException e) {
                handleException(e);
            } finally {
                Log.exit();
            }
        }

    }

    /**
     * This method will load all the users in the
     * database.
     *
     * @return - List of messages.
     */
     public List<MessagePO> loadWallMessages(){
         Log.enter();

         String query = SQL.GET_ALL_PUBLIC_MESSAGES;

         List<MessagePO> messages = new ArrayList<MessagePO>();
         try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(query);) {
             messages = processPublicResults(stmt);
         } catch (SQLException e) {
             handleException(e);
             Log.exit(messages);
         }
         return messages;
     }

    /**
     * This method will load all the users in the
     * database.
     *
     * @return - List of messages.
     */
    public List<MessagePO> loadPrivateMessages(String author, String target) {

        List<MessagePO> po = null;
        try (Connection conn = getConnection();
             PreparedStatement stmt = conn
                     .prepareStatement(SQL.GET_PM_BY_USER_ID)) {
            stmt.setString(1, author);
            stmt.setString(2, target);
            stmt.setString(3, target);
            stmt.setString(4, author);

            po = processPrivateResults(stmt);
        } catch (SQLException e) {
            handleException(e);
        }

        return po;
    }


    private List<MessagePO> processPublicResults(PreparedStatement stmt) {
        Log.enter(stmt);

        if (stmt == null) {
            Log.warn("Inside processMessageById method with NULL statement object.");
            return null;
        }

        Log.debug("Executing stmt = " + stmt);
        List<MessagePO> messages = new ArrayList<MessagePO>();
        try (ResultSet rs = stmt.executeQuery()) {
            while (rs.next()) {
                MessagePO po = new MessagePO();
                po = new MessagePO();
                po.setContent(rs.getString(2));
                po.setAuthor(rs.getString(3));
                po.setTimestamp(rs.getTimestamp(4).toString());
                messages.add(po);
            }
        } catch (SQLException e) {
            handleException(e);
        } finally {
            Log.exit(messages);
        }

        return messages;
    }

    private List<MessagePO> processPrivateResults(PreparedStatement stmt) {
        Log.enter(stmt);

        if (stmt == null) {
            Log.warn("Inside processMessageById method with NULL statement object.");
            return null;
        }

        Log.debug("Executing stmt = " + stmt);
        List<MessagePO> messages = new ArrayList<MessagePO>();
        try (ResultSet rs = stmt.executeQuery()) {
            while (rs.next()) {
                MessagePO po = new MessagePO();
                po = new MessagePO();
                po.setContent(rs.getString(1));
                po.setAuthor(rs.getString(2));
                po.setTarget(rs.getString(3));
                po.setTimestamp(rs.getTimestamp(4).toString());
                messages.add(po);
            }
        } catch (SQLException e) {
            handleException(e);
        } finally {
            Log.exit(messages);
        }

        return messages;
    }
    /**
     * This method will load all the users in the
     * database.
     *
     * @return - List of messages.
     */
    public List<UserPO> loadChatBuddies(String author){
        if (author == null) {
            Log.warn("Inside findByName method with NULL author.");
            return null;
        }


        System.out.print("LOADCHATB 1");

        List<UserPO> po = null;
        try (Connection conn = getConnection();
             PreparedStatement stmt = conn
                     .prepareStatement(SQL.GET_CHAT_BUDDIES)) {
            stmt.setString(1, author);
            po = processChatBuddies(stmt);
        } catch (SQLException e) {
            handleException(e);
        }


        System.out.print("LOADCHATB 2");
        return po;
    }

    private List<UserPO> processChatBuddies(PreparedStatement stmt) {
        Log.enter(stmt);

        if (stmt == null) {
            Log.warn("Inside processChatBuddies method with NULL statement object.");
            return null;
        }

        Log.debug("Executing stmt = " + stmt);
        List<UserPO> users = new ArrayList<UserPO>();
        try (ResultSet rs = stmt.executeQuery()) {
            while (rs.next()) {
                UserPO po = new UserPO();
                po.setUserName(rs.getString(1));
                users.add(po);
            }
        } catch (SQLException e) {
            handleException(e);
        } finally {
            Log.exit(users);
        }

        return users;
    }

    /**
     * This method will load all the users in the
     * database.
     *
     * @return - List of messages.
     */
    public String loadMessageById(int id){
        Log.enter(id);

//        if (id == null) {
//            Log.warn("Inside loadMessageById method with NULL id.");
//            return null;
//        }

        MessagePO po = null;
        try (Connection conn = getConnection();
             PreparedStatement stmt = conn
                     .prepareStatement(SQL.GET_MESSAGE_BY_ID)) {
            stmt.setInt(1, id);

            po = processMessageById(stmt);
        } catch (SQLException e) {
            handleException(e);
            Log.exit(po);
        }

        return po.getContent();
    }

    private MessagePO processMessageById(PreparedStatement stmt) {
        Log.enter(stmt);

        if (stmt == null) {
            Log.warn("Inside processMessageById method with NULL statement object.");
            return null;
        }

        Log.debug("Executing stmt = " + stmt);
        MessagePO po = new MessagePO();
        try (ResultSet rs = stmt.executeQuery()) {
            while (rs.next()) {
                po.setContent(rs.getString(1));
            }
        } catch (SQLException e) {
            handleException(e);
        } finally {
            Log.exit(po);
        }

        return po;
    }


}
