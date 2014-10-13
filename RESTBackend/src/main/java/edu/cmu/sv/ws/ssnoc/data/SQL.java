package edu.cmu.sv.ws.ssnoc.data;

/**
 * This class contains all the SQL related code that is used by the project.
 * Note that queries are grouped by their purpose and table associations for
 * easy maintenance.
 *
 */
public class SQL {
    /*
     * List the USERS table name, and list all queries related to this table
     * here.
     */
    public static final String SSN_USERS = "SSN_USERS";
    public static final String SSN_STATUS = "SSN_STATUS";
    public static final String SSN_MESSAGES = "SSN_MESSAGES";
    public static final String PRIVATE_MESSAGES = "PRIVATE_MESSAGES";
    public static final String TEST_POST = "TEST_POST";
    public static final String TEST_GET = "TEST_GET";
    public static final String TEST_RESULTS = "TEST_RESULTS";

    /**
     * Query to check if a given table exists in the H2 database.
     */
    public static final String CHECK_TABLE_EXISTS_IN_DB = "SELECT count(1) as rowCount "
            + " FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = SCHEMA() "
            + " AND UPPER(TABLE_NAME) = UPPER(?)";

    // ****************************************************************
    // All queries related to USERS
    // ****************************************************************
    /**
     * Query to create the USERS table.
     */

    public static final String CREATE_USERS = "create table IF NOT EXISTS " + SSN_USERS +
            "(user_id IDENTITY PRIMARY KEY," +
            "user_name VARCHAR(255) NOT NULL," +
            "password varchar(40) NOT NULL,"+
            "online_status smallint ,"+
            "emergency_status smallint ,"+
            "salt VARCHAR(512)  );";

    public static final String CREATE_MESSAGES = "CREATE TABLE IF NOT EXISTS "+ SSN_MESSAGES +" (" +
            "pid integer NOT NULL AUTO_INCREMENT,"+
            "message varchar(255),"+
            "author varchar(255),"+
            "timestamp timestamp,"+
            "PRIMARY KEY (pid),"+
            "FOREIGN KEY (author) REFERENCES public.SSN_USERS(user_name)"+
            ");";

    public static final String CREATE_STATUS = "CREATE TABLE emergency_status (" +
            "ok smallint," +
            "help smallint," +
            "emergency smallint, " +
            "undefined smallint," +
            ");";

    public static final String CREATE_PM = "CREATE TABLE " + PRIVATE_MESSAGES + " (" +
            "content varchar(512)," +
            "author varchar(255)," +
            "target varchar(255)," +
            "postedAt timestamp," +
            "messageId smallint NOT NULL AUTO_INCREMENT PRIMARY KEY);";

    public static final String CREATE_TEST_POST = "CREATE TABLE IF NOT EXISTS "+ TEST_POST +" (" +
            "pid integer NOT NULL AUTO_INCREMENT,"+
            "message varchar(255),"+
            "author varchar(255),"+
            "timestamp timestamp,"+
            "PRIMARY KEY (pid),"+
            "FOREIGN KEY (author) REFERENCES public.SSN_USERS(user_name)"+
            ");";

    public static final String CREATE_TEST_GET = "CREATE TABLE IF NOT EXISTS "+ TEST_GET +" (" +
            "pid integer NOT NULL AUTO_INCREMENT,"+
            "message varchar(255),"+
            "author varchar(255),"+
            "timestamp timestamp,"+
            "PRIMARY KEY (pid),"+
            "FOREIGN KEY (author) REFERENCES public.SSN_USERS(user_name)"+
            ");";

    public static final String CREATE_TEST_RESULTS = "CREATE TABLE IF NOT EXISTS " + TEST_RESULTS + " (" +
            "number_of_posts integer," +
            "number_of_gets integer," +
            "timestamp timestamp," +
            "testTime integer);";

    public static final String INSERT_INTO_TEST1 = "insert into " + TEST_GET + " values(1, firstmessagetes, Test_AUTHOR1, 10)";
    public static final String INSERT_INTO_TEST2 = "insert into " + TEST_GET + " values(1, seconmessagetes, Test_AUTHOR2, 20)";
    public static final String INSERT_INTO_TEST3 = "insert into " + TEST_GET + " values(1, thirdmessagetes, Test_AUTHOR3, 30)";





    /**
     * Query to load all users in the system.
     */
    public static final String FIND_ALL_USERS = "select user_id, user_name, password,"
            + " online_status," + " emergency_status," + " salt " + " from " + SSN_USERS + " order by user_name";

    /**
     * Query to find a user details depending on his name. Note that this query
     * does a case insensitive search with the user name.
     */
    public static final String FIND_USER_BY_NAME = "select user_id, user_name, password,"
            + " online_status, "
            + " emergency_status,"
            + " salt "
            + " from "
            + SSN_USERS
            + " where UPPER(user_name) = UPPER(?)";

    public static final String GET_UID_BY_USERNAME = "select user_id from " + SSN_USERS +
            " where user_name = ?";

    public static final String GET_ALL_PUBLIC_MESSAGES = "select * from " + SSN_MESSAGES;

    public static final String SEND_PRIVATE_MESSAGE = "insert into " + PRIVATE_MESSAGES +
            " (content, author, target, postedAt) values (?, ?, ?, ?)";

    public static final String GET_PM_BY_USER_ID = "select * from " + PRIVATE_MESSAGES +
            " where (author = ? and target = ?) or (author = ? and target = ?) ORDER BY postedAt ASC";

    public static final String GET_CHAT_BUDDIES = "select target from " + PRIVATE_MESSAGES +
            " where author = ?";

    public static final String GET_MESSAGE_BY_ID = "select content from " + PRIVATE_MESSAGES +
            " where messageId = ?";

    public static final String POST_ON_WALL = "insert into " + SSN_MESSAGES +
            "(message, author, timestamp) values (?,?,?)";

    public static final String FIND_STATUS_BY_NAME = "select emergency_status from SSN_USERS where UPPER(user_name) = UPPER(?)";

    public static final String FIND_TALKERS_BY_TIME = "select author, target from " + PRIVATE_MESSAGES +
            " where postedAt > ?";

    public static final String FIND_ALL_USERNAMES = "select user_name from " + SSN_USERS;

    /**
     * Query to insert a row into the users table.
     */
    public static final String INSERT_USER = "insert into " + SSN_USERS
            + " (user_name, password, online_status, emergency_status, salt) values (?, ?, ?, ?, ?)";


    public static final String UPDATE_ONLINE = "UPDATE " + SSN_USERS + " SET online_status=1 WHERE user_name=?";

    public static final String UPDATE_OFFLINE = "UPDATE " + SSN_USERS + " SET online_status=0 WHERE user_name=?";

    public static final String UPDATE_STATUS = "UPDATE " + SSN_USERS + " SET emergency_status=? WHERE user_name=?";
}
