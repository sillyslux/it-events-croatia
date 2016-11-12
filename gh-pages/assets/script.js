var filename = new Date().toISOString().substr(0,7)
var now = Date.now()
var upcomingEvents = []
var archiveList;
var archivePerMonth = {};
var archiveFlat = [];
var tcode, itemDate;
var counties = ["Bjelovar", "Čakovec", "Dubrovnik", "Gospić", "Karlovac", "Koprivnica", "Krapina", "Osijek", "Pazin", "Požega", "Rijeka", "Šibenik", "Sisak", "Slavonski_Brod", "Split", "Varaždin", "Virovitica", "Vukovar", "Zadar", "Zagreb"];

fetch('/data/'+filename+'.json')
.then( res => res.json() )
.then( currentMonth => {
  archiveList = currentMonth.archives;
  archiveFlat = currentMonth.entries;
  archivePerMonth[filename] = currentMonth;
  if(~archiveList.indexOf(filename)) archiveList.splice(archiveList.indexOf(filename),1);
  lapsedEvents = currentMonth.entries.filter( e => e.begin < now )
  upcomingEvents = upcomingEvents.concat( currentMonth.entries.filter( e => e.begin > now ) )

  return archiveList
})
.then( archives => {
  var loadArchives = archives.map( file =>
    fetch('/data/'+file+'.json')
    .then( res => res.json() )
  );
  return Promise.all(loadArchives);
})
.then( promisedArchives => {
  promisedArchives.map( archive => {
    archivePerMonth[archive.month]=archive;
    lapsedEvents.concat( archive.entries.filter( e => e.begin < now ) )
    upcomingEvents = upcomingEvents.concat( archive.entries.filter( e => e.begin > now ) )
    archiveFlat = archiveFlat.concat( archive.entries)
  });
  if(location.pathname === '/lapsed') {
    lapsedEvents.map( ev => $('.blog-main').append(eventEntry(ev)) );
    $('#direction').text('lapsed Events')
  }
  else if (tcode = location.pathname.replace(/\//,'').match(/\d{13}/)) {
    tcode=tcode[0]
    itemDate = new Date(parseInt(tcode))
    console.log(itemDate)
    console.log(lapsedEvents.find(item=>item.begin==tcode))
    $('.blog-main').append(eventEntry(lapsedEvents.find(item=>item.begin==tcode)||upcomingEvents.find(item=>item.begin==tcode)))
  }
  else {
    history.pushState(null, null, '/');
    upcomingEvents.map( ev => $('.blog-main').append(eventEntry(ev)) );
  }
  Object.keys(archivePerMonth).map( arch => $('.sidebar-module .archives').append(`<li><a href="#">${arch}</a></li>`) )
});
// .then( () => fetch('/data/2016-06.json') )
// .then( res => res.json() )
// .then( eventList => {
//   // eventList = data.sort( (a,b) => a.begin > b.begin );
//   lapsedEvents.concat( eventList.entries.filter( e => e.begin < now ) )
//   upcomingEvents = upcomingEvents.concat( eventList.entries.filter( e => e.begin > now ) )
//   if(location.pathname === '/lapsed') lapsedEvents.map( ev => $('.blog-main').append(eventEntry(ev)) );
//   else {
// //     $('.blog-main').append(notifyUrlError(location.pathname));
//     history.pushState(null, null, '/');
//     upcomingEvents.map( ev => $('.blog-main').append(eventEntry(ev)) );
//   }
// });

eventEntry = ev => `
<div class="blog-post">
  <h2>${ev.title}</h2>
  <sub>
    <a><b>Share</b></a>
  </sub>
  <p class="blog-post-meta">
    <i>starts:</i> <b>${new Date(ev.begin).toLocaleString()}</b><br>
    <i>ends:</i> <b>${new Date(ev.end).toLocaleString()}</b><br>
    <a class="ext" href="${ev.link}">${ev.link}</a>
  </p>
  <div class="blog-post-body">${ev.teaser}</div>
  <details>
    <summary>
      <i>starts:</i> <b>${new Date(ev.begin).toLocaleString()}</b><br>
      <i>ends:</i> <b>${new Date(ev.end).toLocaleString()}</b><br>
      <a class="ext" href="${ev.link}">${ev.link}</a>
    </summary>
    ${ev.teaser}
  </details>
</div>
`

eventEntryAll = ev => `
<div class="blog-post">
  <h2>${ev.title}</h2>
  <sub>
    <a><b>Share</b></a>
    <span class="pull-right"><i><b>${counties[ev.county]}</b></i></span>
  </sub>
  <p class="blog-post-meta">
    <i>starts:</i> <b>${new Date(ev.begin).toLocaleString()}</b><br>
    <i>ends:</i> <b>${new Date(ev.end).toLocaleString()}</b><br>
    <a class="ext" href="${ev.link}">${ev.link}</a>
  </p>
  <div class="blog-post-body">${ev.teaser}</div>
</div>
`

$('#lapsed').click( (e) => {
  e.preventDefault()
  history.pushState(null, null, 'lapsed');
  $('.blog-main').html('')
  lapsedEvents.map((ev) => {
    $('.blog-main').append(eventEntry(ev))
  });
});

$('#upcoming').click( (e) => {
  e.preventDefault()
  history.pushState(null, null, location.pathname.replace(/(\/\blapsed\b)/,''));
  $('.blog-main').html('')
  upcomingEvents.map((ev) => {
    $('.blog-main').append(eventEntry(ev))
  });
});

$('#direction').click( e => {
  e.preventDefault()
  var el = $('#direction');
  console.log(location.pathname)
  if(el.text()=='upcoming Events') {
    el.text('lapsed Events');
    history.pushState(null, null, (location.pathname||'')+'/lapsed');
    $('.blog-main').html('')
    lapsedEvents.slice().reverse().map((ev) => {
      $('.blog-main').append(eventEntry(ev))
    });
  }
  else {
    el.text('upcoming Events');
    history.pushState(null, null, location.pathname.replace(/(\/\blapsed\b)/,''));
    $('.blog-main').html('')
    upcomingEvents.map((ev) => {
      $('.blog-main').append(eventEntry(ev))
    });
  }
});

$('.dropdown-menu').click("a", e=>{
  e.preventDefault()
  console.log(e)
  var city = $(e.target).text()
  var key = $(e.target).attr('href')
  var listupdate=''
  $('.blog-main').animate({height:'toggle',opacity:'toggle'},800,()=>{
    $('.blog-main').html('')
    if(key=='all') {
      $('#heading-city').text('in Croatia')
      upcomingEvents.map( ev => $('.blog-main').append(eventEntryAll(ev)) );
      history.pushState(null, null, '/');
    }
    else {
      $('#heading-city').text('near '+city)
      upcomingEvents.filter(ev=>ev.county==["Bjelovar", "Cakovec", "Dubrovnik", "Gospic", "Karlovac", "Koprivnica", "Krapina", "Osijek", "Pazin", "Pozega", "Rijeka", "Sibenik", "Sisak", "Slavonski_Brod", "Split", "Varazdin", "Virovitica", "Vukovar", "Zadar", "Zagreb"].indexOf(key)).map(item=>listupdate+=eventEntry(item))
      // $('.blog-main').append(eventEntry(item))
      $('.blog-main').html(listupdate)
      history.pushState(null, null, '/'+key);
    }
    $('.blog-main').animate({height:'toggle',opacity:'toggle'},800)
  })

});

$('.major-event').click( e => {
  e.preventDefault()
  var event = archiveFlat.filter(event => event.image == $(e.target).attr('data-src'))
  history.pushState(null, null, '/'+key);
  console.log(archiveFlat.filter(event => event.image == $(e.target).attr('data-src')), e.currentTarget.href, e)
});

window.addEventListener("popstate", function(e) {
  route()
});

function route() {
  console.log(location.pathname.split('/').slice(1))
}

var routes = {
  'lapsed': ()=>{}
}

//["Bjelovar", "Cakovec", "Dubrovnik", "Gospic", "Karlovac", "Koprivnica", "Krapina", "Osijek", "Pazin", "Pozega", "Rijeka", "Sibenik", "Sisak", "Slavonski_Brod", "Split", "Varazdin", "Virovitica", "Vukovar", "Zadar", "Zagreb"].forEach(city=>$('.dropdown-menu').append('<li><a href="'+city+'">'+city+'</a></li>\n'))
