   var nam
   var nameN = document.getElementById('emri')
   var button = document.getElementById('hi')
   button.addEventListener('click', event => {
     nam =  nameN.value
     window.location.href = 'quiz.html'
     saven()
   })

   function saven () {
     if (localStorage.getItem('array1') === null) {
      var a = []
      a[0] = nam
      localStorage.setItem('array1', JSON.stringify(a))
     }
     else {
      var m = JSON.parse(localStorage.getItem('array1'))
      m.push(nam)
      localStorage.setItem('array1', JSON.stringify(m))
     }
   }
