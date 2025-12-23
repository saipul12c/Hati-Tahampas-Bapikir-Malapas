document.addEventListener('DOMContentLoaded', () => {
  const eventInfo = document.getElementById('event-info');
  const historyContainer = document.getElementById('history-container');

  fetch('event.json')
    .then(response => response.json())
    .then(data => {
      const eventName = document.createElement('h2');
      eventName.textContent = data.eventName;
      eventInfo.appendChild(eventName);

      const description = document.createElement('p');
      description.textContent = data.description;
      eventInfo.appendChild(description);

      data.history.forEach(event => {
        const eventCard = document.createElement('div');
        eventCard.classList.add('event-card');

        const eventImage = document.createElement('img');
        eventImage.src = event.imageUrl;
        eventImage.alt = event.theme;
        eventCard.appendChild(eventImage);

        const eventDetails = document.createElement('div');
        eventDetails.classList.add('event-details');

        const eventYear = document.createElement('h3');
        eventYear.textContent = event.year;
        eventDetails.appendChild(eventYear);

        const eventTheme = document.createElement('p');
        eventTheme.textContent = event.theme;
        eventDetails.appendChild(eventTheme);

        const eventDescription = document.createElement('p');
        eventDescription.textContent = event.description;
        eventDetails.appendChild(eventDescription);

        eventCard.appendChild(eventDetails);
        historyContainer.appendChild(eventCard);
      });
    })
    .catch(error => console.error('Error fetching event data:', error));
});
