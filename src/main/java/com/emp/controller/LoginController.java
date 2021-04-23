package com.emp.controller;

import com.emp.service.LoginService;
import com.emp.util.ResultBuilder;
import com.emp.entity.User;
import com.emp.exception.UserException;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
// import com.emp.util.ResultBuilder;
// import com.emp.util.Result;
// import java.util.HashMap;
// import java.util.List;
// import java.util.Map;

@Controller
public class LoginController {

    protected final Log logger = LogFactory.getLog(getClass());

    @Value("${emp.is-dev}")
    private boolean isDev;

    @Value("${emp.dev-server-port}")
    private int port;

    @Autowired
    private LoginService loginService;

    @RequestMapping(value = "/login", method = RequestMethod.POST)
    public ResultBuilder login(HttpServletRequest request, HttpServletResponse response, Model model)
            throws IOException {
        String userId = (String) request.getParameter("userId");
        String password = (String) request.getParameter("password");
        // User user = loginService.verify(userId, password);
        try {
            User user = loginService.verify(userId, password);
            // request.getSession().setAttribute("userId", userId);
            request.getSession().setAttribute("user", user);
            // response.sendRedirect("/");
            // logger.info(userId + "登录成功");
            // model.addAttribute("jsPath", getPath(isDev, port));
        } catch (UserException e) {
            model.addAttribute("error", e.getMessage());
        }

        return ResultBuilder.success();
    }

    // @RequestMapping(value = "/cancellation.do", method = RequestMethod.POST)
    // public String cancellation(HttpServletRequest request, HttpServletResponse
    // response) throws IOException {
    // request.getSession().invalidate();
    // response.setStatus(1);
    // return "login";
    // }
}
