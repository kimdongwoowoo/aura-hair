var express = require('express');
var router = express.Router();
var calendarTest = [
    
    {
        title: 'All Day Event',
        start: '2020-09-01'
    },
    {
        title: 'Long Event',
        start: '2020-09-07',
        end: '2020-09-10'
    },
    {
        groupId: 999,
        title: 'Repeating Event',
        start: '2020-09-09T16:00:00'
    },
    {
        groupId: 999,
        title: 'Repeating Event',
        start: '2020-09-16T16:00:00'
    },
    {
        title: 'Conference',
        start: '2020-09-11',
        end: '2020-09-13'
    },
    {
        title: 'Meeting',
        start: '2020-09-12T10:30:00',
        end: '2020-09-12T12:30:00'
    },
    {
        title: 'Lunch',
        start: '2020-09-12T12:00:00'
    },
    {
        title: 'Meeting',
        start: '2020-09-12T14:30:00'
    },
    {
        id: 155,
        title: 'Happy Hour',
        allDay: true,
        start: '2020-09-12T17:30:00'
    },
    {
        title: 'Dinner',
        start: '2020-09-12T20:00:00'
    },
    {
        title: 'Birthday Party',
        start: '2020-09-13T07:00:00'
    },
    {
        title: 'Click for Google',
        url: 'http://google.com/',
        start: '2020-09-28'
    }
];
var calendar = [];
router.use(express.json());

router.get('/', (req, res, next) => {
    res.send(calendar);

});

router.post('/', (req, res, next) => {
    var schedule = req.body;
    schedule.id = calendar.length + 1;
    calendar.push(schedule);
    res.send(schedule);

});


router.put("/:id", (req, res) => {
    var schedule;
    for (var i = 0; i < calendar.length; ++i) {

        if (calendar[i].id == parseInt(req.params.id)) {
            schedule = calendar[i] = req.body;
            break;
        }

    }
    if (schedule) {
        res.send(schedule);
    } else {
        res.status(404).send('ID was not found');
    }
});
module.exports = router;