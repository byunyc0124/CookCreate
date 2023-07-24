package com.mmt.controller;

import com.mmt.domain.Role;
import com.mmt.domain.entity.Auth.UserDetailsImpl;
import com.mmt.domain.request.LessonPostReq;
import com.mmt.domain.request.LessonPutReq;
import com.mmt.domain.response.LessonDetailRes;
import com.mmt.domain.response.LessonLatestRes;
import com.mmt.domain.response.ResponseDto;
import com.mmt.domain.response.UserInfoRes;
import com.mmt.service.LessonService;
import com.mmt.service.MemberService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@Tag(name = "과외 글 API", description = "과외 글 관련 API입니다.")
@Slf4j
@RestController
@RequestMapping("/api/v1/lesson")
@RequiredArgsConstructor
public class LessonController {

    private final LessonService lessonService;
    private final MemberService memberService;

    @Operation(summary = "과외 예약하기", description = "과외를 예약한다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "success",
                    content = @Content(schema = @Schema(implementation = UserInfoRes.class))),
            @ApiResponse(responseCode = "400", description = "형식을 맞춰주세요.",
                    content = @Content(schema = @Schema(implementation = UserInfoRes.class))),
            @ApiResponse(responseCode = "401", description = "로그인 후 이용해주세요.(Token expired)",
                    content = @Content(schema = @Schema(implementation = UserInfoRes.class))),
            @ApiResponse(responseCode = "403", description = "Cookyer만 이용 가능합니다.",
                    content = @Content(schema = @Schema(implementation = UserInfoRes.class)))
    })
    @PostMapping("")
    public ResponseEntity<ResponseDto> reserve(@RequestBody @Valid LessonPostReq lessonPostReq, BindingResult bindingResult, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        log.debug("authentication: " + (userDetails.getUsername()));

        if(bindingResult.hasErrors()){ // valid error
            StringBuilder stringBuilder = new StringBuilder();
            for(FieldError fieldError : bindingResult.getFieldErrors()){
                stringBuilder.append(fieldError.getDefaultMessage());
            }
            return new ResponseEntity<>(new ResponseDto(HttpStatus.BAD_REQUEST, stringBuilder.toString()), HttpStatus.BAD_REQUEST);
        }

        String loginId = userDetails.getUsername(); // 현재 로그인한 아이디
        if(!memberService.getRole(loginId).equals(Role.COOKYER)){ // 권한 에러
            return new ResponseEntity<>(new ResponseDto(HttpStatus.FORBIDDEN, "Cookyer만 이용 가능합니다."), HttpStatus.FORBIDDEN);
        }

        lessonPostReq.setCookyerId(loginId);
        ResponseDto responseDto = lessonService.reserve(lessonPostReq);

        return new ResponseEntity<>(responseDto, responseDto.getStatusCode());
    }

    @Operation(summary = "과외 수정하기", description = "예약한 과외를 수정한다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "success",
                    content = @Content(schema = @Schema(implementation = UserInfoRes.class))),
            @ApiResponse(responseCode = "400", description = "형식을 맞춰주세요.",
                    content = @Content(schema = @Schema(implementation = UserInfoRes.class))),
            @ApiResponse(responseCode = "401", description = "로그인 후 이용해주세요.(Token expired)",
                    content = @Content(schema = @Schema(implementation = UserInfoRes.class))),
            @ApiResponse(responseCode = "403", description = "예약한 Cookyer만 이용 가능합니다.",
                    content = @Content(schema = @Schema(implementation = UserInfoRes.class))),
            @ApiResponse(responseCode = "404", description = "존재하지 않는 과외입니다.",
                    content = @Content(schema = @Schema(implementation = UserInfoRes.class)))
    })
    @PutMapping("")
    public ResponseEntity<ResponseDto> modifyLesson(@RequestBody @Valid LessonPutReq lessonPutReq, BindingResult bindingResult, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        log.debug("authentication: " + (userDetails.getUsername()));

        if(bindingResult.hasErrors()){ // valid error
            StringBuilder stringBuilder = new StringBuilder();
            for(FieldError fieldError : bindingResult.getFieldErrors()){
                stringBuilder.append(fieldError.getDefaultMessage());
            }
            return new ResponseEntity<>(new ResponseDto(HttpStatus.BAD_REQUEST, stringBuilder.toString()), HttpStatus.BAD_REQUEST);
        }

        LessonDetailRes lessonDetailRes = lessonService.getLessonDetail(lessonPutReq.getLessonId());
        if(lessonDetailRes == null){ // 존재 유무 확인
            return new ResponseEntity<>(new ResponseDto(HttpStatus.NOT_FOUND, "존재하지 않는 과외입니다."), HttpStatus.NOT_FOUND);
        }

        String loginId = userDetails.getUsername(); // 현재 로그인한 아이디
        if(!loginId.equals(lessonDetailRes.getCookyerId())){ // 권한 에러
            return new ResponseEntity<>(new ResponseDto(HttpStatus.FORBIDDEN, "예약한 Cookyer만 이용 가능합니다."), HttpStatus.FORBIDDEN);
        }

        lessonPutReq.setCookyerId(loginId);
        ResponseDto responseDto = lessonService.modifyLesson(lessonPutReq);

        return new ResponseEntity<>(responseDto, responseDto.getStatusCode());
    }

    @Operation(summary = "과외 상세보기", description = "과외 내용을 상세하게 조회한다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "success",
                    content = @Content(schema = @Schema(implementation = UserInfoRes.class))),
            @ApiResponse(responseCode = "401", description = "로그인 후 이용해주세요.(Token expired)",
                    content = @Content(schema = @Schema(implementation = UserInfoRes.class))),
    })
    @GetMapping("/{lessonId}")
    public ResponseEntity<LessonDetailRes> getLessonDetail(@PathVariable(value = "lessonId") int lessonId, Authentication authentication){
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        log.debug("authentication: " + (userDetails.getUsername()));

        return new ResponseEntity<>(lessonService.getLessonDetail(lessonId), HttpStatus.OK);
    }

    @Operation(summary = "과외 불러오기", description = "최근에 예약한 과외 내용을 불러온다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "success",
                    content = @Content(schema = @Schema(implementation = UserInfoRes.class))),
            @ApiResponse(responseCode = "401", description = "로그인 후 이용해주세요.(Token expired)",
                    content = @Content(schema = @Schema(implementation = UserInfoRes.class))),
            @ApiResponse(responseCode = "403", description = "Cookyer만 이용 가능합니다",
                    content = @Content(schema = @Schema(implementation = UserInfoRes.class))),
            @ApiResponse(responseCode = "404", description = "이전에 예약한 화상 과외 내역이 없습니다.",
                    content = @Content(schema = @Schema(implementation = UserInfoRes.class))),
    })
    @GetMapping("/latest")
    public ResponseEntity<LessonLatestRes> getLessonLatest(Authentication authentication){
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        log.debug("authentication: " + (userDetails.getUsername()));

        LessonLatestRes lessonLatestRes = new LessonLatestRes();
        String loginId = userDetails.getUsername(); // 현재 로그인한 아이디

        if(!memberService.getRole(loginId).equals(Role.COOKYER)){ // 권한 에러
            lessonLatestRes.setStatusCode(HttpStatus.FORBIDDEN);
            lessonLatestRes.setMessage("Cookyer만 이용 가능합니다.");
            return new ResponseEntity<>(new LessonLatestRes(), lessonLatestRes.getStatusCode());
        }

        lessonLatestRes = lessonService.getLessonLatest(loginId);

        return new ResponseEntity<>(lessonLatestRes, lessonLatestRes.getStatusCode());
    }
}
