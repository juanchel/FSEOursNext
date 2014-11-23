package edu.cmu.sv.ws.ssnoc.data.dao;

import java.util.List;
import java.*;

import edu.cmu.sv.ws.ssnoc.data.po.UserPO;

/**
 * Interface specifying the contract that all implementations will implement to
 * provide persistence of User information in the system.
 *
 */
public interface IUserDAO {
    /**
     * This method will save the information of the user into the database.
     *
     * @param userPO
     *            - User information to be saved.
     */
    void save(UserPO userPO, String query);

    /**
     * This method will load all the users in the
     * database.
     *
     * @return - List of all users.
     */
    List<UserPO> loadUsers(String query);

    void testloadUsers();

    void testSaveInUser();

    void testUpdatePassword();

    void testUpdateRole();

    void testUpdateStatus();


    /**
     * This method with search for a user by his userName in the database. The
     * search performed is a case insensitive search to allow case mismatch
     * situations.
     *
     * @param userName
     *            - User name to search for.
     *
     * @return - UserPO with the user information if a match is found.
     */
    UserPO findByName(String userName, String query);

    String getStatusByName(String userName, String query);
    void testGetStatusByName();
    void testFindByName();

    void updateStatus(String userName, int status, String query);
    void updatePW(String username, String pw, String salt, String query);
    void updateUsername(String username, String nextName);
    void updateRole(String username, int nextName, String query);
    void updateActive(String username, boolean active);

    List<UserPO> searchUsername(String userName);
    List<UserPO> searchStatus(int status);
}
