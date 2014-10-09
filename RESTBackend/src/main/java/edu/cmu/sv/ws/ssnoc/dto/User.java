package edu.cmu.sv.ws.ssnoc.dto;

import com.google.gson.Gson;

/**
 * This object contains user information that is responded as part of the REST
 * API request.
 * 
 */
public class User {
	private String userName;
	private String password;
    private int emergency_status;
    private int online_status;

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

    public int getEmergency_status() { return emergency_status;}

    public void setEmergency_status(int emergency_status) { this.emergency_status = emergency_status ;};

    public int getOnline_status() { return online_status; };

    public void setOnline_status(int online_status) { this.online_status = online_status; };

	@Override
	public String toString() {
		return new Gson().toJson(this);
	}

}
