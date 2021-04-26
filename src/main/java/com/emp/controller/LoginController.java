package com.emp.controller;

import com.emp.service.LoginService;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.emp.util.Result;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LoginController {

    protected final Log logger = LogFactory.getLog(getClass());

    @Value("${emp.is-dev}")
    private boolean isDev;

    @Value("${emp.dev-server-port}")
    private int port;

    @Autowired
    private LoginService loginService;

    @RequestMapping(value = "/login", method = RequestMethod.POST)
    public Result login(HttpServletRequest request, HttpServletResponse response, Model model) {
        String userId = (String) request.getParameter("userId");
        String password = (String) request.getParameter("password");
        return loginService.verify(userId, password);
    }
}
