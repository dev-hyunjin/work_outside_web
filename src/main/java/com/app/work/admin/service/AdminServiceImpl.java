package com.app.work.admin.service;

import com.app.work.domain.Criteria;
import com.app.work.domain.dao.DepartmentDAO;
import com.app.work.domain.dao.MemberDAO;
import com.app.work.domain.dao.WorkplaceDAO;
import com.app.work.domain.dto.DeptDTO;
import com.app.work.domain.dto.MemberDTO;
import com.app.work.domain.dto.TeamDTO;
import com.app.work.domain.dto.WorkplaceDTO;
import com.app.work.domain.vo.MemberVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Base64;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminServiceImpl implements AdminService {

    private final MemberDAO memberDAO;
    private final DepartmentDAO departmentDAO;
    private final WorkplaceDAO workplaceDAO;

    @Override
    public MemberVO getMember(Integer sessionNumber) {
        return memberDAO.selectMember(sessionNumber);
    }

    @Override
    public List<MemberVO> getMemberListWithoutAdmin(Integer teamNumber) {
        return memberDAO.selectMemberListWithoutAdmin(teamNumber);
    }

    @Override
    public List<MemberVO> getMemberListWithPaging(Integer deptNumber, Integer teamNumber, String memberName, String memberUse, Criteria criteria) {
        return memberDAO.selectMemberListWithPaging(deptNumber, teamNumber, memberName, memberUse, criteria);
    }

    @Override
    public int getMemberListCount(Integer deptNumber, Integer teamNumber, String memberName, String memberUse, Criteria criteria) {
        return memberDAO.countMemberForPaging(deptNumber, teamNumber, memberName, memberUse, criteria);
    }

    @Override
    public void saveMember(MemberDTO memberDTO) {
        memberDTO.setMemberPassword(Base64.getEncoder().encodeToString(memberDTO.getMemberPassword().getBytes()));

        memberDAO.insertMember(memberDTO);
    }

    @Override
    public void setMember(MemberDTO memberDTO) {
        memberDTO.setMemberPassword(Base64.getEncoder().encodeToString(memberDTO.getMemberPassword().getBytes()));

        memberDAO.updateMember(memberDTO);
    }

    @Override
    public void changeMemberUse(Integer memberNumber, String memberUse) {
        memberDAO.deleteMemberUse(memberNumber, memberUse);
    }

    @Override
    public List<DeptDTO> getDepartmentList() {
        return departmentDAO.selectDepartmentList();
    }

    @Override
    public void saveDepartment(String deptName) {
        departmentDAO.saveDepartment(deptName);
    }

    @Override
    public void setDepartmentName(Integer deptNumber, String deptName) {
        departmentDAO.updateDepartment(deptNumber, deptName);
    }

    @Override
    public void removeDepartment(Integer deptNumber) {
//        부서 삭제 시 해당 부서 사원들 해당없음으로 이동
        memberDAO.updateDeptAndTeamForDeleteDept(deptNumber);

//        팀 삭제(상태 변경)
        departmentDAO.deleteTeam(null, deptNumber);
        
//        이후 부서 삭제(상태 변경)
        departmentDAO.deleteDepartment(deptNumber);
    }

    @Override
    public List<TeamDTO> getTeamList(Integer deptNumber) {
        return departmentDAO.selectTeamList(deptNumber);
    }

    @Override
    public void saveTeam(String teamName, Integer deptNumber) {
        departmentDAO.saveTeam(teamName, deptNumber);
    }

    @Override
    public void setTeamName(Integer teamNumber, String teamName) {
        departmentDAO.updateTeam(teamNumber, teamName);
    }

    @Override
    public void removeTeam(Integer teamNumber, Integer deptNumber) {
//        팀 삭제 시 해당 팀 사원들 빈칸으로 수정
        memberDAO.updateTeamForDeleteTeam(teamNumber);

//        이후 팀 삭제(상태 변경)
        departmentDAO.deleteTeam(teamNumber, deptNumber);
    }

    @Override
    public List<WorkplaceDTO> getWorkplaceList(String workplaceUse, Criteria criteria) {
        return workplaceDAO.selectWorkplaceList(workplaceUse, criteria);
    }

    @Override
    public int getWorkplaceCount(String workplaceUse) {
        return workplaceDAO.selectWorkplaceCount(workplaceUse);
    }

    @Override
    public int checkWorkplaceName(String workplaceName) {
        return workplaceDAO.selectWorkplace(workplaceName);
    }

    @Override
    public void saveWorkplace(String workplaceName) {
        workplaceDAO.saveWorkplace(workplaceName);
    }

    @Override
    public void setWorkplace(String workplaceName, String originName) {
        workplaceDAO.updateWorkplace(workplaceName, originName);
    }

    @Override
    public void setWorkplaceUse(String workplaceName, String workplaceUse) {
        workplaceDAO.updateWorkplaceUse(workplaceName, workplaceUse);
    }
}
