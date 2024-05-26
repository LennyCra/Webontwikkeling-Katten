// function filterCats() {
//     var input = document.getElementById('searchInput');
//     var filter = input.value.toLowerCase();
//     var rows = document.querySelectorAll('#catTable tbody tr');
//     rows.forEach(function (row) {
//         var name = row.querySelector('.cat-name').textContent.toLowerCase();
//         var age = row.querySelector('.cat-age').textContent.toLowerCase();
//         var breed = row.querySelector('.cat-breed').textContent.toLowerCase();
//         if (name.includes(filter) || age.includes(filter) || breed.includes(filter)) {
//             row.style.display = '';
//         }
//         else {
//             row.style.display = 'none';
//         }
//     });
// }
