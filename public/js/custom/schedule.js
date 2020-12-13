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
    editable: true,
    navLinks: true,
    selectable: true,
    businessHours: false,
    locale: 'ko',
    dayMaxEvents: true, // allow "more" link when too many events
    events:data,
    dateClick:fnDateClick,
    eventDrop:fnChangeInfo,
    eventResize:fnChangeInfo

    
  });
  calendar.render();
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

  const date=info.dateStr;
  $("#modalSchedule input[type=date]").val(date);
  $("#modalSchedule").modal('show');
  
  var d=new Date();
  $("#modalSchedule input[type=time]").val(moment(d).format('HH:mm'));
  
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
    //새 일정
    if($("#modalSchedule").attr('scheduleId')==""){
      if($.trim($("#inputTitle").val())==""){
        alert('제목을 입력하세요.');
        return;
      }
      if(!$("#checkboxAllDay").prop('checked') && $("#inputTimeStart").val()==$("#inputTimeEnd").val()){
        alert('시간은 동일할 수 없습니다.');
        return;
      }

      fnAddNewEvent();
    }
  });
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
