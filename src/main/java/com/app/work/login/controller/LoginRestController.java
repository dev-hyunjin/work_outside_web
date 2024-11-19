package com.app.work.login.controller;

import com.app.work.domain.dto.member.MemberDto;
import com.app.work.domain.vo.MemberVO;
import com.app.work.login.service.LoginService;
import com.zaxxer.hikari.pool.HikariProxyCallableStatement;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;

import javax.servlet.http.HttpServletRequest;
import java.lang.reflect.Member;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/logins/*")
@RequiredArgsConstructor
public class LoginRestController {

    private final LoginService loginService;

//    아이디, 비밀번호 체크
    @PostMapping("loginOk")
    public int loginOk(@RequestBody MemberDto memberDto, HttpServletRequest req){
        try {
            memberDto.setMemberPassword(Base64.getEncoder().encodeToString(memberDto.getMemberPassword().getBytes()));

            Integer memberNumber = loginService.findMemberNumber(memberDto.getMemberId(), memberDto.getMemberPassword());
            req.getSession().setAttribute("memberNumber", memberNumber);

            Integer sessionNumber = loginService.findSessionMember(memberDto.getMemberId(), memberDto.getMemberPassword());
            req.getSession().setAttribute("sessionNumber",sessionNumber);

            MemberVO memberInfo = loginService.findMemberName(sessionNumber);
            req.getSession().setAttribute("memberName", memberInfo.getMemberName());
            req.getSession().setAttribute("memberInfo", memberInfo);
            req.getSession().setAttribute("memberRank" , memberInfo.getMemberRank());
            req.getSession().setAttribute("teamNumber", memberInfo.getTeamNumber());
            req.getSession().setAttribute("memberUse", memberInfo.getMemberUse());

            if (memberNumber == 0 || sessionNumber == null) {
                return -1;
            }else if(memberInfo.getMemberRank().equals("관리자") || memberInfo.getMemberRank().equals("팀장") || memberInfo.getMemberRank().equals("수석 매니저")){
                return 2;
            }
            else if (memberInfo.getMemberRank().equals("매니저")){
                return 3;
            }
        }
        catch (IllegalArgumentException e) {
            e.printStackTrace();
            return 0;
        }
        return 1;
    }

    @GetMapping("parameter")
    public String getParameter(@RequestParam("memberId")String memberId , @RequestParam("memberPassword") String memberPassword, HttpServletRequest req) {
        System.out.println("Id : " + memberId);
        System.out.println("PW : " + memberPassword);

        String memberID = req.getParameter("memberId");
        String memberPW = req.getParameter("memberPassword");

        System.out.println("Id : " + memberID + "----------------------------");
        System.out.println("PW : " + memberPW + "----------------------------");

        Map<String, Object> argMap = new HashMap<String, Object>();
        argMap.put("memberId", memberID);
        argMap.put("memberPassword", memberPW);

        return "성공";
    }
}
