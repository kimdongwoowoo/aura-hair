var calendar;
$(document).ready(function () {
  fnGetScheduleList();
  fnModalEventBind();

});
function fnGetScheduleList() {
  $.ajax({
    url: "/api/schedule",
    method: "GET",
    dataType: "json",
    success: success,
    fail: fail
  });
  function success(data) {
    for(var i=0;i<data.length;++i){
      data[i].id=data[i]._id;
    }
    fnLoadCalendar(data);
  }
  function fail(err) {
    console.log(err);
  }
}
function fnLoadCalendar(data) {
  var calendarEl = document.getElementById('calendar');

  calendar = new FullCalendar.Calendar(calendarEl, {
    initialDate: moment(new Date()).format('YYYY-MM-DD'),
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'

    },
    initialView: 'timeGridWeek',
    allDaySlot:false,
    editable: true,
    navLinks: true,
    selectable: true,
    businessHours: false,
    locale: 'ko',
    dayMaxEvents: true, // allow "more" link when too many events
    events:data,
    dateClick:fnDateClick,
    eventDrop:fnChangeInfo,
    eventResize:fnChangeInfo,
    eventClick:fnPopupEvent

    
  });
  calendar.render();
}
//UPDATE
function fnPopupEvent(info){
  
  $("#modalSchedule").attr('scheduleId',info.event.id);
  $("#inputTitle").val(info.event.title);
  $("#btnDelSchedule").show();

  var start=info.event.start;
  var end=info.event.end;
  //종일 && start==end일때는 end가 없음 -> 설정
  if(!end)
    end=start;

  $("#inputAllDayDateStart").val(moment(start).format("YYYY-MM-DD"));
  $("#inputAllDayDateEnd").val(moment(end).format("YYYY-MM-DD"))
  
  $("#inputDate").val(moment(start).format("YYYY-MM-DD"));
  $("#inputTimeStart").val(moment(start).format("HH:mm"));
  $("#inputTimeEnd").val(moment(end).format("HH:mm"));
  $("#inputTimeStart,#inputTimeEnd").timepicker({
    'timeFormat': 'H:i',
    'step': 30 // 30분 단위로 지정. ( 10을 넣으면 10분 단위 )
  });
  $('#inputTimeStart').timepicker('setTime', start);
  $('#inputTimeEnd').timepicker('setTime', end);

  
  if($("#checkboxAllDay").prop('checked')){ //종일이 찍혀있으면
    $("#checkboxAllDay").click(); //다시 uncheck
  }
  if(info.event.allDay){
    $("#checkboxAllDay").click();
  }
  $("#modalSchedule").modal('show');



}
function fnUpdateEvent(){
  var scheduleId=$("#modalSchedule").attr('scheduleid');
  var event=calendar.getEventById(scheduleId);

  if ($("#checkboxAllDay").prop('checked')) {
    event = {
      title: $("#inputTitle").val(),
      start: $("#inputAllDayDateStart").val(),
      end: $("#inputAllDayDateEnd").val(),
      allDay: true
    };


  } else {
    event = {
      title: $("#inputTitle").val(),
      start: $("#inputDate").val() + "T" + $("#inputTimeStart").val(),
      end: $("#inputDate").val() + "T" + $("#inputTimeEnd").val(),
      allDay: false
    };
  }
  //DB 변경
  $.ajax({
    url: "/api/schedule/"+scheduleId,
    method: "PUT",
    data: JSON.stringify(event),
    dataType: "json",
    contentType: "application/json",
    success: success,
    fail: fail
  });
  function success(data) {
    data.id = data._id
    var e=calendar.getEventById(data.id);
    e.setStart(data.start);
    e.setEnd(data.end);
    e.setProp("title",data.title);
    e.setAllDay(data.allDay);
    $("#modalSchedule").modal('hide');
  }
  function fail(err) {
    console.log(err);
  }
  
  

}
function fnChangeInfo(info){
  const event=info.event;
  var schedule;
  if(event.allDay){
    schedule={
      id:event.id,
      title:event.title,
      start:moment(event.start).format('YYYY-MM-DD'),
      //하루일때는 end가 없어짐
      //form에서 저장할때는 end있음
      end:event.end?moment(event.end).format('YYYY-MM-DD'):"",
      allDay:true
    }
  }else{
    schedule={
      id:event.id,
      title:event.title,
      start:moment(event.start).format('YYYY-MM-DDTHH:mm'),
      end:moment(event.end).format('YYYY-MM-DDTHH:mm'),
      allDay:false
    }
  }
  $.ajax({
    url: "/api/schedule/" + schedule.id,
    method: "PUT",
    data: JSON.stringify(schedule),
    dataType: "json",
    contentType: "application/json",
    success: success,
    fail: fail
  });
  function success(data) {
    console.log(data);
  }
  function fail(err) {
    console.log(err);
  }


}
//새로운 일정 추가
function fnDateClick(info){
  $("#modalSchedule").attr('scheduleId','');
  $("#inputTitle").val("");
  $("#btnDelSchedule").hide();
  if($("#checkboxAllDay").prop('checked')){ //종일이 찍혀있으면
    $("#checkboxAllDay").click(); //다시 uncheck
  }
  $("#inputDate").val(moment(info.date).format("YYYY-MM-DD"));
  
  //월별로 보기 캘린더에서 추가시
  if(info.allDay){ 
    //var d=new Date();
    //$("#inputTimeStart").val(moment(d).format('HH:mm'));

  }else{ //그외 추가시 (시간체크되어있음)
   
  }
  $("#inputTimeStart,#inputTimeEnd").timepicker({
    'timeFormat': 'H:i',
    'step': 30 // 30분 단위로 지정. ( 10을 넣으면 10분 단위 )
  });
  var start=moment(info.date).format("hh:mm");
  var end=moment(info.date).add(30,'minutes').format("hh:mm");
  
  $('#inputTimeStart').timepicker('setTime', start);
  
  $('#inputTimeEnd').timepicker('setTime',end);
  $("#modalSchedule").modal('show');
  
  //info.dayEl.style.backgroundColor = 'red';
}
function fnModalEventBind(){
  $("#checkboxAllDay").off().on('click',function(){
    if($(this).prop('checked')){
      $("#divAllDay").show();
      $("#divTime").hide();
    }else{
      $("#divAllDay").hide();
      $("#divTime").show();
    }
  });
  $("#btnSaveSchedule").off().on('click',function(){
    
    if($.trim($("#inputTitle").val())==""){
      alert('제목을 입력하세요.');
      return;
    }
    if(!$("#checkboxAllDay").prop('checked') && $("#inputTimeStart").val()==$("#inputTimeEnd").val()){
      alert('시간은 동일할 수 없습니다.');
      return;
    }
    
    //새 일정
    if($("#modalSchedule").attr('scheduleId')==""){
      fnAddNewEvent();
    }else{
      fnUpdateEvent();
    }
  });

  $("#btnDelSchedule").off().on('click',function(){
    var res=confirm('삭제하시겠습니까?');
        if(res){
            fnDeleteSchedule($("#modalSchedule").attr('scheduleId'));
        }
  });
}
function fnDeleteSchedule(scheduleId){
  $.ajax({
    url: "/api/schedule/" + scheduleId,
    method: "DELETE",
    success: success,
    fail: fail
  });
  function success(data) {
    //UI 변경
    //삭제된 스케줄의 id
    var scheduleId=$("#modalSchedule").attr('scheduleId');
    alert('삭제되었습니다.');
    $("#modalSchedule").modal('hide');
    calendar.getEventById(scheduleId).remove();

  }
  function fail(err) {
    console.log(err);
  }
}
//ajax POST 응답으로 캘린더에 저장
function fnAddNewEvent(){

  //종일
  var event;
  if($("#checkboxAllDay").prop('checked')){
    event={
      title:$("#inputTitle").val(),
      start:$("#inputAllDayDateStart").val(),
      end:$("#inputAllDayDateEnd").val(),
      allDay:true
    };
    

  }else{
    event={
      title:$("#inputTitle").val(),
      start:$("#inputDate").val()+"T"+$("#inputTimeStart").val(),
      end:$("#inputDate").val()+"T"+$("#inputTimeEnd").val(),
      allDay:false
    };
  }
  $.ajax({
    url: "/api/schedule",
    method: "POST",
    data: JSON.stringify(event),
    dataType: "json",
    contentType: "application/json",
    success: success,
    fail: fail
  });
  function success(data) {
    data.id=data._id
    calendar.addEvent(data);
    $("#modalSchedule").modal('hide');
  }
  function fail(err) {
    console.log(err);
  }
}
