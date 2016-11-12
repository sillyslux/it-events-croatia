$(".nav.nav-sidebar").on('click', 'a', e => {
  e.preventDefault();
  console.log(e)
});
$('#add').click( e => {
  $('.main').load('add.html');
});

var fetches = ['eventList'].map(req => fetch(req).then(res=>res.json()))
Promise.all(fetches).then(elgage=>{console.log(elgage)})
  //     "title": "Web Summer Camp",
  //     "begin": 1472601600000,
  //     "end": "2016-09-03",
  //     "duration": "",
  //     "major": "true",
  //     "image": "/img/websc.jpg",
  //     "link": "http://2016.websummercamp.com/",
  //     "location": "ROVINJ, CROATIA",
  //     "teaser": "PHP topic @ Web Summer Camp is a natural continuation of PHP Summer Camp that’s been delivering cutting-edge experien",
  //     "county": 8,
  //     "created": 1464586994366
  //   }
  // ],
