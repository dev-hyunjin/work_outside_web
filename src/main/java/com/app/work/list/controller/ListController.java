package com.app.work.list.controller;

import com.app.work.domain.vo.ListVO;
import com.app.work.list.service.ListService;
import com.app.work.main.service.MainService;
import org.springframework.boot.Banner;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import lombok.RequiredArgsConstructor;
import org.springframework.web.servlet.view.RedirectView;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@Controller
@RequestMapping("/list/*")
@RequiredArgsConstructor
public class ListController {

	private final ListService listService;
	private final MainService mainService;
	
	@GetMapping("/list")
	public String listPage(ListVO listVO, Model model, HttpServletRequest req) {
		try {
			String toDay = listVO.getToDay();
			String toDay2 = listService.findToDay(toDay);
			model.addAttribute("toDay", toDay2);

			listVO.setTeamNumber(listVO.getTeamNumber());

			Integer teamNumber = (Integer) req.getSession().getAttribute("teamNumber");

			listVO.setMemberRank(String.valueOf(req.getSession().getAttribute("memberRank")));

			List<ListVO> workList = listService.findWorkList(listVO, teamNumber);

			List<ListVO> finishWorkList = listService.findFinishWorkList(listVO, teamNumber);

			model.addAttribute("workList", workList);
			model.addAttribute("finishWorkList", finishWorkList);

			List<ListVO> vacationList = mainService.findVacationMember(listVO);
			model.addAttribute("vacationList", vacationList);
		} catch (Exception e) {
			throw new RuntimeException(e);
		}

		return "list/list";
	}
}
