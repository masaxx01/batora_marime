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
      row.classList.add('main-row');

      // 開閉ボタンセル
  const toggleCell = document.createElement('td');
  const toggleBtn = document.createElement('button');
  toggleBtn.textContent = '▶';
  toggleBtn.classList.add('toggle-btn');
  toggleCell.appendChild(toggleBtn);
  row.appendChild(toggleCell);
      
  // 通常のセル
  const cells = [
    entry.date,
    entry.startTime,
    entry.shiai,
    entry.winRate,
    entry.win,
    entry.lose,
    entry.draw,
    entry.startRate
  ];

      cells.forEach(text => {
    const td = document.createElement('td');
    td.textContent = text;
    row.appendChild(td);
  });

  // 「勝ち」セルだけ条件付きで色変更
  const riseRateCell = document.createElement('td');
  riseRateCell.textContent = entry.riseRate;

  if (entry.riseRate > 0) {
    riseRateCell.style.color = '#23954B';
  } else if (entry.riseRate < 0) {
    riseRateCell.style.color = '#C62F2F';
  }

  // 残りのセル
  const endRateCell = document.createElement('td');
  endRateCell.textContent = entry.endRate;

  // セルを行に追加
  row.appendChild(riseRateCell);
  row.appendChild(endRateCell);

 // 詳細行（最初は非表示）
  const detailsRow = document.createElement('tr');
detailsRow.classList.add('details-row');

const detailsCell = document.createElement('td');
detailsCell.colSpan = 11;

// サブテーブルのHTMLを生成
let matchTableHTML = `
  <table class="sub-table">
    <thead>
      <tr>
        <th>種目</th>
        <th>試合数</th>
        <th>勝率</th>
        <th>勝ち</th>
        <th>負け</th>
        <th>引き分け</th>
      </tr>
    </thead>
    <tbody>
`;

entry.matches.forEach(match => {
  matchTableHTML += `
    <tr>
      <td>${match.id}</td>
      <td>${match.result}</td>
      <td>${match.opponent}</td>
      <td>${match.winopponent}</td>
      <td>${match.loseopponent}</td>
      <td>${match.drawopponent}</td>
    </tr>
  `;
});

// 備考欄をテーブル内に追加（colSpanで全体に広げる）
matchTableHTML += `
    </tbody>
  </table>
`;

// 備考欄を追加
const noteHTML = `
  <div class="note-box">
    <strong>備考:</strong><br>
    ${entry.note || '（備考なし）'}
  </div>
`;

detailsCell.innerHTML = `
  <strong>詳細情報</strong><br>
  ${matchTableHTML}
  ${noteHTML}
`;

detailsRow.appendChild(detailsCell);



  // ボタンで詳細表示切り替え
  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // 行クリックを防ぐ
    detailsRow.classList.toggle('visible');
    toggleBtn.textContent = detailsRow.classList.contains('visible') ? '▼' : '▶';
  });

  tbody.appendChild(row);
  tbody.appendChild(detailsRow);
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
