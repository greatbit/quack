package com.testquack.dal;


import com.testquack.beans.User;

import java.util.List;

public interface UserRepositoryCustom {

    public List<User> suggestUsers(String organizationId, String literal);
}
