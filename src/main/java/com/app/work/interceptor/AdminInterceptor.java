package com.app.work.interceptor;

import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

public class AdminInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        HttpSession session = request.getSession(false);

        if(!session.getAttribute("memberRank").equals("관리자")) {
            response.sendRedirect("/login?interceptor=Y");
            session.invalidate();
            return false;
        }

        return true;
    }
}
