fetch('date.json')
  .then(response => response.json())
  .then(data => {
    // 日付で降順ソート
    data.sort((a, b) => new Date(b.date) - new Date(a.date));

    const tbody = document.querySelector('#data-table tbody');
    const labels = [];
    const rateData = [];

    data.forEach(entry => {
  const row = document.createElement('tr');

  // 通常のセル
  row.innerHTML = `
    <td>${entry.date}</td>
    <td>${entry.startTime}</td>
    <td>${entry.startRate}</td>
    <td>${entry.endRate}</td>
  `;

  // 「勝ち」セルだけ条件付きで色変更
  const riseRateCell = document.createElement('td');
  riseRateCell.textContent = entry.riseRate;

  if (entry.riseRate > 0) {
    riseRateCell.style.color = 'yellowgreen';
  } else if (entry.riseRate < 0) {
    riseRateCell.style.color = 'red';
  }

  // 残りのセル
  const winRateCell = document.createElement('td');
  winRateCell.textContent = entry.winRate;

  const winCell = document.createElement('td');
  winCell.textContent = entry.win;

  const loseCell = document.createElement('td');
  loseCell.textContent = entry.lose;

  const drawCell = document.createElement('td');
  drawCell.textContent = entry.draw;

  const matchCell = document.createElement('td');
  matchCell.textContent = entry.match;

  // セルを行に追加
  row.appendChild(riseRateCell);
  row.appendChild(winRateCell);
  row.appendChild(winCell);
  row.appendChild(loseCell);
  row.appendChild(drawCell);
  row.appendChild(matchCell); 

  // 行を表に追加
  tbody.appendChild(row);
});
    

    // グラフは昇順で表示したいので、元の順に戻す
    const sortedForGraph = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
    sortedForGraph.forEach(entry => {
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
          borderColor: '#233287',
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
