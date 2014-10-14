package edu.cmu.sv.ws.ssnoc.data.dao;

import java.sql.Timestamp;
import java.util.List;
import edu.cmu.sv.ws.ssnoc.data.po.MessagePO;
import edu.cmu.sv.ws.ssnoc.data.po.UserPO;
import edu.cmu.sv.ws.ssnoc.dto.TestResult;

/**
 * Interface specifying the contract that all implementations will implement to
 * provide persistence of User information in the system.
 *
 */
public interface IMessageDAO{
    /**
     * This method will save the information of the user into the database.
     *
     * @param messagePO
     *            - User information to be saved.
     */
    void save(MessagePO messagePO);

    /**
     * This method will load all the users in the
     * database.
     *
     * @return - List of messages.
     */
    List<MessagePO> loadWallMessages();

    /**
     * This method will load all the users in the
     * database.
     *
     * @return - List of messages.
     */
    List<MessagePO> loadPrivateMessages(String author, String target);

    /**
     * This method will load all the users in the
     * database.
     *
     * @return - List of messages.
     */
    List<UserPO> loadChatBuddies(String author);

    /**
     * This method will load all the users in the
     * database.
     *
     * @return - List of messages.
     */
    String loadMessageById(int id);

    List<List<UserPO>> getClusters(Timestamp timestamp);

    void startTest(int seconds);

    public TestResult getTestResult();

    public List<MessagePO> testLoadWallMessages();

    void testSave(MessagePO messagePO);
}
