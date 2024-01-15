package com.app.work.mapper.member;

import com.app.work.domain.Criteria;
import com.app.work.domain.dto.MemberDTO;
import com.app.work.domain.vo.MemberVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface MemberMapper {
	//	로그인
	public Integer login(@Param("memberId")String memberId, @Param("memberPassword")String memberPassword);

//	세션 처리
	public Integer sessionMember(@Param("memberId")String memberId, @Param("memberPassword")String memberPassword);

//	세션으로 이름 처리
	public MemberVO selectMember(Integer sessionNumber);

//	사원 리스트 조회(관리자 제외)
	public List<MemberVO> selectMemberListWithoutAdmin(Integer teamNumber);

//	사원 조회
	public List<MemberVO> selectMemberListWithPaging(Integer deptNumber, Integer teamNumber, String memberName, String memberUse, Criteria criteria);

//	사원 조회 시 전체 명수
	public int countMemberForPaging(Integer deptNumber, Integer teamNumber, String memberName, String memberUse, Criteria criteria);

//	사원 등록
	public void insertMember(MemberDTO memberDTO);

//	사원 수정
	public void updateMember(MemberDTO memberDTO);

//	사원 삭제(상태 수정)
	public void deleteMemberUse(Integer memberNumber, String memberUse);

//	부서 삭제 시 해당 부서 사원들 해당없음으로 이동
	public void updateDeptAndTeamForDeleteDept(Integer deptNumber);

//	팀 삭제 시 해당 팀 사원들 빈칸으로 수정
	public void updateTeamForDeleteTeam(Integer teamNumber);
}
