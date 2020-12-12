var calendar;
$(document).ready(function () {
  fnGetScheduleList();


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
    fnLoadCalendar(data);
  }
  function fail(err) {
    console.log(err);
  }
}
function fnLoadCalendar(data) {
  var calendarEl = document.getElementById('calendar');

  calendar = new FullCalendar.Calendar(calendarEl, {
    initialDate: '2020-09-12',
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
    dateClick: function (info) {
      console.log(info);
      // change the day's background color just for fun
      info.dayEl.style.backgroundColor = 'red';
    }
  });


  calendar.render();
}
