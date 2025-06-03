var eventsPage = 1;
async function fetchAndRender(mobilizonUrl, groupName) {

  const limit = 5;
  const after = new Date(Date.now());

  const dtFormat = new Intl.DateTimeFormat("de-DE", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      timeZone: 'Europe/Paris',
  });

  const data = JSON.stringify({
    operationName: "FetchGroupEvents",
    query: `query FetchGroupEvents($name: String!, $afterDateTime: DateTime, $beforeDateTime: DateTime, $order: EventOrderBy, $orderDirection: SortDirection, $organisedEventsPage: Int, $organisedEventsLimit: Int) {
              group(preferredUsername: $name) {
                organizedEvents(
                  afterDatetime: $afterDateTime
                  beforeDatetime: $beforeDateTime
                  order: $order
                  orderDirection: $orderDirection
                  page: $organisedEventsPage
                  limit: $organisedEventsLimit
                ) {
                  elements {
                    id
                    url
                    onlineAddress
                    uuid
                    title
                    beginsOn
                    status
                    draft
                    description
                    options {
                      ...EventOptions
                      __typename
                    }
                    participantStats {
                      participant
                      notApproved
                      __typename
                    }
                    physicalAddress {
                      ...AdressFragment
                      __typename
                    }
                    picture {
                      url
                      id
                      __typename
                    }
                    __typename
                  }
                  total
                  __typename
                }
                ...ActorFragment
                __typename
              }
            }

            fragment EventOptions on EventOptions {
              maximumAttendeeCapacity
              remainingAttendeeCapacity
              showRemainingAttendeeCapacity
              anonymousParticipation
              showStartTime
              showEndTime
              timezone
              offers {
                price
                priceCurrency
                url
                __typename
              }
              participationConditions {
                title
                content
                url
                __typename
              }
              attendees
              program
              commentModeration
              showParticipationPrice
              hideOrganizerWhenGroupEvent
              isOnline
              __typename
            }

            fragment ActorFragment on Actor {
              id
              avatar {
                id
                url
                __typename
              }
              type
              preferredUsername
              name
              domain
              summary
              url
              __typename
            }

            fragment AdressFragment on Address {
              id
              description
              geom
              street
              locality
              postalCode
              region
              country
              type
              url
              originId
              timezone
              pictureInfo {
                url
                author {
                  name
                  url
                  __typename
                }
                source {
                  name
                  url
                  __typename
                }
                __typename
              }
              __typename
            }`,
    variables: {
      "name": groupName,
      "beforeDateTime": null,
      "afterDateTime": after,
      "order": "BEGINS_ON",
      "orderDirection": "ASC",
      "organisedEventsPage": eventsPage,
      "organisedEventsLimit": limit
    }
  });

    const response = await fetch(
        mobilizonUrl,
        {
          method: 'post',
          body: data,
          headers: {
              'Content-Type': "application/json"
          }
        }
    );

    const mapMarker = `<svg fill="currentColor" class="material-design-icon__svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z"><!----></path></svg>`;

    const json = await response.json();
    target = document.getElementById('events-list');
    json.data.group.organizedEvents.elements.forEach((event) => {
        // create the event listing tag
        anchor = document.createElement("a");
        anchor.setAttribute("class", "mbz-card snap-center dark:bg-mbz-purple sm:flex sm:items-start my-4");
        anchor.setAttribute("href", `https://demoday.der-smarte-gemeinschaftskalender.de/#/event/${event.uuid}` );

        // create the image tag
        image = document.createElement("img");
        image.setAttribute("class", "transition-opacity duration-500 rounded-lg object-cover mx-auto h-full opacity-100");
        if (event.picture != null) {
            image.src = event.picture.url;
        }

        // create the title tag
        title = document.createElement("h2"); 
        title.setAttribute("class", "mt-0 mb-2 text-2xl line-clamp-3 font-bold text-violet-3 dark:text-white");
        title.innerHTML = event.title;

        // create the date and time tags
        startTime = document.createElement("time");
        startTime.setAttribute("datetime", event.beginsOn);
        startTime.setAttribute("class", "text-gray-700 dark:text-white font-semibold hidden sm:block");
        startdate = new Date(event.beginsOn);
        startTime.innerHTML = dtFormat.format(startdate);

        // create the location tags
        loc = document.createElement("div");
        if( !!event.physicalAddress) {
        loc.setAttribute("class", "truncate flex gap-1");
        mm = document.createElement("span");
        mm.innerHTML = mapMarker;
        loc.appendChild(mm);
        place = document.createElement("span");
        place.innerHTML = event.physicalAddress?.description + ", " + event.physicalAddress?.locality;
        loc.appendChild(place);
        }

        // create the description
        desc = document.createElement("p");
        desc.setAttribute("style", "margin-top: 1em;");
        desc.innerHTML = event.description;

        // put it all together
        imgblk = document.createElement("div");
        imgblk.setAttribute("class", "rounded-lg");
        imgbox = document.createElement("div");
        imgbox.setAttribute("class", "h-full w-full max-w-100 min-h-5rem");
        imgblk.appendChild(imgbox);
        //imgbox.appendChild(image);
        details = document.createElement("div");
        details.setAttribute("class", "p-2 flex-auto sm:flex-1");
        details.setAttribute("style", "text-align: center;");
        detbox = document.createElement("div");
        detbox.setAttribute("class", "relative flex flex-col h-full");
        details.appendChild(startTime);
        details.appendChild(title);
        details.appendChild(loc);
        //details.appendChild(desc);
        anchor.appendChild(imgblk);
        anchor.appendChild(details);
        target.appendChild(anchor);

    }); 

  const shortFormat = new Intl.DateTimeFormat("de-DE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "numeric",
      timeZone: 'Europe/Paris',
  });

    target = document.getElementById('events-list-ul');
    json.data.group.organizedEvents.elements.forEach((event) => {
        console.log(event.beginsOn)
        start = shortFormat.format(new Date(event.beginsOn)); 

        li = document.createElement("li");
        
        anchor = document.createElement("a");
        anchor.setAttribute("href", `https://demoday.der-smarte-gemeinschaftskalender.de/#/event/${event.uuid}` );
        anchor.innerHTML = `<span class="date" style="padding-right: 2px">${start}: </span><strong>${event.title}</strong>`
    

        li.appendChild(anchor);
        target.appendChild(li);
    })

}

function execute(mobilizonUrl, groupName) {
    window.addEventListener("load", fetchAndRender(mobilizonUrl, groupName));
    // infinite scroll
    document.addEventListener('DOMContentLoaded', function(e) {
        document.addEventListener('scroll', function(e) {
            let documentHeight = document.body.scrollHeight;
            let currentScroll = window.scrollY + window.innerHeight;
            // When the user is [modifier]px from the bottom, fire the event.
            let modifier = 200; 
            if(currentScroll + modifier > documentHeight) {
                eventsPage++;
                fetchAndRender(mobilizonUrl, groupName);
            }
        })
    })
}