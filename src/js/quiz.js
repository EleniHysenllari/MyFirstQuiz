var put = document.getElementById('home')
var end = document.getElementById('container1')
var clear = document.getElementById('container')
var question = ''
let k = 0
let uri = 'http://vhost3.lnu.se:20080/question/1'
var t = document.getElementById('quiztime')
var ask = document.querySelector('h2')
var sec = 20
var time = null
var totaltime = 0
function first () {
  window.addEventListener('load', async (event) => {
    time = setInterval(myTimer, 1000)
    question = await search(uri)
    ask.innerText = question
    const input = document.createElement('input')
    put.appendChild(input)
    const submit = document.createElement('button')
    end.appendChild(submit)
    submit.classList.add('btn')
    submit.innerText = 'Submit'
    submit.addEventListener('click', (event) => {
      k = parseInt(input.value)
      connectedCallback(k)
    })
  })
}
function myTimer () {
  t.innerText = sec + ' sec left'
  sec = sec - 1
  totaltime = totaltime + 1
  if (sec === -1) {
    clearInterval(time)
    window.location.href = 'end.html'
    totaltime = 0
  }
}

async function next () {
  try {
    question = await search(uri)
    put.innerText = ''
    end.innerText = ''
    ask.innerHTML = question
    try {
      var alt = await searchalt(uri)
      var alterna = await searchalt1(uri)
      clearInterval(time)
      sec = 20
      time = setInterval(myTimer, 1000)
      for (var i = 0; i < alt.length; i++) {
        const but = document.createElement('button')
        but.classList.add('btn')
        put.appendChild(but)
        but.innerHTML = alt[i]
        but.setAttribute('value', alterna[i])
        k = but.value
        but.addEventListener('click', event => {
          mo(but.value)
        })
      }
    } catch {
      nextinput()
    }
  } catch (error) {
    clearInterval(time)
    clear.innerText = ''
    var h = document.createElement('h2')
    clear.appendChild(h)
    h.innerText = 'Highscore'
    var m = JSON.parse(localStorage.getItem('array1'))
    if (m.length === 1) {
      m.push(totaltime)
      localStorage.setItem('array1', JSON.stringify(m))
    } else {
      if (m.length < 10) {
        m.push(totaltime)
        for (i = m.length - 3; i > -1; i = i - 2) {
          if (totaltime < m[i]) {
            var temp = m[i]
            var temp1 = m[i - 1]
            m[i] = totaltime
            m[i - 1] = m[i + 1]
            m[i + 1] = temp1
            m[i + 2] = temp
          }
        }
      } else {
        i = m.length - 2
        if (totaltime > m[i]) {
          m.pop()
        } else {
          m.push(totaltime)
          for (i = m.length - 3; i > -1; i = i - 2) {
            if (totaltime < m[i]) {
              temp = m[i]
              temp1 = m[i - 1]
              m[i] = totaltime
              m[i - 1] = m[i + 1]
              m[i + 1] = temp1
              m[i + 2] = temp
            }
          }
          m.pop()
          m.pop()
        }
      }
      localStorage.setItem('array1', JSON.stringify(m))
    }
    var c = JSON.parse(localStorage.getItem('array1'))
    var v = document.createElement('div')
    v.classList.add('name')
    clear.appendChild(v)
    for (i = 0; i < c.length; i = i + 2) {
      v.innerHTML += c[i] + ' ' + c[i + 1]
      var s = document.createElement('br')
      v.appendChild(s)
    }
  }
}
function mo (a) {
  end.innerText = ''
  const submit = document.createElement('button')
  end.appendChild(submit)
  submit.classList.add('btn')
  submit.innerText = 'Submit'
  submit.addEventListener('click', (event) => {
    connectedCallback(a)
  })
}
function nextinput () {
  clearInterval(time)
  sec = 20
  time = setInterval(myTimer, 1000)
  const input = document.createElement('input')
  put.appendChild(input)
  const submit = document.createElement('button')
  put.appendChild(submit)
  submit.classList.add('btn')
  submit.innerText = 'Submit'
  submit.addEventListener('click', async (event) => {
    k = input.value
    connectedCallback(k)
  })
}
async function connectedCallback (m) {
  var url = await searchans(uri)
  const data = { answer: m }
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const json = await response.json()
    if (json.message === 'Correct answer!') {
      uri = json.nextURL
      next()
    } else {
      window.location.href = 'end.html'
      console.log('wrong')
      totaltime = 0
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

async function searchalt (u) {
  let f = await window.fetch(u)
  f = await f.json()
  return Object.values(f.alternatives)
}

async function searchalt1 (u) {
  let f = await window.fetch(u)
  f = await f.json()
  return Object.getOwnPropertyNames(f.alternatives)
}

async function search (u) {
  let f = await window.fetch(u)
  f = await f.json()
  return f.question
}

async function searchans (u) {
  let q = await window.fetch(u)
  q = await q.json()
  return q.nextURL
}
export { first }
