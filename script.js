fetch('date.json')
  .then(response => response.json())
  .then(data => {
    const tbody = document.querySelector('#data-table tbody');
    const labels = [];
    const rateData = [];

    data.forEach(entry => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${entry.date}</td>
        <td>${entry.startTime}</td>
        <td>${entry.startRate}</td>
        <td>${entry.endRate}</td>
        <td>${entry.riseRate}</td>
        <td>${entry.winRate}</td>
        <td>${entry.win}</td>
        <td>${entry.lose}</td>
        <td>${entry.draw}</td>
        <td>${entry.match}</td>
      `;
      tbody.appendChild(row);

      labels.push(entry.date);
      rateData.push(entry.endRate);
    });

    const ctx = document.getElementById('rateChart').getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'レート',
          data: rateData,
          borderColor: '#ff8c42',
          backgroundColor: 'rgba(255, 140, 66, 0.2)',
          fill: true,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            title: {
              display: true,
              text: '日付'
            }
          },
          y: {
            title: {
              display: true,
              text: 'レート'
            }
          }
        }
      }
    });
  });
